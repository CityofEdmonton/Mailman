
var InputCard = require('./card-input.js');
var TitledCard = require('./card-titled.js');
var TextareaCard = require('./card-textarea.js');
var List = require('./list.js');
var EmailRule = require('./email-rule.js');
var Database = require('./database.js');
var Util = require('./util.js');

var Cards = function(contentArea) {

  // ***** CONSTANTS ***** //
  // This is mirrored server-side changes here must be reflected in global-variables.js
  var RULE_KEY = 'MAILMAN_PROP_RULES';

  //***** LOCAL VARIABLES *****//

  var self;

  // This handles all object reading/writing
  var database;

  // This holds all the "cards".
  var contentArea;

  // The currently shown Card.
  var activeCard;

  // This alters how many Card links will be shown in the nav bar.
  var maxNavItems;

  // All the different sheet names.
  var sheets;

  // All the columns of the selected sheet.
  var columns;

  // The maximum number of results to display in the autocompletes.
  var maxResults;

  // The list containing all the Cards.
  var cards;

  // This stores all the existing email rules.
  var emailRule;

  // Whether to show the Card help or not
  var showingHelp;

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @param {jQuery} contentArea The area where Cards are meant to be added.
   * @constructor
   */
  this.init = function(contentArea) {
    self = this;

    // Data Config
    database = new Database();

    // Try to load an existing email rule.
    emailRule = new EmailRule();
    emailRule.ruleType = EmailRule.RuleTypes.INSTANT;
    database.load(RULE_KEY, setEmailRules);

    sheets = [
      'Loading...'
    ];

    columns = [
      'Loading...'
    ];

    // UI Configuration
    maxNavItems = 3;
    maxResults = 5;

    cards = new List();

    cards.add(new TitledCard(contentArea, {
      title: 'Welcome!',
      help: 'Help will be displayed here normally. Since this is just the welcome page, there isn\'t much to know!',
      paragraphs: [
        'Welcome to Mailman! This application helps users easily create mail merges. It aims to be easy to use, ' +
            'while also providing advanced options for power users.',
        'To get started, simply click NEXT down below.'
      ]
    }));
    cards.tail.name = 'Welcome';

    cards.add(new InputCard(contentArea, {
      title: 'Which Sheet are we sending from?',
      help: 'This Sheet must contain all the information you may want to send in an email.',
      label: 'Sheet...',
      autocomplete: {
        results: sheets,
        maxResults: maxResults,
        triggerOnFocus: true
      }
    }));
    cards.tail.name = 'Sheet';
    // We hide the card before applying the event. This stops the initial trigger from happening.
    cards.tail.data.hide(); // TODO
    cards.tail.data.attachEvent('card.hide', function(event) {
      if (window.google !== undefined) {
        var sheet = getNode('Sheet').data.getValue(); // TODO use attached event data to make this smoother
        google.script.run
            .withSuccessHandler(setColumns)
            .getHeaderNames(sheet);
      }
      else {
        console.log('Setting columns based on sheet.');
      }
    });

    cards.add(new InputCard(contentArea, {
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
    })).name = 'To';
    cards.tail.data.addOption('change header row', function(e) {

      // Add another card before this one, but after Sheet

      var headerNode = insertNode('Sheet', new InputCard(contentArea, {
        title: 'Which row contains your header titles?',
        help: 'By default, Mailman looks in row 1 for your header titles.' +
            ' If your header is not in row 1, please input the row.',
        label: 'Header row...'
      }));
      headerNode.name = 'Header Row';
      headerNode.data.attachEvent('card.hide', function(event, card) {

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

      setHelp();
      self.jumpTo(headerNode.name);

      // Remove the option
      getNode('To').data.removeOption('change header row');
    });

    cards.add(new InputCard(contentArea, {
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
    })).name = 'Subject';

    cards.add(new TextareaCard(contentArea, {
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
    }));
    cards.tail.name = 'Body';

    cards.add(new TitledCard(contentArea, {
      title: 'Send emails now?',
      paragraphs: [
        'This will send out an email blast right now. ' +
            'If you\'d like, you can send the emails at a later time, or even based upon a value in a given column. ' +
            'Just select the related option from the bottom right.'
      ]
    }));
    cards.tail.name = 'Email';
    cards.tail.data.addOption('send on trigger', function(e) {
      emailRule.ruleType = EmailRule.RuleTypes.TRIGGER;

      var triggerNode = insertNode('Body', new TitledCard(contentArea, {
        title: 'Repeated emails.',
        paragraphs: [
          'Mailman will now guide you through the process of creating your own repeated mail merge.',
          'This feature can be used to set up an email-based reminder system.'
        ],
        help: 'If you\'d like to go back to a regular mail merge, use the options below.'
      }));
      triggerNode.name = 'Trigger';

      var node = insertNode('Trigger', new InputCard(contentArea, {
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
      }));
      node.name = 'Confirmation';
      if (emailRule.ruleType === EmailRule.RuleTypes.TRIGGER) {
        node.data.setValue(emailRule.sendColumn);
      }

      node = insertNode('Confirmation', new InputCard(contentArea, {
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
      }));
      node.name = 'Last Sent';
      if (emailRule.ruleType === EmailRule.RuleTypes.TRIGGER) {
        node.data.setValue(emailRule.timestampColumn);
      }

      getNode('Email').data.removeOption('send on trigger');
      setHelp();

      self.jumpTo(triggerNode.name);
    });

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
    return getNode(name).data;
  };

  /**
   * Makes the Card with the given id the active Card.
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
   */
  var hideHelp = function() {
    showingHelp = false;
    Util.setHidden($('.help'), true);
  };

  /**
   * This function shows the help <p> tags.
   *
   */
  var showHelp = function() {
    showingHelp = true;
    Util.setHidden($('.help'), false);
  };

  /**
   * Based upon the value of showingHelp, it either hides or shows the help.
   *
   */
  var setHelp = function() {
    if (showingHelp) {
      showHelp();
    }
    else {
      hideHelp();
    }
  };

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
   */
  var setCardValues = function() {

    var card = getNode('Sheet').data;
    card.setValue(emailRule.sheet);

    card = getNode('To').data;
    card.setValue(emailRule.to);

    card = getNode('Subject').data;
    card.setValue(emailRule.subject);

    card = getNode('Body').data;
    card.setValue(emailRule.body);
  };

  /**
   * Gets the node with a given name. It's worth noting that the name of a node isn't something
   * inherant to the Node object. This file adds them as an alternative way of discovery.
   *
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
    return cards.insert(index + 1, card);
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
   * @param {boolean} serverReturn A boolean indicating not much.
   */
  var ruleCreationSuccess = function(serverReturn) {
    google.script.host.close();
  };

  var setSheets = function(sheets) {
    sheets = sheets;
    getNode('Sheet').data.setAutocomplete({
      results: sheets,
      maxResults: maxResults,
      triggerOnFocus: true
    });
  };

  var setColumns = function(columnValues) {
    columns = columnValues;

    getNode('To').data.setAutocomplete({
      results: columns,
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });

    getNode('Subject').data.setAutocomplete({
      results: columns,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });
    getNode('Body').data.setAutocomplete({
      results: columns,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });
  };

  this.init(contentArea);
};

/***** GAS Response Functions *****/

/**  */
module.exports = Cards;
