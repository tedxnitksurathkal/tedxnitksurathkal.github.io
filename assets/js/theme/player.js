
AFRAME.registerComponent("player", {
    init: function () {
        this.el.addEventListener('collide', (evt) => {
            if (evt.detail.body.el.id != undefined && evt.detail.body.el.id == "finish-tile") {
                this.el.sceneEl.exitVR()

                let finishDlgElm = document.querySelector("#finishDialog")
                finishDlgElm.setAttribute("style", "display: block");
                this.finished = true;
            }
        });
    }
})


