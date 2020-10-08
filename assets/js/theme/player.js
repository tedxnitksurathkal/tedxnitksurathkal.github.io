let instructions = 1
let seconds = 0
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
                $('#instructions').append("<p> You are in maze number " + maze_gen);
                startModal.style.display = "block"
                instructions = 0
                console.log(startModal)
                console.log(instr)
            }
        });
    }
})

function endgame() {
    var instructions = "<p>Congrats!! You took " + seconds + " seconds to navigate through Maze " + maze_gen + ". Take a screenshot of this page and send it to our instagram account and stand a chance to win exciting goodies!!</p>";
    $('#instructions-end').append(instructions)
    var el = document.getElementById("instructions-end");
    var i = 0;

    clearInterval()
    interval = setInterval(function() {
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
        attr_text.value = seconds++
        timer.setAttribute('text', attr_text)
    }
}, 1000);
