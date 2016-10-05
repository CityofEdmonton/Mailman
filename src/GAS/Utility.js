function getHeaderStrings(sheet) {
  return getValues(sheet, 0);
}

function getValues(sheet, rowIndex) {
  var range = sheet.getDataRange();

  // Find the header row
  var row = range.offset(rowIndex, 0, 1, range.getNumColumns());

  // Make an array of header names
  var values = [];
  for (var i = 1; i <= row.getNumColumns(); i++) {
    values.push(row.getCell(1, i).getValue());
  }

  return values;
}

function test() {
  var ss = SpreadsheetApp.openById('1G0APrUUpZv-TpFmqdlSPUpzQL3mbDhZQ4stQFWjU30c');
  var sheet = ss.getSheetByName('Defects');
  var header = getHeaderStrings(sheet);
  var row = getValues(sheet, 2);

  var superObj;
  for (var i = 0; i < header.length; i++) {
    superObj[header[i]] = row[i];
  }

  Logger.log(replaceTags('This is a <<Category>>. Another priority: <<Priority>>.', sheet, superObj));
}

function replaceTags(text, sheet, headerToData) {
  var dataText = text.replace(/<<.*?>>/g, function(match, offset, string) {
    var columnName = match.slice(2, match.length - 2);
    return headerToData[columnName];
  });

  return dataText;
}

/**
 * Given a range in A1 notation, this function extracts the sheet name.
 * Example: TestSheet1!A4:D10 returns TestSheet1.
 *
 * @param {string} a1Notation A range in A1 notation.
 * @return {string} The sheet name.
 */
function extractSheetName(a1Notation) {
  return a1Notation.substr(0, a1Notation.search('!'));
}


/**
 * Given a range in A1 notation, this function extracts the range.
 * Example: TestSheet1!A4:D10 returns A4:D10.
 * Note: This does not validate the range. It could be just gibberish.
 * All this does is return some text after a !.
 *
 * @param {string} a1Notation A range in A1 notation.
 * @return {string} The range in A1 notation (no sheet name).
 */
function extractRange(a1Notation) {
  return a1Notation.substr(a1Notation.search('!') + 1, a1Notation.length);
}


/**
 * Ensures a given rule makes sense. It logs issues with the rule and also returns the issues in a string array.
 *
 * @param {Object} rule An object that contains to, cc, bcc, subject, body, range, comparison, value.
 * @return {Array.<string>}  A list of issues with the rules. If this is empty, the rule is good!
 */
function validateRule(rule) {

}


/**
 * Get the rule for this document.
 *
 * @return {object} The rule in object form.
 */
function getRule() {
  return JSON.parse(PropertiesService.getDocumentProperties().getProperty(PROPERTY_RULE));
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
 * Creates a rule with default test information. Used for testing purposes.
 *
 */
function fillTestInfo() {
  createRule('Defects!I:I', null, null, 'Defects Email!A:A', 'Defects Email!B:B', 'Defects Email!C:C', 'Text is exactly', 'TRUE', 'Defects Email!D:D');
}


/**
 * Logs the Documents properties. Used for testing purposes.
 *
 */
function checkDocumentProperties() {
  Logger.log(PropertiesService.getDocumentProperties().getProperties());
}


/**
 * Cleans all properties. We need the sheet id stored as a property. Remember to get this id again.
 *
 */
function removeProperties() {
  PropertiesService.getDocumentProperties().deleteAllProperties();
}
