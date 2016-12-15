

var RuleTypes = {
  INSTANT: 'INSTANT',
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
  GmailApp.sendEmail(to, subject, body);

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
    log('Email info: \nto: ' + to +
        '\nsubject: ' + subject +
        '\nbody: ' + body +
        '\nsendColumn: ' + sendColumn
    );

    GmailApp.sendEmail(to, subject, body);

    return true;
  }

  return false;
}


/**
 * Handles all trigger rules. For each rule, all rows will be iterated through.
 *
 */
function sendManyEmails() {
  log('Starting rules...');
  var rules = getRules();
  log(rules);

  // Validate each rule for each row
  var ss = SpreadsheetApp.openById(load(PROPERTY_SS_ID));
  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var header = getHeaderStrings(sheet);

  for (var i = 0; i < rules.rules.length; i++) {
    var rule = rules.rules[i];

    if (rule.ruleType === RuleTypes.TRIGGER) {
      // We only timestamp when the email successfully sends.
      triggerEmail(ss, rule);
    }
  }
  log('Ending rules...');
}


function triggerEmail(ss, rule) {
  log('Starting trigger rule...');
  log(rule);
  if (validateRule(rule)) {
    return;
  }

  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var header = getHeaderStrings(sheet);

  for (var i = 1; i < range.getNumRows(); i++) {
    var row = getValues(sheet, i);

    // We only timestamp when the email successfully sends.
    if (sendConditionalEmail(header, row, rule)) {
      var dateColumn = rule.timestampColumn.replace(/(<<|>>)/g, '');
      var currentDate = new Date();
      var datetime = (currentDate.getMonth() + 1) + '/' +
              currentDate.getDate() + '/' +
              currentDate.getFullYear() + ' ' +
              currentDate.getHours() + ':' +
              currentDate.getMinutes() + ':' +
              currentDate.getSeconds();

      var cell = getCell(sheet, dateColumn, i);
      cell.setValue(datetime);
    }
    else {
      log('Email failed for row ' + i);
    }
  }

  log('Ending trigger rule...');
}


function instantEmail(rule) {

  log('Starting instant email...');
  log(rule);
  if (!validateRule(rule)) {
    return;
  }

  // Validate each rule for each row
  var ss = SpreadsheetApp.openById(load(PROPERTY_SS_ID));
  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var header = getHeaderStrings(sheet);

  for (var i = 1; i < range.getNumRows(); i++) {
    var row = getValues(sheet, i);

    try {
      sendBasicEmail(header, row, rule);
    }
    catch (e) {
      log(e);
    }

  }

  log('Ending instant email...');
}


function validateRule(rule) {
  if (rule.ruleType == null) {
    log('EmailRule config is missing "ruleType".');
    return false;
  }
  if (rule.to == null) {
    log('EmailRule config is missing "to".');
    return false;
  }
  if (rule.sheet == null) {
    log('EmailRule config is missing "sheet".');
    return false;
  }
  if (rule.subject == null) {
    log('EmailRule config is missing "subject".');
    return false;
  }
  if (rule.body == null) {
    log('EmailRule config is missing "body".');
    return false;
  }
  if (rule.ruleType === RuleTypes.TRIGGER &&
      rule.sendColumn == null) {
    log('EmailRule config is missing "sendColumn".');
    return false;
  }
  if (rule.ruleType === RuleTypes.TRIGGER &&
      rule.timestampColumn == null) {
    log('EmailRule config is missing "timestampColumn".');
    return false;
  }

  return true;
}
