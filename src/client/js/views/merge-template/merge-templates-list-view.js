
var baseHTML = require('./merge-templates-list-view.html');
var MergeTemplateListItem = require('./merge-template-list-item.js');
var MergeTemplate = require('../../data/merge-template/merge-template.js');
var MergeTemplateContainer = require('../../data/merge-template-container.js');
var Util = require('../../util/util.js');
var PubSub = require('pubsub-js');
var ActionBar = require('../action-bar/action-bar.js');



/**
 * This view displays all of the MergeTemplates. Each MergeTemplate corresponds to a MergeTemplateListItem.
 * This view responds to the following PubSub events: Rules.delete, Rules.add, Rules.update.
 * This view publishes the following events: Mailman.RulesListView.show.
 * @constructor
 * @param {jquery} appendTo The element this view should be appended to.
 */
var MergeTemplatesListView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var listItems = [];
  var mergeTemplates;
  var actionBar = ActionBar;
  var repeatDialog;
  var runDialog;
  var deleteDialog;

  // jQuery Objects
  var list = base.find('[data-id="list"]');
  var emptyContainer = base.find('[data-id="empty-container"]');
  var instantButton = base.find('[data-id="instant-button"]');

  // Event callbacks
  var deletionCallback;
  var editCallback;
  var runCallback;
  var instantCB;
  var repeatCB;
  var unrepeatCB;

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    instantButton.on('click', newInstant);

    PubSub.subscribe('Rules.delete', rebuild);
    PubSub.subscribe('Rules.add', rebuild);
    PubSub.subscribe('Rules.update', rebuild);
    PubSub.subscribe('Mailman.SettingsView.hide', self.show);

    componentHandler.upgradeElement(instantButton[0], 'MaterialButton');
  };

  var itemEdit = function(e) {
    editCallback(e.data);
  };

  var newInstant = function(e) {
    instantCB(e);
  };

  var rebuild = function() {
    for (var i = 0; i < listItems.length; i++) {
      listItems[i].cleanup();
    }

    listItems = [];
    for (var i = 0; i < mergeTemplates.length(); i++) {
      self.add(mergeTemplates.get(i));
    }

    setEmptyDisplay();
  };

  var setEmptyDisplay = function() {
    if (listItems.length === 0) {
      Util.setHidden(list, true);
      Util.setHidden(emptyContainer, false);
      actionBar.hideBranding();
    }
    else {
      Util.setHidden(list, false);
      Util.setHidden(emptyContainer, true);
      actionBar.showBranding();
    }
  };

  //***** public methods *****//

  // this.setRunPromise = function()

  /**
   * Sets the MergeTemplateContainer this view uses.
   *
   * @param {MergeTemplateContainer} container This is the model used by the view to update.
   */
  this.setContainer = function(container) {
    mergeTemplates = container;
    rebuild();
  };

  /**
   * Adds a new MergeTemplateListItem to this view.
   *
   * @param {MergeTemplate} template The model that is used to build the view.
   */
  this.add = function(template) {

    var item = new MergeTemplateListItem(list, template);
    item.setDeleteHandler(deletionCallback);
    item.setEditHandler(itemEdit);
    item.setRunHandler(runCallback);
    item.setRepeatHandlers(repeatCB, unrepeatCB);
    item.setRepeatDialog(repeatDialog);
    item.setRunDialog(runDialog);
    item.setDeleteDialog(deleteDialog);

    listItems.push(item);
  };

  /**
   * Hides this view.
   *
   */
  this.hide = function() {
    Util.setHidden(base, true);
    actionBar.showBranding();
  };

  /**
   * Shows this view.
   *
   */
  this.show = function() {
    setEmptyDisplay();
    Util.setHidden(base, false);
    PubSub.publish('Mailman.RulesListView.show');
  };

  /**
   * Sets the handler for each list item deletion.
   *
   * @param {Function} callback Called when the delete icon is clicked.
   */
  this.setDeleteHandler = function(callback) {
    deletionCallback = callback;
  };

  /**
   * Sets the handler for each list item edit.
   *
   * @param {Function} callback Called when the edit icon is clicked.
   */
  this.setEditHandler = function(callback) {
    editCallback = callback;
  };

  /**
   * Sets the handler for each list item run.
   *
   * @param {Function} callback Called when the run icon is clicked.
   */
  this.setRunHandler = function(callback) {
    runCallback = callback;
  };

  /**
   * Sets the handler for each list item repeat.
   *
   * @param {Function} onCallback Called when the repeat icon is clicked on.
   * @param {Function} offCallback Called when the repeat icon is clicked off.
   */
  this.setRepeatHandlers = function(onCallback, offCallback) {
    repeatCB = onCallback;
    unrepeatCB = offCallback;
  };

  /**
   * Sets the handler for the instant email button click.
   * TODO
   * @param {Function} callback Called when the instant button is clicked.
   */
  this.setInstantHandler = function(callback) {
    instantCB = callback;
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

  this.init_(appendTo);
};


/** */
module.exports = MergeTemplatesListView;
