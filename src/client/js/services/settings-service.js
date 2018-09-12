/**
 * This module exports the SettingsService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');



/**
 * Used for managing the advanced settings for Mailman.
 *
 * @constructor
 */
var SettingsService = function() {

  /**
   * Gets the URL of the current log.
   *
   * @return {Promise} A Promise.
   */
  this.getLog = function() {
    return Provoke('SettingsService', 'getLogURL');
  };

  /**
   * Enables logging.
   *
   * @return {Promise} A Promise.
   */
  this.turnOnLogging = function() {
    return Provoke('SettingsService', 'turnOnLogging');
  };

  /**
   * Disables logging.
   *
   * @return {Promise} A Promise.
   */
  this.turnOffLogging = function() {
    return Provoke('SettingsService', 'turnOffLogging');
  };

  /**
   * Determines if advanced merge features are on.
   *
   * @deprecated
   * @return {Promise} A Promise.
   */
  this.getAdvancedMerge = function() {
    logger.info("Advanced merge is deprecated");
    return Provoke('SettingsService', 'getAdvancedMerge');
  };

  /**
   * Enables advanced Mailman features.
   *
   * @deprecated
   * @return {Promise} A Promise.
   */
  this.turnOnAdvancedMerge = function() {
    logger.info("Advanced merge is deprecated");
    return Provoke('SettingsService', 'turnOnAdvancedMerge');
  };

  /**
   * Disables advanced Mailman features.
   *
   * @deprecated
   * @return {Promise} A Promise.
   */
  this.turnOffAdvancedMerge = function() {
    logger.info("Advanced merge is deprecated");
    return Provoke('SettingsService', 'turnOffAdvancedMerge');
  };
};


/** */
module.exports = SettingsService;
