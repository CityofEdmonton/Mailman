var MergeTemplate = require('./merge-template/merge-template.js');
var MTService = require('../services/merge-template-service.js');
var PubSub = require('pubsub-js');



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
   * Appends a new MergeTemplate. Notifies all listeners.
   *
   * TODO Fix event.
   * @param {Object} config The config object for this MergeTemplate. Please see MergeTemplate for details.
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
   * TODO Remove event publish.
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
   * TODO This could probably rely more heavily on the server for state.
   *
   * @param  {MergeTemplate} template The template to delete.
   */
  this.remove = function(template) {
    var index = self.indexOf(template.toConfig().id);
    if (index === -1) {
      throw new Error('MergeTemplate not found.');
    }

    service.delete(self.get(index)).then(
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
    return templates.findIndex(function(element) {
      return element.toConfig().id === id;
    });
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
   * Converts this to a serializeable form.
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
