var Provoke = require('../util/provoke.js');



var SheetsService = function() {

  this.get = function() {
    return Provoke('SheetsService', 'get');
  };

};

module.exports = SheetsService;
