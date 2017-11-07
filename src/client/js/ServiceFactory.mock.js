/**
 * This module exports the ServiceFactory object for local web debugging.
 * Most of the services are Mock implementations
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


/**
 * Provides access to all the Services that Mailman needs.
 * This class may be replaced by another factory that creates Mock services
 * (for local debugging or Unit Tests)
 *
 * @constructor
 */
var ServiceFactory = function() {
    
  /**
   * Gets The Settings Service
   *
   * @return The Settings Service
   */
    this.getSettingsService = function() {
        if (!this._settingsService) {
            var SettingsService = require('./services-mock/settings-mock-service.js');
            this._settingsService = new SettingsService();
        }
        return this._settingsService;
    }
       
    /**
     * Gets The Metadata Service
     *
     * @return The Metadata Service
     */
    this.getMetadataService = function() {
        if (!this._metadataService) {
            var MetadataService = require('./services-mock/metadata-mock-service.js');
            this._metadataService = new MetadataService();
        }
        return this._metadataService;
    }

    /**
     * Gets The MergeTemplate Service
     *
     * @return The MergeTemplate Service
     */
    this.getMergeTemplateService = function() {
        if (!this._mergeTemplateService) {
            var MergeTemplateService = require('./services-mock/merge-template-mock-service.js');
            this._mergeTemplateService = new MergeTemplateService();
        }
        return this._mergeTemplateService;
    }

    /**
     * Gets the sheets service
     */
    this.getSheetsService = function() {
        if (!this._sheetsService) {
            var SheetService = require('./services-mock/sheets-mock-service.js');
            this._sheetsService = new SheetService();
        }
        return this._sheetsService;
    }

    this.getHeaderService = function() {
        if (!this._headerService) {
            var HeaderService = require('./services-mock/header-mock-service.js');
            this._headerService = new HeaderService();
        }
        return this._headerService;
    }

    this.getEmailService = function() {
        if (!this._emailService) {
            var EmailService = require('./services-mock/email-mock-service.js');
            this._emailService = new EmailService();
        }
        return this._emailService;
    }
}


/** */
module.exports = ServiceFactory;