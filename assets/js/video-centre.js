$(document).ready(function () {
    $(".arrow-right").bind("click", function (event) {
        event.preventDefault();
        $(".vid-list-container").stop().animate({
            scrollLeft: "+=336"
        }, 750);
    });
    $(".arrow-left").bind("click", function (event) {
        event.preventDefault();
        $(".vid-list-container").stop().animate({
            scrollLeft: "-=336"
        }, 750);
    });

    
});


//display the video player based on the tab clicked
function openSeries(evt, vidName) {
    var i, tabcontent, tablinks;
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

// Set default to 2019
document.getElementById("defaultOpen").click();

$(".vid-item .desc").click(function () {
    $(this).parent().siblings().removeClass("vid-item-active");
    $(this).parent().addClass("vid-item-active");
});

$(".vid-item .thumb").click(function () {
    $(this).parent().siblings().removeClass("vid-item-active");
    $(this).parent().addClass("vid-item-active");
});
