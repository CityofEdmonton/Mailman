/**
 * This module exports the MergeTemplate object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var MergeRepeater = require('./merge-repeater.js');
var MergeData = require('./merge-data.js');
var ID = require('../id.js');



/**
 * This represents a merge of some type. The type of merge is decided by {@link MergeData}.
 * This is meant to be easily de/serializeable.
 *
 * @constructor
 * @alias MergeTemplate
 * @param {Object} config The Object used to create this MergeTemplate.
 * @param {string|undefined} config.createdBy The user that originally created this MergeTemplate.
 * @param {string|undefined} config.createdDatetime The date string of when this MergeTemplate was created.
 * @param {string|undefined} config.id The unique identifier of this merge.
 * @param {Object|undefined} config.mergeRepeater An Object representing a {@link MergeRepeater}.
 * @param {Object} config.mergeData An Object representing {@link MergeData}.
 */
var MergeTemplate = function(config) {

  // Mailman looks for this on a trigger. If it finds it, it attempts to send it just like if you ran it yourself.
  var repeater;

  // This represents the "payload" of the merge. This will generally be all the info needed for an email merge,
  // but could be extended to support other merge types (doc merge, calendar merge).
  var data;

  var self = this;
  var createdBy = 'Unknown user';
  var createdDatetime;
  var id = ID();

  //***** Private Methods *****//

  this.init_ = function(config) {
    if (config.mergeData == null) {
      throw new Error('MergeTemplate must contain mergeData.');
    }

    createdDatetime = self.getDateString(new Date());

    this.update(config);
  };

  //***** Public Methods *****//

  /**
   * Updates this MergeTemplate. Takes the same config Object as the constructor.
   *
   * @param  {Object} config A configuration Object that can be used to build this Object.
   * See the constructor for details.
   */
  this.update = function(config) {
    if (config.id != null) {
      id = config.id;
    }

    if (config.createdDatetime != null) {
      createdDatetime = config.createdDatetime;
    }

    if (config.createdBy != null) {
      createdBy = config.createdBy;
    }

    if (config.mergeData != null) {
      data = new MergeData(config.mergeData);
    }

    if (config.mergeRepeater != null) {
      repeater = new MergeRepeater(config.mergeRepeater);
    }
  };

  /**
   * Checks whether this MergeTemplate is equal to the parameter Object.
   *
   * @param  {MergeTemplate} template The MergeTemplate to compare against.
   * @return {boolean} True if the given value is equal to this MergeTemplate.
   */
  this.isEqual = function(template) {
    return template.getID() === id;
  };

  /**
   * Returns the unique id of this MergeTemplate.
   *
   * @return {string} The unique id of this MergeTemplate.
   */
  this.getID = function() {
    return id;
  };

  /**
   * Formats a Date into a string in a way this MergeTemplate wants.
   *
   * @param  {Date} date The Date to format.
   * @return {string} The stringified version of the Date.
   */
  this.getDateString = function(date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  };

  /**
   * Converts this object into an easily serializeable form.
   *
   * @returns {Object} An Object containing all the data needed to recreate this Object.
   */
  this.toConfig = function() {
    var mRep;
    if (repeater !== undefined) {
      mRep = repeater.toConfig();
    }

    return {
      mergeRepeater: mRep,
      mergeData: data.toConfig(),
      createdBy: createdBy,
      createdDatetime: createdDatetime,
      id: id
    };
  };

  this.init_(config);
};


/** */
module.exports = MergeTemplate;
