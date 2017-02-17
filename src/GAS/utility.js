function getSpreadsheet() {
  try {
    var id = PropertiesService.getDocumentProperties().getProperty(PROPERTY_SS_ID);
    var ss = SpreadsheetApp.openById(id);
  }
  catch (e) {
    log(e);
    throw e;
  }

  return ss;
}


/**
 * Ensures the assigned trigger is valid.
 *
 * @param  {Trigger} trigger The Trigger to test.
 * @return {boolean} True if the Trigger is valid, false otherwise.
 */
function validateTrigger(trigger) {
  if (trigger.getEventType() !== ScriptApp.EventType.CLOCK) {
    log('Invalid trigger event type');
    return false;
  }
  if (trigger.getHandlerFunction() !== 'sendManyEmails') {
    log('Invalid trigger function');
    return false;
  }

  return true;
}


/**
 * Validates all of Mailman's triggers. Logs any issues for debug purposes.
 *
 * @return {boolean} True if the triggers are set up properly, false if they are set up incorrectly.
 */
function validateTriggers() {
  var ss = getSpreadsheet();

  var triggers = ScriptApp.getUserTriggers(ss);
  log('Triggers:' + triggers.length);
  if (triggers.length !== 1) {
    log('Incorrect number of triggers: ' + triggers.length);
    return false;
  }

  return validateTrigger(triggers[0]);
}


/**
 * Creates the sheet used for storing mailman's data.
 *
 */
function setupSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(RULE_SHEET_NAME);

  if (sheet === null) {
    log('Creating config sheet.');
    sheet = ss.insertSheet(RULE_SHEET_NAME);
  }

  sheet.hideSheet();
}


/**
 * Clears the data storage sheet.
 *
 */
function clearSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(RULE_SHEET_NAME);
  sheet.clear();
}


/**
 * This gets the values of the header row for the given EmailRule. It's worth noting that
 * the parameter object isn't actually an EmailRule, it just needs to have the sheet and headerRow
 * properties.
 *
 * @param {Object} rule The EmailRule to find header values for.
 * @param {string} rule.sheet The sheet name.
 * @param {string} rule.headerRow The 1-indexed row of the header.
 * @return {Array<string>} The array of values.
 */
function getHeaderStrings(rule) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(rule.sheet);

  var value = getValues(sheet, parseInt(rule.headerRow) - 1);

  return value;
}


/**
 * Gets an array of the values in a specific sheets row.
 *
 * @param {Sheet} sheet The sheet to get the values from.
 * @param {number} rowIndex The zero-based index of the row to retrieve values for.
 * @return {Array<string>} The array of values.
 */
function getValues(sheet, rowIndex) {
  var range = sheet.getDataRange();

  var row = range.offset(rowIndex, 0, 1, range.getNumColumns());

  return row.getDisplayValues()[0];
}


/**
  * This function gets a value from a specific Sheet, column and row.
  * The column is specified by header name.
  *
  * @param {EmailRule} rule The EmailRule to use for getting a given cell.
  * @param {String} headerName The name of the header. This determines the column to look in.
  * @param {Number} row The 0-based row index. 0 is the very top row in the Sheet.
  * @return {Range} The cell.
  */
function getCell(rule, headerName, row) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(rule.sheet);

  var headerStrings = getHeaderStrings(rule);
  var column = headerStrings.indexOf(headerName);

  if (column === -1) {
    return null;
  }

  return sheet.getDataRange().getCell(row + 1, column + 1);
}


/**
 * Appends a column to the end of the headers.
 * @param  {EmailRule} rule The rule that contains the info we are interested in.
 * @param  {string} name The name of the new header.
 * @return {Range} The cell of the new header.
 */
function appendColumn(rule, name) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(rule.sheet);
  var range = sheet.getDataRange();
  var headerRow = range.offset(rule.headerRow - 1, 0, 1, range.getNumColumns());

  var newHeader = headerRow.offset(0, headerRow.getNumColumns(), 1, 1);
  newHeader.setValue(name);

  return newHeader;
}


/**
 * This function replaces  all instances of <<tags>> with the data in headerToData.
 *
 * @param {string} text The string that contains the tags.
 * @param {Object} headerToData A key-value pair where the key is a column name
 * and the value is the data in the column.
 * @return {string} The text with all tags replaced with data.
 */
function replaceTags(text, headerToData) {
  var dataText = text.replace(/<<.*?>>/g, function(match, offset, string) {
    var columnName = match.slice(2, match.length - 2);
    return headerToData[columnName];
  });

  return dataText;
}


/**
 * Source: http://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
 * Converts a column index into the column letter.
 *
 * @param {number} column  The column index
 * @return {string}  The column letters
 */
function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}


/**
 * Deletes all triggers associated with the given Sheet.
 *
 * @param  {Sheet} sheet The Sheet to remove triggers from.
 */
function deleteAllTriggers(sheet) {
  var triggers = ScriptApp.getUserTriggers(sheet);

  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}


/**
 * Removes the triggers for the Sheet the add on is installed in.
 *
 */
function deleteForThisSheet() {
  var ss = getSpreadsheet();

  deleteAllTriggers(ss);
}
