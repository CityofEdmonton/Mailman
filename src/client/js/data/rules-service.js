


/**
 * This service is made to get/handle all EmailRules from the server.
 *
 */
var RulesService = function() {
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
      console.log('Failed calling RulesService.');
    }
  };

  //***** public methods *****//

  this.getRules = function(success, fail) {
    runGoogleFunction('getAllRules', null, success, fail);
  };

  this.deleteRule = function(rule, success, fail) {
    runGoogleFunction('deleteByID', rule.getID(), success, fail);
  };

  this.updateRule = function(rule, success, fail) {
    runGoogleFunction('updateRule', rule.toConfig(), success, fail);
  };

  this.getRule = function(rule, success, fail) {
    runGoogleFunction('getRuleByID', rule.getID(), success, fail);
  };

  this.createRule = function(rule, success, fail) {
    runGoogleFunction('createRule', rule.toConfig(), success, fail);
  };

};


/** */
module.exports = RulesService;
