
var Util = require('./util.js');
var InputCard = require('./card-input.js');
var TitledCard = require('./card-titled.js');
var TextareaCard = require('./card-textarea.js');

var MailMan = function() {

  //***** LOCAL VARIABLES *****//

  var self;

  // This holds all the "cards".
  var contentArea;

  // This tracks whether help is being displayed currently.
  var showHelp;

  // These are used to keep track of the visible card as well as the hidden cards.
  var cards = [];
  var activeCard;

  // This alters how many card links will be shown in the nav bar
  var maxNavItems;

  // All the different sheet names.
  var sheets;

  // All the columns of the selected sheet.
  var columns;

  // The maximum number of results to display in the autocompletes
  var maxResults;

  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   */
  this.init = function() {
    self = this;

    // TEMP
    sheets = [
      'Title Page',
      'DEV Defect Log',
      'UAT Tests',
      'Team',
      'UAT Log',
      'Production Accounts',
      'QA Log',
      'Log Template'
    ];

    columns = [
      'ID',
      'Project Number',
      'Issue Title',
      'Description (include expected and actual outcomes)',
      'Status',
      'Priority',
      'Attachment (Screenshots, Documents, etc.)',
      'Comments',
      'Created By',
      'Created Date and Time',
      'Identified By',
      'Identified Date and Time',
      'Assigned To',
      'Completion Required Date',
      'Completed By',
      'Actual Completion Date'
    ];

    // Configuration
    contentArea = $('#content-area');
    showHelp = false;
    maxNavItems = 3;
    maxResults = 5;

    cards[0] = new TitledCard(contentArea, {
      title: 'Welcome!',
      help: 'Help will be displayed here normally. Since this is just the welcome page, there isn\'t much to know!',
      paragraphs: [
        'Welcome to Mailman! This application helps users easily create mail merges. It aims to be easy to use, ' +
            'while also providing advanced options for power users.',
        'To get started, simply click NEXT down below.'
      ]
    });
    cards[1] = new InputCard(contentArea, {
      title: 'Which Sheet are we sending from?',
      help: 'This Sheet must contain all the information you may want to send in an email.',
      label: 'Sheet...',
      autocomplete: {
        results: sheets,
        maxResults: maxResults,
        triggerOnFocus: true
      }
    });
    cards[2] = new InputCard(contentArea, {
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
    cards[3] = new InputCard(contentArea, {
      title: 'Who\'s this from?',
      help: 'Who should recipients see as the sender of these emails?',
      label: 'From...'
    });
    cards[4] = new InputCard(contentArea, {
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
    cards[5] = new TextareaCard(contentArea, {
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

    activeCard = cards[0];
    cards[0].name = 'Welcome';
    cards[1].name = 'Sheet';
    cards[2].name = 'To';
    cards[3].name = 'From';
    cards[4].name = 'Subject';
    cards[5].name = 'Body';

    handleButtons(activeCard);
    show(activeCard);
    buildNavTree(activeCard);
    $('.help').addClass('hidden');

    // All UI Bindings
    $('#step').on('click', self.next);
    $('#done').on('click', self.done);
    $('#back').on('click', self.back);
    $('#help').on('click', self.toggleHelp);

    // Card change Bindings
    cards[1].attachEvent('card.hide', function(event) {

      if (window.google !== undefined) {
        var sheet = cards[1].getValue();
        google.script.run
            .withSuccessHandler(setColumns)
            .getHeaderNames(sheet);
      }
      else {
        console.log('Setting columns based on sheet.')
      }
    });

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

    if (cards.indexOf(activeCard) + 1 < cards.length) {
      activeCard = cards[cards.indexOf(activeCard) + 1];
    }

    show(activeCard);
    handleButtons(activeCard);
    // Add to the nav location
    buildNavTree(activeCard);
  };

  /**
   * This function goes to the previous card.
   * TODO There is non-DRY code between this function and this.next.
   *
   * @param {event} event The event that triggered the function call.
   */
  this.back = function(event) {
    if (cards.indexOf(activeCard) > 0) {
      activeCard = cards[cards.indexOf(activeCard) - 1];
    }

    show(activeCard);
    handleButtons(activeCard);
    // Add to the nav location
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

    var to = cards[2].getValue();
    var subject = cards[4].getValue();
    var body = cards[5].getValue();
    var sheet = cards[1].getValue();
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
   * @param {Card} card The Card to display in the navigation bar.
   */
  var addNavLink = function(card) {
    var newLink = $('<a>' + card.name + '</a>')
        .on('click', card, navigate);

    $('#nav-bar')
        .append('&nbsp;&gt;&nbsp;')
        .append(newLink);
  };

  /**
   * Builds the navigation tree from scratch. Removes the previous tree.
   *
   * @private
   * @param {Card} card The card to build the tree to.
   */
  var buildNavTree = function(card) {
    $('#nav-bar').empty();

    var stop = cards.indexOf(card);
    var start = Math.max(0, stop - maxNavItems + 1);
    for (var i = start; i <= stop; i++) {
      addNavLink(cards[i]);
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

    show(e.data);
    handleButtons(e.data);
    buildNavTree(e.data);
  };

  /**
   * Sets the display and behaviour of the buttons based on the activeCard.
   *
   * @private
   * @param {Card} card The card that is active currently.
   */
  var handleButtons = function(card) {
    setVisibility($('#back'), true);
    setHidden($('#step'), false);
    setHidden($('#done'), true);

    if (cards.indexOf(card) === 0) {
      setVisibility($('#back'), false);
    }
    else if (cards.indexOf(card) >= cards.length - 1) {
      setHidden($('#step'), true);
      setHidden($('#done'), false);
    }
  };

  /**
   * Hides all the primary content divs. There are spacing divs, so those ones aren't hidden. Then shows the parameter
   * div.
   *
   * @private
   * @param {Card} card The div to leave visible. All other are 'display:none'ed
   */
  var show = function(card) {
    hideAll();
    card.show();
  };

  /**
   * Hides all cards.
   *
   * @private
   */
  var hideAll = function() {
    cards.every(function(card) {
      card.hide();
      return true;
    });
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
    cards[1].setAutocomplete({
      results: sheets,
      maxResults: maxResults,
      triggerOnFocus: true
    });
  };

  var setColumns = function(columns) {
    columns = columns;

    cards[2].setAutocomplete({
      results: columns,
      prepend: '<<',
      append: '>>',
      maxResults: maxResults,
      triggerOnFocus: true
    });

    cards[4].setAutocomplete({
      results: columns,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });
    cards[5].setAutocomplete({
      results: columns,
      trigger: '<<',
      prepend: '<<',
      append: '>>',
      maxResults: maxResults
    });
  };

  var buildExample = function(emailObject) {
    cards[6].addParagraph('To: ' + emailObject.to);
    cards[6].addParagraph(emailObject.subject);
    cards[6].addParagraph(emailObject.body);
  };

  this.init();
};


/**
 *
 */
module.exports = MailMan;
