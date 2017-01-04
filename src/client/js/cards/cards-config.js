var CardNames = require('./card-names.js');
var InputCard = require('../card/card-input.js');
var TitledCard = require('../card/card-titled.js');
var TextareaCard = require('../card/card-textarea.js');

var CardsConfig = {};


/**
 * Initializes a Card repository.
 *
 * @return {Object<string, Card>} The repository used for storing Cards. These may not be in the program flow.
 */
CardsConfig.buildCardRepo = function(contentArea) {

  var repo = {};

  repo[CardNames.welcome] = new TitledCard(contentArea, {
    title: 'Welcome!',
    help: 'Help will be displayed here normally. Since this is just the welcome page, there isn\'t much to know!',
    paragraphs: [
      'Welcome to Mailman! This application helps users easily create mail merges. It aims to be easy to use, ' +
          'while also providing advanced options for power users.',
      'To get started, simply click NEXT down below.'
    ]
  });

  repo[CardNames.sheet] = new InputCard(contentArea, {
    title: 'Which Sheet are we sending from?',
    help: 'This Sheet must contain all the information you may want to send in an email.',
    label: 'Sheet...'
  });

  repo[CardNames.to] = new InputCard(contentArea, {
    title: 'Who are you sending to?',
    help: 'This is the column filled with the email addresses of the recipients.',
    label: 'To...'
  });

  repo[CardNames.row] = new InputCard(contentArea, {
    title: 'Which row contains your header titles?',
    label: 'Header row...'
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
    title: 'Send emails now?',
    paragraphs: [
      'This will send out an email blast right now. ' +
          'If you\'d like, you can send the emails at a later time, or even based upon a value in a given column. ' +
          'Just select the related option from the bottom right.'
    ]
  });

  repo[CardNames.triggerSetup] = new TitledCard(contentArea, {
    title: 'Repeated emails.',
    paragraphs: [
      'Mailman will now guide you through the process of creating your own repeated mail merge.',
      'This feature can be used to set up an email-based reminder system.'
    ]
  });

  repo[CardNames.shouldSend] = new InputCard(contentArea, {
    title: 'Which column determines whether an email should be sent?',
    paragraphs: [
      'Mailman regularly checks whether an email needs to be sent. ' +
          'Please specify a column that determines when an email should be sent.',
      'Note that Mailman looks for the value TRUE to determine when to send an email.'
    ],
    label: 'Send?'
  });

  repo[CardNames.lastSent] = new InputCard(contentArea, {
    title: 'Where should Mailman keep track of the previously sent email?',
    paragraphs: [
      'Every time Mailman sends an email, it records the time in a cell.',
      'Using the timestamp, you can determine whether you want to send another email.'
    ],
    label: 'Last sent...'
  });

  repo[CardNames.triggerConfirmation] = new TitledCard(contentArea, {
    title: 'Submit the trigger?',
    paragraphs: [
      'This will regularly check the previously mentioned column for the value TRUE. ' +
          'When TRUE is found in the column, an email is sent out with that row\'s information.'
    ]
  });

  return repo;
};


/** */
module.exports = CardsConfig;
