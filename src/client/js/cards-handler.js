'use strict';

var InputCard = require('./card/card-input.js');
var TitledCard = require('./card/card-titled.js');
var TextareaCard = require('./card/card-textarea.js');
var List = require('./list/list.js');
var EmailRule = require('./data/email-rule.js');
var RuleTypes = require('./data/rule-types.js');
var Database = require('./data/database.js');
var Util = require('./util.js');
var PubSub = require('pubsub-js');
var Keys = require('./data/prop-keys.js');
var CardsConfig = require('./cards/cards-config.js');

var Cards = function(parent, rule) {

  //***** LOCAL VARIABLES *****//

  var self = this;

  // This handles all object reading/writing
  var database = new Database();

  // This holds all the "cards".
  var contentArea = parent;

  // All the different sheet names.
  var sheets = ['Loading...'];

  // The maximum number of results to display in the autocompletes.
  var maxResults = 5;

  // The list containing all the Cards.
  var cards = new List();

  // This allows for changing Card names without major code changes.
  var cardNames = {
    welcome: 'Welcome',
    sheet: 'Sheet',
    to: 'To',
    row: 'Header Row',
    subject: 'Subject',
    body: 'Body',
    sendNow: 'Email',
    triggerConfirmation: 'Schedule',
    triggerSetup: 'Trigger',
    shouldSend: 'Confirmation',
    lastSent: 'Last Sent'
  };

  // This stores the configured Cards. These are only meant for easily adding/removing Cards without losing the data.
  var cardRepository = CardsConfig.buildCardRepo();

  // Whether to show the Card help or not
  var showingHelp;

  // The currently shown Card.
  var activeCard;

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   * @param {jQuery} contentArea The area where Cards are meant to be added.
   */
  this.init = function(contentArea, rule) {

    // Set the help any time a new Card is inserted.
    PubSub.subscribe('Cards.insertNode', function(msg, data) {
      setHelp();
    });

    setupCards();

    // Load information from GAS
    if (window.google !== undefined) {
      google.script.run
          .withSuccessHandler(setSheets)
          .getSheets();
    }
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
   * Submits the data back to server side.
   *
   */
  this.submit = function() {
    var to = self.getCard(cardNames.to).getValue();
    var subject = self.getCard(cardNames.subject).getValue();
    var body = self.getCard(cardNames.body).getValue();
    var sheet = self.getCard(cardNames.sheet).getValue();

    var newRule = new EmailRule({
      ruleType: RuleTypes.INSTANT,
      to: to,
      subject: subject,
      body: body,
      sheet: sheet
    });

    if (self.getRuleType() === RuleTypes.TRIGGER) {
      var setup = self.getCard(cardNames.shouldSend).getValue();
      var lastSent = self.getCard(cardNames.lastSent).getValue();

      newRule.sendColumn = setup;
      newRule.timestampColumn = lastSent;
      newRule.ruleType = RuleTypes.TRIGGER;
    }

    database.save(Keys.RULE_KEY, newRule, function() {
      if (rule.ruleType === RuleTypes.TRIGGER) {
        /*google.script.run
            .createTriggerBasedEmail();*/
      }
      else {
        /*google.script.run
            .sendManyEmails();*/
      }

      setTimeout(function() {
        google.script.host.close();
      }, 1000);
    });
  };

  /**
   * Returns the Node of the active Card.
   *
   * @return {Node} The active Node.
   */
  this.getActiveNode = function() {
    return activeCard;
  }

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
        PubSub.publish('Cards.jumpTo', cardId);

        return;
      }

      node = node.next;
    }
  };

  /**
   * This function toggles the state of the help <p> tags.
   *
   */
  this.toggleHelp = function() {
    if (showingHelp) {
      hideHelp();
    }
    else {
      showHelp();
    }
  };

  /**
   * Sets all Card values based upon the values in emailRule.
   * TODO Replace this with something more flexible.
   *
   * @private
   */
  this.setRule = function(rule) {
    if (rule.sheet) {
      cardRepository[cardNames.sheet].setValue(rule.sheet);
    }
    if (rule.to) {
      cardRepository[cardNames.to].setValue(rule.to);
    }
    if (rule.subject) {
      cardRepository[cardNames.subject].setValue(rule.subject);
    }
    if (rule.body) {
      cardRepository[cardNames.body].setValue(rule.body);
    }
    if (rule.sendColumn) {
      cardRepository[cardNames.shouldSend].setValue(rule.sendColumn);
    }
    if (rule.timestampColumn) {
      cardRepository[cardNames.lastSent].setValue(rule.timestampColumn);
    }

    self.setType(rule.ruleType);
  };

  this.setType = function(type) {
    if (type === RuleTypes.INSTANT) {
      cards = createInstantList();
    }
    else if (type === RuleTypes.TRIGGER) {
      cards = createTriggerList();
    }

    hideHelp();
    activeCard = cards.head;
    self.jumpTo(activeCard.name);
  }

  /**
   * Gets the active rules email type.
   *
   * @return {String} The current ruleType.
   */
  this.getRuleType = function() {
    var trigger = self.getCard(cardNames.triggerSetup);

    var current = cards.head;
    while (current !== null) {
      if (current.data === trigger) {
        return RuleTypes.TRIGGER;
      }

      current = current.next;
    }

    return RuleTypes.INSTANT;
  }

  /**
   * Gets an EmailRule associated with this series of Cards.
   *
   * @return {EmailRule} Created from the various Cards this handler is supervising.
   */
  this.getRule = function() {

    if (self.getRuleType() === RuleTypes.TRIGGER) {

      return new EmailRule({
        ruleType: RuleTypes.TRIGGER,
        to: self.getCard(cardNames.to).getValue(),
        subject: self.getCard(cardNames.subject).getValue(),
        body: self.getCard(cardNames.body).getValue(),
        sheet: self.getCard(cardNames.sheet).getValue(),
        sendColumn: self.getCard(cardNames.shouldSend).getValue(),
        timestampColumn: self.getCard(cardNames.lastSent).getValue()
      });
    }
    else if (self.getRuleType() === RuleTypes.INSTANT) {

      return new EmailRule({
        ruleType: RuleTypes.INSTANT,
        to: self.getCard(cardNames.to).getValue(),
        subject: self.getCard(cardNames.subject).getValue(),
        body: self.getCard(cardNames.body).getValue(),
        sheet: self.getCard(cardNames.sheet).getValue()
      });
    }
    else {
      throw new Error('Unknown ruletype: ' + self.getRuleType());
    }
  };

  //***** PRIVATE *****//

  var setupCards = function() {
    cardRepository[cardNames.sheet].attachEvent('card.hide', function(event) {
      var sheet = cardRepository[cardNames.sheet].getValue();

      if (sheet !== '') {
        google.script.run
            .withSuccessHandler(setColumns)
            .getHeaderNames(sheet);
      }
    });

    cardRepository[cardNames.to].addOption('change header row', function(e) {

      // Add another card before this one, but after Sheet

      var headerNode = insertNode(cardNames.sheet, cardRepository[cardNames.row]);
      headerNode.name = cardNames.row;

      self.jumpTo(cardNames.row);

      // Remove the option
      cardRepository[cardNames.to].removeOption('change header row');
    });

    cardRepository[cardNames.row].attachEvent('card.hide', function(event, card) {

      // Set the header row
      if (window.google !== undefined) {
        var row = card.getValue();
        var sheet = cardRepository[cardNames.sheet].getValue();

        // Verify the row data.
        var numTest = parseInt(row);
        if (!isNaN(numTest) && numTest > 0) {
          google.script.run
              .withSuccessHandler(setColumns)
              .setHeaderRow(row, sheet);
        }
      }

    });
  };

  /**
   * This function hides the help <p> tags.
   *
   * @private
   */
  var hideHelp = function() {
    showingHelp = false;
    Util.setHidden($('.help'), true);
  };

  /**
   * This function shows the help <p> tags.
   *
   * @private
   */
  var showHelp = function() {
    showingHelp = true;
    Util.setHidden($('.help'), false);
  };

  /**
   * Based upon the value of showingHelp, it either hides or shows the help.
   *
   * @private
   */
  var setHelp = function() {
    if (showingHelp) {
      showHelp();
    }
    else {
      hideHelp();
    }
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
   * Called when a rule is successfully created.
   *
   * @private
   * @param {boolean} serverReturn A boolean indicating not much.
   */
  var ruleCreationSuccess = function(serverReturn) {
    google.script.host.close();
  };

  /**
   * Sets the value of the sheets autocomplete.
   *
   * @private
   * @param {Array<String>} values The values to display in the Sheet Card.
   */
  var setSheets = function(values) {
    sheets = values;
    cardRepository[cardNames.sheet].setAutocomplete({
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
    cardRepository[cardNames.to].setAutocomplete({
      results: values,
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });

    cardRepository[cardNames.subject].setAutocomplete({
      results: values,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });

    cardRepository[cardNames.body].setAutocomplete({
      results: values,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });

    cardRepository[cardNames.shouldSend].setAutocomplete({
      results: values,
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });

    cardRepository[cardNames.lastSent].setAutocomplete({
      results: values,
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });
  };

  var createInstantList = function() {
    var list = new List();

    list.add(cardRepository[cardNames.welcome]);
    list.tail.name = cardNames.welcome;

    list.add(cardRepository[cardNames.sheet]);
    list.tail.name = cardNames.sheet;

    list.add(cardRepository[cardNames.to]);
    list.tail.name = cardNames.to;

    list.add(cardRepository[cardNames.subject]);
    list.tail.name = cardNames.subject;

    list.add(cardRepository[cardNames.body]);
    list.tail.name = cardNames.body;

    list.add(cardRepository[cardNames.sendNow]);
    list.tail.name = cardNames.sendNow;

    return list;
  };

  var createTriggerList = function() {
    var list = new List();

    list.add(cardRepository[cardNames.welcome]);
    list.tail.name = cardNames.welcome;

    list.add(cardRepository[cardNames.sheet]);
    list.tail.name = cardNames.sheet;

    list.add(cardRepository[cardNames.to]);
    list.tail.name = cardNames.to;

    list.add(cardRepository[cardNames.subject]);
    list.tail.name = cardNames.subject;

    list.add(cardRepository[cardNames.body]);
    list.tail.name = cardNames.body;

    list.add(cardRepository[cardNames.triggerSetup]);
    list.tail.name = cardNames.triggerSetup;

    list.add(cardRepository[cardNames.shouldSend]);
    list.tail.name = cardNames.shouldSend;

    list.add(cardRepository[cardNames.lastSent]);
    list.tail.name = cardNames.lastSent;

    list.add(cardRepository[cardNames.triggerConfirmation]);
    list.tail.name = cardNames.triggerConfirmation;

    return list;
  };

  this.init(contentArea, rule);
};

/***** GAS Response Functions *****/

/**  */
module.exports = Cards;
