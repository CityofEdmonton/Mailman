var Provoke = require('../util/provoke.js');



var HeaderService = function() {

  this.get = function(sheet, row) {
    return Provoke('HeaderService', 'get', sheet, row);
  };
};
