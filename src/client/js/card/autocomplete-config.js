


/**
 * This config object prepares a jqueryUI autocomplete object. I've added some notable features to the base jquery
 * implementation, such as:
 *  - pre and post tags. These surround a search term. (in my case << and >>)
 *  - Swapping terms into the middle of a block of text.
 * This code is the worst. TODO refactor, if time permits.
 *
 * @param {InputCard|TextareaCard} myCard The Card this autocomplete is for. This is a really dirty way to do this,
 *                                        as the implementations are very co-dependant. It works though.
 */
var Config = function(mdlObject) {

  // Private variables
  var input;
  if (mdlObject.find('input').length !== 0) {
    input = mdlObject.find('input');
  }
  if (mdlObject.find('textarea').length !== 0) {
    input = mdlObject.find('textarea');
  }

  //***** Privileged Methods *****//

  /**
   * Gets the jQuery UI autocomplete config.
   *
   * @param {string} append The string to put after a selection is made.
   * @param {string} prepend The string to put before the selection.
   * @param {number} maxResults The maximum number of results displayed when filtering results.
   * @param {string} trigger A string to watch for that triggers selection.
   * @param {Array<string>} results The results to filter for autocomplete.
   * @return {object} A configuration object used by jQuery UI.
   */
  this.getAutocompleteConfig = function(append, prepend, maxResults, trigger, results) {
    return {
      minLength: 0,
      source: function(request, response) {

        if (trigger === undefined) {
          response($.ui.autocomplete.filter(results, request.term.split(/,\s*/).pop()).slice(0, maxResults));
        }
        else {
          var cursor = input[0].selectionStart;
          var startOfTerm = request.term.substring(0, cursor);
          var last = startOfTerm.split(trigger).pop();

          // Fixes weird bug that doesn't force the DDL to hide if you trigger it with nothing.
          if (trigger !== '' && request.term === '') {
            response('');
          }
          else {
            // delegate back to autocomplete, but extract the last term
            response($.ui.autocomplete.filter(results, last).slice(0, maxResults));
          }
        }
      },
      focus: function() {
        return false;
      },
      select: function(event, ui) {

        if (trigger === undefined) {
          var terms = this.value.split(/,\s*/);
          terms.pop();
          terms.push(prepend);
          terms.push(ui.item.value);
          terms.push(append);
          // card.setValue(terms.join(''));
          mdlObject[0].MaterialTextfield.change(terms.join(''));
        }
        else {
          var cursor = input[0].selectionStart;
          var startOfTerm = this.value.substring(0, cursor);
          var triggerPos = startOfTerm.lastIndexOf(trigger);
          var newStart = this.value.substring(0, triggerPos) + prepend + ui.item.value + append;
          var newValue = newStart + this.value.substring(cursor);

          var newCursorPos = newStart.length;

          mdlObject[0].MaterialTextfield.change(newValue);
          input[0].focus();
          input[0].selectionStart = newCursorPos;
          input[0].selectionEnd = newCursorPos;
        }

        return false;
      }
    };
  };

};


/** */
module.exports = Config;
