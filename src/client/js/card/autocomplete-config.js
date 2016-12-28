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
        console.log('Auto trigger');
        if (trigger === undefined) {
          response($.ui.autocomplete.filter(results, request.term.split(/,\s*/).pop()).slice(0, maxResults));
        }
        else {
          var cursor = input[0].selectionStart;
          var startOfTerm = request.term.substring(0, cursor);
          var last = startOfTerm.split(trigger).pop();

          console.log(startOfTerm);

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
          var terms = [this.value.substring(0, this.value.lastIndexOf(trigger))];

          terms.push(prepend);
          terms.push(ui.item.value);
          terms.push(append);
          this.value = terms.join('');
        }

        // We have to manually mark the text field as dirty. If we don't, MDL text fields act weird.
        $(this).parent().addClass('is-dirty');

        return false;
      }
    };
  }

};



module.exports = Config;
