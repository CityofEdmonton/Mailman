/**
 * @file A service focused on sending emails.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 */

/**
 * This service handles sending emails using MergeTemplates.
 * TODO Performance improvements in here could be very important.
 *
 * @type {Object}
 */
var EmailService = {

  /**
   * Runs a MergeTemplate, sending emails as needed. This actually reloads the MergeTemplate,
   * so it runs the most up to date version.
   *
   * @method
   * @param {MergeTemplate} template The MergeTemplate to run.
   */
  startMergeTemplate: function(template) {
    try {
      MergeTemplateService.validate(template);
    }
    catch(e) {
      log(e);
      throw e;
    }

    template = MergeTemplateService.getByID(template.id);
    if (template === null) {
      return;
    }

    log('Starting merge template ' + template.id);

    var ss = Utility.getSpreadsheet();
    var sheet = ss.getSheetByName(template.mergeData.sheet);
    var range = sheet.getDataRange();
    var header = HeaderService.get(template.mergeData.sheet, template.mergeData.headerRow);

    for (var i = parseInt(template.mergeData.headerRow); i < range.getNumRows(); i++) {
      var row = range.offset(i, 0, 1, range.getNumColumns());

      var emailProps = EmailService.getEmailFields(header, row.getDisplayValues()[0], template);
      var to = emailProps.to;
      var cc = emailProps.cc;
      var bcc = emailProps.bcc;
      var subject = emailProps.subject;
      var body = emailProps.body;
      var conditional = emailProps.conditional;

      try {
        // We only timestamp when the email successfully sends.
        if ((template.mergeData.conditional == null || conditional === 'true') &&
          EmailService.send(to, subject, body, cc, bcc)) {

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

  /**
   * Handles sending emails. Emails that don't have "to" defined return false.
   * Emails that contain closing </html> tags result in an html email being sent.
   *
   * @param {string} to The primary recipients of the email. Can be a comma delimited list of users.
   * @param {string} subject The subject of the email. This can be an empty string.
   * @param {string} body The body of the email. This can be an empty string.
   * @param {string|undefined} cc Secondary recipients of the email. Can be a comma delimited list of users.
   * @param {string|undefined} bcc Blind copied recipients. Can be a comma delimited list of users.
   * @return {boolean} true if the email was sent, false if it wasn't.
   */
  send: function(to, subject, body, cc, bcc) {
    if (to === '' || to == null) {
      return false;
    }

    log('Sending email to ' + JSON.stringify({
      to: to,
      cc: cc,
      bcc: bcc
    }));

    if (/<html>/.test(body)) {
      GmailApp.sendEmail(to, subject, body, {
        htmlBody: body,
        cc: cc,
        bcc: bcc
      });
    }
    else {
      GmailApp.sendEmail(to, subject, body, {
        cc: cc,
        bcc: bcc
      });
    }

    return true;
  },

  /******* Private / utility functions *******/

  /**
   * Retrieves the required fields for an email to be sent.
   *
   * @param {String[]} headerRow An array of header values.
   * @param {String[]} row An array of row values.
   * @param {Object} template The MergeTemplate used to send the email. See the client-side object for info.
   * @return {Boolean} true if the email was sent, false otherwise.
   */
  getEmailFields: function(headerRow, row, template) {
    var valueMap = {};
    for (var j = 0; j < headerRow.length; j++) {
      valueMap[headerRow[j]] = row[j];
    }

    if (template.mergeData.type.toLowerCase() === 'email') {
      return {
        to: EmailService.replaceTags(template.mergeData.data.to, valueMap),
        cc: EmailService.replaceTags(template.mergeData.data.cc, valueMap),
        bcc: EmailService.replaceTags(template.mergeData.data.bcc, valueMap),
        subject: EmailService.replaceTags(template.mergeData.data.subject, valueMap),
        body: EmailService.replaceTags(template.mergeData.data.body, valueMap),
        conditional: EmailService.replaceTags(template.mergeData.conditional, valueMap).toLowerCase()
      };
    }
    else if (template.mergeData.type.toLowerCase() === 'document') {
      var bodyHTML = DocumentService.getDocumentAsHTML(template.mergeData.data.documentID);
      return {
        to: EmailService.replaceTags(template.mergeData.data.to, valueMap),
        cc: EmailService.replaceTags(template.mergeData.data.cc, valueMap),
        bcc: EmailService.replaceTags(template.mergeData.data.bcc, valueMap),
        subject: EmailService.replaceTags(template.mergeData.data.subject, valueMap),
        body: EmailService.replaceTags(bodyHTML, valueMap),
        conditional: EmailService.replaceTags(template.mergeData.conditional, valueMap).toLowerCase()
      };
    }

    return {};
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
    if (text == null) {
      text = '';
    }

    // This must match <<these>> and &lt;&lt;these&gt;&gt; since we need to support HTML.
    var dataText = text.replace(/<<(.*?)>>|&lt;&lt;(.*?)&gt;&gt;/g, function(match, m1, m2, offset, string) {
      if (m1 && headerToData[m1]) {
        return headerToData[m1];
      }
      else if (m2 && headerToData[m2]) {
        return headerToData[m2];
      }
      return '';
    });

    return dataText;
  }
};
