/**
 * This module exports a function that assists in setting up a series of Cards.
 * This is one of the modules that would need to be swapped out if Mailman were to be repurposed.
 *
 * @author {@link https://github.com/dchenier|Dan Chenier}
 * @module
 */


var CardNames = require('./names.js');
var PreviewCard = require('../card/card-preview.js');
var TitledCard = require('../card/card-titled.js');
var TextareaCard = require('../card/card-textarea.js');
var ConditionalInputCard = require('../card/conditional-input-card.js');
var ToCard = require('../card/to-cc-bcc.js');
var Snackbar = require('../views/snackbar/snackbar.js');
var Util = require('../util/util.js');



/**
 * The base Object that handles the creation of a map of Cards.
 *
 * @static
 * @type {Object}
 */
var CardsConfig = {};

/**
 * Initializes a Card repository.
 *
 * @static
 * @return {Object<string, Card>} The repository used for storing Cards. The map is between the names found
 * in CardNames and the created Card. These are typically used for handling user setup.
 */
CardsConfig.buildCardRepo = function(contentArea,
    hService, 
    sService,   
    eService) { 

    var repo = {};        

    repo[CardNames.title] = new PreviewCard(contentArea, {
        title: 'Preview',
        //help: 'This title will help you differentiate this merge from others.',
        label: 'Preview...'
    });

    return repo;
};

/** */
module.exports = CardsConfig;