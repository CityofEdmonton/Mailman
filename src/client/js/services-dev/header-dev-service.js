/**
 * This module exports the HeadersService object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */


var Provoke = require('../util/provoke.js');
var Promise = require('promise');
var gOAuthService = new (require('./google-oauth-service'))();
var sheetsService = new (require('./sheets-dev-service'))();

/**
 * This service handles getting all the headers for a specific Sheet.
 *
 * @constructor
 */
var HeaderService = function() {

  //***** private methods *****//

  this.init_ = function() {

  };

  //***** public methods *****//

  /**
   * Gets the headers for a given Sheet and row.
   *
   * @param {string} sheet The name of the Sheet.
   * @param {string} row The row the headers are in.
   */
  this.get = function(sheet, row) {
    return new Promise(function(resolve, reject) {
      sheetsService.getTestSheetId().then(function(sheetId) {
        gOAuthService.getSheetsApi().then(function(sheets) {
          // sheets is a v4 Google API thing: https://developers.google.com/sheets/api/quickstart/js
          var range = sheet + "!A" + row + ":AZ" + row; 
          sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range:range
          }).then(function(response) {   
            var values = response.result.values;
            resolve(values && values.length ? values[0] : []);
          }, function(getValuesError) {
            reject({
              message: "Unable to read sheet at row " + row,
              error: getValuesError
            });
          });
          
        }, function(getSheetApiError) {
          reject({
            message: "Unable to get sheets API",
            error: getSheetApiError
          })
        });
      }, function(getTestSheetIdError) {
        reject({
          message: "Unable to get test sheet id",
          error: getTestSheetIdError
        })
      });
    });
  };


  this.init_();
};


/** */
module.exports = HeaderService;
