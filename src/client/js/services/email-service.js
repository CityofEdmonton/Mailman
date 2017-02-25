var Provoke = require('../util/provoke.js');



var EmailService = function() {

  this.sendTest = function() {

  };

  this.send = function(template) {
    return Provoke('EmailService', 'startMergeTemplate', template.toConfig());
  };

};

module.exports = EmailService;
