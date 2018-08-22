/**
 * @file A service focused on handling metadata.
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 */


/**
 * This service handles app information.
 *
 * @type {Object}
 */
var MetadataService = {

  /**
   * Gets the effective user.
   *
   * @return {string} The email address of the effective user.
   */
  getUser: function() {
    return Session.getEffectiveUser().getEmail();
  },

  /**
   * Gets the currently running version of Mailman.
   *
   * @return {string} The current version of Mailman.
   */
  getVersion: function() {
    return MAILMAN_VERSION;
  },

  /**
   * Gets the email quota for the effective user.
   *
   * @return {Integer} The number of emails that can be sent today.
   */
  getQuota: function() {
    return MailApp.getRemainingDailyQuota();
  }
};
