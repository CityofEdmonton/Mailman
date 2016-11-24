var factory = require('./serializable-factory.js');

var EmailRule = function() {
  // private variables

  // public variables
  this.RuleTypes = {
    INSTANT: 'INSTANT',
    LATER: 'LATER',
    TRIGGER: 'TRIGGER'
  };

  this.ruleType = null;

  // The type is needed in a static and object context. There may be better ways to do this.
  this.TYPE = 'EmailRule';

  // INSTANT
  this.to = null;
  this.sheet = null;
  this.subject = null;
  this.body = null;

  // LATER
  this.laterDate = null;

  // TRIGGER
  this.sendColumn = null;
  this.timestampColumn = null;

  // ***** private methods ***** //

  // ***** privileged methods ***** //

  /**
   * @constructor
   */
  this.init = function() {
    this.ruleType = this.RuleTypes.INSTANT;
  };

  this.init();
};


/**
 * These types determine which type of rule any given rule is. They could be modeled as seperate classes.
 */
EmailRule.RuleTypes = {
  INSTANT: 'INSTANT',
  LATER: 'LATER',
  TRIGGER: 'TRIGGER'
};


/** The type is needed in a static and object context. There may be better ways to do this. */
EmailRule.TYPE = 'EmailRule';
factory.register(EmailRule);


/** */
module.exports = EmailRule;
