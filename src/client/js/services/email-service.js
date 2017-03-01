var Provoke = require('../util/provoke.js');



var EmailService = function() {

  this.sendTest = function(sheetName, headerRow, subject, body) {
    return Provoke('EmailService', 'sendTest', sheetName, headerRow, subject, body);
  };

  this.send = function(template) {
    return Provoke('EmailService', 'startMergeTemplate', template.toConfig());
  };

};

module.exports = EmailService;
