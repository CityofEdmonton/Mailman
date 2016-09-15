var $ = require('jquery');

var MailMan = function() {

  // *** GLOBAL VARIABLES *** //
  var self = null;
  var state = null;
  var maxState = null;
  var slideWidth = null;
  var duration = 400;

  // ********** PUBLIC **********//

  this.init = function() {
    self = this;
    state = 0;
    maxState = 1;
    slideWidth = $('.slide').width();

    $('#toButton').fadeTo(0, 0);
    setFadeCharacteristics($('#toLine'), $('#toLine').children('.rest-right'));

    $('#subjectButton').fadeTo(0, 0);
    setFadeCharacteristics($('#subjectLine'), $('#subjectLine').children('.rest-right'));

    $('#back').fadeTo(0, 0);
    $('#back').prop('disabled', true);

    $('#back').on('click', back);
    $('#next').on('click', next);
    $('#ccSpan').on('click', ccClick);
    $('#bccSpan').on('click', bccClick);
    $('.docs-icon').on('click', getSelection);

    $('.waffle-range-selection-container').on('focusin', function() {
      $(this).addClass('waffle-range-selection-container-focus');
    }).on('focusout', function() {
      $(this).removeClass('waffle-range-selection-container-focus');
    });

    // Close the DDL on click outside the DDL
    // http://stackoverflow.com/questions/485453/best-way-to-get-the-original-target/11298886#11298886
    $(document).on('click', function(event) {
      // The DDL is not yet visible
      if (!$('#select-ddl').is(':visible')) {
        return;
      }
      // The clicked element is a child of the DDL
      if ($(event.target).parents('#select-ddl').length > 0) {
        return;
      }
      // The clicked element is a child of the DDL button.
      if ($(event.target).parents('#select-ddl-button').length > 0) {
        return;
      }

      $('#select-ddl').css({
        'display': 'none'
      });
    });

    // Open the DDL on click
    $('#select-ddl-button').on('click', function() {
      $('#select-ddl').css({
        'display': 'initial'
      });
    });

    $('body').width(window.innerWidth)
        .height(window.innerHeight);
    window.onresize = function() {
      $('body').width(window.innerWidth)
          .height(window.innerHeight);
    };
  };

  // ********** PRIVATE **********//

  var getSelection = function() {
    // I always pass the input's parent in. I know this function is awful.
    // TODO adjust HTML to allow consistant input/button relationship
    if ($(this).siblings('input').length > 0) {
      google.script.run
          .withSuccessHandler(insertSelection)
          .withUserObject($(this).parent())
          .getSheetSelection();
    } else if ($(this).parent().parent().parent().children('input').length > 0) {
      google.script.run
          .withSuccessHandler(insertSelection)
          .withUserObject($(this).parent().parent().parent())
          .getSheetSelection();
    } else if ($(this).parent().parent().siblings('.waffle-row').length > 0) {
      google.script.run
          .withSuccessHandler(insertSelection)
          .withUserObject($(this).parent().parent().siblings('.waffle-row'))
          .getSheetSelection();
    }
  };


  var insertSelection = function(selection, uObj) {
    var input = $(uObj).children('input');
    input.insertAtCaret(selection);
  };

  var submitData = function() {
    console.log('IMPLEMENT ME');
    google.script.host.close();
  };

  var ccClick = function() {
    $('#ccSpan').remove();
    $('#ccLine').append('<input name="cc" class="input-full" placeholder="Cc" />');
    $('#ccLine').append(
        getIconButton()
        .prop('id', 'ccButton')
        .fadeTo(100, 0)
        .on('click', getSelection));
    setFadeCharacteristics($('#ccLine'), $('#ccLine'));
  };

  var bccClick = function() {
    $('#bccSpan').remove();
    $('#bccLine').append('<input name="bcc" class="input-full" placeholder="Bcc" />');
    $('#bccLine').append(
        getIconButton()
        .prop('id', 'bccButton')
        .fadeTo(100, 0)
        .on('click', getSelection));
    setFadeCharacteristics($('#bccLine'), $('#bccLine'));
  };

  var back = function() {
    if (state > 0) {
      state--;

      $('#slider').animate({
        left: '+=' + slideWidth
      }, this.duration);

      // Fade out the button if we are at the base state.
      if (state === 0) {
        $('#back').fadeTo(400, 0);
        $('#back').prop('disabled', true);
      }

      $('#next').html('Next');
      $('#next').off().on('click', next);
    }
  };

  var next = function(event) {
    if (state < maxState) {
      state++;

      $('#back').fadeTo(400, 1);
      $('#back').prop('disabled', false);

      $('#slider').animate({
        left: '-=' + slideWidth
      }, this.duration);

      $('#next').html('Done');
      $('#next').off().on('click', done);
    }
  };

  var done = function() {
    // SUBMIT THE INFO BACK TO SHEETS
    var container;
    var to = $('#toLine').children('input').val();
    var cc = $('#ccLine').children('input').val() == null || $('#ccLine').children('input').val() === '' ? null : $('#ccLine').children('input').val();
    var bcc = $('#bccLine').children('input').val() == null || $('#bccLine').children('input').val() === '' ? null : $('#bccLine').children('input').val();
    var subject = $('#subject').val();
    var body = $('#body').val();
    var range = $('#range').val();
    var comparison = $('#comparison').html();
    var value = $('#value-to-watch').val();
    var lastSent = $('#last-sent').val();

    // TODO Must have to, subject, body, range (could just default to whole sheet) comparison and value

    console.log('to: ' + to +
        '\ncc: ' + cc +
        '\nbcc: ' + bcc +
        '\nsubject: ' + subject +
        '\nbody: ' + body +
        '\nrange: ' + range +
        '\ncomparison: ' + comparison +
        '\nvalue: ' + value +
        '\nlast: ' + lastSent

    );

    google.script.run
        .withSuccessHandler(submitData)
        .createRule(to, cc, bcc, subject, body, range, comparison, value, lastSent);
  };

  var getIconButton = function() {
    return $('#toButton').clone().prop('class', function() {
      return $(this).prop('class') + ' rest-right';
    });
  };

  /**
   * Searches for a .jfk-button in search and applies fading effects to it
   * based upon the mouse state over line
   *
   * @param {jQuery} line The object to watch for events (hoverin, hoverout, focusin, focusout).
   * @param {jQuery} search The object to look for button in.
   *
   */
  var setFadeCharacteristics = function(line, search) {
    var button = search.children('.jfk-button');

    line.hover(function(e) {
      button.fadeTo(100, 1);
    }, function(e) {
      var input = line.children('.input-full');
      if (!input.is(':focus')) {
        button.fadeTo(100, 0);
      }
    })
        .on('focusin', function() {
          button.fadeTo(100, 1);
        })
        .on('focusout', function() {
          button.fadeTo(100, 0);
        });
  };
};

module.exports = MailMan;
