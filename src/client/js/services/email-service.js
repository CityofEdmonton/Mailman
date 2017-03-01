var Provoke = require('../util/provoke.js');



var EmailService = function() {

  this.sendTest = function(to, subject, body) {
    return Provoke('EmailService', 'send', to, subject, body);
  };

  this.send = function(template) {
    return Provoke('EmailService', 'startMergeTemplate', template.toConfig());
  };

};

module.exports = EmailService;
