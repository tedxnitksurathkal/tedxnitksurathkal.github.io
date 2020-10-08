let instructions = 1
let seconds = 0.00
let minutes = 0
var interval = null;

AFRAME.registerComponent("player", {
    init: function () {
        this.el.addEventListener('collide', (evt) => {
            if (evt.detail.body.el.id != undefined && evt.detail.body.el.id == "finish-tile") {
                this.el.sceneEl.exitVR()
                $('#maze-full').fadeOut(500);
                endgame();
            }

            if (evt.detail.body.el.id != undefined && evt.detail.body.el.id == "start-tile" && instructions == 1) {
                let startModal = document.getElementById("startDialog")
                if (AFRAME.utils.device.isMobile()) {
                    $("#instructions").append("<p>2. Tap and hold screen to move forward. Move your phone to look around.</p><p>3. Alternatively, you can also swipe on screen to look around.</p>");
                } else {
                    $("#instructions").append("<p>2. Use the arrow keys to move and your mouse to look around.</p>")
                }
                startModal.style.display = "block"
                instructions = 0
            }
        });
    }
})

function endgame() {
    let toc = null
    if (minutes == 0) {
        if (seconds.toFixed(2) < 10) {
            toc = "00:" + "0" + seconds.toFixed(2)
        } else {
            toc = "00:" + seconds.toFixed(2)
        }
    } else {
        if (minutes < 10) {
            toc = "0" + minutes
        } else {
            toc = minutes
        }
        if (seconds.toFixed(2) < 10) {
            toc += ":" + "0" + seconds.toFixed(2)
        } else {
            toc += ":" + seconds.toFixed(2)
        }
    }
    var instructions = "<p>Congratulations!!</p><p>You took " + toc + " to navigate through Maze-" + maze_gen + ".</p><p>Take a screenshot of this page, put it as your story on Instagram, tag @tedxnitksurathkal and stand a chance to win exciting goodies!!</p>";
    $('#instructions-end').append(instructions)
    var el = document.getElementById("instructions-end");
    var i = 0;

    clearInterval()
    interval = setInterval(function () {
        el.innerHTML = instructions;
    }, 100);

    $('#endDialog').delay(1000).fadeIn();
}

function animate_trailblazers() {
    let endModal = document.getElementById("endDialog");
    endModal.style.display = "none";
    clearInterval(interval);
    $('.has-animation').each(function (index) {
        $(this).delay($(this).data('delay')).queue(function () {
            $(this).addClass('animate-in');
        });
    });
}

clearInterval()
setInterval(() => {
    let timer = document.getElementById("timer")
    let vis = timer.getAttribute('visible')
    if (vis) {
        let attr_text = timer.getAttribute('text')
        seconds += 0.01
        if (seconds.toFixed(2) >= 60.00) {
            seconds = seconds.toFixed(2) - 60.00
            minutes++
        }
        if (minutes == 0) {
            if (seconds.toFixed(2) < 10) {
                attr_text.value = "00:" + "0" + seconds.toFixed(2)
            } else {
                attr_text.value = "00:" + seconds.toFixed(2)
            }
        } else {
            if (minutes < 10) {
                attr_text.value = "0" + minutes
            } else {
                attr_text.value = minutes
            }
            if (seconds.toFixed(2) < 10) {
                attr_text.value += ":" + "0" + seconds.toFixed(2)
            } else {
                attr_text.value += ":" + seconds.toFixed(2)
            }
        }
        timer.setAttribute('text', attr_text)
    }
}, 10);
