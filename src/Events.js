function onInstall(e) {
  //Install triggers
  PropertiesService.getDocumentProperties().setProperty(PROPERTY_SS_ID, SpreadsheetApp.getActiveSpreadsheet().getId());
  
  onOpen(e);
}

function onOpen(e) {
  SpreadsheetApp.getUi()
    .createAddonMenu()//'Defect Tracker'
    .addItem('Set Up Email List', 'openListSetUpSidebar')
    .addToUi();       
}

/**
 * Creates an HTML sidebar for creating/viewing mailman rules.
 * 
 */
function openListSetUpSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('ListSetupSidebar')
    .setTitle('Set Up Email List')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  SpreadsheetApp.getUi().showSidebar(ui);
}

function onTrigger() {
  Logger.log('Running trigger function...');

  var headers = 1;

  // Get all rules (TODO Multiple rules)
  var rules = getRule();
  SPREADSHEET_ID = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);
  
  // Validate each rule for each row
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheets = ss.getSheets();
  
  var to = rules.to.split('!');
  var cc = rules.cc === null ? null : rules.cc.split('!');
  var bcc = rules.bcc === null ? null : rules.bcc.split('!');
  var subject = rules.subject.split('!');
  var body = rules.body.split('!');
  var comparison = Comparison[rules.comparison];
  var range = rules.range.split('!');
  var previous = rules.previous.split('!');
  
  var dataVisible = true;
  var rowsChecked = 0;
  while (dataVisible) {
    
    var rangeCell = ss.getSheetByName(range[0]).getRange(range[1]).getCell(rowsChecked + headers + 1, 1);
    
    if (rangeCell.getDisplayValue() === rules.value) {
      // Send emails
      
      var toCell = ss.getSheetByName(to[0]).getRange(to[1]).getCell(rowsChecked + headers + 1, 1);
      var ccCell = cc === null ? null : ss.getSheetByName(cc[0]).getRange(cc[1]).getCell(rowsChecked + headers + 1, 1);
      var bccCell = bcc === null ? null : ss.getSheetByName(bcc[0]).getRange(bcc[1]).getCell(rowsChecked + headers + 1, 1);
      var subjectCell = ss.getSheetByName(subject[0]).getRange(subject[1]).getCell(rowsChecked + headers + 1, 1);
      var bodyCell = ss.getSheetByName(body[0]).getRange(body[1]).getCell(rowsChecked + headers + 1, 1);
      
      //GMAILAPP
      GmailApp.sendEmail(toCell.getDisplayValue(), subjectCell.getDisplayValue(), bodyCell.getDisplayValue(), {
        bcc: (bccCell === null ? null : bccCell.getDisplayValue()),
        cc: (ccCell === null ? null : ccCell.getDisplayValue())
      });
      Logger.log('Send to: ' + toCell.getDisplayValue());
      Logger.log('Subject: ' + subjectCell.getDisplayValue());
      Logger.log('Body: ' + bodyCell.getDisplayValue());
      
      // Update Last sent:
      var previousCell = ss.getSheetByName(previous[0]).getRange(previous[1]).getCell(rowsChecked + headers + 1, 1);
      Logger.log('Previous Email: ' + previousCell.getDisplayValue());
      
      var now = new Date();
      
      // Date.getMonth is 0 indexed. January is 0.
      previousCell.setValue(now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate());
    }
    
    rowsChecked++;
    if (rowsChecked >= 5) {
      dataVisible = false;
    }
  }
  
}