var EmailRule = require('./email-rule.js');
var RuleTypes = require('./rule-types.js');
var Database = require('./database.js');
var Keys = require('./prop-keys.js');

/**
 * This model holds all EmailRules. It is built to make serialization and deserialization easy.
 *
 * @param {Array<EmailRule>} config.rules The array of EmailRules config objects.
 * @constructor
 */
var RuleContainer = function(config) {

  // private variables
  var self = this;
  var rules = [];
  var database = new Database();

  // public variables

  // ***** private methods ***** //
  this.init_ = function(config) {
    if (config.rules != null) {

      var ruleObjs = config.rules;
      for (var i = 0; i < ruleObjs.length; i++) {

        var ruleObj = ruleObjs[i];
        this.add(ruleObj);
      }
    }
  };

  // ***** privileged methods ***** //

  /**
   * Appends a new EmailRule.
   *
   * @param {Object} config The config object for this EmailRule. Please see EmailRule for details.
   */
  this.add = function(config) {
    rules.push(new EmailRule(config));
  };

  // TODO Test
  this.remove = function(rule) {
    console.log('REMOVE');
    rules.forEach(function(element, index, array) {

      if (element.isEqual(rule)) {
        array.splice(index);

        // Push rule update
        database.save(Keys.RULE_KEY, rules);

        return;
      }
    });

  };

  this.get = function(index) {
    return rules[index];
  };

  this.length = function() {
    return rules.length;
  }

  /**
   * Converts this RuleContainer to a serializeable form.
   *
   * @return {Object} The configuration object, which can be used to rebuild this object exactly.
   *     See RuleContainer for a detailed description of all object members.
   */
  this.toConfig = function() {
    return {
      rules: rules
    };
  };

  this.init_(config);
};

module.exports = RuleContainer;
