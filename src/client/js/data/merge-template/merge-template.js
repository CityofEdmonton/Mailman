var MergeRepeater = require('./merge-repeater.js');
var MergeData = require('./merge-data.js');
var ID = require('../id.js');



/**
 * This represents a merge of some type. The type of merge is decided by MergeData.
 * This is meant to be easily de/serializeable.
 *
 * @param {Object} config The Object used to create this MergeTemplate.
 * @param {string} config.createdBy The user that originally created this MergeTemplate.
 * @param {string} config.createdDatetime The date string of when this MergeTemplate was created.
 * @param {string} config.id The unique identifier of this merge.
 * @param {Object} config.mergeRepeater An Object representing a MergeRepeater Object. See MergeRepeater for details.
 * @param {Object} config.mergeData An Object representing a MergeData Object. See MergeData for details.
 */
var MergeTemplate = function(config) {

  /**
   * @type {MergeRepeater}
   *
   * Mailman looks for this on a trigger. If it finds it, it attempts to send it just like if you ran it yourself.
   */
  var repeater;

  /**
   * @type {MergeData}
   *
   * This represents the "payload" of the merge. This will generally be all the info needed for an email merge,
   * but could be extended to support other merge types (doc merge, calendar merge).
   */
  var data;

  var self = this;
  var createdBy = 'Unknown user';
  var createdDatetime = self.getDateString(new Date());
  var id = ID();

  //***** Private Methods *****//

  this.init_ = function(config) {
    if (config.mergeData == null) {
      throw new Error('MergeTemplate must contain mergeData.');
    }

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
    return
      (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +
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
