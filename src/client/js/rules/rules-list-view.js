
var baseHTML = require('./rules-list-view.html');
var EmailRule = require('../data/email-rule.js');
var RuleListItem = require('./rule-list-item.js');
var TitledCard = require('../card/card-titled.js');
var Util = require('../util.js');
var PubSub = require('pubsub-js');



/**
 * This view displays all of the EmailRules. Each EmailRule corresponds to a RuleListItem.
 * This view responds to the following PubSub events: Rules.delete, Rules.add, Rules.update.
 *
 * @constructor
 * @param {jquery} appendTo The element this view should be appended to.
 */
var RulesListView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var ruleItems = [];
  var ruleContainer;
  var card;

  // jQuery Objects
  var list = base.find('[data-id="list"]');
  var emptyContainer = base.find('[data-id="empty-container"]');
  var triggerButton = base.find('[data-id="trigger-button"]');
  var instantButton = base.find('[data-id="instant-button"]');

  // Event callbacks
  var deletionCallback;
  var editCallback;
  var triggerCB;
  var instantCB;

  // public variables


  //***** private methods *****//

  this.init_ = function(appendTo) {
    appendTo.append(base);

    card = new TitledCard(emptyContainer, {
      title: 'Get started',
      paragraphs: [
        'Click one of the buttons in the bottom right corner to begin.'
      ]
    });
    card.show();

    triggerButton.on('click', newTrigger);
    instantButton.on('click', newInstant);

    PubSub.subscribe('Rules.delete', rebuild);
    PubSub.subscribe('Rules.add', rebuild);
    PubSub.subscribe('Rules.update', rebuild);
  };

  var itemDelete = function(e) {
    deletionCallback(e.data);
  };

  var itemEdit = function(e) {
    editCallback(e.data);
  };

  var newTrigger = function(e) {
    triggerCB(e);
  };

  var newInstant = function(e) {
    instantCB(e);
  };

  var rebuild = function() {
    for (var i = 0; i < ruleItems.length; i++) {
      ruleItems[i].cleanup();
    }

    ruleItems = [];
    for (var i = 0; i < ruleContainer.length(); i++) {
      self.addRule(ruleContainer.get(i));
    }

    setEmptyDisplay();
  };

  var setEmptyDisplay = function() {
    if (ruleItems.length === 0) {
      Util.setHidden(list, true);
      Util.setHidden(emptyContainer, false);
    }
    else {
      Util.setHidden(list, false);
      Util.setHidden(emptyContainer, true);
    }
  };

  //***** privileged methods *****//

  /**
   * Sets the RulesContainer this view uses.
   *
   * @param {RuleContainer} container This is the model used by the view to update.
   */
  this.setRulesContainer = function(container) {
    ruleContainer = container;
    rebuild();
  };

  /**
   * Adds a new RuleListItem to this view.
   *
   * @param {EmailRule} rule The model that is used to build the view.
   */
  this.addRule = function(rule) {

    var item = new RuleListItem(list, rule);
    item.setDeleteHandler(itemDelete);
    item.setEditHandler(itemEdit);

    ruleItems.push(item);
  };

  /**
   * Hides the RulesListView.
   *
   */
  this.hide = function() {
    Util.setHidden(base, true);
  };

  /**
   * Shows the RulesListView.
   *
   */
  this.show = function() {
    Util.setHidden(base, false);
  };

  /**
   * Sets the handler for each RuleListItem deletion.
   *
   * @param {Function} callback Called when the delete icon is clicked.
   */
  this.setDeleteHandler = function(callback) {
    deletionCallback = callback;
  };

  /**
   * Sets the handler for each RuleListItem edit.
   *
   * @param {Function} callback Called when the edit icon is clicked.
   */
  this.setEditHandler = function(callback) {
    editCallback = callback;
  };

  /**
   * Sets the handler for the new trigger button click.
   *
   * @param {Function} callback Called when the add trigger button is clicked.
   */
  this.setTriggerHandler = function(callback) {
    triggerCB = callback;
  };

  /**
   * Sets the handler for the instant email button click.
   *
   * @param {Function} callback Called when the instant trigger button is clicked.
   */
  this.setInstantHandler = function(callback) {
    instantCB = callback;
  };

  this.init_(appendTo);
};


/** */
module.exports = RulesListView;
