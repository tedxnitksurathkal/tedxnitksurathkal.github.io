gsap.registerPlugin(ScrollTrigger);

if (window.innerWidth > 900) {
  gsap.from(".reddit-card", {
    scrollTrigger: {
      trigger: ".reddit-section",
      pin: true,
      scrub: 1,
      start: "top top",
      end: "bottom center",
    },
    x: -1500,
  });

  gsap.to("#redditUpvote", {
    scrollTrigger: {
      trigger: ".reddit-section",
      scrub: 1,
      start: "top top",
      end: "bottom center",
    },
    fontWeight: "bolder",
    color: "red",
  });

  gsap.from(".instagram-card", {
    scrollTrigger: {
      trigger: ".instagram-section",
      pin: true,
      scrub: 0.5,
      start: "top top",
      end: "bottom center",
    },
    x: 1500,
  });

  gsap.to("#instagramLike", {
    scrollTrigger: {
      trigger: ".instagram-section",
      scrub: true,
      start: "80% bottom",
      end: "80% top",
    },
    color: "red",
    fontWeight: "bolder",
  });

  gsap.from(".twitter-card", {
    scrollTrigger: {
      trigger: ".twitter-section",
      pin: true,
      scrub: 1,
      start: "top top",
      end: "bottom center",
    },
    opacity: 0,
    y: -100,
  });

  gsap.to("#twitterRetweet", {
    scrollTrigger: {
      trigger: ".twitter-card",
      scrub: 0.5,
    },
    color: "green",
    fontWeight: "bolder",
  });

  gsap.to(".drop-image", {
    scrollTrigger: {
      trigger: ".drop",
      scrub: 1,
      start: "top top",
      end: "bottom center",
    },
    opacity: 0,
    y: 200,
  });
} else {

  gsap.to(".drop-image", {
    scrollTrigger: {
      trigger: ".drop",
      scrub: 1,
      start: "top center",
      end: "bottom center",
    },
    opacity: 0,
    y: 200,
  });

}