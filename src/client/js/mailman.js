var $ = require('jquery');
var Util = require('./util.js');
var Card = require('./simple-content-div.js');

var MailMan = function() {

  // *** GLOBAL VARIABLES *** //

  // This holds all the "cards"
  var contentArea;

  // This stores all the
  var cards = [];
  var activeCard;

  // ********** PUBLIC **********//

  this.init = function() {
    self = this;

    // Configuration
    contentArea = $('#content-area');

    cards[0] = new Card(contentArea, Card.types.INFO, {
      title: 'Welcome!',
      help: 'Help will be displayed here normally. Since this is just the welcome page, there isn\'t much to know!',
      paragraphs: [
        "Welcome to Mailman! This application helps users easily create mail merges. It aims to be easy to use, while also providing advanced options for power users.",
        "To get started, simply click NEXT down below."
      ]
    });
    cards[1] = new Card(contentArea, Card.types.INPUT, {
      title: 'Which Sheet are we sending from?',
      help: 'HELP',
      label: 'Sheet...'
    });
    cards[2] = new Card(contentArea, Card.types.INPUT, {
      title: 'Who are you sending to?',
      help: 'HELP',
      label: 'To...'
    });
    cards[3] = new Card(contentArea, Card.types.INPUT, {
      title: 'Who\'s this from?',
      help: 'HELP',
      label: 'From...'
    });
    cards[4] = new Card(contentArea, Card.types.INPUT, {
      title: 'What\'s your subject?',
      help: 'HELP',
      label: 'Subject...'
    });
    cards[5] = new Card(contentArea, Card.types.TEXTAREA, {
      title: 'What\'s in the body?',
      help: 'HELP',
      label: 'Body...'
    });

    activeCard = cards[0];

    cards[0].name = 'Welcome';
    cards[1].name = 'Sheet';
    cards[2].name = 'To';
    cards[3].name = 'From';
    cards[4].name = 'Subject';
    cards[5].name = 'Body';

    show(activeCard);
    buildNavTree(activeCard);

    // All UI Bindings
    $('#continue').on('click', self.next);

  };

  this.next = function(event) {
    if (cards.indexOf(activeCard) + 1 < cards.length) {
      activeCard = cards[cards.indexOf(activeCard) + 1];
    }

    show(activeCard);

    // Add to the nav location
    buildNavTree(activeCard);
  };

  // ********** PRIVATE **********//

  /**
   * Adds a new nav link to the top navigation bar. Each content div (the card looking things) should have a related nav item.
   *
   * @param {Card} card The Card to display in the navigation bar.
   */
  var addNavLink = function(card) {
    var newLink = $('<a>' + card.name + '</a>')
      .on('click', card, navigate);

    $('#nav-bar')
      .append('&nbsp;&gt;&nbsp;')
      .append(newLink);
  };

  var buildNavTree = function(card) {
    $('#nav-bar').empty();

    var stop = cards.indexOf(card);
    for (var i = 0; i <= stop; i++) {
      addNavLink(cards[i]);
    }
  };

  /**
   * The event triggered by any of the anchors in the nav bar. The related content div is shown and all others are hidden.
   * Note that 'this' will be the HTMLElement that fired this request.
   *
   * @param {event} e The event that triggerred this function.
   */
  var navigate = function(e) {
    activeCard = e.data;

    show(e.data);
    buildNavTree(e.data);
  };

  /**
   * Hides all the primary content divs. There are spacing divs, so those ones aren't hidden. Then shows the parameter div.
   *
   * @param {Card} card The div to leave visible. All other are 'display:none'ed
   */
  var show = function(card) {
    hideAll();
    card.show();
  };

  var hideAll = function() {
    cards.every(function(card) {
      card.hide();
      return true;
    });
  };

  var done = function() {
    // SUBMIT THE INFO BACK TO SHEETS
    console.log('done');
    google.script.run
        .withSuccessHandler(submitData)
        .createRule(to, cc, bcc, subject, body, range, comparison, value, lastSent);
  };

};

module.exports = MailMan;
