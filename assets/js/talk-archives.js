$(document).ready(function () {
  $(".arrow-right").bind("click", function (event) {
    event.preventDefault();
    $(".vid-list-container").stop().animate(
      {
        scrollLeft: "+=336",
      },
      750
    );
  });
  $(".arrow-left").bind("click", function (event) {
    event.preventDefault();
    $(".vid-list-container").stop().animate(
      {
        scrollLeft: "-=336",
      },
      750
    );
  });
});

//display the video player based on the tab clicked
function openSeries(evt, vidName) {
  var i, tabcontent, tablinks;

  switch (vidName) {
    case '2023':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/bbNKx3fKX2U?&rel=0&showinfo=0&autohide=1';
      break;
    case '2021':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/ADBhj5oSM5c?&rel=0&showinfo=0&autohide=1';
      break;
    case '2020trailblazer':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/RG2add2P0nU?&rel=0&showinfo=0&autohide=1';
      break;
    case '2020aatmanirbhar':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/NR4opvW0Lbg?&rel=0&showinfo=0&autohide=1';
      break;
    case '2020':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/usDzA8UVDus?rel=0&showinfo=0&autohide=1';
      break;
    case '2019':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/-7ENgIjLWps?rel=0&showinfo=0&autohide=1';
      break;
    case '2018':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/RrSqxO8alR4?rel=0&showinfo=0&autohide=1';
      break;
    case '2016':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/J8uq8et5W1A?rel=0&showinfo=0&autohide=1';
      break;
    case '2012':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/u3i9tyZ8e4g?rel=0&showinfo=0&autohide=1';
      break;
    case '2011':
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/RoMvP_Zyx5Q?rel=0&showinfo=0&autohide=1';
      break;
    default:
      document.getElementById('vid_frame').src =
        'https://www.youtube.com/embed/-7ENgIjLWps?rel=0&showinfo=0&autohide=1';
      break;
  }
  tabcontent = $(".tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = $(".tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(vidName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

$(".vid-item .desc").click(function () {
  $(this).parent().siblings().removeClass("vid-item-active");
  $(this).parent().addClass("vid-item-active");
});

$(".vid-item .thumb").click(function () {
  $(this).parent().siblings().removeClass("vid-item-active");
  $(this).parent().addClass("vid-item-active");
});


var hidWidth;
var scrollBarWidths = 40;

var widthOfList = function () {
  var itemsWidth = 0;
  $('.list li').each(function () {
    var itemWidth = $(this).outerWidth();
    itemsWidth += itemWidth;
  });
  return itemsWidth;
};

var widthOfHidden = function () {
  return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
};

var getLeftPosi = function () {
  return $('.list').position().left;
};

var reAdjust = function () {
  if (($('.wrapper').outerWidth()) < widthOfList()) {
    $('.scroller-right').show();
  }
  else {
    $('.scroller-right').hide();
  }

  if (getLeftPosi() < 0) {
    $('.scroller-left').show();
  }
  else {
    $('.item').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow');
    $('.scroller-left').hide();
  }
}

reAdjust();

$(window).on('resize', function (e) {
  reAdjust();
});

var showHideButtons = function () {
  setTimeout(function () {
    if (($('.wrapper').outerWidth()) < widthOfList()) {
      $('.scroller-right').fadeIn('slow');
    }
    else {
      $('.scroller-right').fadeOut('slow');
    }

    if (getLeftPosi() < 0) {
      $('.scroller-left').fadeIn('slow');
    }
    else {
      $('.scroller-left').fadeOut('slow');
    }
  }, 0);

}

$('.scroller-right').click(function () {

  let hidden = widthOfHidden();

  if (hidden > -400) {

    $('.list').animate({ left: "+=" + hidden + "px" }, 'slow', function () { });
    $('.scroller-left').fadeIn('slow');
    $('.scroller-right').fadeOut('slow');
  }
  else {

    $('.list').animate({ left: "-=300px" }, 'slow', function () { });
    showHideButtons();
  }

});

$('.scroller-left').click(function () {

  let hidden = getLeftPosi();

  if (hidden > -400) {
    $('.list').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow', function () { });
    $('.scroller-right').fadeIn('slow');
    $('.scroller-left').fadeOut('slow');
  }
  else {

    $('.list').animate({ left: "+=300px" }, 'slow', function () { });

    showHideButtons();
  }

});
