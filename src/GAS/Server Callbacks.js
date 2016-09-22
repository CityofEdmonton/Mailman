/**
 * Called from the client-side. Returns the current selection in A1 notation.
 * @return {string} The sheets selection in A1 notation.
 */
function getSheetSelection() {
  var column = columnToLetter(SpreadsheetApp.getActiveRange().getColumn());
  var sheet = SpreadsheetApp.getActiveRange().getSheet().getName();

  return sheet + '!' + column + ':' + column;
}


/**
 * The ultimate output of the client-side html form.
 * Used to create a new rule to check.
 *
 * @param  {string} to          The A1 notation for the column containing the primary recipients
 * @param  {string} cc          The A1 notation for the column containing the cc recipients
 * @param  {string} bcc         The A1 notation for the column containing the bcc recipients
 * @param  {string} subject     The A1 notation for the column containing the subject
 * @param  {string} body        The A1 notation for the body column
 * @param  {string} range       The A1 notation for the range to be searched/emailed
 * @param  {string} comparison  The type of comparison (TODO only supports Text is exactly...)
 * @param  {string} value       The value corresponding to the comparison
 * @param  {string} previous    The last time this row sent an email
 * @return {string} Success     value that informs users of issues/success
 */
function createRule(to, cc, bcc, subject, body, range, comparison, value, previous) {
  // Test all the values

  var rule = {
    'to': to,
    'cc': cc,
    'bcc': bcc,
    'subject': subject,
    'body': body,
    'range': range,
    'comparison': comparison,
    'value': value,
    'previous': previous
  };

  PropertiesService.getDocumentProperties().setProperty(PROPERTY_RULE, JSON.stringify(rule));

  Logger.log(rule);

  // TEMP
  onTrigger();
}
