'use strict';

var ID = require('./id.js');
var RuleTypes = require('./rule-types.js');



/**
 * This resource represents an email blast. They can be one time, or recurring (TRIGGER)
 * emails.
 *
 * @constructor
 * @param {Object} config The config Object used to initialize this EmailRule.
 * @param {string} config.ruleType The type of EmailRule. Can be INSTANT (one time) or TRIGGER (reoccurring).
 * @param {string} config.to The tagged column that contains the username of the recipient.
 * @param {string} config.sheet The name of the Sheet that contains all the needed columns.
 *                              Mailman requires all columns to be in the same sheet.
 * @param {string} config.subject The tagged subject of the EmailRule. This can contain tags and normal strings.
 * @param {string} config.body The tagged body of the EmailRule. It can contain text and tags together.
 *                             TODO support HTML.
 * @param {string} config.sendColumn The tagged column that contains the truthy value.
 * @param {string} config.timestampColumn The tagged column that Mailman will edit when an email is sent.
 */
var EmailRule = function(config) {

  // private variables

  // This id is only used client-side. It allows each rule to be distinguished from the next.
  var id = ID();
  var self = this;

  // public variables
  this.createdDatetime;
  this.title;
  this.headerRow;
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

  this.init_ = function(config) {
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

    // createdDatetime
    if (config.createdDatetime == null) {
      self.createdDatetime = self.getDateString(new Date());
    }
    else {
      self.createdDatetime = config.createdDatetime;
    }

    // title
    if (config.title == null) {
      self.title = 'Title';
    }
    else {
      self.title = config.title;
    }

    // header
    if (config.headerRow == null) {
      self.headerRow = '1';
    }
    else {
      self.headerRow = config.headerRow.toString();
    }
  };

  // ***** privileged methods ***** //

  /**
   * Checks whether a given email object is equal to either the supplied object or the supplied id.
   *
   * @param  {EmailRule} rule Either the id of the EmailRule or the EmailRule.
   * @return {boolean} True if the given value is equal to this EmailRule.
   */
  this.isEqual = function(rule) {
    return rule.getID() === id;
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
   * Formats a Date into a string in a way this EmailRule wants.
   *
   * @param  {Date} date The Date to format.
   * @return {string} The stringified version of the Date.
   */
  this.getDateString = function(date) {
    return (date.getMonth() + 1) + '/' +
            date.getDate() + '/' +
            date.getFullYear() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds();
  };

  /**
   * Converts this EmailRule to an easily serializeable form.
   *
   * @return {Object} The configuration object, which can be used to rebuild this object exactly.
   *     See EmailRule for a detailed description of all object members.
   */
  this.toConfig = function() {
    return {
      ruleType: self.ruleType,
      headerRow: self.headerRow,
      to: self.to,
      sheet: self.sheet,
      subject: self.subject,
      body: self.body,
      sendColumn: self.sendColumn,
      timestampColumn: self.timestampColumn,
      createdDatetime: self.createdDatetime,
      title: self.title
    };
  };


  this.init_(config);
};


/** */
module.exports = EmailRule;