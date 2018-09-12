(function (global, factory) {
    if (!global.structuredLog) {
      global.structuredLog = {};
    }    
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory(global.structuredLog));
  }(this, (function (exports) { 'use strict'; 
  
    /**
     * Checks if a log event level includes the target log event level.
     * @param {LogEventLevel} level The level to check.
     * @param {LogEventLevel} target The target level.
     * @returns True if the checked level contains the target level, or if the checked level is undefined.
     */
    function isEnabled(level, target) {
      return typeof level === 'undefined' || (level & target) === target;
    }
  
    var FirestoreSink = /** @class */ (function () {
      function FirestoreSink(options) {
        this.options = options || {};
        if (!this.options.projectId) {
          throw 'FirestoreSink options.projectId parameter is required, and must be the project id of the Firestore project';
        }
        if (!this.options.email) {
          throw 'FirestoreSink options.email parameter is required';
        }
        if (!this.options.key) {
          throw 'FirestoreSink options.key parameter is required, and must be the private key of a service account with rights to the DataStore API';
        }
        if (!this.options.database) {
          this.options.database = '(default)';
        }
        if (!this.options.collection) {
          this.options.collection = 'log';
        }
  
        this.authToken = getAuthToken(this.options.email, this.options.key);
      }
  
      function getAuthToken(email, key) {
        const jwtInfo = createJwt(email, key);
      
        const options = {
        'method' : 'post',
        'payload' : 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwtInfo.jwt,
        'muteHttpExceptions' : true
        };
      
        var response = null;
        try {
          response = UrlFetchApp.fetch("https://www.googleapis.com/oauth2/v4/token/", options);
        } catch (ex) {
          console.error("Error getting authToken", ex);
          return null;
        }
        
        var responseText = response.getContentText();
        //console.log("responseText: " + responseText);
        const responseObj = JSON.parse(responseText);
      
        return {
          token: responseObj["access_token"],
          expiry: jwtInfo.expiry
        };
      }
      
      // http://grahamearley.website/blog/2017/10/18/firestore-in-google-apps-script.html#creating-the-jwt
      function createJwt(email, key) {
        const jwtHeader = {"alg" : "RS256", "typ" : "JWT"};
        
        const now = new Date();
        const nowSeconds = now.getTime() / 1000;
        
        now.setHours(now.getHours() + 1);
        const oneHourFromNowSeconds = now.getTime() / 1000;
        
        const jwtClaim = {
          "iss" : email,
          "scope" : "https://www.googleapis.com/auth/datastore",
          "aud" : "https://www.googleapis.com/oauth2/v4/token/",
          "exp" : oneHourFromNowSeconds,
          "iat" : nowSeconds
        }
        
        const jwtHeaderBase64 = base64EncodeSafe(JSON.stringify(jwtHeader));  
        const jwtClaimBase64 = base64EncodeSafe(JSON.stringify(jwtClaim));
        
        const signatureInput = jwtHeaderBase64 + "." + jwtClaimBase64;

        // ensure escaped newlines are replaced with actual newlines
        key = key.split("\\n").join("\n");   
        
        const signature = Utilities.computeRsaSha256Signature(signatureInput, key);
        const encodedSignature = base64EncodeSafe(signature);
        
        const jwt = signatureInput + "." + encodedSignature;
              
        return {jwt: jwt, expiry: oneHourFromNowSeconds};
      }
  
      function base64EncodeSafe(str) {
        // This uses the "Utilities" class provided by Google apps script.
        // In order to support other environments (i.e. node) we will have to rewrite this
        var encoded = Utilities.base64EncodeWebSafe(str);
        return encoded.replace(/=/g, "");
      }
  
      function wrapString(string) {
        return {"stringValue" : string};
      }
      
      function wrapBoolean(boolean) {
        return {"booleanValue" : boolean};
      }
      
      function wrapInt(int) {
        return {"integerValue" : int};
      }
      
      function wrapDouble(double) {
        return {"doubleValue" : double};
      }
      
      function wrapNumber(num) {
        if (isInt(num)) {
          return wrapInt(num);
        } else {
          return wrapDouble(num);           
        }
      }
      
      function wrapObject(object) {
        if (!object) {
          return {"nullValue" : null};
        }
        
        return {"mapValue" : createFirestoreObject(object)};
      }
  
      // Assumes n is a Number.
      function isInt_(n) {
        return n % 1 === 0;
      }
  
      function createFirestoreObject(object) {
        const keys = Object.keys(object);
        const firestoreObj = {};
          
        firestoreObj["fields"] = {};
          
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var val = object[key];
          
          var type = typeof(val);
          
          switch(type) {
            case "string":
              firestoreObj["fields"][key] = wrapString(val);
              break;
            case "object":
              firestoreObj["fields"][key] = wrapObject(val);
              break;
            case "number":
              firestoreObj["fields"][key] = wrapNumber(val);
              break;
            case "boolean":
              firestoreObj["fields"][key] = wrapBoolean(val);
              break;
            default:
              break;
          }
        }
          
        return firestoreObj
      }  
  
      function createDocument(documentData) {
        const firestoreObject = createFirestoreObject(documentData);
        var baseUrl = 'https://firestore.googleapis.com/v1beta1/projects/' + 
          this.options.projectId + 
          '/databases/' + 
          this.options.database +
          '/documents/' + 
          this.options.collection;
  
        const options = {
         'method' : 'post',
         'muteHttpExceptions' : true,
         'payload': JSON.stringify(firestoreObject),
         'headers': {'content-type': 'application/json', 'Authorization': 'Bearer ' + this.authToken.token}
        };
        
        try {
          var result = UrlFetchApp.fetch(baseUrl, options);
          return result;
        }
        catch (ex) {
          console.error("Unable to log to Firestore database", ex);
        }
      }
  
      FirestoreSink.prototype.emit = function (events) {
        // validate authToken here
        if (!this.authToken || !this.authToken.token) {
          console.warn("Not logging to Firestore because there is no valid authToken");
          return;
        }

        for (var i = 0; i < events.length; ++i) {
          var e = events[i];
          if (!isEnabled(this.options.restrictedToMinimumLevel, e.level))
              continue;
          var documentData = { };
          if (this.options.includeProperties) {
            for (var key in e.properties) {
              if (e.properties.hasOwnProperty(key)) {
                documentData[key] = e.properties[key];
              }
            }
          }
          // always include timestamp in the data
          documentData["Timestamp"] = e.timestamp;
          if (e.error instanceof Error) {
            documentData.Error = e.error;
          }
          var output = e.messageTemplate.render(e.properties);
          if (this.options.includeTimestamps) {
            output = e.timestamp + " " + output;
          } 
          documentData.Message = output;
          documentData.MessageTemplate = e.messageTemplate.raw;
  
          switch (e.level) {
              case exports.LogEventLevel.fatal:
                documentData.Level = 'Fatal';
                break;
              case exports.LogEventLevel.error:
                documentData.Level = 'Error';
                break;
              case exports.LogEventLevel.warning:
                documentData.Level = 'Warning';
                break;
              case exports.LogEventLevel.information:
                documentData.Level = 'Information';
                break;
              case exports.LogEventLevel.debug:
                documentData.Level = 'Debug';
                break;
              case exports.LogEventLevel.verbose:
                documentData.Level = 'Verbose';
                break;
              default:
                documentData.Level = 'Log';
                break;
          }
          createDocument.call(this, documentData);
        }    
      };
      FirestoreSink.prototype.flush = function () {
      };
      return FirestoreSink;
    }());
  
  
    exports.FirestoreSink = FirestoreSink
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  })));