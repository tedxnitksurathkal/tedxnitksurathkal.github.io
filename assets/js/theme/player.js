
AFRAME.registerComponent("player", {
    init: function () {
        this.el.addEventListener('collide', (evt) => {
            if (evt.detail.body.el.id != undefined && evt.detail.body.el.id == "finish-tile") {
                this.el.sceneEl.exitVR()
                
                $('#maze-full').fadeOut(500);
                animate_trailblazers();
            }
        });
    }
})

function animate_trailblazers() {
    $('.has-animation').each(function(index) {
            $(this).delay($(this).data('delay')).queue(function(){
            $(this).addClass('animate-in');
        });
    });
}
