var Config = function(inputEl) {

  // Private variables
  var input = inputEl;

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
          this.value = terms.join('');
        }
        else {
          var cursor = input[0].selectionStart;
          var startOfTerm = this.value.substring(0, cursor);
          var triggerPos = startOfTerm.lastIndexOf(trigger);
          var newStart = this.value.substring(0, triggerPos) + prepend + ui.item.value + append;
          var newValue = newStart + this.value.substring(cursor);

          var newCursorPos = newStart.length;

          this.value = newValue;
          input[0].focus();
          input[0].selectionStart = newCursorPos;
          input[0].selectionEnd = newCursorPos;
        }

        // We have to manually mark the text field as dirty. If we don't, MDL text fields act weird.
        $(this).parent().addClass('is-dirty');

        return false;
      }
    };
  }

};


/** */
module.exports = Config;
