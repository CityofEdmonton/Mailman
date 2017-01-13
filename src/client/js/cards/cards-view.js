var baseHTML = require('./cards-view.html');
var Cards = require('../cards-handler.js');
var Util = require('../util.js');
var PubSub = require('pubsub-js');



/**
 * This view displays all the information needed to create a new EmailRule.
 * This view publishes the following events: Mailman.CardsView.show.
 *
 * @constructor
 * @param {jquery} appendTo The element this view should be appended to.
 */
var CardsView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var cards;
  var doneCB;
  var cancelCB;

  // jQuery Objects
  var contentArea = base.find('[data-id="content-area"]');
  var back = base.find('[data-id="back"]');
  var step = base.find('[data-id="step"]');
  var done = base.find('[data-id="done"]');
  var cancel = base.find('[data-id="cancel"]');

  //***** private methods *****//
  this.init_ = function(appendTo) {
    appendTo.append(base);

    cards = new Cards(contentArea);

    step.on('click', self.next);
    done.on('click', self.done);
    back.on('click', self.back);
    cancel.on('click', self.cancel);

    componentHandler.upgradeElement(step[0], 'MaterialButton');
    componentHandler.upgradeElement(done[0], 'MaterialButton');
    componentHandler.upgradeElement(back[0], 'MaterialButton');
    componentHandler.upgradeElement(cancel[0], 'MaterialButton');
  };

  //***** public methods *****//

  this.cleanup = function() {
    cards.cleanup();
  };

  /**
   * This function goes to the next card.
   *
   * TODO There is non-DRY code between this function and this.back.
   * TODO Move this into the CardHandler or a CardsView.
   * @param {event} event The event that triggered the function call.
   */
  this.next = function(event) {
    var active = cards.next();
    setButtonState();
  };

  /**
   * This function goes to the previous card.
   *
   * TODO There is non-DRY code between this function and this.next.
   * TODO Move this into the CardHandler or a CardsView.
   * @param {event} event The event that triggered the function call.
   */
  this.back = function(event) {
    var active = cards.back();
    setButtonState();
  };

  /**
   * Passes the EmailRule to the previously set callback.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.done = function(event) {
    if (doneCB == undefined) {
      throw new Error('CardsView has no done callback. Please set with setDoneCallback.');
    }

    doneCB(cards.getRule());
  };

  /**
   * Cancels the EmailRule creation process.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.cancel = function(event) {
    if (cancelCB == undefined) {
      throw new Error('CardsView has no cancel callback. Please set with setDCancelCallback.');
    }

    cancelCB();
  };

  /**
   * Sets the EmailRule this view should display. This is typically used when editing an existing EmailRule.
   *
   * @param {EmailRule} rule The rule contains all the information that should be displayed in this view.
   */
  this.setRule = function(rule) {
    cards.setRule(rule);
    setButtonState();
  };

  /**
   * Creates a fresh instance of this view for creating a new EmailRule.
   *
   * @param  {RuleTypes} type The RuleType of the new EmailRule. This view knows nothing about these.
   * It just passes the type through to the CardsHandler.
   */
  this.newRule = function(type) {
    cards.setType(type);
    setButtonState();
  };

  /**
   * Shows this view.
   *
   */
  this.show = function() {
    Util.setHidden(base, false);
    PubSub.publish('Mailman.CardsView.show');
  };

  /**
   * Hides this view.
   *
   */
  this.hide = function() {
    Util.setHidden(base, true);
  };

  /**
   * Toggles the state of the help information.
   *
   */
  this.toggleHelp = function() {
    cards.toggleHelp();
  };

  /**
   * Sets the function to call when the done button is clicked.
   *
   * @param {Function} cb The function that will be called when the done button is clicked.
   */
  this.setDoneCallback = function(cb) {
    doneCB = cb;
  };

  /**
   * Sets the function to call when the cancel button is clicked.
   *
   * @param {Function} cb The function that will be called when the cancel button is clicked.
   */
  this.setCancelCallback = function(cb) {
    cancelCB = cb;
  };

  //***** private methods *****//

  /**
   * Using the Cards handler, this sets the state of the buttons.
   * Depending on the active Card, different buttons may be shown.
   *
   */
  var setButtonState = function() {
    // Default state
    Util.setHidden(done, true);
    Util.setHidden(step, false);
    Util.setHidden(back, false);
    Util.setHidden(cancel, true);

    if (cards.isFirst()) {
      Util.setHidden(back, true);
      Util.setHidden(cancel, false);
    }
    else if (cards.isLast()) {
      Util.setHidden(done, false);
      Util.setHidden(step, true);
    }
  };

  this.init_(appendTo);
};


/** */
module.exports = CardsView;
