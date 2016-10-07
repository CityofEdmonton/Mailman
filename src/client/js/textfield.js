

var Textfield = function(options) {
  var append = '';
  var prepend = '';
  maxResults;
  autoResults = [];
  var input;

  if (options !== undefined) {
    if (options.trigger !== undefined) {
      trigger = options.autocomplete.trigger;
    }
    if (options.autocomplete.append !== undefined) {
      append = options.autocomplete.append;
    }
    if (options.autocomplete.prepend !== undefined) {
      prepend = options.autocomplete.prepend;
    }
    if (options.autocomplete.maxResults !== undefined) {
      maxResults = options.autocomplete.maxResults;
    }
    if (options.autocomplete.triggerOnFocus === true) { //TODO Change this
      input.on('focus', function() {input.autocomplete('search', self.getValue())});
    }
    if (options.autocomplete.results !== undefined) {
      autoResults = options.autocomplete.results;
    }
  }

};
