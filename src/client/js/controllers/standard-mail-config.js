var CardNames = require('./names.js');
var InputCard = require('../card/card-input.js');
var TitledCard = require('../card/card-titled.js');
var TextareaCard = require('../card/card-textarea.js');
var ConditionalInputCard = require('../card/conditional-input-card.js');
var Snackbar = require('../views/snackbar/snackbar.js');
var HeaderService = require('../services/header-service.js');
var SheetsService = require('../services/sheets-service.js');
var EmailService = require('../services/email-service.js');

var CardsConfig = {};

CardsConfig.maxResults = 5;

/**
 * Initializes a Card repository.
 *
 * @return {Object<string, Card>} The repository used for storing Cards. These may not be in the program flow.
 */
CardsConfig.buildCardRepo = function(contentArea) {

  var repo = {};
  var hService = new HeaderService();
  var sService = new SheetsService();
  var eService = new EmailService();

  repo[CardNames.title] = new InputCard(contentArea, {
    title: 'What should this merge be called?',
    help: 'This title will help you differentiate this merge from others.',
    label: 'Title...'
  });

  repo[CardNames.sheet] = new InputCard(contentArea, {
    title: 'Which Sheet are we sending from?',
    help: 'This Sheet must contain all the information you may want to send in an email.',
    label: 'Sheet...'
  });
  sService.get().then(
    function(result) {
      repo[CardNames.sheet].setAutocomplete({
        results: result,
        maxResults: CardsConfig.maxResults,
        triggerOnFocus: true
      });
    },
    function(err) {
      console.error(err);
    }
  ).done();


  repo[CardNames.to] = new InputCard(contentArea, {
    title: 'Who are you sending to?',
    help: 'This is the column filled with the email addresses of the recipients.',
    label: 'To...',
    error: {
      hint: 'Must be a single header surrounded by whack whacks',
      pattern: '<<[^<>]*>>'
    }
  });

  repo[CardNames.row] = new InputCard(contentArea, {
    title: 'Which row contains your header titles?',
    label: 'Header row...',
    error: {
      hint: 'Must be a number greater than 0',
      pattern: '[1-9][0-9]*'
    }
  });
  repo[CardNames.row].setValue(1); // Default row 1.
  repo[CardNames.row].attachEvent('card.hide', function(event, card) {
    // Set the header row
    var row = card.getValue();
    var sheet = repo[CardNames.sheet].getValue();

    hService.get(sheet, row).then(
      function(values) {
        repo[CardNames.to].setAutocomplete({
          results: values,
          trigger: '<<',
          prepend: '<<',
          append: '>>',
          maxResults: CardsConfig.maxResults,
          triggerOnFocus: true
        });

        repo[CardNames.subject].setAutocomplete({
          results: values,
          trigger: '<<',
          prepend: '<<',
          append: '>>',
          maxResults: CardsConfig.maxResults
        });

        repo[CardNames.body].setAutocomplete({
          results: values,
          trigger: '<<',
          prepend: '<<',
          append: '>>',
          maxResults: CardsConfig.maxResults
        });

        repo[CardNames.conditional].setAutocomplete({
          results: values,
          trigger: '<<',
          prepend: '<<',
          append: '>>',
          maxResults: CardsConfig.maxResults,
          triggerOnFocus: true
        });
      },
      function(err) {
        console.error(err);
      }
    ).done();

  });

  repo[CardNames.subject] = new InputCard(contentArea, {
    title: 'What\'s your subject?',
    help: 'Recipients will see this as the subject line of the email. Type "<<" to see a list of column names. ' +
        'These tags will be swapped out with the associated values in the Sheet.',
    label: 'Subject...'
  });

  repo[CardNames.body] = new TextareaCard(contentArea, {
    title: 'What\'s in the body?',
    help: 'Recipients will see this as the body of the email. Type "<<" to see a list of column names. These tags ' +
        'will be swapped out with the associated values in the Sheet.',
    label: 'Body...'
  });

  repo[CardNames.sendNow] = new TitledCard(contentArea, {
    title: 'Save this merge?',
    paragraphs: [
      'This will save the merge. It won\'t send any emails yet.',
       'If you would like to send yourself a test email, click the option from the lower right.'
    ]
  });
  repo[CardNames.sendNow].addOption('Send test email', function() {
    var sheet = repo[CardNames.sheet].getValue();
    var row = repo[CardNames.row].getValue();
    var subject = repo[CardNames.subject].getValue();
    var body = repo[CardNames.body].getValue();

    eService.sendTest(sheet, row, subject, body).then(
      function() {
        Snackbar.show('Test email sent.');
      },
      function(err) {
        console.error(err);
      }
    ).done();
  });

  repo[CardNames.shouldSend] = new InputCard(contentArea, {
    title: 'Which column determines whether an email should be sent?',
    paragraphs: [
      'Mailman regularly checks whether an email needs to be sent. ' +
          'Please specify a column that determines when an email should be sent.',
      'Note that Mailman looks for the value TRUE to determine when to send an email.'
    ],
    label: 'Send?',
    error: {
      hint: 'Must be a single header surrounded by whack whacks',
      pattern: '<<[^<>]*>>'
    }
  });

  repo[CardNames.conditional] = new ConditionalInputCard(contentArea, {
    title: 'Conditional column (optional)',
    help: 'This column is used to determine when to send an email. If a given row reads TRUE, ' +
      'Mailman will send an email. Any other value and Mailman won\'t send. This can be useful for scheduling your ' +
      'merges or ensuring you don\'t accidentally email someone twice.',
    label: 'Conditional',
    error: {
      hint: 'Must be a single header surrounded by whack whacks',
      pattern: '<<[^<>]*>>'
    },
    enabled: true,
    checkboxText: 'Filter this merge?'
  });

  return repo;
};


/** */
module.exports = CardsConfig;
