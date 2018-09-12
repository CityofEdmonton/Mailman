
// This is the logging spreadsheet I'm using.
var logSheet;
var maxRows = 3000;
var logger = getLogger();

function log(text) {
  try {
    getLogSheet();
    Logger.log(logSheet);
    if (logSheet == null) {
      return;
    }


    if (logSheet.getLastRow() > maxRows) {
      var sheet = logSheet.getSheets()[0];
      sheet.getRange(2, 1, logSheet.getLastRow() - 1, logSheet.getLastColumn()).clear();
    }

    logSheet.appendRow([new Date().toString().slice(0, -15), text, Session.getActiveUser().getEmail(), MAILMAN_VERSION]);
  }
  catch (e) {
    // This tends to be the user not having logging permissions to the Sheet.
    throw e;
  }
}

// the structured logging object
var _logger;
function getLogger() {
  if (!_logger) {
    // initialize logging
    var logConfig = structuredLog.configure();

    // try to get the current user 
    var userEmail =  Session.getActiveUser().getEmail();
    if (!userEmail) {
      userEmail = PropertiesService.getUserProperties().getProperty("userEmail");
    }  
    if (!userEmail) {
      // the following "trick" is from https://stackoverflow.com/questions/12300777/determine-current-user-in-apps-script:
      var protection = null;
      try {
        protection = SpreadsheetApp.getActive().getRange("A1").protect();
        // tric: the owner and user can not be removed
        protection.removeEditors(protection.getEditors());
        var editors = protection.getEditors();
        if(editors.length === 2) {
          var owner = SpreadsheetApp.getActive().getOwner();
          editors.splice(editors.indexOf(owner),1); // remove owner, take the user
        }
        userEmail = editors[0];
        // saving for better performance next run
        if (userEmail) {
          PropertiesService.getUserProperties().setProperty("userEmail",userEmail);
        }
      }
      catch (err) {
        console.warn("Unable to determine current user", err);
      }
      finally {
        if (protection) {
          protection.remove();
        }
      }
    }

    // final logging options and create the logger
    logConfig = logConfig.suppressErrors(false)
      .enrich(function() {
        if (!MAILMAN_SESSION_ID) {
          // this is normally set in events.openSidebar()
          MAILMAN_SESSION_ID = PropertiesService.getUserProperties().getProperty(MAILMAN_SESSION_ID_KEY);
        }
        return {
          'Version': MAILMAN_VERSION,
          'UserEmail': userEmail,
          'SessionId': MAILMAN_SESSION_ID  
        };
      });

      logConfig = logConfig.writeTo(new structuredLog.ConsoleSink());

      // set up Firestore as configured
      var props = PropertiesService.getScriptProperties();
      var firebaseOptions = {
        url: props.getProperty("log-firebase-url"),
        projectId: props.getProperty("log-firebase-project-id"),
        email: props.getProperty("log-firebase-email"),
        secret: props.getProperty("log-firebase-secret"),
        restrictedToMinimumLevel: props.getProperty("log-firebase-min-level"),
      };
      // other options
      firebaseOptions.includeProperties = true;
      if (!firebaseOptions.url)
      console.warn("log-firebase-url was not specified in project properties");
      else if (!firebaseOptions.email)
        console.warn("log-firebase-email was not specified in project properties");
      else if (!firebaseOptions.secret)
        console.warn("log-firebase-secret was not specified in project properties");
      else {
        //console.log("starting firebase sink...");
        var firebaseSink = new structuredLog.FirebaseSink(firebaseOptions);
        logConfig = logConfig.writeTo(firebaseSink);
      }
  
      // set up seq sink
      var seqOptions = {
        url: props.getProperty("log-seq-url"),
        apiKey: props.getProperty("log-seq-key")
      };
      if (!seqOptions.url)
        console.warn("log-seq-url was not specified in project properties");
      else {
        //console.log("starting seq sink...");
        var mySeqSink = new SeqSink(seqOptions);
        logConfig = logConfig.writeTo(mySeqSink);
      }

    // this initializes the Log variable set up in global-variables.js
    _logger = logConfig.create();
  }
  return _logger;
}

function getLogSheet() {
  if (logSheet == null) {
    var url = SettingsService.getLogURL();
    Logger.log(url);

    if(url === null) {
      return;
    }

    try {
      // This catches the event where the log sheet has been deleted.
      logSheet = SpreadsheetApp.openByUrl(url);
    }
    catch (e) {
      Logger.log(e);
      return;
    }
  }
}
