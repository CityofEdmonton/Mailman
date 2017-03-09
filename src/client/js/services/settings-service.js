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

  this.getAdvancedMerge = function() {
    return Provoke('SettingsService', 'getAdvancedMerge');
  };

  this.turnOnAdvancedMerge = function() {
    return Provoke('SettingsService', 'turnOnAdvancedMerge');
  };

  this.turnOffAdvancedMerge = function() {
    return Provoke('SettingsService', 'turnOffAdvancedMerge');
  };

};

module.exports = SettingsService;
