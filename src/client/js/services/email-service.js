/**
 * This module exports the EmailService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');



/**
 * This service is used to send emails.
 *
 * @constructor
 */
var EmailService = function() {

  /**
   * Sends a test email to the active user.
   *
   * @param {string} sheetName The name of the Sheet to send from.
   * @param {string} headerRow The 1-based row that contains the headers.
   * @param {string} subject The subject of the email.
   * @param {string} body The body of the email.
   * @return {Promise} A promise.
   */
  this.sendTest = function(sheetName, headerRow, subject, body) {
    return Provoke('EmailService', 'sendTest', sheetName, headerRow, subject, body);
  };

  /**
   * Runs a MergeTemplate for sending emails.
   *
   * @param {MergeTemplate} template The template to run.
   * @return {Promise} A Promise.
   */
  this.send = function(template) {
    return Provoke('EmailService', 'startMergeTemplate', template.toConfig());
  };

};


/** */
module.exports = EmailService;
