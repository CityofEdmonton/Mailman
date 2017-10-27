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
            this._metadataService = MetadataService;
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
}


/** */
module.exports = ServiceFactory;