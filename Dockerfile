FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install

COPY . .

# CMD [ "node", "index.js" ]
CMD [ "nodemon", "index.js" ]