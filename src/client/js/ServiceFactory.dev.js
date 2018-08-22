/**
 * This module exports the ServiceFactory object for local web debugging.
 * These services use OAuth to read from a single test file
 * at https://docs.google.com/spreadsheets/d/1GnoG6twy6OC9jQw7-KeZBR02znTW8VkR7Yp2Wf2JlrY/edit#gid=0
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
            var SettingsService = require('./services-dev/settings-dev-service.js');
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
            var MetadataService = require('./services-dev/metadata-dev-service.js');
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
            var MergeTemplateService = require('./services-dev/merge-template-dev-service.js');
            this._mergeTemplateService = new MergeTemplateService();
        }
        return this._mergeTemplateService;
    }

    /**
     * Gets the sheets service
     */
    this.getSheetsService = function() {
        if (!this._sheetsService) {
            var SheetService = require('./services-dev/sheets-dev-service.js');
            this._sheetsService = new SheetService();
        }
        return this._sheetsService;
    }

    this.getHeaderService = function() {
        if (!this._headerService) {
            var HeaderService = require('./services-dev/header-dev-service.js');
            this._headerService = new HeaderService();
        }
        return this._headerService;
    }

    this.getEmailService = function() {
        if (!this._emailService) {
            var EmailService = require('./services-dev/email-dev-service.js');
            this._emailService = new EmailService();
        }
        return this._emailService;
    }

    this.getRenderService = function() {
        if (!this._renderService) {
            var RenderService = require('./services-dev/render-dev-service.js');
            this._renderService = new RenderService();
        }
        return this._renderService;       
    }    
}


/** */
module.exports = ServiceFactory;