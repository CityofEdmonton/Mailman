// TODO Performance improvements in here could be very important.

var EmailService = {

  startMergeTemplate: function(template) {
    try {
      MergeTemplateService.validate(template);
      EmailService.validate(template.mergeData.data);
    }
    catch(e) {
      log(e);
      throw e;
    }

    log('Starting merge template ' + template.id);
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(template.mergeData.sheet);
    var range = sheet.getDataRange();
    var header = HeaderService.get(template.mergeData.sheet, template.mergeData.headerRow);
    var sendHelper;

    if (template.mergeData.conditional == null) {
      sendHelper = EmailService.sendHelper;
    }
    else {
      sendHelper = EmailService.conditionalSendHelper;
    }

    for (var i = parseInt(template.mergeData.headerRow); i < range.getNumRows(); i++) {
      var row = range.offset(i, 0, 1, range.getNumColumns());

      try {
        // We only timestamp when the email successfully sends.
        if (sendHelper(header, row.getDisplayValues()[0], template)) {
          var timestampName = template.mergeData.timestampColumn.replace(/(<<|>>)/g, '');
          var timeCell = row.getCell(1, header.indexOf(timestampName) + 1);

          var currentDate = new Date();
          var datetime = (currentDate.getMonth() + 1) + '/' +
                  currentDate.getDate() + '/' +
                  currentDate.getFullYear() + ' ' +
                  currentDate.getHours() + ':' +
                  currentDate.getMinutes() + ':' +
                  currentDate.getSeconds();

          timeCell.setValue(datetime);
        }
      }
      catch (e) {
        log(e);
      }
    }

    log('Ending merge template...');
  },

  /**
   * Sends a test email to the current user.
   *
   * @param  {string} sheetName The name of the Sheet to send from.
   * @param  {string} headerRow The 1-based row the header is in.
   * @param  {string} subject The whack-whacked subject.
   * @param  {string} body The whack whacked body.
   */
  sendTest: function(sheetName, headerRow, subject, body) {
    log('Sending test email');
    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    var range = sheet.getDataRange();
    var header = HeaderService.get(sheetName, headerRow);
    var row = range.offset(parseInt(headerRow), 0, 1, range.getNumColumns()).getDisplayValues()[0];

    var combinedObj = {};
    for (var j = 0; j < header.length; j++) {
      combinedObj[header[j]] = row[j];
    }

    // Convert <<>> tags to actual text.
    var subject = EmailService.replaceTags(subject, combinedObj);
    var body = EmailService.replaceTags(body, combinedObj);

    EmailService.send(Session.getActiveUser().getEmail(), subject, body);
  },

  send: function(to, subject, body, cc, bcc) {
    if (to === '' || to == null) {
      return;
    }

    var htmlEmail = HtmlService.createTemplateFromFile('email-template');
    htmlEmail.id = Utility.getSpreadsheet().getId();
    htmlEmail.bodyArray = body.split('\n');

    log('Sending email to ' + JSON.stringify({
      to: to,
      cc: cc,
      bcc: bcc
    }));
    GmailApp.sendEmail(to, subject, body, {
      htmlBody: htmlEmail.evaluate().getContent(),
      cc: cc,
      bcc: bcc
    });
  },

  /**
   * Validates the supplied MergeData.data. This can be found in MergeTemplate.mergeData.data. This is specifically
   * for mail merge.
   * Note, this throws errors if the data is invalid.
   *
   * @param  {Object} data The data payload containing to, subject and body.
   */
  validate: function(data) {
    if (data == null) {
      throw new Error('MergeTemplate.mergeData.data is null');
    }
    if (data.to == null) {
      throw new Error('MergeTemplate.mergeData.data.to is null');
    }
    if (data.subject == null) {
      throw new Error('MergeTemplate.mergeData.data.subject is null');
    }
    if (data.body == null) {
      throw new Error('MergeTemplate.mergeData.data.body is null');
    }
  },

  /******* Private / utility functions *******/

  /**
   * Sends an email based upon a MergeTemplate. Whack whacks are swapped out.
   * Handles to, subject and body fields.
   *
   * @param {String[]} headerRow An array of header values.
   * @param {String[]} row An array of row values.
   * @param {Object} template The MergeTemplate used to send the email. See the client-side object for info.
   * @return {Boolean} true if the email was sent, false otherwise.
   */
  sendHelper: function(headerRow, row, template) {

    var combinedObj = {};
    for (var j = 0; j < headerRow.length; j++) {
      combinedObj[headerRow[j]] = row[j];
    }

    // Convert <<>> tags to actual text.
    var to = EmailService.replaceTags(template.mergeData.data.to, combinedObj);
    var subject = EmailService.replaceTags(template.mergeData.data.subject, combinedObj);
    var body = EmailService.replaceTags(template.mergeData.data.body, combinedObj);
    var cc;
    var bcc;

    if (template.mergeData.data.cc != null) {
      cc = EmailService.replaceTags(template.mergeData.data.cc, combinedObj);;
    }
    if (template.mergeData.data.bcc != null) {
      bcc = EmailService.replaceTags(template.mergeData.data.bcc, combinedObj);;
    }

    EmailService.send(to, subject, body, cc, bcc);

    return true;
  },

  /**
   * Sends an email based upon a MergeTemplate. Tags are swapped out.
   * Handles to, subject, body, conditional and timestampColumn fields.
   *
   * @param {String[]} headerRow An array of header values.
   * @param {String[]} row An array of row values.
   * @param {Object} template The MergeTemplate used to send the email. See the client-side Object for info.
   * @return {Boolean} true if the email was sent, false otherwise.
   */
  conditionalSendHelper: function(headerRow, row, template) {
    var combinedObj = {};
    for (var j = 0; j < headerRow.length; j++) {
      combinedObj[headerRow[j]] = row[j];
    }

    // Convert <<>> tags to actual text.
    var to = EmailService.replaceTags(template.mergeData.data.to, combinedObj);
    var subject = EmailService.replaceTags(template.mergeData.data.subject, combinedObj);
    var body = EmailService.replaceTags(template.mergeData.data.body, combinedObj);
    var sendColumn = EmailService.replaceTags(template.mergeData.conditional, combinedObj);
    var cc;
    var bcc;

    if (template.mergeData.data.cc != null) {
      cc = EmailService.replaceTags(template.mergeData.data.cc, combinedObj);;
    }
    if (template.mergeData.data.bcc != null) {
      bcc = EmailService.replaceTags(template.mergeData.data.bcc, combinedObj);;
    }

    if (sendColumn.toLowerCase() == 'true') {
      EmailService.send(to, subject, body, cc, bcc);

      return true;
    }

    return false;
  },

  /**
   * This function replaces  all instances of <<tags>> with the data in headerToData.
   *
   * @param {string} text The string that contains the tags.
   * @param {Object} headerToData A key-value pair where the key is a column name and the value is the data in the
   * column.
   * @return {string} The text with all tags replaced with data.
   */
  replaceTags: function(text, headerToData) {
    var dataText = text.replace(/<<.*?>>/g, function(match, offset, string) {
      var columnName = match.slice(2, match.length - 2);
      return headerToData[columnName];
    });

    return dataText;
  }
};
