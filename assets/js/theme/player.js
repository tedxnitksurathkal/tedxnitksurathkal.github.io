let instructions = 1

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
    $('#endDialog').delay(1000).fadeIn();
}

function animate_trailblazers() {
    let endModal = document.getElementById("endDialog");
    endModal.style.display = "none";
    $('.has-animation').each(function (index) {
        $(this).delay($(this).data('delay')).queue(function () {
            $(this).addClass('animate-in');
        });
    });
}
