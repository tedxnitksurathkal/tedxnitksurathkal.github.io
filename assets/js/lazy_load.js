$(function() {
  // Load the Base64 image of lazy loading gif
  $('.lazy').lazy({
    scrollDirection: 'vertical',
    effect: 'fadeIn',
    visibleOnly: true,
    /* Uncomment for debugging
    afterLoad: function(element) {
      console.log('Image loaded for ' + element.attr('id'));
    },
    */
    onError: function(element) {
      console.log('Error loading ' + element.data('src'));
    }
  });
});
