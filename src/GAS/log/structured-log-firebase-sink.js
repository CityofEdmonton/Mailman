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
  
    var FirebaseSink = /** @class */ (function () {
      function FirebaseSink(options) {
        this.options = options || {};
        if (!this.options.url) {
          throw 'FirebaseSink options.url parameter is required, should be of the form https://<project>.firebaseio.com';
        }
        if (!this.options.email) {
          throw 'FirebaseSink options.email parameter is required';
        }
        if (!this.options.secret) {
          throw 'FirebaseSink options.secret parameter is required';
        } 

        if (!this.options.path) {
          this.options.path = 'log';
        }

        try {
          this.firebaseApp = FirebaseApp.getDatabaseByUrl(this.options.url, this.options.secret);
        }
        catch (ex) {
          console.error("Error getting connecting to firebase app", ex);
        }
        
      }
  
      FirebaseSink.prototype.emit = function (events) {
        if (!this.firebaseApp) {
          // no point in logging if there is nowhere to log to.
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

          // actually write to the database here
          this.firebaseApp.pushData(this.options.path, documentData);
        }    
      };
      FirebaseSink.prototype.flush = function () {
      };
      return FirebaseSink;
    }());
  
  
    exports.FirebaseSink = FirebaseSink
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  })));