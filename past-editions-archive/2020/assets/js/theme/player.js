let instructions = 1

AFRAME.registerComponent("player", {
    init: function () {
        this.el.addEventListener('collide', (evt) => {
            if (evt.detail.body.el.id != undefined && evt.detail.body.el.id == "finish-tile") {
                this.el.sceneEl.exitVR()
                $('#maze-full').fadeOut(500);
                animate_trailblazers();
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
                console.log(startModal)
                console.log(instr)
            }
        });
    }
})

function animate_trailblazers() {
    $('.has-animation').each(function (index) {
        $(this).delay($(this).data('delay')).queue(function () {
            $(this).addClass('animate-in');
        });
    });
}
