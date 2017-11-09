/**
 * This module exports the SettingsService object.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var Promise = require('promise');


/**
 * Used for authenticating to Google with OAuth.
 *
 * @constructor
 */
var GoogleOAuthService = function() {

  var self = this;
  var GoogleAuth; // filled in when loaded

  var isAuthorized;

  var GAPI = {
    "sheets": {
      "discovery": "https://sheets.googleapis.com/$discovery/rest?version=v4",
      "scopes": {
        "readonly": "https://www.googleapis.com/auth/spreadsheets.readonly",
        "readwrite": "https://www.googleapis.com/auth/spreadsheets",
        "metadata": "https://www.googleapis.com/auth/drive.readonly"
      }/*,
      "drive": {
        "discovery": "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        "scopes": {
          "full": "https://www.googleapis.com/auth/drive"
        }
      }*/
    }
  };

  _initClient = function(gapi) {
    return new Promise((resolve, reject) => {
      // from https://developers.google.com/identity/protocols/OAuth2UserAgent
      // Retrieve the discovery document for version 3 of Google Drive API.
      // In practice, your app can retrieve one or more discovery documents.

      // Initialize the gapi.client object, which app uses to make API requests.
      // Get API key and client ID from API Console.
      // 'scope' field specifies space-delimited list of access scopes.   
      gapi.client.init({
        'apiKey': self.apiKey, //'YOUR_API_KEY',
        'discoveryDocs': [GAPI.sheets.discovery],
        'clientId': self.clientId, // 'YOUR_CLIENT_ID',
        'scope': GAPI.sheets.scopes.readwrite
      }).then(function() {
        GoogleAuth = gapi.auth2.getAuthInstance();
        window["coeGoogleAuth"] = GoogleAuth; // reuse across services instances
        resolve();        
      }, function(err) {
          reject(err);
      });
    });
  };


  var _ensureAppSettings;
  var ensureAppSettings = function() {
    if (!_ensureAppSettings) {
      _ensureAppSettings = new Promise((resolve1, reject1) => {
        $.getJSON("/appsettings-dev.json", function(json) {
            try {
                self.apiKey = json.integration.apiKey;
                self.clientId = json.integration.oauth.clientId;
                resolve1(json.integration.oauth);
            }
            catch (err11) {
                reject1(err11);
            }
        })
        .fail(function() { reject1(err1); });
      });
    }
    return _ensureAppSettings;
  };

  var _ensureGApiScript;
  var ensureGApiScript = function() {
    if (!_ensureGApiScript) {
      // we need to ensure we only do this once per browser window
      _ensureGApiScript = window["coeEnsureGApiScript"];
      if (!_ensureGApiScript) {
        _ensureGApiScript = new Promise((resolve2, reject2) => {
          var oHead = document.head || document.getElementsByTagName("head")[0];
          var oScript = document.createElement('script');
          oScript.onload = function() {
              resolve2(window["gapi"]);
          };
          oScript.onerror = function(err) {
              reject2(err);
          }
          oScript.type = 'text/javascript';
          oScript.src = 'https://apis.google.com/js/api.js'; 
          oHead.appendChild(oScript);    
        });
        window["coeEnsureGApiScript"] =  _ensureGApiScript;
      }
    }
    return _ensureGApiScript;
  }

  var _ensureGApi;
  var ensureGApi = function() {
    if (!_ensureGApi) {
      _ensureGApi = new Promise(function(resolve, reject) {
        if (GoogleAuth) {
          resolve(); 
        } else if (window["coeGoogleAuth"]) {
          // reuse across services instances
          GoogleAuth = window["coeGoogleAuth"];
          resolve(); 
        } else {
          Promise.all([ensureGApiScript(), ensureAppSettings()]).done(values => {
              var gapi = values[0];
              var config = values[1];

              // Load the API's client and auth2 modules.
              // Call the initClient function after the modules load.
              gapi.load('client:auth2', function() {
                  _initClient(gapi).then(function() {
                    resolve();
                  }, function(initClientError) {
                    reject(initClientError);
                  }
                );
              });
          });
        }
      });
    }
    return _ensureGApi;
  };


  this.ensureAuthorized = function(scope) {
    return new Promise((resolve, reject) => {
      ensureGApi().then(function() {
        var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        if (isSignedIn) {
          var user = GoogleAuth.currentUser.get();
          var isAuthorized = user.hasGrantedScopes(scope);
          if (isAuthorized) {
            resolve();
          } else {
            reject({ message: "Current user is signed in but not authorized to access the required scopes" });
          }
        } else {
          GoogleAuth.signIn().then(function() {
            var user = GoogleAuth.currentUser.get();
            var isAuthorized = user.hasGrantedScopes(scope);
            if (isAuthorized) {
              resolve();
            } else {
              reject({ message: "Current user is signed in but not authorized to access the required scopes" });
            }
          }, function(signInError) {
            reject({ 
              message: "",
              error: signInError
            });
          });
        }
      }, function(ensureGApiError) {
        reject({
          message: "Unable to load Google API",
          error: ensureGApiError
        });
      });
    });
  };

  this.getSheetsApi = function() {
    return new Promise(function(resolve, reject) {
      self.ensureAuthorized(GAPI.sheets.scopes.readwrite).then(function() {
        resolve(gapi.client.sheets);
      }, function(err) {
        reject(err);
      });

      // ensureGApi().then(function() {
      //   if (isAuthorized) {
      //     // Make API request
      //     resolve(gapi.client.drive);
      //   } else {
      //     // seems to need a setTimeOut(.., 0) or else the browser blocks
      //     window.setTimeout(function() {
      //       GoogleAuth.signIn().then(function() {
      //         // Make API request
      //         resolve(gapi.client.drive);
      //       }, function(err) {
      //         reject(err);
      //       });
      //     }, 1);
      //   }
      // });
    });
  };

};


/** */
module.exports = GoogleOAuthService;
