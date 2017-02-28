var baseHTML = require('./cards-view.html');
var Util = require('../../util/util.js');
var PubSub = require('pubsub-js');
var Promise = require('promise');



/**
 * This view helps a user set up their own MergeTemplate. This view can be used for email merge, doc merge, draft merge,
 * or any other merge, so long as it adheres to the Card-style creation process.
 * This view publishes the following events: Mailman.CardsView.show.
 *
 * @constructor
 * @param {jquery} appendTo The element this view should be appended to.
 * @param {CardHandler} handler There are different types of CardHandlers. This needs to support them all.
 */
var CardsView = function(appendTo, handler, data) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var cards;

  // These are used to resolve the Promise in done.
  var resolveCB;
  var rejectCB;

  // jQuery Objects
  var contentArea = base.find('[data-id="content-area"]');
  var back = base.find('[data-id="back"]');
  var step = base.find('[data-id="step"]');
  var done = base.find('[data-id="done"]');
  var cancel = base.find('[data-id="cancel"]');

  //***** private methods *****//
  this.init_ = function(appendTo, handler, data) {
    appendTo.append(base);

    cards = new handler(contentArea);
    if (data != null) {
      cards.setMergeTemplate(data);
    }
    setButtonState();

    step.on('click', self.next);
    done.on('click', doneClicked);
    back.on('click', self.back);
    cancel.on('click', cancelClicked);

    componentHandler.upgradeElement(step[0], 'MaterialButton');
    componentHandler.upgradeElement(done[0], 'MaterialButton');
    componentHandler.upgradeElement(back[0], 'MaterialButton');
    componentHandler.upgradeElement(cancel[0], 'MaterialButton');
  };

  var doneClicked = function() {
    if (resolveCB != null) {
      resolveCB(cards.getMergeTemplate());
    }
  };

  var cancelClicked = function() {
    if (rejectCB != null) {
      rejectCB('cancelled');
    }
  };

  //***** public methods *****//

  this.cleanup = function() {
    //cards.cleanup(); TODO
    console.log('cleanup');
  };

  /**
   * This function goes to the next card.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.next = function(event) {
    cards.next();
    setButtonState();
  };

  /**
   * This function goes to the previous card.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.back = function(event) {
    cards.back();
    setButtonState();
  };

  /**
   * Gives a Promise that can be used to determine whether the CardsView is done or not.
   *
   * @return {Promise} A promise that doesn't resolve until the DONE button is clicked. The Promise is rejected if
   * CANCEL is clicked.
   */
  this.done = function() {
    return new Promise(function(resolve, reject) {
      resolveCB = resolve;
      rejectCB = reject;
    });
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

  this.init_(appendTo, handler, data);
};


/** */
module.exports = CardsView;
