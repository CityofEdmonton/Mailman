'use strict';

var InputCard = require('./card/card-input.js');
var TitledCard = require('./card/card-titled.js');
var TextareaCard = require('./card/card-textarea.js');
var List = require('./list/list.js');
var EmailRule = require('./data/email-rule.js');
var RuleTypes = require('./data/rule-types.js');
var Util = require('./util.js');
var PubSub = require('pubsub-js');
var Keys = require('./data/prop-keys.js');
var CardsConfig = require('./cards/cards-config.js');
var CardNames = require('./cards/card-names.js');
var Snackbar = require('./snackbar/snackbar.js');

var Cards = function(parent) {

  //***** LOCAL VARIABLES *****//

  var self = this;

  // This holds all the "cards".
  var contentArea = parent;

  // All the different sheet names.
  var sheets = ['Loading...'];

  // The maximum number of results to display in the autocompletes.
  var maxResults = 5;

  // The list containing all the Cards.
  var cards = new List();

  // This stores the configured Cards. These are only meant for easily adding/removing Cards without losing the data.
  var cardRepository = CardsConfig.buildCardRepo(contentArea);

  // The currently shown Card.
  var activeCard;

  // The rule to update. This is only used when an existing EmailRule is being updated.
  var updateRule = null;

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   * @param {jQuery} contentArea The area where Cards are meant to be added.
   */
  this.init = function(contentArea) {
    setupCards();
  };

  /**
   * Resets the view so it can handle a new EmailRule.
   *
   */
  this.cleanup = function() {

    for (var property in cardRepository) {

      if (cardRepository.hasOwnProperty(property) && cardRepository[property].setValue) {
        cardRepository[property].setValue('');
      }
      if (cardRepository.hasOwnProperty(property) && cardRepository[property].hide) {
        cardRepository[property].hide();
      }
    }

    updateRule = null;
  };

  /**
   * This function goes to the next card.
   *
   * @return {?Node} The new active node.
   */
  this.next = function() {
    if (activeCard.next === null) {
      return null;
    }

    activeCard.data.hide();
    activeCard = activeCard.next;
    activeCard.data.show();

    return activeCard;
  };

  /**
   * This function goes to the previous card.
   *
   * @return {?Node} The new active node.
   */
  this.back = function() {
    if (activeCard.previous === null) {
      return;
    }

    activeCard.data.hide();
    activeCard = activeCard.previous;
    activeCard.data.show();

    return activeCard;
  };

  /**
   * Returns the Node of the active Card.
   *
   * @return {Node} The active Node.
   */
  this.getActiveNode = function() {
    return activeCard;
  };

  /**
   * Checks to see if the card handler is at the first Card.
   *
   * @return {Boolean} true if the active Card is the first Card.
   */
  this.isFirst = function() {
    return activeCard === cards.head;
  };

  /**
   * Checks to see if the card handler is at the last Card.
   *
   * @return {Boolean} true if the active Card is the last Card.
   */
  this.isLast = function() {
    return activeCard === cards.tail;
  };

  /**
   * Gets the Card with the given name.
   *
   * @param {String} name The unique id of the Card to return.
   * @return {Card} The Card with the given id.
   */
  this.getCard = function(name) {
    return cardRepository[name];
  };

  /**
   * Makes the Card with the given id the active Card. Invokes the pubsub message Cards.jumpTo.
   *
   * @param {String} cardId The ID of the Card.
   */
  this.jumpTo = function(cardId) {
    hideAll();

    var node = cards.head;
    while (node !== null) {

      if (node.name === cardId) {
        node.data.show();
        activeCard = node;
        //PubSub.publish('Cards.jumpTo', cardId);

        return;
      }

      node = node.next;
    }
  };

  /**
   * Sets all Card values based upon the values in emailRule.
   * TODO Replace this with something more flexible. It could use a match up between EmailRule properties and
   *  the CardNames.
   *
   * @param {EmailRule} rule The EmailRule to set the Cards to. This is used for editing an existing EmailRule.
   */
  this.setRule = function(rule) {
    updateRule = rule;

    if (rule.sheet != null) {
      cardRepository[CardNames.sheet].setValue(rule.sheet);
    }
    if (rule.title != null) {
      cardRepository[CardNames.title].setValue(rule.title);
    }
    if (rule.headerRow != null) {
      cardRepository[CardNames.row].setValue(rule.headerRow);
    }
    if (rule.to != null) {
      cardRepository[CardNames.to].setValue(rule.to);
    }
    if (rule.subject != null) {
      cardRepository[CardNames.subject].setValue(rule.subject);
    }
    if (rule.body != null) {
      cardRepository[CardNames.body].setValue(rule.body);
    }
    if (rule.sendColumn != null) {
      cardRepository[CardNames.shouldSend].setValue(rule.sendColumn);
    }

    self.setType(rule.ruleType);
  };

  /**
   * This is used to prepare the CardsHandler for a new INSTANT or TRIGGER EmailRule creation.
   *
   * @param {RuleTypes} type One of the EmailRule RuleTypes.
   */
  this.setType = function(type) {
    // Load information from GAS
    if (window.google !== undefined) {
      google.script.run
          .withSuccessHandler(setSheets)
          .getSheets();
    }

    if (type === RuleTypes.INSTANT) {
      cards = createInstantList();
    }
    else if (type === RuleTypes.TRIGGER) {
      cards = createTriggerList();
    }

    activeCard = cards.head;
    self.jumpTo(activeCard.name);
  };

  /**
   * Gets the active rules email type.
   *
   * @return {String} The current ruleType.
   */
  this.getRuleType = function() {
    var trigger = self.getCard(CardNames.triggerConfirmation);

    var current = cards.head;
    while (current !== null) {
      if (current.data === trigger) {
        return RuleTypes.TRIGGER;
      }

      current = current.next;
    }

    return RuleTypes.INSTANT;
  };

  /**
   * Gets an EmailRule associated with this series of Cards. The interaction of the update/create portion
   * makes this way more confusing than it need be.
   *
   * TODO Refactor this. The multiple returns makes flow confusing. It still sucks.
   * @return {EmailRule} Created from the various Cards this handler is supervising.
   */
  this.getRule = function() {
    var config = {};
    if (updateRule !== null) {
      config = updateRule;
    }

    config.to = self.getCard(CardNames.to).getValue();
    config.subject = self.getCard(CardNames.subject).getValue();
    config.body = self.getCard(CardNames.body).getValue();
    config.sheet = self.getCard(CardNames.sheet).getValue();
    config.title = self.getCard(CardNames.title).getValue();
    if (self.getRuleType() === RuleTypes.TRIGGER) {
      config.sendColumn = self.getCard(CardNames.shouldSend).getValue();
      config.ruleType = RuleTypes.TRIGGER;
    }
    else {
      config.ruleType = RuleTypes.INSTANT;
    }

    if (self.getCard(CardNames.row).getValue() !== '') {
      config.headerRow = self.getCard(CardNames.row).getValue();
    }

    if (updateRule !== null) {
      return updateRule;
    }

    return new EmailRule(config);
  };

  //***** PRIVATE *****//

  /**
   * Sets the event handlers on the various Cards.
   *
   * @private
   */
  var setupCards = function() {

    cardRepository[CardNames.row].attachEvent('card.hide', function(event, card) {

      // Set the header row
      if (window.google !== undefined) {
        var row = card.getValue();
        var sheet = cardRepository[CardNames.sheet].getValue();

        // Verify the row data.
        var numTest = parseInt(row);
        if (!isNaN(numTest) && numTest > 0) {
          google.script.run
              .withSuccessHandler(setColumns)
              .getHeaderStrings({
                sheet: sheet,
                headerRow: row
              });
        }
      }

    });

    cardRepository[CardNames.sendNow].addOption('Send test email', function() {
      google.script.run
        .withSuccessHandler(function() {
          Snackbar.show('Test email sent.');
        })
        .sendTestEmail(self.getRule().toConfig());
    });

    cardRepository[CardNames.triggerConfirmation].addOption('Send test email', function() {
      google.script.run
        .withSuccessHandler(function() {
          Snackbar.show('Test email sent.');
        })
        .sendTestEmail(self.getRule().toConfig());
    });
  };

  /**
   * Gets the node with a given name. It's worth noting that the name of a node isn't something
   * inherant to the Node object. This file adds them as an alternative way of discovery.
   *
   * @private
   * @param {string} name The name of the Node.
   * @return {Node} The node with the given name.
   */
  var getNode = function(name) {
    var current = cards.head;
    while (current !== null) {
      if (current.name === name) {
        return current;
      }

      current = current.next;
    }

    return null;
  };

  /**
   * Inserts a Node after the Node with the given name.
   * Note: This cannot be used to insert a Node at the start of a list.
   *
   * @private
   * @param {String} before The name of the Node before the Node to be inserted.
   * @param {Card} card The Card to be inserted.
   * @return {Node} The newly inserted Node.
   */
  var insertNode = function(before, card) {
    var beforeNode = getNode(before);

    if (beforeNode === null) {
      return null;
    }

    var index = cards.getPosition(beforeNode);
    var node = cards.insert(index + 1, card);

    PubSub.publish('Cards.insertNode', node);

    return node;
  };

  /**
   * Hides all cards.
   *
   * @private
   */
  var hideAll = function() {
    var node = cards.head;

    while (node !== null) {

      node.data.hide();
      node = node.next;
    }
  };

  /**
   * Sets the value of the sheets autocomplete.
   *
   * @private
   * @param {Array<String>} values The values to display in the Sheet Card.
   */
  var setSheets = function(values) {
    sheets = values;
    cardRepository[CardNames.sheet].setAutocomplete({
      results: sheets,
      maxResults: maxResults,
      triggerOnFocus: true
    });
  };

  /**
   * Sets the autocomplete drop down values to the provided values.
   *
   * @private
   * @param {Array<String>} values The values to use for autocomplete.
   */
  var setColumns = function(values) {
    cardRepository[CardNames.to].setAutocomplete({
      results: values,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });

    cardRepository[CardNames.subject].setAutocomplete({
      results: values,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });

    cardRepository[CardNames.body].setAutocomplete({
      results: values,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });

    cardRepository[CardNames.shouldSend].setAutocomplete({
      results: values,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });
  };

  /**
   * Creates the Card flow for Instant emails.
   *
   * @private
   * @return {List} A List of Cards that can be used to create an INSTANT EmailRule.
   */
  var createInstantList = function() {
    var list = new List();

    list.add(cardRepository[CardNames.title]);
    list.tail.name = CardNames.title;

    list.add(cardRepository[CardNames.sheet]);
    list.tail.name = CardNames.sheet;

    list.add(cardRepository[CardNames.row]);
    list.tail.name = CardNames.row;

    list.add(cardRepository[CardNames.to]);
    list.tail.name = CardNames.to;

    list.add(cardRepository[CardNames.subject]);
    list.tail.name = CardNames.subject;

    list.add(cardRepository[CardNames.body]);
    list.tail.name = CardNames.body;

    list.add(cardRepository[CardNames.sendNow]);
    list.tail.name = CardNames.sendNow;

    return list;
  };

  /**
   * Creates the Card flow for TRIGGER emails.
   *
   * @private
   * @return {List} A List of Cards that can be used to create a TRIGGER EmailRule.
   */
  var createTriggerList = function() {
    var list = new List();

    list.add(cardRepository[CardNames.title]);
    list.tail.name = CardNames.title;

    list.add(cardRepository[CardNames.sheet]);
    list.tail.name = CardNames.sheet;

    list.add(cardRepository[CardNames.row]);
    list.tail.name = CardNames.row;

    list.add(cardRepository[CardNames.to]);
    list.tail.name = CardNames.to;

    list.add(cardRepository[CardNames.subject]);
    list.tail.name = CardNames.subject;

    list.add(cardRepository[CardNames.body]);
    list.tail.name = CardNames.body;

    list.add(cardRepository[CardNames.shouldSend]);
    list.tail.name = CardNames.shouldSend;

    list.add(cardRepository[CardNames.triggerConfirmation]);
    list.tail.name = CardNames.triggerConfirmation;

    return list;
  };

  this.init(contentArea);
};


/**  */
module.exports = Cards;
