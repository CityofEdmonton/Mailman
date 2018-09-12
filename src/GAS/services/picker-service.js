var PickerService = {};

PickerService.openDocument = function(writeTo) {
  var template = HtmlService
    .createTemplateFromFile('picker.html');
  template.oauthToken = getOAuthToken();
  log.debug("Retrieved OAuthToken={OAuthToken}", template.oauthToken);
  // template.fileType = google.picker.ViewId.DOCUMENTS;
  template.writeTo = writeTo;
  log.debug("PickerServier writeTo={writeTo}", template.writeTo);

  var html = template.evaluate()
    .setWidth(600)
    .setHeight(425)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showModalDialog(html, 'Select a file');
}

/**
 * Gets the user's OAuth 2.0 access token so that it can be passed to Picker.
 * This technique keeps Picker from needing to show its own authorization
 * dialog, but is only possible if the OAuth scope that Picker needs is
 * available in Apps Script. In this case, the function includes an unused call
 * to a DriveApp method to ensure that Apps Script requests access to all files
 * in the user's Drive.
 *
 * @return {string} The user's OAuth 2.0 access token.
 */
function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}
