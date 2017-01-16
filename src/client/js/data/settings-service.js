

var SettingsService = function() {
  // private variables


  //***** private methods *****//

  var runGoogleFunction = function(main, param, success, fail) {
    if (success == null && fail == null) {
      google.script.run[main](param);
    }
    else if (success != null && fail == null) {
      google.script.run
          .withSuccessHandler(success)
          [main](param);
    }
    else if (success == null && fail != null) {
      google.script.run
          .withFailureHandler(fail)
          [main](param);
    }
    else if (success != null && fail != null) {
      google.script.run
          .withSuccessHandler(success)
          .withFailureHandler(fail)
          [main](param);
    }
    else {
      console.log('Failed calling SettingsService.');
    }
  };

  //***** public methods *****//

  this.getLog = function(success, fail) {
    runGoogleFunction('getLogURL', null, success, fail);
  };

  this.turnOnLogging = function(success, fail) {
    runGoogleFunction('turnOnLogging', null, success, fail);
  };

  this.turnOffLogging = function(success, fail) {
    runGoogleFunction('turnOffLogging', null, success, fail);
  };

  this.sendAsMe = function(success, fail) {
    runGoogleFunction('rebuildTrigger', null, success, fail);
  };

  this.clearData = function(success, fail) {
    runGoogleFunction('clearData', null, success, fail);
  };

};


/** */
module.exports = SettingsService;
