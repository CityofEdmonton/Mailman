var baseHTML = require('./cards-view.html');
var Cards = require('../cards-handler.js');
var Util = require('../util.js');
var PubSub = require('pubsub-js');

var CardsView = function(appendTo) {
  // private variables
  var self = this;
  var base = $(baseHTML);
  var cards;

  // jQuery Objects
  var cardsView = base.find('[data-id="cards-view"]'); // cardsView in Mailman.js Should now use base
  var contentArea = base.find('[data-id="content-area"]');
  var back = base.find('[data-id="back"]');
  var step = base.find('[data-id="step"]');
  var done = base.find('[data-id="done"]');

  //***** private methods *****//
  this.init_ = function(appendTo) {
    appendTo.append(base);

    cards = new Cards(contentArea);

    step.on('click', self.next);
    done.on('click', self.done);
    back.on('click', self.back);

    // It's important to note the flow of the program here.
    // When cards.jumpTo is called, this pubsub function is called.
    // jump to a card > rebuild the nav tree
    PubSub.subscribe('Cards.jumpTo', function(msg, data) {
      var activeNode = cards.getActiveNode();
      navBar.buildNavTree(cards.getActiveNode());
      setButtonState();
    });
  };

  //***** public methods *****//

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

    navBar.buildNavTree(active);
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

    navBar.buildNavTree(active);
  };

  /**
   * Submits data back to google.
   *
   * TODO Move this into the CardHandler or a CardsView.
   * @param {event} event The event that triggered the function call.
   */
  this.done = function(event) {
    var rule = cards.getRule();

    if (rules.indexOf(rule.getID()) !== -1) {
      rules.update(rule);
    }
    else {
      rules.add(rule.toConfig());
    }

    database.save(Keys.RULE_KEY, rules.toConfig(), function() {
      if (cards.getRuleType() === RuleTypes.INSTANT) {
        google.script.run
            .instantEmail(rule.toConfig());
      }

      setTimeout(function() {
        rulesListView.show();
        Util.setHidden(cardsView, true);

        navBar.cleanup();
        cards.cleanup();

        // TODO reload rules
      }, 1000);
    });
  };

  //***** private methods *****//

  /**
   * Using the Cards handler, this sets the state of the buttons.
   * Depending on the active Card, different buttons may be shown.
   *
   */
  var setButtonState = function() {
    // Default state
    Util.setHidden($('#done'), true);
    Util.setHidden($('#step'), false);
    Util.setHidden($('#back'), false);

    if (cards.isFirst()) {
      Util.setHidden($('#back'), true);
    }
    else if (cards.isLast()) {
      Util.setHidden($('#done'), false);
      Util.setHidden($('#step'), true);
    }
  };

  this.init_();
};


/** */
module.exports = CardsView;
