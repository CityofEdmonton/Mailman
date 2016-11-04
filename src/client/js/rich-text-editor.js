require('jquery.hotkeys');
require('./wysiwyg-editor.js');

var Intercom = require('./intercom.js');

$(document).ready(function() {
  $('#editor').wysiwyg();

  /**
   * The ID of this dialog. This is set once when the template is rendered.
   */
  var DIALOG_ID = 'rte_dialog';

  /**
   * How often to check-in with the server, in milliseconds.
   */
  var CHECKIN_INTERVAL_MS = 500;

  /**
   * Instance of the Intercom.js library.
   */
  var intercom = Intercom.getInstance();
  console.log(intercom);

  var button = $('#done').on('click', onSubmit);

  // Sets up an interval to check-in with the server every few seconds, so we can tell
  // if it's been X-ed out.
  window.setInterval(function() {
    intercom.emit(DIALOG_ID, 'checkIn');
  }, CHECKIN_INTERVAL_MS);

  /**
   * Runs when the form is submitted.
   */
  function onSubmit() {
    // Here is where you would add custom logic specific to your form.
    // You may need to make additional google.script.run calls to store various information
    // collected in the dialog.
	console.log('RTE: Submitting...');
    intercom.emit(DIALOG_ID, 'done');
    google.script.host.close();
  }
});
