/* ------------------------------------- */
/*  TABLE OF CONTENTS
 /* ------------------------------------- */
/*   PRE LOADING                          */
/*   sliders                      */



    /* ==============================================
/*  PRE LOADING
  =============================================== */
'use strict';
$(window).on('load', function() {
    $('.loader').delay(100).fadeOut('slow');
});


$(document).ready(function() {

    'use strict';
    /* ==============================================
        STICKY HEADER
        =============================================== */

    $(window).on('scroll', function () {
        if ($(window).scrollTop() < 100) {
            $('.header').removeClass('sticky_header');
        } else {
            $('.header').addClass('sticky_header');
        }
    });
});
