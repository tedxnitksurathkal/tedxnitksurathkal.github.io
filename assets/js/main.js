// Loader
'use strict';
$(window).on('load', function() {
    $('.loader').delay(100).fadeOut('slow');
});


$(document).ready(function() {
    'use strict';

    // Sticky header
    let header = document.querySelector('.header');
    
    window.addEventListener('scroll', function () {
      if (window.scrollY < 100)
        header.classList.remove('sticky_header');
      else
        header.classList.add('sticky_header');
    });

    // Lazy load images
    $('.lazy').lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        afterLoad: function(element) {
          element.css('background-image', 'none');
        },
        onError: function(element) {
          console.log('Error loading ' + element.data('src'));
        }
    });
});
