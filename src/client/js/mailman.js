var $ = require('jquery');
var Util = require('./util.js');
var Card = require('./simple-content-div.js');

var MailMan = function() {

  // *** GLOBAL VARIABLES *** //
  // This links up the links in the header to the actual cards.
  var navToID = {
    'To': 'to-card',
    'From': 'from-card',
    'Subject': 'subject-card',
    'Body' : 'body-card'
  };

  // For convenience, this will hold the reverse lookup of navToID.
  var idToNav;

  // This holds all the "cards"
  var contentArea;

  // ********** PUBLIC **********//

  this.init = function() {
    self = this;

    // Configuration
    idToNav = Util.reverseObject(navToID);
    contentArea = $('#content-area');

    var body = new Card('test', contentArea);

    // All UI Bindings
    $('#continue').on('click', self.next);

  };

  this.next = function(event) {
    var current = $('.demo-content:not(.hidden)');
    var next = current.next('.demo-content');

    show(next);

    // Make sure this isn't the last one.

    // Add to the nav location
    addNavLink(idToNav[next.attr('id')]);
  };





  // ********** PRIVATE **********//

  /**
   * Adds a new nav link to the top navigation bar. Each content div (the card looking things) should have a related nav item.
   *
   * @param {string} value The string to display in the navigation bar.
   */
  var addNavLink = function(value) {
    var newLink = $('<a>' + value + '</a>')
      .on('click', navigate);

    $('#nav-bar')
      .append('&nbsp;&gt;&nbsp;')
      .append(newLink);
  };

  /**
   * The event triggered by any of the anchors in the nav bar. The related content div is shown and all others are hidden.
   * Note that 'this' will be the HTMLElement that fired this request.
   *
   * @param {event} e The event that triggerred this function.
   */
  var navigate = function(e) {
    var id = navToID[$(this).text()];

    // Show only the selected conent div
    show($('#' + id));

  };

  /**
   * Hides all the primary content divs. There are spacing divs, so those ones aren't hidden. Then shows the parameter div.
   *
   * @param {jquery} contentDiv The div to leave visible. All other are 'display:none'ed
   */
  var show = function(contentDiv) {
    $('.demo-content').addClass('hidden');
    contentDiv.removeClass('hidden');
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
