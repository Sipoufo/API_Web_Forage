class QueryOption {
    filter = {};
    limit = {};
    offset = 0;

    constructor() {
        this.filter = {};
        this.limit = {};
        this.offset = 0;
    }

    constructor(filter, limit, offset) {
        this.filter = filter;
        this.limit = limit;
        this.offset = offset;
    }
  }
  
  module.exports = QueryOption;