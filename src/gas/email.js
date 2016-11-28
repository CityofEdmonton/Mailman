

RuleTypes = {
  INSTANT: 'INSTANT',
  LATER: 'LATER',
  TRIGGER: 'TRIGGER'
};


/**
 * Sends an email based upon an EmailRule. Tags are swapped out.
 * Handles to, subject and body fields.
 *
 * @param {String[]} headerRow An array of header values.
 * @param {String[]} row An array of row values.
 * @param {Object} rule The rule used to send the email. See the client-side object EmailRule for info.
 * @return {Boolean} true if the email was sent, false otherwise.
 */
function sendBasicEmail(headerRow, row, rule) {
  var combinedObj = {};
  for (var j = 0; j < headerRow.length; j++) {
    combinedObj[headerRow[j]] = row[j];
  }

  // Convert <<>> tags to actual text.
  var to = replaceTags(rule.to, combinedObj);
  var subject = replaceTags(rule.subject, combinedObj);
  var body = replaceTags(rule.body, combinedObj);

  log('Sending email to ' + to);
  MailApp.sendEmail(to, subject, body);

  return true;
}


/**
 * Sends an email based upon an EmailRule. Tags are swapped out.
 * Handles to, subject, body, sendColumn and timestampColumn fields.
 * This is used for TRIGGER type rules.
 *
 * @param {String[]} headerRow An array of header values.
 * @param {String[]} row An array of row values.
 * @param {Object} rule The rule used to send the email. See the client-side object EmailRule for info.
 * @return {Boolean} true if the email was sent, false otherwise.
 */
function sendConditionalEmail(headerRow, row, rule) {
  var combinedObj = {};
  for (var j = 0; j < headerRow.length; j++) {
    combinedObj[headerRow[j]] = row[j];
  }

  // Convert <<>> tags to actual text.
  var to = replaceTags(rule.to, combinedObj);
  var subject = replaceTags(rule.subject, combinedObj);
  var body = replaceTags(rule.body, combinedObj);
  var sendColumn = replaceTags(rule.sendColumn, combinedObj);

  if (sendColumn.toLowerCase() === 'true') {
    log('Sending email to ' + to);

    MailApp.sendEmail(to, subject, body);

    return true;
  }

  return false;
}


function sendManyEmails() {
  var rule = getRule();

  // Validate each rule for each row
  var ss = SpreadsheetApp.openById(load(PROPERTY_SS_ID));
  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var header = getHeaderStrings(sheet);
  var dateColumn = rule.timestampColumn.replace(/(<<|>>)/g, '');

  log('Starting...');
  log(rule);

  for (var i = 1; i < range.getNumRows(); i++) {
    var row = getValues(sheet, i);

    if (rule.ruleType === RuleTypes.TRIGGER) {
      // We only timestamp when the email successfully sends.
      if (sendConditionalEmail(header, row, rule)) {
        var currentdate = new Date();
        var datetime = (currentdate.getMonth()+1) + '/'
                + currentdate.getDate() + '/'
                + currentdate.getFullYear() + ' '
                + currentdate.getHours() + ':'
                + currentdate.getMinutes() + ':'
                + currentdate.getSeconds();

        var cell = getCell(sheet, dateColumn, i);
        cell.setValue(datetime);
      }
    }
    else if (rule.ruleType === RuleTypes.INSTANT) {
      sendBasicEmail(header, row, rule);
    }
  }
  log('Ending...');
}
