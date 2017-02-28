var Provoke = require('../util/provoke.js');



var SettingsService = function() {

  this.getLog = function() {
    return Provoke('SettingsService', 'getLogURL');
  };

  this.turnOnLogging = function() {
    return Provoke('SettingsService', 'turnOnLogging');
  };

  this.turnOffLogging = function() {
    return Provoke('SettingsService', 'turnOffLogging');
  };

};

module.exports = SettingsService;
