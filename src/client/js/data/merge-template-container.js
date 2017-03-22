/**
 * This module exports the MergeTemplateContainer object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var MergeTemplate = require('./merge-template/merge-template.js');
var MTService = require('../services/merge-template-service.js');
var PubSub = require('pubsub-js');



/**
 * This object handles many of the operations associated with MergeTemplates.
 * It also acts as the primary store for them.
 *
 * @constructor
 * @alias MergeTemplateContainer
 * @param {Object} config An Object containing configuration objects for this.
 * @param {Array<Object>} config.templates An array of MergeTemplate configs to be created.
 * See also {@link MergeTemplate}
 */
var MergeTemplateContainer = function(config) {

  // private variables
  var self = this;
  var templates = [];
  var service = new MTService();

  // ***** private methods ***** //

  this.init_ = function(config) {
    var templateObjs = config.templates;

    for (var i = 0; i < templateObjs.length; i++) {
      templates.push(new MergeTemplate(templateObjs[i]));
    }
  }

  // ***** public methods ***** //

  /**
   * Toggles the repeat state of a given MergeTemplate.
   * TODO this could be improved by not requiring 2 calls to the server. The update call should be uneccesary.
   *
   * @param {MergeTemplate} template The MergeTemplate to toggle the repeater state of.
   */
  this.toggleRepeat = function(template) {
    var oldConfig = template.toConfig();

    var index = self.indexOf(oldConfig.id);
    if (index === -1) {
      throw new Error('MergeTemplate not found.');
    }

    if (oldConfig.mergeRepeater == null) {
      service.getRepeat().then(
        function(config) {
          var tempConfig = template.toConfig();
          tempConfig.mergeRepeater = config;
          self.update(new MergeTemplate(tempConfig));
        },
        function(err) {
          console.error(err);
        }
      ).done();
    }
    else {
      service.removeRepeat(template).then(
        function(config) {
          self.update(new MergeTemplate(config));
        },
        function(err) {
          console.error(err);
        }
      ).done();
    }
  };

  /**
   * Creates a new MergeTemplate. It's worth noting that MergeTemplates are created from a config Object that looks
   * similar to MergeTemplate, but doesn't have all of its information.
   *
   * @param {Object} config The config object for this MergeTemplate. Please see {@link MergeTemplate} for details.
   */
  this.add = function(config) {
    var template = new MergeTemplate(config);
    templates.push(template);

    service.create(template).then(
      function() {
        PubSub.publish('Rules.add');
      },
      function(e) {
        console.log(e);
      }
    ).done();
  };

  /**
   * Updates the given MergeTemplate. Note that the id of the given MergeTemplate must be the same as the MergeTemplate
   * stored in this MergeTemplateContainer.
   *
   * @param {MergeTemplate} template The new MergeTemplate. Its id must be the same as an existing MergeTemplate.
   * or the update will fail.
   */
  this.update = function(template) {

    var index = self.indexOf(template.toConfig().id);
    if (index === -1) {
      throw new Error('MergeTemplate not found.');
    }
    templates[index] = template;

    service.update(template).then(
      function() {
        PubSub.publish('Rules.update');
      },
      function(e) {
        console.log(e);
      }
    ).done();
  };

  /**
   * Removes a MergeTemplate from the container and notifies any listeners.
   *
   * @param  {MergeTemplate} template The template to delete.
   */
  this.remove = function(template) {
    var index = self.indexOf(template.getID());
    if (index === -1) {
      throw new Error('MergeTemplate not found.');
    }

    service.delete(template).then(
      function(result) {
        PubSub.publish('Rules.delete');
      },
      function(err) {
        console.log(err);
      }
    ).done();

    templates.splice(index, 1);
  };

  /**
   * Gets a MergeTemplate by index.
   *
   * @param {number} index The index of the MergeTemplate.
   * @return {MergeTemplate} The MergeTemplate at the given index.
   */
  this.get = function(index) {
    return templates[index];
  };

  /**
   * Gets the index of a given MergeTemplate by id.
   *
   * @param  {string} id The id of the template to find.
   * @return {number} The index of the MergeTemplate with the given ID. -1 if not found.
   */
  this.indexOf = function(id) {
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].toConfig().id === id) {
        return i;
      }
    }

    return -1;
  };

  /**
   * Gets the number of MergeTemplates.
   *
   * @return {number} The number of MergeTemplates.
   */
  this.length = function() {
    return templates.length;
  };

  /**
   * Converts this to a serializeable form. This Object can be used to create a new MergeTemplateContainer that is
   * an exact representation of the current one.
   *
   * @return {Object} The configuration object, which can be used to rebuild this object exactly.
   * See MergeTemplateContainer for a detailed description of all object members.
   */
  this.toConfig = function() {
    return {
      templates: templates.map(function(template){
        return template.toConfig();
      })
    };
  };

  this.init_(config);
};


/** */
module.exports = MergeTemplateContainer;
