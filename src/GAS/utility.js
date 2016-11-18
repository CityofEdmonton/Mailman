

/**
 * This gets the values of the top-most row.
 *
 * @param {Sheet} sheet The sheet to find the headers in.
 * @return {Array<string>} The array of values.
 */
function getHeaderStrings(sheet) {
  var temp = parseInt(getHeaderRow());

  var headerRow = 1;
  if (!isNaN(temp) && temp !== null && temp > 0) {
    headerRow = temp;
  }
  
  return getValues(sheet, headerRow - 1);
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

  // Find the header row
  var row = range.offset(rowIndex, 0, 1, range.getNumColumns());

  // Make an array of header names
  var values = [];
  for (var i = 1; i <= row.getNumColumns(); i++) {
    values.push(row.getCell(1, i).getValue());
  }

  return values;
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
