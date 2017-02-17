var RULE_SHEET_NAME = 'mm-config';
var TIMESTAMP_COLUMN = 'Email Timestamp';
var ID_INDEX = 1;
var RULE_INDEX = 2;


/**
 * Gets all EmailRules.
 *
 * @return {string} A stringified array (<Array<EmailRule>) containing EmailRules.
 */
function getAllRules() {
  try {
    var sheet = getRuleSheet();
    var range = sheet.getDataRange();
    var rObj = {
      rules: []
    };

    for (var i = 0; i < range.getNumRows(); i++) {
      var row = range.offset(i, 0, 1, range.getNumColumns());
      try {
        var config = JSON.parse(row.getCell(1, RULE_INDEX).getDisplayValue());
        rObj.rules.push(config);
      }
      catch (e) {
        // Potentially delete the rule.
        log('Invalid JSON discovered.');
      }
    }

    return rObj;
  }
  catch (e) {
    log(e);
    throw e;
  }
}


/**
 * Gets an EmailRule by id. Note that the returned object is just a string.
 * Use JSON.parse if you want the actual object.
 *
 * @param  {string} id The id of the EmailRule to return.
 * @return {string} A stringified version of the EmailRule.
 */
function getRuleByID(id) {
  try {
    var row = getRowByID(id);
    var value = row.getCell(1, RULE_INDEX).getDisplayValue();

    return value;
  }
  catch (e) {
    log(e);
    throw e;
  }
}


/**
 * Deletes an EmailRule by id.
 *
 * @param  {string} id The id of the EmailRule to delete.
 */
function deleteByID(id) {
  try {
    var sheet = getRuleSheet();
    var row = getRowByID(id);

    if (row !== null) {
      sheet.deleteRow(row.getRowIndex());
    }
  }
  catch (e) {
    log(e);
    throw e;
  }
}


/**
 * Creates a new EmailRule.
 *
 * @param  {EmailRule} rule The stringified version of the EmailRule to create.
 */
function createRule(rule) {
  try {
    // We need to verify there is a timestamp column.
    var dataSheet = getSpreadsheet().getSheetByName(rule.sheet);
    if (dataSheet !== null) {
      var headers = getHeaderStrings(rule);
      var name = rule.timestampColumn
        .replace('<<', '')
        .replace('>>', '');

      if (headers.indexOf(name) === -1) {
        appendColumn(rule, name);
      }
    }

    var sheet = getRuleSheet();

    sheet.appendRow([rule.id, JSON.stringify(rule)]);
  }
  catch (e) {
    log(e);
    throw e;
  }
}


/**
 * Updates an existing EmailRule. EmailRule.id is used to do the comparison.
 *
 * @param  {EmailRule} rule The new EmailRule.
 */
function updateRule(rule) {
  try {
    // We need to verify there is a timestamp column.
    var dataSheet = getSpreadsheet().getSheetByName(rule.sheet);
    if (dataSheet !== null) {
      var headers = getHeaderStrings(rule);
      var name = rule.timestampColumn
        .replace('<<', '')
        .replace('>>', '');

      if (headers.indexOf(name) === -1) {
        appendColumn(rule, name);
      }
    }

    log('updating:');
    log(rule);
    var row = getRowByID(rule.id);

    if (row !== null) {
      var ruleCell = row.getCell(1, RULE_INDEX);
      ruleCell.setValue(JSON.stringify(rule));
    }
  }
  catch (e) {
    log(e);
    throw e;
  }
}

// Utility functions

function getRuleSheet() {
  var ss = getSpreadsheet();
  return ss.getSheetByName(RULE_SHEET_NAME);
}

function getRowByID(id) {
  var sheet = getRuleSheet();
  var range = sheet.getDataRange();

  for (var i = 0; i < range.getNumRows(); i++) {

    var row = range.offset(i, 0, 1, range.getNumColumns());
    var idCell = row.getCell(1, ID_INDEX);

    if (idCell.getDisplayValue() === id) {
      return row;
    }
  }

  return null;
}
