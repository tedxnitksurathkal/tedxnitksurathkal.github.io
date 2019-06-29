$(function() {
  $('.lazy').lazy({
    scrollDirection: 'vertical',
    effect: 'fadeIn',
    visibleOnly: true,
    placeholder: '', // TODO: Replace with the loading GIF
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
