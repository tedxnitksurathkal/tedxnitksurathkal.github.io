$(function() {
  // Load the Base64 image of lazy loading gif
  $('.lazy').lazy({
    scrollDirection: 'vertical',
    effect: 'fadeIn',
    visibleOnly: true,
    afterLoad: function(element){
      element.css('background-image', 'none');
    },
    onError: function(element) {
      console.log('Error loading ' + element.data('src'));
    }
  });
});
