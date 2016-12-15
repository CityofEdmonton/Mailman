var EmailRule = require('./email-rule.js');
var RuleTypes = require('./rule-types.js');
var Database = require('./database.js');
var PubSub = require('pubsub-js');
var Keys = require('./prop-keys.js');



/**
 * This model holds all EmailRules. It is built to make serialization and deserialization easy.
 *
 * @param {Object} config The Object used to rebuild the RuleContainer.
 * @param {Array<EmailRule>} config.rules The EmailRules that this container holds.
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
        rules.push(new EmailRule(ruleObj));
      }
    }
  };

  // ***** privileged methods ***** //

  /**
   * Appends a new EmailRule. Notifies all listeners.
   *
   * TODO Make this take an EmailRule.
   * @param {Object} config The config object for this EmailRule. Please see EmailRule for details.
   */
  this.add = function(config) {
    rules.push(new EmailRule(config));

    database.save(Keys.RULE_KEY, self.toConfig(), function() {
      PubSub.publish('Rules.add');
    });
  };

  /**
   * Removes an EmailRule from the container and notifies any listeners.
   *
   * @param  {EmailRule} rule The rule to delete.
   */
  this.remove = function(rule) {
    rules.forEach(function(element, index, array) {

      if (element.isEqual(rule)) {
        array.splice(index, 1);

        // Push rule update
        database.save(Keys.RULE_KEY, self.toConfig(), function() {
          PubSub.publish('Rules.delete');
        });

        return;
      }
    });
  };

  /**
   * Updates the given EmailRule. Note that the id of the given EmailRule must be the same as the EmailRule stored
   * in this RuleContainer.
   *
   * @param  {EmailRule} rule The new EmailRule. It's id must be the same as an existing EmailRule,
   *                          or the update will fail.
   */
  this.update = function(rule) {

    var index = self.indexOf(rule.getID());
    if (index === -1) {
      throw new Error('Error: EmailRule not found.');
    }

    rules[index] = rule;
    database.save(Keys.RULE_KEY, self.toConfig(), function() {
      PubSub.publish('Rules.update');
    });
  };

  /**
   * Gets an EmailRule by index.
   * @param  {number} index The index of the EmailRule.
   * @return {EmailRule} The EmailRule at the given index.
   */
  this.get = function(index) {
    return rules[index];
  };

  /**
   * Gets the index of a given EmailRule by id.
   *
   * @param  {string} id The id of the rule to find.
   * @return {number} The index of the EmailRule with the given ID. -1 if not found.
   */
  this.indexOf = function(id) {
    return rules.findIndex(function(element) {
      return element.getID() === id;
    });
  };

  /**
   * Gets the number of EmailRules.
   *
   * @return {number} The number of EmailRules.
   */
  this.length = function() {
    return rules.length;
  };

  /**
   * Converts this RuleContainer to a serializeable form.
   *
   * @return {Object} The configuration object, which can be used to rebuild this object exactly.
   *     See RuleContainer for a detailed description of all object members.
   */
  this.toConfig = function() {
    var ruleConfigs = [];
    for (var i = 0; i < rules.length; i++) {
      ruleConfigs.push(rules[i].toConfig());
    }

    return {
      rules: ruleConfigs
    };
  };

  this.init_(config);
};


/** */
module.exports = RuleContainer;
