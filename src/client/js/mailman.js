/**
 * Intercom: https://github.com/diy/intercom.js/
 * Tips on using intercom with GAS: https://github.com/googlesamples/apps-script-dialog2sidebar
 *
 *
 */

var Util = require('./util.js');
var InputCard = require('./card-input.js');
var TitledCard = require('./card-titled.js');
var TextareaCard = require('./card-textarea.js');
var List = require('./list.js');
var Intercom = require('./intercom.js');

var MailMan = function() {

  //***** LOCAL VARIABLES *****//

  var self;

  // This holds all the "cards".
  var contentArea;

  // This tracks whether help is being displayed currently.
  var showHelp;

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

  // The object used to communicate between the sidebar and the RTE (Rich Text Editor)
  var intercom;

  /**
	 * How long to wait for the dialog to check-in before assuming it's been
	 * closed, in milliseconds.
	 */
	var DIALOG_TIMEOUT_MS = 2000;

	/**
	 * Holds a mapping from dialog ID to the ID of the timeout that is used to
	 * check if it was lost. This is needed so we can cancel the timeout when
	 * the dialog is closed.
	 */
	var timeoutIds = {};

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   */
  this.init = function() {
    self = this;

    sheets = [
      'Loading...'
    ];

    columns = [
      'Loading...'
    ];

    // Configuration
	intercom = Intercom.getInstance();
    contentArea = $('#content-area');
    showHelp = false;
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
    cards.tail.data.attachEvent('card.hide', function(event) {
      setHidden($('#back'), false);
    });
    cards.tail.data.attachEvent('card.show', function(event) {
      setHidden($('#back'), true);
    });

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
    cards.tail.data.addOption('Rich Text Editor', function(e) {
      console.log('Rich Text test');

      // Launch the RTE.
      if (window.google !== undefined) {
        google.script.run
            .withSuccessHandler(onRTEOpened)
            .launchRTE();
      }
    });
    cards.tail.data.attachEvent('card.hide', function(event) {
      setHidden($('#step'), false);
      setHidden($('#done'), true);
    });
    cards.tail.data.attachEvent('card.show', function(event) {
      setHidden($('#step'), true);
      setHidden($('#done'), false);
    });

    activeCard = cards.head;
    jumpTo(activeCard.data);

    buildNavTree(activeCard);
    $('.help').addClass('hidden');

    // All UI Bindings
    $('#step').on('click', self.next);
    $('#done').on('click', self.done);
    $('#back').on('click', self.back);
    $('#help').on('click', self.toggleHelp);

    // Load information from GAS
    if (window.google !== undefined) {
      google.script.run
          .withSuccessHandler(setSheets)
          .getSheets();
    }
  };

  /**
   * This function goes to the next card.
   * TODO There is non-DRY code between this function and this.back.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.next = function(event) {
    if (activeCard.next === null) {
      return;
    }

    activeCard.data.hide();
    activeCard = activeCard.next;
    activeCard.data.show();

    // After changing the card layout, the nav tree needs to be rebuilt.
    buildNavTree(activeCard);
  };

  /**
   * This function goes to the previous card.
   * TODO There is non-DRY code between this function and this.next.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.back = function(event) {
    if (activeCard.previous === null) {
      return;
    }

    activeCard.data.hide();
    activeCard = activeCard.previous;
    activeCard.data.show();

    // After changing the card layout, the nav tree needs to be rebuilt.
    buildNavTree(activeCard);
  };

  /**
   * Submits data back to google.
   * NOTE: GAS only
   *
   * @param {event} event The event that triggered the function call.
   */
  this.done = function(event) {
    // SUBMIT THE INFO BACK TO SHEETS

    var to = getNode('To').data.getValue();
    var subject = getNode('Subject').data.getValue();
    var body = getNode('Body').data.getValue();
    var sheet = getNode('Sheet').data.getValue();
    var options = null;

    if (window.google !== undefined) {
      google.script.run
          .withSuccessHandler(ruleCreationSuccess)
          .createRule(to, subject, body, options, sheet);
    }
    else {
      console.log('Creating rule.');
    }

  };



  /**
   * This function toggles the state of the help <p> tags.
   *
   * @param {event} event The event that triggered this function.
   */
  this.toggleHelp = function(event) {
    if (showHelp) {
      showHelp = false;
      $('.help').addClass('hidden');
    }
    else {
      showHelp = true;
      $('.help').removeClass('hidden');
    }
  };

  //***** PRIVATE *****//

  /**
   * Adds a new nav link to the top navigation bar. Each content div (the card looking things) should have a related
   * nav item.
   *
   * @private
   * @param {Node} node The node to add to the nav bar. This node contains a related Card.
   */
  var addNavLink = function(node) {
    var newLink = $('<a>' + node.name + '</a>')
        .on('click', node, navigate);

    $('#nav-bar')
        .prepend(newLink)
        .prepend('&nbsp;&gt;&nbsp;');

  };

  /**
   * Builds the navigation tree from scratch. Removes the previous tree.
   * TODO rebuild the link limit code
   * @private
   * @param {Node} node The Node to build the tree to.
   */
  var buildNavTree = function(node) {
    $('#nav-bar').empty();

    var current = node;
    for (var i = 0; i < maxNavItems; i++) {
      if (current !== null) {
        addNavLink(current);
        current = current.previous;
      }
    }
  };

  /**
   * The event triggered by any of the anchors in the nav bar. The related content div is shown and all others are
   * hidden.
   * Note that 'this' will be the HTMLElement that fired this request.
   *
   * @private
   * @param {event} e The event that triggerred this function.
   */
  var navigate = function(e) {
    activeCard = e.data;

    jumpTo(e.data.data);
    buildNavTree(e.data);
  };

  /**
   * Hides all the primary content divs. There are spacing divs, so those ones aren't hidden. Then shows the parameter
   * div.
   *
   * @private
   * @param {Card} card The div to leave visible. All other are 'display:none'ed
   */
  var jumpTo = function(card) {
    hideAll();

    var node = cards.head;
    while (node !== null) {
      if (node.data === card) {
        node.data.show();
        activeCard = node;
        return;
      }

      node = node.next;
    }
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
   * A generic UI element hider. Doesn't remove the object from the flow of the document.
   *
   * @private
   * @param {jquery} object The object to apply the change to.
   * @param {boolean} state True for visible, false for invisible.
   */
  var setVisibility = function(object, state) {
    if (state) {
      object.removeClass('invisible');
    }
    else {
      object.addClass('invisible');
    }
  };

  /**
   * A generic UI element hider. Removes the object from the flow of the document.
   *
   * @private
   * @param {jquery} object The object to apply the change to.
   * @param {boolean} state True for display:none, false for default.
   */
  var setHidden = function(object, state) {
    if (state) {
      object.addClass('hidden');
    }
    else {
      object.removeClass('hidden');
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


  var setColumns = function(columns) {
    columns = columns;

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

  var onRTEOpened = function(dialogId) {
    console.log('RTE opened successfully.');
	intercom.on(dialogId, function(state) {
          switch(state) {
            case 'done':
              console.log('Dialog submitted.\n');
              forget(dialogId);
              break;
            case 'aborted':
              console.log('Dialog cancelled.\n');
              forget(dialogId);
              break;
            case 'checkIn':
              forget(dialogId);
              watch(dialogId);
              break;
            case 'lost':
              console.log('Dialog lost.\n');
              break;
            default:
              throw 'Unknown dialog state: ' + state;
          }
        });
  }

  /**
   * Watch the given dialog, to detect when it's been X-ed out.
   *
   * @param {string} dialogId The ID of the dialog to watch.
   */
  var watch = function (dialogId) {
    timeoutIds[dialogId] = window.setTimeout(function() {
      intercom.emit(dialogId, 'lost');
    }, DIALOG_TIMEOUT_MS);
  }

  /**
   * Stop watching the given dialog.
   * @param {string} dialogId The ID of the dialog to watch.
   */
  var forget = function (dialogId) {
    if (timeoutIds[dialogId]) {
      window.clearTimeout(timeoutIds[dialogId]);
    }
  }

  this.init();
};


/**  */
module.exports = MailMan;
