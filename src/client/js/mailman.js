/**
 * This module exports the MailMan object.
 *
 * @author {@link https://github.com/j-rewerts|Jared Rewerts}
 * @module
 */

 // ServiceFactory is injected by Gulp, either a mock implementation or the real thing
 // depending on configuration (--dev or not)
var ServiceFactory = require('./ServiceFactory.js');


var MergeTemplateContainer = require('./data/merge-template-container.js');
var MergeTemplateService = require('./services/merge-template-service.js');
var EmailService = require('./services/email-service.js');
var MergeTemplatesView = require('./views/merge-template/merge-templates-list-view.js');
var CardsView = require('./views/merge-setup/cards-view.js');
var SettingsView = require('./views/settings/settings-view.js');
var ActionBar = require('./views/action-bar/action-bar.js');
var Snackbar = require('./views/snackbar/snackbar.js');
var Dialog = require('./views/dialog/dialog.js');
var LoadingScreen = require('./views/loading/loading-screen.js');
var baseHTML = require('./main.html');
var PubSub = require('pubsub-js');
var StandardMailHandler = require('./controllers/standard-mail-handler.js');
var DocumentMailHandler = require('./controllers/document-mail-handler.js');
var TypeToHandler = require('./controllers/type-to-handler.js');


/**
 * The base Object for the app. It handles much of the event wiring, as well as app initialization.
 *
 * @constructor
 * @param {jQuery} appendTo The region to append Mailman to.
 */
var MailMan = function(appendTo) {

  // ***** CONSTANTS ***** //

  //***** LOCAL VARIABLES *****//

  var self = this;
  var actionBar = ActionBar;
  var snackbar = Snackbar;
  var ls = LoadingScreen;

  var serviceFactory = new ServiceFactory();

  var mtService = serviceFactory.getMergeTemplateService();
  var emailService = new EmailService();
  var templatesContainer;

  var mtListView;
  var cardsView;
  var settingsView;
  var runDialog;
  var deleteDialog;
  var repeatDialog;

  // jquery objects
  var base = $(baseHTML);
  var header = base.find('[data-id="header"]');


  //***** PUBLIC *****//

  window.runAllTemplates = mtService.runMerges;

  this.init = function(appendTo) {

    appendTo.append(base);

    actionBar.init(header);
    snackbar.init(base);
    mtListView = new MergeTemplatesView(base);
    
    settingsView = new SettingsView(base, 
      serviceFactory.getSettingsService(),
      serviceFactory.getMetadataService());
      
    runDialog = new Dialog(appendTo, 'Run this merge?', 'This will run your merge template. ' +
      'Emails will be sent to everyone in your specified sheet. Are you sure you want to merge?');

    deleteDialog = new Dialog(appendTo, 'Delete this merge template?', 'This will remove this merge template. ' +
      'You won\'t be able to send emails using it anymore. Are you sure you want to delete this merge template?');

    repeatDialog = new Dialog(appendTo, 'Repeatedly run this merge template?', 'This will cause this merge template ' +
      'to run regularly. This is an advanced feature and requires training. Please see IT Knowledge Management for ' +
      'tips on training and use. Are you sure you want to repeatedly run this merge template?');

    // PubSub
    PubSub.subscribe('Rules.add', function(msg, data) {
      snackbar.show('Merge template created.');

      showListView();

      if (cardsView != null) {
        cardsView.cleanup();
      }
    });
    PubSub.subscribe('Rules.run', function(msg, data) {
      snackbar.show('Running merge "' + data.mergeData.title + '".');
    });
    PubSub.subscribe('Rules.update', function(msg, data) {
      snackbar.show('Merge template updated.');

      showListView();

      if (cardsView != null) {
        cardsView.cleanup();
      }
    });
    PubSub.subscribe('Rules.updateFailed', function(msg, data) {
      snackbar.show('You don\'t have permission to edit that merge template.');

      showListView();

      if (cardsView != null) {
        cardsView.cleanup();
      }
    });

    actionBar.setSettingsHandler(showSettingsView);

    mtListView.setEmailHandler(function(e) {
      cardsView = createCardsView(base, StandardMailHandler);
      showCardsView();
    });
    mtListView.setDocumentHandler(function(e) {
      cardsView = createCardsView(base, DocumentMailHandler);
      showCardsView();
    });

    mtListView.setDeleteDialog(deleteDialog);
    mtListView.setDeleteHandler(function(template) {
      snackbar.show('Deleting merge template...');
      templatesContainer.remove(template);
    });

    mtListView.setEditHandler(function(template) {
      var type = template.toConfig().mergeData.type;
      cardsView = createCardsView(base, TypeToHandler[type.toLowerCase()], template);
      showCardsView();
    });

    mtListView.setRunDialog(runDialog);
    mtListView.setRunHandler(function(template) {
      // This only occurs when the user clicks OK.
      emailService.send(template);
      PubSub.publish('Rules.run', template.toConfig());
    });

    mtListView.setRepeatDialog(repeatDialog);
    mtListView.setRepeatHandlers(
      function(template) {
        snackbar.show('Turning ON repeated merge...');
        templatesContainer.toggleRepeat(template);
      },
      function(template) {
        snackbar.show('Turning OFF repeated merge...');
        templatesContainer.toggleRepeat(template);
      });

    mtService.getAll().then(
      function(result) {
        templatesContainer = new MergeTemplateContainer(result, serviceFactory);
        mtListView.setContainer(templatesContainer);
        ls.hide();
      },
      function(err) {
        console.error(err);
      }
    ).done();

    showListView();
  };

  //***** PRIVATE *****//

  var showListView = function() {
    mtListView.show();
    settingsView.hide();

    if (cardsView != null) {
      cardsView.hide();
    }
  };

  var showSettingsView = function() {
    settingsView.show();
    mtListView.hide();

    if (cardsView != null) {
      cardsView.hide();
    }
  };

  var showCardsView = function() {
    mtListView.hide();
    settingsView.hide();

    if (cardsView != null) {
      cardsView.show();
    }
  };

  var createCardsView = function(base, handler, data) {

    var view = new CardsView(base, handler, data, serviceFactory);

    view.done().then(
      function(template) {
        if (templatesContainer.indexOf(template.toConfig().id) !== -1) {
          templatesContainer.update(template);
        }
        else {
          templatesContainer.add(template.toConfig());
        }
      },
      function() {
        view.cleanup();

        mtListView.show();
        view.hide();
      }
    ).done();

    return view;
  };

  this.init(appendTo);
};


/**  */
module.exports = MailMan;
