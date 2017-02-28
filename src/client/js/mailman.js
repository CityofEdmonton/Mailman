
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

// Handlers
var StandardMailHandler = require('./controllers/standard-mail-handler.js');


var MailMan = function(appendTo) {

  // ***** CONSTANTS ***** //

  //***** LOCAL VARIABLES *****//

  var self = this;
  var actionBar = ActionBar;
  var snackbar = Snackbar;
  var ls = LoadingScreen;

  var mtService = new MergeTemplateService();
  var emailService = new EmailService();
  var templatesContainer;

  var mtListView;
  var cardsView;
  var settingsView;
  var runDialog;
  var deleteDialog;

  // jquery objects
  var base = $(baseHTML);
  var header = base.find('[data-id="header"]');


  //***** PUBLIC *****//

  /**
   * Performs basic set up of the Mailman environment.
   *
   * @constructor
   */
  this.init = function(appendTo) {

    appendTo.append(base);

    actionBar.init(header);
    snackbar.init(base);
    mtListView = new MergeTemplatesView(base);

    settingsView = new SettingsView(base);
    runDialog = new Dialog(appendTo, 'Run this merge?', 'This will run your merge template. ' +
      'Emails will be sent to everyone in your specified sheet. Are you sure you want to merge?');

    deleteDialog = new Dialog(appendTo, 'Delete this merge template?', 'This will remove this merge template. ' +
      'You won\'t be able to send emails using it anymore. Are you sure you want to delete this merge template?');

    // PubSub
    PubSub.subscribe('Rules.delete', function(msg, data) {
      snackbar.show('Merge template deleted.');
    });
    PubSub.subscribe('Rules.add', function(msg, data) {
      snackbar.show('Merge template created.');
    });
    PubSub.subscribe('Rules.update', function(msg, data) {
      snackbar.show('Merge template updated.');
    });
    PubSub.subscribe('Rules.run', function(msg, data) {
      snackbar.show('Running merge "' + data.mergeData.title + '".');
    });

    PubSub.subscribe('Rules.add', function(msg, data) {
      cardsView.cleanup();
      mtListView.show();

      if (cardsView != null) {
        cardsView.hide();
      }
    });

    PubSub.subscribe('Rules.update', function(msg, data) {
      cardsView.cleanup();
      mtListView.show();

      if (cardsView != null) {
        cardsView.hide();
      }
    });

    actionBar.setSettingsHandler(function() {
      settingsView.show();
      mtListView.hide();

      if (cardsView != null) {
        cardsView.hide();
      }
    });

    mtListView.setInstantHandler(function(e) {
      cardsView = createCardsView(base, StandardMailHandler);

      mtListView.hide();
      cardsView.show();
    });

    mtListView.setDeleteHandler(function(template) {
      deleteDialog.show().then(
        function() {
          // This only occurs when the user clicks OK.
          templatesContainer.remove(template);
        },
        function(err) {
          console.error(err);
        }
      ).done();
    });

    mtListView.setEditHandler(function(template) { // TODO
      cardsView = createCardsView(base, StandardMailHandler, template);
      mtListView.hide();
      cardsView.show();
    });

    mtListView.setRunHandler(function(template) {
      runDialog.show()
        .then(function() {
          // This only occurs when the user clicks OK.
          emailService.send(template);
          PubSub.publish('Rules.run', template.toConfig()); // TODO
        }).done();
    });

    mtService.getAll().then(
      function(result) {
        templatesContainer = new MergeTemplateContainer(result);
        mtListView.setContainer(templatesContainer);
        ls.hide();
      },
      function(err) {
        console.error(err);
      }
    ).done();

    mtListView.show();
  };

  //***** PRIVATE *****//

  var createCardsView = function(base, handler, data) {

    var view = new CardsView(base, handler, data);

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
