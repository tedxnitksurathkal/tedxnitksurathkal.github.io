const {
    gsap,
    ScrollTrigger,
    gsap: { timeline, set, to, delayedCall } } =
    window;

gsap.registerPlugin(ScrollTrigger);

// Utility function - h/t to https://www.trysmudford.com/blog/linear-interpolation-functions/
const LERP = (x, y, a) => x * (1 - a) + y * a;
const CLAMP = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const INVLERP = (x, y, a) => CLAMP((a - x) / (y - x));
const RANGE = (x1, y1, x2, y2, a) => LERP(x2, y2, INVLERP(x1, y1, a));

//const VOLUME_TOGGLE = document.querySelector('input');
const EYES = document.querySelector('.eyes--open');
const LIMIT = 0.2;

const TRACKS = {
    // Forest by Yakov Golman(https://freemusicarchive.org/music/Yakov_Golman/Piano__orchestra_1/Yakov_Golman_-_Forest_1236) is licensed under a Attribution License: http://creativecommons.org/licenses/by/4.0/
    CLASSICAL: {
        TRACK: new Audio(
            'https://assets.codepen.io/605876/yakov-golman-forest-classic.mp3'),

        HUE: 40
    },

    // Born Ready by Flex Vector(https://freemusicarchive.org/music/Flex_Vector/20190131191544588/Flex_Vector_-_Born_Ready_1591) is licensed under a Attribution-NonCommercial-ShareAlike License: http://creativecommons.org/licenses/by-nc-sa/4.0/
    INSTRUMENTAL: {
        TRACK: new Audio(
            'https://assets.codepen.io/605876/flex-vector-bord-ready-instrumental.mp3'),

        HUE: 160
    },

    // Spencer - Bluegrass (ID 1230) by Lobo Loco(https://freemusicarchive.org/music/Lobo_Loco/Salad_Mixed/Spencer_-_Bluegrass_ID_1230) is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 License: http://creativecommons.org/licenses/by-nc-nd/4.0/
    BLUES: {
        TRACK: new Audio(
            'https://assets.codepen.io/605876/lobo-loco-spencer-bluegrass-blues.mp3'),

        HUE: 190
    },

    // Rainbow by Chad Crouch(https://freemusicarchive.org/music/Chad_Crouch/Motion/Rainbow_1648) is licensed under a Attribution-NonCommercial 3.0 International License: http://creativecommons.org/licenses/by-nc/3.0/
    POP: {
        TRACK: new Audio(
            'https://assets.codepen.io/605876/chad-crouch-rainbow-pop.mp3'),

        HUE: 320
    },

    // Magic by Yung Kartz(https://freemusicarchive.org/music/Yung_Kartz/July_2019/Magic) is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 License: http://creativecommons.org/licenses/by-nc-nd/4.0/
    HIPHOP: {
        TRACK: new Audio(
            'https://assets.codepen.io/605876/yung-kartz-magic-hiphop.mp3'),

        HUE: 280
    },

    // Story has Begun (Kielokaz 156) by KieLoKaz(https://freemusicarchive.org/music/KieLoKaz/Walker_Traffic/Story_has_Begun_Kielokaz_156) is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 License: http://creativecommons.org/licenses/by-nc-nd/4.0/
    JAZZ: {
        TRACK: new Audio(
            'https://assets.codepen.io/605876/kielokaz-story-has-begun-jazz.mp3'),

        HUE: 220
    }
};

// TODO: Figure out autoplay  
let currentTrack = null;
let timer;

for (let genre of Object.keys(TRACKS)) {
    TRACKS[genre].TRACK.loop = true;
    TRACKS[genre].TRACK.muted = false;
    TRACKS[genre].TRACK.volume = 1;
}

const genRate = s => {
    let rate = 1;
    const val = CLAMP(s, -LIMIT, LIMIT);
    // if (val < 0) rate = RANGE(-5, 0, 0.5, 1, val)
    // else rate = RANGE(0, 5, 1, 4, val)
    rate = RANGE(-LIMIT, LIMIT, -LIMIT, LIMIT, val);
    return rate;
};

set('.record', { transformOrigin: '50% 50%' });
set('.player-arm', { transformOrigin: '25% 15%', rotate: 25 });
to('.player-arm', { duration: 0.5, rotate: 26, repeat: -1, yoyo: true });

const TL = timeline({ repeat: -1 }).
    to(
        '.record',
        {
            rotate: 360,
            duration: 1,
            ease: 'none'
        },

        0).

    to(
        '.record',
        {
            transformOrigin: '49.5% 50%',
            repeat: 1,
            yoyo: true,
            duration: 0.5
        },

        0).

    to(
        '.record__shine',
        {
            transformOrigin: '49.5% 50%',
            repeat: 1,
            yoyo: true,
            duration: 0.5
        },

        0).

    to(
        '.record__shine',
        {
            rotate: '+=4',
            repeat: 1,
            yoyo: true,
            duration: 0.5,
            ease: 'none'
        },

        0);

set('.record__shine', { transformOrigin: '50% 50%', rotate: 55 });
set(['.record-player', '.genre-switch'], { display: 'block' });


const blink = EYES => {
    gsap.set(EYES, { scaleY: 1 });
    if (EYES.BLINK_TL) EYES.BLINK_TL.kill();
    EYES.BLINK_TL = timeline({
        delay: Math.floor(Math.random() * 5) + 1,
        onComplete: () => blink(EYES)
    });

    EYES.BLINK_TL.to(EYES, {
        duration: 0.05,
        transformOrigin: '50% 50%',
        scaleY: 0,
        yoyo: true,
        repeat: 1
    });

};
blink(EYES);

const TRACK_INDEX = {
    0: "CLASSICAL",
    1: "BLUES",
    2: "HIPHOP",
    3: "INSTRUMENTAL",
    4: "JAZZ",
    5: "POP"
};

var num;

const GENRE_SWITCH = document.getElementById('pause-button');
GENRE_SWITCH.addEventListener('click', () => {
    num = Math.floor((Math.random() * 10) % 6);
    document.documentElement.style.setProperty(
        '--hue',
        TRACKS[TRACK_INDEX[num]].HUE);
});

const audio = document.querySelector("#gooey-audio");
// const progressBar = document.querySelector("#progress-bar");
let audioContext;
const AudioContext = window.AudioContext || window.webkitAudioContext || false;
if (AudioContext) {
    audioContext = new AudioContext();
    audioContext.createGain();
} else {
    alert("Sorry, Web Audio API is not supported in your browser");
}
const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 1024;

const bufferLength = analyser.frequencyBinCount;
const frequencyData = new Uint8Array(bufferLength);

const bars = [];

for (let i = 1; i <= 128; i++) {
    bars.push(document.getElementById("bar-" + i));
}

const MusicVisuals = {
    rafId: null,
    start() {
        analyser.getByteFrequencyData(frequencyData);

        let barcc = -1;
        const numberOfBars = 128;

        for (let increment = -1; increment < numberOfBars * 2; increment += 2) {
            const y = frequencyData[increment];

            if (barcc > numberOfBars) {
                barcc = 0;
            }

            const bar = bars[barcc];

            if (bar) {
                bar.style.visibility = "visible";
                bar.style.transform = `translateY(${30 / 255 * (255 - y)}vh)`;
            }
            barcc++;
        }

        MusicVisuals.rafId = requestAnimationFrame(MusicVisuals.start);
    },
    stop() {
        cancelAnimationFrame(MusicVisuals.rafId);
    }
};


document.querySelector("#pause-button").addEventListener("click", () => {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    audio.paused ? audio.play() : audio.pause();
});

// if (audio.readyState >= audio.HAVE_FUTURE_DATE) {
//     console.log("CANPLAY");
//     document.querySelector("#pause-button").removeAttribute("disabled");
//     document.querySelector("#pause-button").style.color = "hsl(var(--hue), 50%, 0%)";
// };

document.querySelector("#gooey-audio").addEventListener("play", () => {
    if (audioContext.state === "suspended" || audioContext.state === "interrupted") {
        audioContext.resume();
    }
    document.querySelector("#pause-button span").textContent = "pause";
    MusicVisuals.start();
});

document.querySelector("#gooey-audio").addEventListener("pause", () => {
    document.querySelector("#pause-button span").textContent = "play_arrow";

    for (let i = 0; i < bars.length; i++) {
        if (bars[i]) {
            bars[i].style.transform = null;
            // bars[i].style.visibility = "hidden"
        }
    }

    MusicVisuals.stop();
});

document.querySelector("#gooey-audio").addEventListener("ended", () => {
    MusicVisuals.stop();
    audio.src = audio.src === "https://api.soundcloud.com/tracks/75308415/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb" ? "https://katiebaca.com/tutorial/odd-look.mp3" : "https://api.soundcloud.com/tracks/75308415/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb";
    // if (audioContext.state === "suspended") {
    //     audioContext.resume();
    // }
    audio.play();
});

document.querySelector("#gooey-audio").addEventListener("timeupdate", () => {
    // Maybe randomly choose a value between 30-45 sec
    if (audio.currentTime >= 30) {
        nextSong();
    }
});

function nextSong() {
    audio.pause();
    // Change below line to set song directly instead of horrendous tertiary op
    audio.src = audio.src === "https://api.soundcloud.com/tracks/75308415/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb" ? "https://katiebaca.com/tutorial/odd-look.mp3" : "https://api.soundcloud.com/tracks/75308415/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb";
    if (audioContext.state === "suspended" || audioContext.state === "interrupted") {
        audioContext.resume();
    }
    audio.play();
}

// const progressWidth = document.querySelector(".progress").offsetWidth;

// document.querySelector("#gooey-audio").addEventListener("timeupdate", () => {
//     const p = (audio.currentTime / audio.duration) * 100;

//     // progressBar.style.width = p + "%";
// });

// document.querySelector(".progress").addEventListener("click", (e) => {
//     const mouseX = e.pageX;
//     const boundingRect = e.target.getBoundingClientRect();
//     const barX = boundingRect.left;
//     const percent = boundingRect.width / (e.pageX - barX);

//     audio.currentTime = audio.duration / percent;
// });