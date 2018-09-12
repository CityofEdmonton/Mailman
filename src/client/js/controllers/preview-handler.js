//import { setInterval } from 'timers';

/**
 * This module exports an Object used for initializing the mergeTemplate for emails set up.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */

var List = require('../list/list.js');
var CardsConfig = require('./preview-config.js');
var CardNames = require('./names.js');
var MergeTemplate = require('../data/merge-template/merge-template.js');
var logger = require('../services/logger-service.js')


/**
 * The handler used for previewing merge templates
 *
 * @constructor
 * @param {jQuery} parent The jquery object that will contain all the Cards.
 * @param serviceFactory The service factory to get services
 */
var PreviewHandler = function(parent, serviceFactory) {

    var self = this;
    var activeNode;
    var contentArea = parent;
    var cardsList;
    var sheetsSerivice = serviceFactory.getSheetsService(),
        mergeTemplateService = serviceFactory.getMergeTemplateService();

    var cardRepository = CardsConfig.buildCardRepo(contentArea,
      serviceFactory.getHeaderService(),
      sheetsSerivice,
      serviceFactory.getEmailService());
    var templateConfig = {};
    var type = 'Preview';

    //***** private functions *****//

  this.init_ = function() {

    debugger;
    var x = logger;
    logger.info('test logging clientside.');

    // if we ever want more cards we can put them here
    cardsList = new List();
    cardsList.add(CardNames.title);
    activeNode = cardsList.head;
    show(activeNode.data);

    // poll for previewing merge templates
    this._previewPoll = window.setInterval(pollToPreviewActiveCell, 500);    
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

  var pollToPreviewActiveCell = function() {
    if (self._mergeTemplateId) {
      // has the active cell changed?
      sheetsSerivice.getActiveCell().then(cellRef => {
        if (self._currentCell !== cellRef) {
          self._currentCell = cellRef;
          // Are we in the right sheet?
          if (cellRef) {
            try {
              var split = cellRef.split('!');
              if (split.length > 1) {
                var sheet = split[0], cellRef = split[1];
                if (sheet && cellRef && self._mergeData.sheet === sheet) {
                  // ok, we have something new to preview!
                  var rowIndexInStr = /\d/.exec(cellRef);
                  if (rowIndexInStr && rowIndexInStr.index) {
                    var row = parseInt(cellRef.substr(rowIndexInStr.index));
                    mergeTemplateService.renderTemplate(self._mergeTemplateId, sheet, row).then(data => {
                      logger.info("Got rendered template");
                      setPreviewData(data);
                    }, error => {
                      logger.error(error, "Error rendering template, {ErrorMessage}", error);
                    });
                  }
                }  
              }
            } catch (ex) {
              logger.error(ex, "Error rendering template, {ErrorMessage}", ex);
            }
          }
        }
      }, err => {
        logger.error(err, "Unable to get active cell to determine if we should be previewing merge template, {ErrorMessage}", err);
      });
    }
  };

  var setPreviewData = function(data) {
    var mergeData = data || {};
    cardRepository[CardNames.title].setValue({
        subject: mergeData.subject,
        body: mergeData.body,
        to: mergeData.to,
        cc: mergeData.cc,
        bcc: mergeData.bcc,
        conditional: mergeData.conditional
    });
  };

  //***** public functions *****//
  /**
   * Sets the parent CardsView
   */
  this.setCardsView = function(cardsView) {
    this._cardsView = cardsView;
    $(cardsView).on('navigatingBack', e => {
      // remove the interval timer
      if (self._previewPoll) {
        window.clearInterval(self._previewPoll);
        delete self._previewPoll;        
      }
    });
  };

  /**
   * Sets the MergeTemplate to edit.
   *
   * @param {MergeTemplate} template The template to make edits to.
   */
  this.setMergeTemplate = function(template) {
    templateConfig = template.toConfig();    
    this._mergeData = templateConfig.mergeData;
    this._mergeTemplateId = template.getID();
  };

  /**
   * Displays the next Card. If the Card is the last one, nothing happens.
   *
   * @return {Node|undefined} The newly active Node.
   */
  this.next = function() {
    if (self.isLast()) {
      return;
    }

    cardRepository[activeNode.data].hide();
    activeNode = activeNode.next;
    cardRepository[activeNode.data].show();

    return activeNode;
  };  

 /**
   * Displays the previous Card. If the Card is the first one, nothing happens.
   *
   * @return {Node|undefined} The newly active Node.
   */
  this.back = function() {
    if (self.isFirst()) {
      return;
    }

    cardRepository[activeNode.data].hide();
    activeNode = activeNode.previous;
    cardRepository[activeNode.data].show();

    return activeNode;
  };

  /**
   * Determines if the active Card is the first Card.
   *
   * @return {boolean} True if the active Card is the first Card, false otherwise.
   */
  this.isFirst = function() {
    return activeNode === cardsList.head;
  };

  /**
   * Determines if the active Card is the last Card.
   *
   * @return {boolean} Returns true if the active Card is the last Card.
   */
  this.isLast = function() {
    return activeNode === cardsList.tail;
  };

  /**
   * Validates the currently active Card.
   *
   * @return {boolean} Returns true if the active Card is valid, false if it is invalid.
   */
  this.validateState = function() {
    if (cardRepository[activeNode.data].isValid !== undefined) {
      return cardRepository[activeNode.data].isValid();
    }
    return true;
  };


  this.init_();  
};


/** */
module.exports = PreviewHandler;