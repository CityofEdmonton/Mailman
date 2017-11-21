/**
 * This module exports the MergeTemplateListItem object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var baseHTML = require('./merge-template-list-item.html');
var MergeTemplate = require('../../data/merge-template/merge-template.js');
var ID = require('../../data/id.js');
var Util = require('../../util/util.js');
var Disabler = require('../../util/disable.js');
//var MetadataService = require('../../services/metadata-service.js');



/**
* Used to display a MergeTemplate. It has icons for editing, deleting and running.
*
* @constructor
* @param {jquery} appendTo The object to append this component to.
* @param {MergeTemplate} template The merge to display.
*/
var MergeTemplateListItem = function(appendTo, template,
  metadataService) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var user;
  var repeatDialog;
  var runDialog;
  var deleteDialog;
  var template;

  var repeatButton = base.find('[data-id="repeat-toggle-mail"]');
  var repeatIcon = base.find('[data-id="repeat-icon"]');
  var deleteIcon = base.find('[data-id="delete"]');
  var runIcon = base.find('[data-id="run"]');
  var editIcon = base.find('[data-id="edit"]');
  var previewIcon = base.find('[data-id="preview"]');
  var title = base.find('[data-id="title"]');
  var claimedUser = base.find('[data-id="claimed-user"]');

  var previewTT = base.find('[data-id="preview-label"]');
  var editTT = base.find('[data-id="edit-label"]');
  var runTT = base.find('[data-id="run-label"]');
  var deleteTT = base.find('[data-id="delete-label"]');
  var repeatTT = base.find('[data-id="repeat-label"]');


  var REPEAT_ON_LABEL = 'Turn Off Repeat';
  var REPEAT_OFF_LABEL = 'Turn On Repeat';

  //***** private methods *****//

  this.init_ = function(appendTo, templateObj) {
    template = templateObj;

    var config = template.toConfig();
    title.text(config.mergeData.title);

    var id = ID();
    editIcon.attr('id', id);
    editTT.attr('data-mdl-for', id);

    id = ID();
    runIcon.attr('id', id);
    runTT.attr('data-mdl-for', id);

    id = ID();
    deleteIcon.attr('id', id);
    deleteTT.attr('data-mdl-for', id);

    id = ID();
    repeatButton.attr('id', id);
    repeatTT.attr('data-mdl-for', id);

    id = ID();
    previewIcon.attr('id', id);
    previewTT.attr('data-mdl-for', id); 

    appendTo.append(base);

    componentHandler.upgradeElement(deleteIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(runIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(editIcon[0], 'MaterialButton');
    componentHandler.upgradeElement(repeatButton[0], 'MaterialButton');
    componentHandler.upgradeElement(editTT[0], 'MaterialTooltip');
    componentHandler.upgradeElement(runTT[0], 'MaterialTooltip');
    componentHandler.upgradeElement(deleteTT[0], 'MaterialTooltip');
    componentHandler.upgradeElement(repeatTT[0], 'MaterialTooltip');
    componentHandler.upgradeElement(previewTT[0], 'MaterialTooltip');
    
    metadataService.getUser().then(function(u) {
      user = u;
      lock();
    });
  };

  var lock = function() {
    var config = template.toConfig();

    if (config.mergeRepeater == null) {
      repeatIcon.removeClass('rli-repeat');
      repeatTT.text(REPEAT_OFF_LABEL);
    }
    else {
      repeatIcon.addClass('rli-repeat');
      repeatTT.text(REPEAT_ON_LABEL);

      if (config.mergeRepeater.owner !== user) {
        self.disable();
        claimedUser.text('Claimed by ' + config.mergeRepeater.owner);
        Util.setHidden(claimedUser, false);
      }
    }
  };

  //***** privileged methods *****//

  /**
  * Sets the handler for when the delete icon is clicked.
  *
  * @param {Function} callback The function to call.
  */
  this.setDeleteHandler = function(callback) {
    deleteIcon.on('click', template, function(e) {
      deleteDialog.show().then(function() {
        Disabler(deleteIcon, 10000);
        callback(e.data);
      }).done();
    });
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
    runIcon.on('click', template, function(e) {
      runDialog.show().then(function() {
        Disabler(runIcon, 10000);
        callback(e.data);
      }).done();
    });
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
        repeatDialog.show().then(function() {
          console.log('List item on');
          Disabler(repeatButton, 10000);
          onCallback(template);
        }).done();
      }
      else {
        console.log('List item off');
        Disabler(repeatButton, 10000);
        offCallback(template);
      }
    });
  };

 /**
  * Sets the handler for when the toggle button is clicked.
  *
  * @param {Function} callback The function to call.
  */
  this.setPreviewHandler = function(callback) {
    previewIcon.on('click', template, callback);
  };


  this.setRepeatDialog = function(dialog) {
    repeatDialog = dialog;
  };

  this.setRunDialog = function(dialog) {
    runDialog = dialog;
  };

  this.setDeleteDialog = function(dialog) {
    deleteDialog = dialog;
  };

  this.getTemplate = function() {
    return template;
  };

  /**
   * Disables the ListItem and all of its controls.
   *
   */
  this.disable = function() {
    base.attr('disabled', true);
    repeatButton.attr('disabled', true);
    deleteIcon.attr('disabled', true);
    runIcon.attr('disabled', true);
    editIcon.attr('disabled', true);
    previewIcon.attr('disabled', true);
  };

  /**
   * Enables the ListItem and all of it's controls.
   *
   */
  this.enable = function() {
    base.removeAttr('disabled');
    repeatButton.removeAttr('disabled');
    deleteIcon.removeAttr('disabled');
    runIcon.removeAttr('disabled');
    editIcon.removeAttr('disabled');
    previewIcon.removeAttr('disabled');
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
