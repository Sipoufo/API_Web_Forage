const catchAsync = require("../../utils/catchAsync");
const { Admin, Facture, Client, StaticInf } = require("../../models/index");
const {} = require("../../models/index");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authorization = (req) => {
  return req.headers.authorization.split(" ")[1];
};

const addFacture = catchAsync(async (req, res) => {
  // const token = req.cookies.pwftoken
  const token = authorization(req);
  jwt.verify(token, "Admin web forage", async (err, decodedToken) => {
    if (err) {
      console.log(err);
    } else {
      const idClient = req.params.idClient;
      const idAdmin = decodedToken.id;
      const newIndex = req.body.newIndex;
      const idCompteur = req.body.idCompteur;
      // const montantVerse = req.body.montantVerse;
      const dateReleveNewIndex = new Date(req.body.dateReleveNewIndex);
      let oldIndex = req.body.oldIndex ? req.body.oldIndex : 0;
      const monthDate = dateReleveNewIndex.getMonth() + 1;
      const yearDate = dateReleveNewIndex.getFullYear();
      let doFacture = true;
      let surplus = 0;

      // for pre-create invoice
      let indexFacture = null;
      let isprecreate = false;
      let idFacturePre = null;
      console.log(idClient);
      await Facture.find({ idClient, idCompteur })
        .sort({ dateReleveNewIndex: -1 })
        .then(async (factures) => {
          if (factures.length > 0) {
            for (let i = 0; i < factures.length; i++) {
              const dateBilling = new Date(factures[i].dateReleveNewIndex);
              if (
                dateBilling.getMonth() + 1 == monthDate &&
                dateBilling.getFullYear() == yearDate &&
                factures[i].preCreate == false
              ) {
                doFacture = false;
                break;
              } else if (factures[i].preCreate == false) {
                indexFacture = i;
                isprecreate = false;
                idFacturePre = factures[i]._id;
              } else if (
                dateBilling.getMonth() == monthDate &&
                dateBilling.getFullYear() == yearDate &&
                factures[i].preCreate == true
              ) {
                indexFacture = i;
                isprecreate = true;
                idFacturePre = factures[i]._id;
              }
            }
          }
          if (factures.length >= 1) {
            oldIndex = factures[0].newIndex;
            surplus = factures[0].surplus;
          }

          if (doFacture == true && isprecreate == false) {
            console.log("Step 2");
            await Admin.findById(decodedToken.id).then(async (admin) => {
              if (admin) {
                const static = await StaticInf.find().sort({ createdAt: 1 });
                const prixUnitaire = static[0].prixUnitaire;
                const fraisEntretien = static[0].fraisEntretien;
                const consommation = newIndex - oldIndex;
                const montantConsommation =
                  consommation * prixUnitaire + fraisEntretien;
                // const dateFacturation = new Date();
                let montantImpaye = 0;
                let facturePay = false;
                if (montantConsommation - surplus >= 0) {
                  montantImpaye = montantConsommation - surplus;
                } else {
                  surplus = (montantConsommation - surplus) * -1;
                  facturePay = true;
                }
                const dataLimitePaid = new Date(
                  dateReleveNewIndex.getFullYear(),
                  dateReleveNewIndex.getMonth() + 1,
                  static[0].limiteDay,
                  dateReleveNewIndex.getHours() + 1,
                  dateReleveNewIndex.getMinutes(),
                  dateReleveNewIndex.getMilliseconds()
                );
                console.log("Step 3");
                await Facture.create({
                  idClient,
                  idAdmin,
                  surplus,
                  facturePay,
                  dateReleveNewIndex,
                  newIndex,
                  oldIndex,
                  idCompteur,
                  consommation,
                  prixUnitaire,
                  fraisEntretien,
                  montantConsommation,
                  dataLimitePaid,
                  montantImpaye,
                  facturePay,
                  penalty: { montant: 0, date: dateReleveNewIndex },
                }).then((resp) => {
                  if (resp) {
                    res.status(200).json({ status: 200, result: resp });
                  } else {
                    res
                      .status(500)
                      .json({ status: 500, error: "Error during the save" });
                  }
                });
              } else {
                res
                  .status(500)
                  .json({ status: 500, error: "Error during the save" });
              }
            });
          } else if (doFacture == true && isprecreate == true) {
            const static = await StaticInf.find().sort({ createdAt: 1 });
            const prixUnitaire = static[0].prixUnitaire;
            const fraisEntretien = static[0].fraisEntretien;
            const new_Consommation = newIndex - oldIndex;
            const old_Consommation =
              factures[indexFacture].newIndex - factures[indexFacture].oldIndex;
            const final_Consommation = new_Consommation + old_Consommation;
            const montantConsommation =
              final_Consommation * prixUnitaire + fraisEntretien - surplus;
            const dataLimitePaid = new Date(
              dateReleveNewIndex.getFullYear(),
              dateReleveNewIndex.getMonth() + 2,
              static[0].limiteDay,
              dateReleveNewIndex.getHours() + 1,
              dateReleveNewIndex.getMinutes(),
              dateReleveNewIndex.getMilliseconds()
            );
            console.log("Step 4");
            await Facture.findByIdAndUpdate(idFacturePre, {
              idClient,
              idAdmin,
              dateReleveNewIndex,
              newIndex: factures[indexFacture].newIndex,
              oldIndex: factures[indexFacture].oldIndex,
              consommation: final_Consommation,
              montantConsommation,
              dataLimitePaid,
              preCreate: false,
            });
          } else {
            res
              .status(500)
              .json({
                status: 500,
                error: "This customer already has an invoice for this month",
              });
          }
        });
    }
  });
});

const preCreate = catchAsync(async (req, res) => {
  const static = await StaticInf.find().sort({ createdAt: 1 });
  const token = authorization(req);
  const IdCompteur = req.body.IdCompteur;
  let oldIndex = req.body.oldIndex ? req.body.oldIndex : null;
  const newIndex = req.body.newIndex;
  const idClient = req.params.idClient;
  const dateReleveNewIndex = new Date();
  let consommation = 0;
  const preCreate = true;
  const prixUnitaire = static[0].prixUnitaire;
  const fraisEntretien = static[0].fraisEntretien;
  let surplus = 0;

  jwt.verify(token, "Admin web forage", async (err, decodedToken) => {
    if (err) {
      console.log(err);
    } else {
      Client.findById(idClient).then(async (customer) => {
        if (customer) {
          const factures = await Facture.find({ idClient }).sort({
            dateReleveNewIndex: -1,
          });
          if (factures.length > 0) {
            oldIndex = factures[0].oldIndex;
            surplus = factures[0].surplus;
          }
          const montantConsommation =
            consommation * prixUnitaire + fraisEntretien - surplus;
          consommation = newIndex - oldIndex;
          const montantImpaye = montantConsommation;
          const dataLimitePaid = new Date(
            dateReleveNewIndex.getFullYear(),
            dateReleveNewIndex.getMonth() + 2,
            static[0].limiteDay,
            dateReleveNewIndex.getHours() + 1,
            dateReleveNewIndex.getMinutes(),
            dateReleveNewIndex.getMilliseconds()
          );
          await Client.findByIdAndUpdate(idClient, { IdCompteur });
          Facture.create({
            idClient,
            idAdmin: decodedToken.id,
            newIndex,
            oldIndex,
            IdCompteur,
            consommation,
            prixUnitaire,
            montantConsommation,
            fraisEntretien,
            montantImpaye,
            surplus,
            preCreate,
            dataLimitePaid,
            dateReleveNewIndex,
            penalty: { montant: 0, date: dateReleveNewIndex },
          }).then((facture) => {
            if (facture) {
              res.status(200).json({ status: 200, result: facture });
            } else {
              res
                .status(500)
                .json({ status: 500, error: "Error during the creation" });
            }
          });
        } else {
          res
            .status(500)
            .json({ status: 500, error: "This customer don't exist" });
        }
      });
    }
  });
});

const addInformation = catchAsync(async (req, res) => {
  const prixUnitaire = req.body.prixUnitaire;
  const fraisEntretien = req.body.fraisEntretien;
  const limiteDay = req.body.limiteDay;
  const token = authorization(req);
  jwt.verify(token, "Admin web forage", async (err, decodedToken) => {
    if (err) {
      console.log(err);
    } else {
      await Admin.findOne({ _id: decodedToken.id, profile: "superAdmin" }).then(
        async (result) => {
          if (result) {
            const staticResult = await StaticInf.create({
              idAdmin: decodedToken.id,
              prixUnitaire,
              fraisEntretien,
              limiteDay,
            });
            if (staticResult) {
              res.status(200).json({ status: 200, result: staticResult });
            } else {
              res
                .status(500)
                .json({ status: 500, error: "Error during the creation" });
            }
          } else {
            res
              .status(500)
              .json({ status: 500, error: "Your are not super administrator" });
          }
        }
      );
    }
  });
});

const getAllFacture = catchAsync((req, res) => {
  Facture.find()
    .sort({ createdAt: 1 })
    .then((factures) => {
      res.status(200).json({ status: 200, result: factures });
    });
});

const haveInvoice = catchAsync((req, res) => {
  const idClient = req.params.idClient;
  let have;
  Facture.find({ idClient }).then((factures) => {
    if (factures.length > 0) {
      have = true;
    } else {
      have = false;
    }
    res.status(200).json({ status: 200, result: have });
  });
});

const seeUnpaidInvoicewithDate = catchAsync(async (req, res) => {
  // const dateUnpaid = new Date(req.params.dateUnpaid)
  const dateUnpaidMonth = new Date(req.params.dateUnpaid).getMonth() + 1;
  const dateUnpaidYear = new Date(req.params.dateUnpaid).getFullYear();
  let invoiceUnpaid = [];
  Client.find({ isDelete: false })
    .sort({ name: 0 })
    .then(async (customers) => {
      for (let i = 0; i < customers.length; i++) {
        // console.log(customers[i])
        let invoiceCustomer = await Facture.aggregate([
          {
            $project: {
              _id: 1,
              client: "$idClient",
              month: { $month: "$dateReleveNewIndex" },
              year: { $year: "$dateReleveNewIndex" },
            },
          },
          {
            $match: {
              month: dateUnpaidMonth,
              year: dateUnpaidYear,
              client: customers[i]["_id"],
            },
          },
        ]);
        if (invoiceCustomer.length == 0) {
          invoiceUnpaid.push(customers[i]);
        }
      }
      res.status(200).json({ status: 200, result: invoiceUnpaid });
    });
});

const getUserThatHaveNotPaidInvoiceWithDate = catchAsync(async (req, res) => {
  const dateUnpaidMonth = new Date(req.params.date).getMonth() + 1;
  const dateUnpaidYear = new Date(req.params.date).getFullYear();
  let results = [];

  Client.find({ isDelete: false })
    .sort({ name: 0 })
    .then(async (customers) => {
      for (let i = 0; i < customers.length; i++) {
        let factures = await Facture.find({ idClient: customers[i]["_id"] });
        let hasAtLeastOneInvoice = factures.length > 0 ? true : false;

        let invoiceCustomer = await Facture.aggregate([
          {
            $project: {
              _id: 1,
              client: "$idClient",
              month: { $month: "$dateReleveNewIndex" },
              year: { $year: "$dateReleveNewIndex" },
              idCompteur: 1,
            },
          },
          {
            $match: {
              month: dateUnpaidMonth,
              year: dateUnpaidYear,
              client: customers[i]["_id"],
            },
          },
        ]);

        if (invoiceCustomer.length == 0) {
          results.push({
            user: customers[i],
            idCompteur: customers[i]?.idCompteur,
            hasAtLeastOneInvoice,
          });
        } else {
          //if user has bill
          if (
            invoiceCustomer.length !== customers[i]?.idCompteur.length &&
            invoiceCustomer.length < customers[i]?.idCompteur.length
          ) {
            for (let j = 0; j < invoiceCustomer.length; j++) {
              const element = invoiceCustomer[j]; //je recupère une facture

              for (let x = 0; x < customers[i]?.idCompteur?.length; x++) {
                const idCompteur = customers[i]?.idCompteur[x];

                if (element?.idCompteur !== idCompteur) {
                  let index =
                    results.length > 0
                      ? results.findIndex((x) => x.user === customers[i])
                      : -1;
                  if (index > -1) {
                    let counters = results[index];
                    counters.idCompteur?.push(idCompteur);
                    results.splice(index, 1, counters);
                  } else {
                    results.push({
                      user: customers[i],
                      idCompteur: [idCompteur],
                      hasAtLeastOneInvoice,
                    });
                  }
                }
              }
            }
          }
        }
      }
      res.status(200).json({ status: 200, result: results });
    });
});

const getStaticInformation = catchAsync((req, res) => {
  const staticInf = [];
  StaticInf.find()
    .sort({ createdAt: 1 })
    .then((static) => {
      if (static) {
        for (let i = 0; i < static.length; i++) {
          staticInf.push(static[i]);
        }
      }
      res.status(200).json({ status: 200, result: staticInf });
    });
});

const getFactures = catchAsync((req, res) => {
  const month = req.params.month ? req.params.month : new Date().getMonth() + 1;
  const year = req.params.year ? req.params.year : new Date().getFullYear();
  const page = req.params.page ? req.params.page : 1;
  const limit = req.params.limit ? req.params.limit : 10;
  const facture = [];
  Facture.paginate({}, { page, limit }).then((factures) => {
    for (let i = 0; i < factures.docs.length; i++) {
      const monthInvoice = factures.docs[i].createdAt.getMonth() + 1;
      const yearInvoice = factures.docs[i].createdAt.getFullYear();
      console.log(monthInvoice);
      console.log(yearInvoice);
      if (monthInvoice == month && yearInvoice == year) {
        facture.push(factures.docs[i]);
      }
    }
    res.status(200).json({ status: 200, result: facture });
  });
});

const getFactureOne = catchAsync((req, res) => {
  const idFacture = req.params.idFacture;
  console.log(idFacture);
  Facture.findById(idFacture).then((facture) => {
    if (facture) {
      res.status(200).json({ status: 200, result: facture });
    } else {
      res
        .status(500)
        .json({ status: 500, error: "Error while the find facture" });
    }
  });
});

const getClientFactures = catchAsync((req, res) => {
  const idClient = req.params.idClient;
  Facture.find({ idClient })
    .sort({ dateReleveNewIndex: -1 })
    .then((factures) => {
      if (factures.length > 0) {
        res.status(200).json({ status: 200, result: factures });
      } else {
        res
          .status(500)
          .json({ status: 500, error: "This customer don't have invoice" });
      }
    });
});

const findByYear = catchAsync((req, res) => {
  const year = req.params.year;
  let result = [];
  // console.log(year)
  Facture.find()
    .sort({ createdAt: 1 })
    .then((factures) => {
      if (factures.length > 0) {
        for (let i = 0; i < factures.length; i++) {
          const yearFacture = factures[i].createdAt.getFullYear();
          console.log(yearFacture);
          if (yearFacture == year) {
            result.push(factures[i]);
          }
        }
      }
      res.status(200).json({ status: 200, result });
    });
});

const getOneInvoiceByYear = catchAsync((req, res) => {
  const year = req.params.year;
  const idClient = req.params.idClient;
  let result = [];
  console.log(idClient);
  Facture.find({ idClient })
    .sort({ createdAt: 1 })
    .then((factures) => {
      console.log(factures);
      if (factures.length > 0) {
        for (let i = 0; i < factures.length; i++) {
          const yearFacture = factures[i].createdAt.getFullYear();
          console.log(yearFacture);
          if (yearFacture == year) {
            result.push(factures[i]);
          }
        }
      }
      res.status(200).json({ status: 200, result });
    });
});

const getFactureAdvance = catchAsync(async (req, res) => {
  let EndFactureAdvance = [];
  await Facture.find()
    .sort({ createdAt: -1 })
    .then((factures) => {
      console.log(factures);
      if (factures.length > 0) {
        for (let i = 0; i < factures.length; i++) {
          if (factures[i].montantImpaye == 0) {
            EndFactureAdvance.push(factures[i]);
          }
        }
        res.status(200).json({ status: 200, result: EndFactureAdvance });
      } else {
        res.status(500).json({ status: 500, error: "I don't see the facture" });
      }
    });
});

const updateFacture = catchAsync(async (req, res) => {
  const idFacture = req.params.idFacture;
  console.log(idFacture);
  const token = authorization(req);
  jwt.verify(token, "Admin web forage", async (err, decodedToken) => {
    if (err) {
      console.log(err);
    } else {
      const [day, month, year] = req.body.dateReleveNewIndex.split('-')
      console.log('month : ', month);
      console.log('day : ', day);
      console.log('year : ', year);

      const date = new Date(year, month - 1, day);
      console.log('date : ', date);

      const newIndex = req.body.newIndex;
      const montantVerse = req.body.montantVerse;
      await Admin.findById(decodedToken.id).then(async (resul) => {
        if (resul) {
          let idInvoice = mongoose.Types.ObjectId("" + idFacture);
          const bill = await Facture.findById({_id: idInvoice});
          let penality = 0;
          console.log('update 1');
          if (bill?.penalty && bill?.penalty?.length > 0) {
            let penalties = new Array();
            penalties = bill?.penalty;
            let montants = penalties?.map((x) => x.montant);
            penality = montants.reduce(
              (previousValue, currentValue) => previousValue + currentValue
            );
          }

          console.log('update 2 : ', penality);

          const consommation = newIndex - bill?.oldIndex;
          const static = await StaticInf.find().sort({ createdAt: 1 });
          const prixUnitaire = static[0].prixUnitaire;
          const fraisEntretien = static[0].fraisEntretien;
          const montantConsommation =
            consommation * prixUnitaire + fraisEntretien + penality;
          const montantImpaye = montantConsommation - montantVerse;
          console.log('update 3 : ', montantConsommation);

          await Facture.findByIdAndUpdate(idInvoice, {
            newIndex,
            montantVerse,
            date,
            consommation,
            montantConsommation,
            montantImpaye,
          }).then((response) => {
            if (response) {
              res.status(200).json({ status: 200, result: response });
            } else {
              res
                .status(500)
                .json({ status: 500, error: "Error during the update" });
            }
          });
        }
      });
    }
  });
});

const statusPaidFacture = catchAsync(async (req, res) => {
  const idFacture = req.params.idFacture;
  let status = false;
  const amount = req.body.amount;
  let surplus = 0;

  await Facture.findById(idFacture).then(async (result) => {
    if (result) {
      if (result.facturePay != true) {
        let newUnpaid = result.montantImpaye - amount;
        const newAmountPaid = result.montantVerse + amount;
        if (newUnpaid >= 0) {
          if (newUnpaid != 0) {
            status = false;
          } else {
            status = true;
          }
        } else {
          surplus = newUnpaid * -1;
          newUnpaid = 0;
          status = true;
        }

        console.log('yyy: ',newAmountPaid );
        await Facture.findByIdAndUpdate(idFacture, {
          facturePay: status,
          montantImpaye: newUnpaid,
          montantVerse: newAmountPaid,
          surplus,
          $push: { tranche: { montant: amount, date: new Date() } },
        }).then((facture) => {
          if (facture) {
            res.status(200).json({ status: 200, result: facture });
          } else {
            res
              .status(500)
              .json({ status: 500, error: "Error during the update" });
          }
        });
      } else {
        res
          .status(500)
          .json({ status: 500, error: "This facture is already paid" });
      }
    } else {
      res.status(500).json({ status: 500, error: "This facture don't exist" });
    }
  });
});

const getByStatus = catchAsync(async (req, res) => {
  const status = req.params.status;
  await Facture.find({ facturePay: status })
    .sort({ createdAt: -1 })
    .then((factures) => {
      if (factures.length > 0) {
        res.status(200).json({ status: 200, result: factures });
      } else {
        res
          .status(500)
          .json({
            status: 500,
            error: "I don't see a facture with this status",
          });
      }
    });
});


const getByStatusWithPagination = catchAsync(async (req, res) => {
  const status = req.params.status;
  const page = (req.params.page) ? req.params.page : 1;
  const limit = (req.params.limit) ? req.params.limit : 5;
  
  await Facture.find({ facturePay: status })
    .sort({ createdAt: -1 })
    .then(async (factures) => {
      if (factures.length > 0) {
        let invoices = factures.slice((page - 1), (page - 1) + limit);
      let bills = [];
      for (let index = 0; index < invoices.length; index++) {
        const element = invoices[index];
        let id = mongoose.Types.ObjectId("" + element?.idClient);
        console.log('id', id);
        let client = await Client.findById({_id: id});
        bills.push({
          invoice:element,
          user: client
        });
      }
      
        res.status(200).json({ status: 200, result: generatePaginnation(bills, factures, limit, page)});
      } else {
        res
          .status(500)
          .json({
            status: 500,
            error: "I don't see a facture with this status",
          });
      }
    });
});

const removeInvoice = catchAsync(async (req, res) => {
  const idInvoice = req.params?.idInvoice;
  await Facture.deleteOne({
    _id: mongoose.Types.ObjectId("" + idInvoice),
  }).then((val) => {
    res
      .status(200)
      .json({ status: 200, result: "Removal successfully completed" });
  });
});

const searchInvoice = catchAsync(async (req, res) => {
  const page = (req.params.page) ? req.params.page : 1;
  const limit = (req.params.limit) ? req.params.limit : 5;
  const month = req.body?.month;
  const consumption = req.body?.consumption;
  const year = req.body?.year;
  const username = req.body?.username;
  const type = req.body?.type;

  let idClient;
  let client;

  let invoices = [];

  if(username && username !== " ") {
    client = await Client.find({ name: username });
    idClient = client?._id;
  }

  let factures = await Facture.find().sort({ createdAt: 1 });
  if (factures.length > 0) {
    for (let i = 0; i < factures.length; i++) {
      const yearFacture = factures[i].createdAt.getFullYear();

      let invoice = null;
      let conform = "start check";

      if(year && year !== 0) {
        if (yearFacture == year) {
          invoice=factures[i];
          conform = "year";
        }
      }

      if(month && month !== 0) {
        if (invoice && invoice !== null) {
          const monthFacture = invoice.createdAt.getFullMonth();
          if (monthFacture !== month) {
            invoice = null;
            conform = "month";
          }
        } else {
          const monthFacture = factures[i].createdAt.getFullMonth();
          if (monthFacture == month) {
            invoice=factures[i];
            conform = "month";
          }
        }
      }

      if(consumption && consumption !== 0) {
        if (conform === "start check" && factures[i]?.consommation === consumption) {
          invoice=factures[i];
          conform = "consumption";
        }
        if (conform !== "start check") {
          if(invoice && invoice !== null) {
            if(invoice?.consommation !== consumption) {
              invoice = null;
              conform = "consumption";
            }
          }
        }
      }

      if(idClient && idClient !== null) {
        if (conform === "start check" && factures[i]?.idClient === idClient) {
          invoice=factures[i];
          conform = "idClient";
        }
        if (conform !== "start check") {
          if(invoice && invoice !== null) {
            if(invoice?.idClient !== idClient) {
              invoice = null;
              conform = "idClient";
            }
          }
        }
      } else {
        let id = mongoose.Types.ObjectId("" + factures[i].idClient);
        console.log('id', id);
        client = await Client.findById({_id: id});
      }

      if(invoice && invoice !== null) {
        if(type && type !== " " && type === "all") {
          invoices.push({
            invoice,
            user: client
          });
        }

        if(type && type !== " " && type === "paid") {
          if (invoice?.facturePay === true) {
            invoices.push({
              invoice,
              user: client
            });
          }
        }

        if(type && type !== " " && type === "unpaid") {
          if (invoice?.facturePay === false) {
            invoices.push({
              invoice,
              user: client
            });
          }
        }
      }
    }
  }

  res
  .status(200)
  .json({ status: 200, result: generatePaginnation(invoices.slice((page - 1), (page - 1) + limit), invoices, limit, page)});

});

const generatePaginnation = (result, data, limit, page) => {
  if (data?.length > 0) {
      const totalPages = Math.floor(data.length/limit);
      return {
          docs: result,
          totalDocs: data.length,
          limit: limit,
          totalPages: totalPages,
          page: page,
          pagingCounter: totalPages,
          hasPrevPage: ( page > 1),
          hasNextPage: (totalPages > page),
          prevPage: (page - 1),
          nextPage: (totalPages > page) ? page + 1 : page
      }
  } else {
      return {
          docs: [],
          totalDocs: 0,
          limit: limit,
          totalPages: 0,
          page: page,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: 1,
          nextPage: 1
      }
  }
}

module.exports = {
  addFacture,
  getAllFacture,
  getFactures,
  getClientFactures,
  updateFacture,
  statusPaidFacture,
  getFactureAdvance,
  getByStatus,
  getFactureOne,
  findByYear,
  getOneInvoiceByYear,
  addInformation,
  getStaticInformation,
  seeUnpaidInvoicewithDate,
  haveInvoice,
  preCreate,

  searchInvoice,
  getByStatusWithPagination,
  removeInvoice,
  getUserThatHaveNotPaidInvoiceWithDate,
};
