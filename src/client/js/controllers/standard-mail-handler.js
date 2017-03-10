var List = require('../list/list.js');
var CardsConfig = require('./standard-mail-config.js');
var CardNames = require('./names.js');
var MergeTemplate = require('../data/merge-template/merge-template.js');



var StandardMailHandler = function(parent) {

  var self = this;
  var activeNode;
  var contentArea = parent;
  var cardsList;
  var cardRepository = CardsConfig.buildCardRepo(contentArea);
  var updateConfig = {};
  var type = 'Email';

  //***** private functions *****//

  this.init_ = function() {
    cardRepository[CardNames.title].setValidation(cardValidator);
    cardRepository[CardNames.sheet].setValidation(cardValidator);
    cardRepository[CardNames.row].setValidation(cardValidator);

    cardsList = new List();
    cardsList.add(CardNames.title);
    cardsList.add(CardNames.sheet);
    cardsList.add(CardNames.row);
    cardsList.add(CardNames.to);
    cardsList.add(CardNames.subject);
    cardsList.add(CardNames.body);
    cardsList.add(CardNames.conditional);
    cardsList.add(CardNames.sendNow);

    activeNode = cardsList.head;
    show(activeNode.data);
  };

  var cardValidator = function(card) {
    if (card.getValue() == '') {
      return false;
    }

    return true;
  };

  var show = function(name) {
    hideAll();
    cardRepository[name].show();
  };

  var hideAll = function() {
    for (var name in cardRepository) {
      if (cardRepository.hasOwnProperty(name)) {
        cardRepository[name].hide();
      }
    }
  }

  //***** public functions *****//

  this.setMergeTemplate = function(template) {
    updateConfig = template.toConfig();
    cardRepository[CardNames.title].setValue(updateConfig.mergeData.title);
    cardRepository[CardNames.sheet].setValue(updateConfig.mergeData.sheet);
    cardRepository[CardNames.row].setValue(updateConfig.mergeData.headerRow);
    cardRepository[CardNames.to].setValue({
      to: updateConfig.mergeData.data.to,
      cc: updateConfig.mergeData.data.cc,
      bcc: updateConfig.mergeData.data.bcc
    });
    cardRepository[CardNames.subject].setValue(updateConfig.mergeData.data.subject);
    cardRepository[CardNames.body].setValue(updateConfig.mergeData.data.body);

    if (updateConfig.mergeData.conditional != null) {
      cardRepository[CardNames.conditional].check();
      cardRepository[CardNames.conditional].setValue(updateConfig.mergeData.conditional);
    }
    else {
      cardRepository[CardNames.conditional].uncheck();
    }

    // Load headers TODO
  };

  this.getMergeTemplate = function() {
    var toVals = cardRepository[CardNames.to].getValue();
    return new MergeTemplate(
      Object.assign({}, updateConfig, {
        mergeData: {
          title: cardRepository[CardNames.title].getValue(),
          sheet: cardRepository[CardNames.sheet].getValue(),
          headerRow: cardRepository[CardNames.row].getValue(),
          conditional: cardRepository[CardNames.conditional].getValue(),
          type: type,
          data: {
            to: toVals.to,
            cc: toVals.cc,
            bcc: toVals.bcc,
            subject: cardRepository[CardNames.subject].getValue(),
            body: cardRepository[CardNames.body].getValue()
          }
        }
      }
    ));
  };

  this.next = function() {
    if (self.isLast()) {
      return;
    }

    cardRepository[activeNode.data].hide();
    activeNode = activeNode.next;
    cardRepository[activeNode.data].show();

    return activeNode;
  };

  this.back = function() {
    if (self.isFirst()) {
      return;
    }

    cardRepository[activeNode.data].hide();
    activeNode = activeNode.previous;
    cardRepository[activeNode.data].show();

    return activeNode;
  };

  this.isFirst = function() {
    return activeNode === cardsList.head;
  };

  this.isLast = function() {
    return activeNode === cardsList.tail;
  };

  this.validateState = function() {
    if (cardRepository[activeNode.data].isValid !== undefined) {
      return cardRepository[activeNode.data].isValid();
    }
    return true;
  };

  this.init_();
};

module.exports = StandardMailHandler;
