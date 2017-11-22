/**
 * This module exports the MergeTemplateService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');
var Promise = require('promise');
var MergeTemplate = require('../data/merge-template/merge-template');



/**
 * This object handles all operations related to MergeTemplates.
 *
 * @constructor
 */
var MergeTemplateService = function() {

  // use an in-memory store of templates
  var templates = [];
  var SERIALIZE_KEY = "MAILMAN_DEV";

  //***** private methods *****//


  //***** public methods *****//

  /**
   * This creates a new MergeTemplate.
   *
   * @param {MergeTemplate} template The MergeTemplate to create.
   * @return {Promise} A promise.
   */
  this.create = function(template) {
    templates.push(template);
    // save to local storage to retrieve later
    if (localStorage) {
      var templatesSerialized = '[' +
        templates.map(x => JSON.stringify(x.toConfig()))
          .join(',') + ']';
      if (templatesSerialized) {
        localStorage.setItem(SERIALIZE_KEY, templatesSerialized);       
      }
    }
    return new Promise(function(resolve, reject) {
      resolve();
    });
  };

  /**
   * Gets all MergeTemplates.
   *
   * @return {Promise} A Promise.
   */
  this.getAll = function() {
    return new Promise(function(resolve, reject) {
      if (localStorage) {
        var serializedItems = localStorage.getItem(SERIALIZE_KEY);
        if (serializedItems) {
          try {
            var items = JSON.parse(serializedItems);
            if (items && items.length > 0) {
               var loadedTemplates = items.map(x => new MergeTemplate(x));
               if (loadedTemplates && loadedTemplates.length > 0) {
                loadedTemplates.templates = items;
                templates = loadedTemplates;
               }
            }
          }
          catch (ex) {
            console.log("Unable to read templates from local storage");
          }
        }        
      }
      resolve(templates);
    });
  };

  /**
   * Gets a single MergeTemplate.
   *
   * @param {string} id The id of the MergeTemplate to fetch.
   * @return {Promise} A Promise.
   */
  this.getOne = function(id) {
    debugger;
    throw "Not Implemented";
    //return Provoke('MergeTemplateService', 'getByID', id);
  };

  /**
   * Updates the provided MergeTemplate. Note that the id of the provided MergeTemplate must match an existing
   * MergeTemplate.
   *
   * @param {MergeTemplate} template The newly updated MergeTemplate.
   * @return {Promise} A Promise.
   */
  this.update = function(template) {
    // nothing to do since we are directly working on the objects
    return new Promise(function(resolve, reject) {
      resolve();
    });
    //return Provoke('MergeTemplateService', 'update', template.toConfig());
  };

  /**
   * Deletes the given MergeTemplate.
   *
   * @param {MergeTemplate} template The MergeTemplate to be deleted.
   * @return {Promise} A Promise.
   */
  this.delete = function(template) {
    debugger;
    throw "Not Implemented";    
    //return Provoke('MergeTemplateService', 'deleteByID', template.getID());
  };

  /**
   * Gets a new MergeRepeater config Object. Currently, update must be called after adding this MergeRepeater to a
   * MergeTemplate in order for it to work.
   * TODO Create a function that creates the MergeRepeater AND updates the MergeTemplate.
   *
   * @return {Promise} A Promise.
   */
  this.getRepeat = function() {
    debugger;
    throw "Not Implemented";    
    //return Provoke('MergeTemplateService', 'getRepeatConfig');
  };

  /**
   * Removes the MergeRepeater from the given MergeTemplate. Same as with getRepeat, the MergeTemplate needs to be
   * updated after the change.
   * TODO Create a function that deletes the MergeRepeater and updates the MergeTemplate.
   *
   * @param {MergeTemplate} template The MergeTemplate to remove the MergeRepeater on.
   * @return {Promise} A Promise.
   */
  this.removeRepeat = function(template) {
    debugger;
    throw "Not Implemented";    
    //return Provoke('MergeTemplateService', 'removeRepeatMerge', template.toConfig());
  };

  /**
   * Adds a MergeRepeater to a MergeTemplate.
   *
   * @param {MergeTemplate} template This guy gets updated with a MergeRepeater.
   * @return {Promise} A Promise.
   */
  this.addRepeater = function(template) {
    debugger;
    throw "Not Implemented";    
    //return Provoke('MergeTemplateService', 'addRepeater', template.toConfig());
  };

  /**
   * Runs all MergeTemplates.
   *
   * @return {Promise} A Promise.
   */
  this.runMerges = function() {
    debugger;
    throw "Not Implemented";    
    //return Provoke(null, 'runAllMergeTemplates');
  }

  /**
   * Renders a merge template for the given sheet and row
   * 
   * @param {string} templateId The id of the template to render
   * @param  {string} sheetName The name of the sheet to append the column to.
   * @param  {number} rowNum The 1-based row index to add the header to.   * 
   */
  this.renderTemplate = function(templateId, rowNum) {
    //return Provoke(MergeTemplateService, 'renderTemplate', templateId, sheetName, rowNum);
    debugger;
    throw "Not Implemented";
  }  
};


/** */
module.exports = MergeTemplateService;
