
var baseHTML = require('./merge-template-list-item.html');
var MergeTemplate = require('../../data/merge-template/merge-template.js');
var ID = require('../../data/id.js');
var Util = require('../../util/util.js');



/**
* Used to display a MergeTemplate. It has icons for editing, deleting and running.
*
* @constructor
* @param {jquery} appendTo The object to append this component to.
* @param {MergeTemplate} template The merge to display.
*/
var MergeTemplateListItem = function(appendTo, template) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var dialog;
  var template;

  var repeatButton = base.find('[data-id="repeat-toggle-mail"]');
  var repeatIcon = base.find('[data-id="repeat-icon"]');
  var deleteIcon = base.find('[data-id="delete"]');
  var runIcon = base.find('[data-id="run"]');
  var editIcon = base.find('[data-id="edit"]');
  var title = base.find('[data-id="title"]');

  //***** private methods *****//

  this.init_ = function(appendTo, templateObj) {
    template = templateObj;

    var config = template.toConfig();
    title.text(config.mergeData.title);

    if (config.mergeRepeater == null) {
      repeatIcon.removeClass('rli-repeat');
    }
    else {
      repeatIcon.addClass('rli-repeat');
    }

    appendTo.append(base);

    componentHandler.upgradeElement(deleteIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(runIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(editIcon[0], 'MaterialButton');
  };

  //***** privileged methods *****//

  /**
  * Sets the handler for when the delete icon is clicked.
  *
  * @param {Function} callback The function to call.
  */
  this.setDeleteHandler = function(callback) {
    deleteIcon.on('click', template, callback);
  };

  /**
  * Sets the handler for when the edit icon is clicked.
  *
  * @param {Function} callback The function to call.
  */
  this.setEditHandler = function(callback) {
    editIcon.on('click', template, callback);
  };

  /**
  * Sets the handler for when the run icon is clicked.
  *
  * @param {Function} callback The function to call.
  */
  this.setRunHandler = function(callback) {
    runIcon.on('click', template, callback);
  };

  /**
  * Sets the handler for when the toggle button is clicked.
  *
  * @param {Function} onCallback Called when the repeat icon is clicked on.
  * @param {Function} offCallback Called when the repeat icon is clicked off.
  */
  this.setRepeatHandlers = function(onCallback, offCallback) {
    repeatButton.on('click', template, function() {
      var config = template.toConfig();

      if (config.mergeRepeater == null) {
        dialog.show().then(function() {
          console.log('List item on');
          onCallback(template);
        }).done();
      }
      else {
        console.log('List item off');
        offCallback(template);
      }
    });
  };

  this.setRepeatDialog = function(rDialog) {
    dialog = rDialog;
  };

  /**
  * Cleans up this component. This involves removing the HTML from the DOM.
  *
  */
  this.cleanup = function() {
    base.remove();
  };

  this.init_(appendTo, template);
};


/** */
module.exports = MergeTemplateListItem;
