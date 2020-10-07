
AFRAME.registerComponent("player", {
    init: function () {
        this.el.addEventListener('collide', (evt) => {
            if (evt.detail.body.el.id != undefined && evt.detail.body.el.id == "finish-tile") {
                this.el.sceneEl.exitVR()

                let finishDlgElm = document.querySelector("#maze-full")
                finishDlgElm.setAttribute("style", "display: none");
            }
        });
    }
})


