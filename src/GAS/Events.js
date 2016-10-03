function onInstall(e) {
  //Install triggers
  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());

  onOpen(e);
}

function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu() //'Defect Tracker'
      .addItem('Set Up Email List', 'openModalDialog')
      .addToUi();

  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());
}


/**
 * Creates an HTML sidebar for creating/viewing mailman rules.
 *
 */
function openModalDialog() {
  var ui = HtmlService.createHtmlOutputFromFile('NewEmailDialog')
      .setTitle('Mailman')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showSidebar(ui);
}

function onTrigger() {
  Logger.log('Running trigger function...');

  var headers = 1;

  // Get all rules (TODO Multiple rules)
  var rule = getRule();
  SPREADSHEET_ID = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);

  // Validate each rule for each row
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var header = getHeaderStrings(sheet);

  for (var i = 1; i <= range.getNumRows(); i++) {
    var row = getValues(sheet, i);

    var combinedObj = {};
    for (var j = 0; j < header.length; j++) {
      combinedObj[header[j]] = row[j];
    }


    // Convert <<>> tags to actual text.
    var to = replaceTags(rules.to, sheet, combinedObj);
    var subject = replaceTags(rules.subject, sheet, combinedObj);
    var body = replaceTags(rules.body, sheet, combinedObj);

    MailApp.sendEmail(to, subject, body);
  }

}
