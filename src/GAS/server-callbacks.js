

/**
 * Creates a trigger for sending emails.
 *
 */
function createTriggerBasedEmail() {
  try {
    log('Creating trigger.');
    ScriptApp.newTrigger('sendManyEmails')
        .timeBased()
        .everyHours(1)
        .create();
  }
  catch (e) {
    log('Error: ' + e);
    throw e;
  }
}


function rebuildTrigger() {
  deleteForThisSheet();
  createTriggerBasedEmail();
}


function clearData() {
  clearSheet();
}


/**
 * Launches the Rich Text Editor.
 *
 * @return {string} The id of the newly created dialog.
 */
function launchRTE() {
  var dialogId = Utilities.base64Encode(Math.random());

  var template = HtmlService.createTemplateFromFile('rich-text-editor');
  template.dialogId = dialogId;

  var ui = template.evaluate()
      .setTitle('Mailman')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setHeight(600)
      .setWidth(750);

  SpreadsheetApp.getUi().showModalDialog(ui, ' ');

  return 'dialog';
}


/**
 * Gets the names of all the available sheets.
 *
 * @return {Array<string>} The names of all the sheets.
 */
function getSheets() {
  var ss = getSpreadsheet();
  var sheets = ss.getSheets();

  var names = [];
  for (var i = 0; i < sheets.length; i++) {
    names.push(sheets[i].getName());
  }

  return names;
}
