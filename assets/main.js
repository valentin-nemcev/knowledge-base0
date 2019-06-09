"use strict"

moment.locale('en-my-settings', {
  longDateFormat : {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
  }
});

jQuery(function($) {
  $('.date').each(function() {
    var m = moment($(this).data('date'));
    $(this).attr('title', m.format('LL'));
    $(this).text(m.calendar());
  });
});
