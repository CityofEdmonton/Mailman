
var InputCard = require('./card/card-input.js');
var TitledCard = require('./card/card-titled.js');
var TextareaCard = require('./card/card-textarea.js');
var List = require('./list/list.js');
var EmailRule = require('./data/email-rule.js');
var Database = require('./data/database.js');
var Util = require('./util.js');
var PubSub = require('pubsub-js');

var Cards = function(parent) {

  // ***** CONSTANTS ***** //
  // This is mirrored server-side changes here must be reflected in global-variables.js
  var RULE_KEY = 'MAILMAN_PROP_RULES';

  //***** LOCAL VARIABLES *****//

  var self = this;

  // This handles all object reading/writing
  var database = new Database();

  // This holds all the "cards".
  var contentArea = parent;

  // All the different sheet names.
  var sheets = ['Loading...'];

  // All the columns of the selected sheet.
  var columns = ['Loading...'];

  // The maximum number of results to display in the autocompletes.
  var maxResults = 5;

  // The list containing all the Cards.
  var cards = new List();

  // This stores all the existing email rules.
  var emailRule = new EmailRule();

  // This allows for changing Card names without major code changes.
  var cardNames = {
    welcome: 'Welcome',
    sheet: 'Sheet',
    to: 'To',
    row: 'Header Row',
    subject: 'Subject',
    body: 'Body',
    sendNow: 'Email',
    triggerSetup: 'Trigger',
    shouldSend: 'Confirmation',
    lastSent: 'Last Sent'
  };

  // This stores the configured Cards. These are only meant for easily adding/removing Cards without losing the data.
  var cardRepository = {};

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
  this.init = function(contentArea) {

    // Set the help any time a new Card is inserted.
    PubSub.subscribe('Cards.insertNode', function(msg, data) {
      setHelp();
    });

    // Try to load an existing email rule.
    emailRule.ruleType = EmailRule.RuleTypes.INSTANT; // TODO
    database.load(RULE_KEY, function(value) {
      emailRule = value;
      setCardValues(value);
    });

    cardRepository = buildCardRepo();

    cards.add(cardRepository[cardNames.welcome]);
    cards.tail.name = cardNames.welcome;

    cards.add(cardRepository[cardNames.sheet]);
    cards.tail.name = cardNames.sheet;

    cards.add(cardRepository[cardNames.to]);
    cards.tail.name = cardNames.to;

    cards.add(cardRepository[cardNames.subject]);
    cards.tail.name = cardNames.subject;

    cards.add(cardRepository[cardNames.body]);
    cards.tail.name = cardNames.body;

    cards.add(cardRepository[cardNames.sendNow]);
    cards.tail.name = cardNames.sendNow;

    hideHelp();
    activeCard = cards.head;
    self.jumpTo(activeCard.name);

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

  //***** PRIVATE *****//

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

  // TODO delete this
  var setEmailRules = function(value) {
    if (value !== null) {
      emailRule = value;
      setCardValues();
    }
  };

  /**
   * Sets all Card values based upon the values in emailRule.
   * TODO Replace this with something more flexible.
   *
   * @private
   */
  var setCardValues = function(rule) {
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
    columns = values;

    cardRepository[cardNames.to].setAutocomplete({
      results: columns,
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });

    cardRepository[cardNames.subject].setAutocomplete({
      results: columns,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });

    cardRepository[cardNames.body].setAutocomplete({
      results: columns,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });

    if (emailRule.ruleType === EmailRule.RuleTypes.TRIGGER) {
      console.log('Setting trigger autocomplete');
      cardRepository[cardNames.shouldSend].setAutocomplete({
        results: columns,
        prepend: '<<',
        append: '>>',
        maxResults: maxResults,
        triggerOnFocus: true
      });

      cardRepository[cardNames.shouldSend].setAutocomplete({
        results: columns,
        prepend: '<<',
        append: '>>',
        maxResults: maxResults,
        triggerOnFocus: true
      });
    }
  };

  /**
   * Initializes a Card repository.
   *
   * @private
   * @return {Object<String, Card>} The repository used for storing Cards. These may not be in the program flow.
   */
  var buildCardRepo = function() {
    var repo = {};

    repo[cardNames.welcome] = new TitledCard(contentArea, {
      title: 'Welcome!',
      help: 'Help will be displayed here normally. Since this is just the welcome page, there isn\'t much to know!',
      paragraphs: [
        'Welcome to Mailman! This application helps users easily create mail merges. It aims to be easy to use, ' +
            'while also providing advanced options for power users.',
        'To get started, simply click NEXT down below.'
      ]
    });

    repo[cardNames.sheet] = new InputCard(contentArea, {
      title: 'Which Sheet are we sending from?',
      help: 'This Sheet must contain all the information you may want to send in an email.',
      label: 'Sheet...',
      autocomplete: {
        results: sheets,
        maxResults: maxResults,
        triggerOnFocus: true
      }
    });
    repo[cardNames.sheet].attachEvent('card.hide', function(event) {
      if (window.google !== undefined) {
        var sheet = cardRepository[cardNames.sheet].getValue();
        google.script.run
            .withSuccessHandler(setColumns)
            .getHeaderNames(sheet);
      }
      else {
        console.log('Setting columns based on sheet.');
      }
    });

    repo[cardNames.to] = new InputCard(contentArea, {
      title: 'Who are you sending to?',
      help: 'This is the column filled with the email addresses of the recipients.',
      label: 'To...',
      autocomplete: {
        results: columns,
        prepend: '<<',
        append: '>>',
        maxResults: maxResults,
        triggerOnFocus: true
      }
    });
    repo[cardNames.to].addOption('change header row', function(e) {

      // Add another card before this one, but after Sheet

      var headerNode = insertNode('Sheet', cardRepository[cardNames.row]);
      headerNode.name = cardNames.row;

      self.jumpTo(cardNames.row);

      // Remove the option
      repo[cardNames.to].removeOption('change header row');
    });

    repo[cardNames.row] = new InputCard(contentArea, {
      title: 'Which row contains your header titles?',
      help: 'By default, Mailman looks in row 1 for your header titles.' +
          ' If your header is not in row 1, please input the row.',
      label: 'Header row...'
    });
    repo[cardNames.row].attachEvent('card.hide', function(event, card) {

      // Set the header row
      if (window.google !== undefined) {
        var row = card.getValue();
        var sheet = getNode('Sheet').data.getValue();

        // Verify the row data.
        var numTest = parseInt(row);
        if (!isNaN(numTest) && numTest > 0) {
          google.script.run
              .withSuccessHandler(setColumns)
              .setHeaderRow(row, sheet);
        }
      }

    });

    repo[cardNames.subject] = new InputCard(contentArea, {
      title: 'What\'s your subject?',
      help: 'Recipients will see this as the subject line of the email. Type "<<" to see a list of column names. ' +
          'These tags will be swapped out with the associated values in the Sheet.',
      label: 'Subject...',
      autocomplete: {
        results: columns,
        trigger: '<<',
        prepend: '<<',
        append: '>>',
        maxResults: maxResults
      }
    });

    repo[cardNames.body] = new TextareaCard(contentArea, {
      title: 'What\'s in the body?',
      help: 'Recipients will see this as the body of the email. Type "<<" to see a list of column names. These tags ' +
          'will be swapped out with the associated values in the Sheet.',
      label: 'Body...',
      autocomplete: {
        results: columns,
        trigger: '<<',
        prepend: '<<',
        append: '>>',
        maxResults: maxResults
      }
    });

    repo[cardNames.sendNow] = new TitledCard(contentArea, {
      title: 'Send emails now?',
      paragraphs: [
        'This will send out an email blast right now. ' +
            'If you\'d like, you can send the emails at a later time, or even based upon a value in a given column. ' +
            'Just select the related option from the bottom right.'
      ]
    });
    repo[cardNames.sendNow].addOption('send on trigger', function(e) {
      emailRule.ruleType = EmailRule.RuleTypes.TRIGGER;

      var trigger = insertNode('Body', cardRepository[cardNames.triggerSetup]);
      trigger.name = cardNames.triggerSetup;

      var shouldSend = insertNode('Trigger', cardRepository[cardNames.shouldSend]);
      shouldSend.name = cardNames.shouldSend;

      var confirm = insertNode('Confirmation', cardRepository[cardNames.lastSent]);
      confirm.name = cardNames.lastSent;

      self.jumpTo(cardNames.triggerSetup);
      repo[cardNames.sendNow].removeOption('send on trigger');
    });

    repo[cardNames.triggerSetup] = new TitledCard(contentArea, {
      title: 'Repeated emails.',
      paragraphs: [
        'Mailman will now guide you through the process of creating your own repeated mail merge.',
        'This feature can be used to set up an email-based reminder system.'
      ],
      help: 'If you\'d like to go back to a regular mail merge, use the options below.'
    });

    repo[cardNames.shouldSend] = new InputCard(contentArea, {
      title: 'Which column determines whether an email should be sent?',
      paragraphs: [
        'Mailman regularly checks whether an email needs to be sent. ' +
            'Please specify a column that determines when an email should be sent.',
        'Note that Mailman looks for the value TRUE to determine when to send an email.'
      ],
      help: 'Mailman checks roughly every 15 minutes for new emails to send. ' +
          'Keep in mind, this can lead to sending emails to someone every 15 minutes. ' +
          'Continue on for some ideas about how to avoid this!',
      label: 'Send?',
      autocomplete: {
        results: columns,
        prepend: '<<',
        append: '>>',
        maxResults: maxResults,
        triggerOnFocus: true
      }
    });

    repo[cardNames.lastSent] = new InputCard(contentArea, {
        title: 'Where should Mailman keep track of the previously sent email?',
        paragraphs: [
          'Every time Mailman sends an email, it records the time in a cell.',
          'Using the timestamp, you can determine whether you want to send another email.'
        ],
        help: 'This timestamp can be used for some interesting things! ' +
            'Imagine you are interested in sending an email to someone every day (just to annoy them). ' +
            'You could just set the formula in the previously mentioned column to ' +
            '"=TODAY() - {put the last sent here} > 1". Now an email will be sent every time TRUE pops up (every day).',
        label: 'Last sent...',
        autocomplete: {
          results: columns,
          prepend: '<<',
          append: '>>',
          maxResults: maxResults,
          triggerOnFocus: true
        }
      });

      return repo;
  };

  this.init(contentArea);
};

/***** GAS Response Functions *****/

/**  */
module.exports = Cards;
