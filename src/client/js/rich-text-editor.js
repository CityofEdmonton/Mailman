require('jquery.hotkeys');
require('./wysiwyg-editor.js');

//var Intercom = require('./intercom.js');

$(document).ready(function() {
  var wysiwyg = $('#editor').wysiwyg();
  var selection;

  /**
   * The ID of this dialog. This is set once when the template is rendered.
   */
  var DIALOG_ID = 'dialog';

  /**
   * How often to check-in with the server, in milliseconds.
   */
  var CHECKIN_INTERVAL_MS = 500;

  /**
   * Instance of the Intercom.js library.
   */
  var intercom = Intercom.getInstance();
  console.log(intercom);
  console.log('Dialog: ' + DIALOG_ID);

  var button = $('#done').on('click', onSubmit);
  var linkButton = $('#link-btn').on('click', onLinkClick);
  var linkInsertButton = $('#link-insert-btn').on('click', onLinkInsertClick);
  var linkInput = $('#link-url-value').on('click', wysiwyg.saveSelection)


  // Sets up an interval to check-in with the server every few seconds, so we can tell
  // if it's been X-ed out.
  window.setInterval(function() {
    intercom.emit(DIALOG_ID, {state: 'checkIn'});
  }, CHECKIN_INTERVAL_MS);

  function onLinkInsertClick(e) {
    var urlInput = $('#link-url-value');

    wysiwyg.restoreSpecificSelection(selection);

    console.log(urlInput.val());
    wysiwyg.execCommand('createLink', urlInput.val());

    var menu = $('#rte-link-menu');
    menu.addClass('hidden');

  }

  function onLinkClick(e) {
    selection = wysiwyg.getCurrentRange();

    var menu = $('#rte-link-menu');
    menu.toggleClass('hidden');
  }

  /**
   * Runs when the form is submitted.
   */
  function onSubmit() {
    // Here is where you would add custom logic specific to your form.
    // You may need to make additional google.script.run calls to store various information
    // collected in the dialog.


    console.log('RTE: Submitting... ' + $('#editor').cleanHtml());
    intercom.emit(DIALOG_ID, {state: 'done', message: $('#editor').cleanHtml()});
    google.script.host.close();
  }

});
