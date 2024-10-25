console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    gsap
    .timeline({
        scrollTrigger: {
            trigger: ".wrapper",
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true
        }
    })
    .to("img", {
        scale: 1,
        z: 350,
        transformOrigin: "center center",
        ease: "power1.inOut"
    });
});