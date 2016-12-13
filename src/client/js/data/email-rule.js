'use strict';

var ID = require('./id.js');
var RuleTypes = require('./rule-types.js');

var EmailRule = function(config) {
  if (config.ruleType == null) {
    throw new Error('EmailRule config is missing "ruleType".');
  }
  if (config.to == null) {
    throw new Error('EmailRule config is missing "to".');
  }
  if (config.sheet == null) {
    throw new Error('EmailRule config is missing "sheet".');
  }
  if (config.subject == null) {
    throw new Error('EmailRule config is missing "subject".');
  }
  if (config.body == null) {
    throw new Error('EmailRule config is missing "body".');
  }
  if (config.ruleType === RuleTypes.TRIGGER &&
    config.sendColumn == null) {
    throw new Error('EmailRule config is missing "sendColumn".');
  }
  if (config.ruleType === RuleTypes.TRIGGER &&
    config.timestampColumn == null) {
    throw new Error('EmailRule config is missing "timestampColumn".');
  }

  // private variables

  // This id is only used client-side. It allows each rule to be distinguished from the next.
  var id = ID();

  // public variables

  this.ruleType = config.ruleType;

  // INSTANT
  this.to = config.to;
  this.sheet = config.sheet;
  this.subject = config.subject;
  this.body = config.body;

  // TRIGGER
  this.sendColumn = config.sendColumn;
  this.timestampColumn = config.timestampColumn;

  // ***** private methods ***** //


  // ***** privileged methods ***** //

  /**
   * Checks whether a given email object is equal to either the supplied object or the supplied id.
   *
   * @param  {number|EmailRule}  idOrObject Either the id of the EmailRule or the EmailRule.
   * @return {Boolean} True if the given value is equal to this EmailRule.
   */
  this.isEqual = function(rule) {
    return rule.getID() === id;
    // if (typeof idOrObject === 'number') {
    //   return this.id === idOrObject;
    // }
    // else {
    //   return this === idOrObject;
    // }
  };

  /**
   * Returns the unique id of this EmailRule.
   *
   * @return {string} The unique id of this EmailRule.
   */
  this.getID = function() {
    return id;
  };

  /**
   * Converts this EmailRule to an easily serializeable form.
   *
   * @return {Object} The configuration object, which can be used to rebuild this object exactly.
   *     See EmailRule for a detailed description of all object members.
   */
  this.toConfig = function() {
    return {
      ruleType: this.ruleType,
      to: this.to,
      sheet: this.sheet,
      subject: this.subject,
      body: this.body,
      sendColumn: this.sendColumn,
      timestampColumn: this.timestampColumn
    };
  };

};


/** */
module.exports = EmailRule;
