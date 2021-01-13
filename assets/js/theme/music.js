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

const gooeyAudio = document.querySelector("#gooey-audio");
const roundAudio = document.querySelector("#round-audio");
const songs = [
    'assets/songs/bad_guy.mp3',
    'assets/songs/blank_space.mp3',
    'assets/songs/caravan.mp3',
    'assets/songs/comfortably_numb.mp3',
    'assets/songs/fly_me_to_the_moon.mp3',
    'assets/songs/guns_n_roses.mp3',
    'assets/songs/levitating.mp3',
    'assets/songs/love_yourself.mp3',
    'assets/songs/shape_of_you.mp3',
    'assets/songs/wonderful_world.mp3'
];
let effectPlaying = 1;

function randSongIndex() {
    return Math.floor(Math.random() * songs.length);
}

gooeyAudio.src = songs.splice(randSongIndex(), 1)[0];
gooeyAudio.load();
// roundAudio.src = songs.splice(randSongIndex(), 1)[0]


// GOOEY BAR JS - EFFECT 1
// const progressBar = document.querySelector("#progress-bar");
let audioContext;
const AudioContext = window.AudioContext || window.webkitAudioContext || false;
if (AudioContext) {
    audioContext = new AudioContext();
    audioContext.createGain();
} else {
    alert("Sorry, Web Audio API is not supported in your browser");
}
const source = audioContext.createMediaElementSource(gooeyAudio);
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
                bar.style.transform = `translateY(${40 / 255 * (255 - y)}vh)`;
            }
            barcc++;
        }

        MusicVisuals.rafId = requestAnimationFrame(MusicVisuals.start);
    },
    stop() {
        cancelAnimationFrame(MusicVisuals.rafId);
    }
};

document.querySelector("#play-button").addEventListener("click", () => {
    $('#play-button').css("animation", "exitBottom 1s");
    setTimeout(function() {
        $('#play-button').slideDown();
        $('#play-button').css("display", "none");
    }, 700);
    $('#title-start').slideUp();
    setTimeout(function() {
        $('#main-content').fadeIn("slow");
    }, 1000);
    pause_button_align();
    setTimeout(revealTheme, 6000);
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    gooeyAudio.play();
});

document.querySelector("#pause-button").addEventListener("click", () => {
    if (songs.length === 0) {
        revealTheme();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    if (effectPlaying === 1) {
        gooeyAudio.pause();
        nextSong(2, songs.splice(randSongIndex(), 1)[0]);
        effectPlaying = 2;
    } else if (effectPlaying === 2) {
        roundAudio.pause();
        nextSong(1, songs.splice(randSongIndex(), 1)[0]);
        effectPlaying = 1;
    }
});

/* Toggle between pause and play
document.querySelector("#pause-button").addEventListener("click", () => {
    if(document.querySelector("#pause-button i").classList.contains("ion-play")) {
        document.querySelector("#pause-button i").classList.add("ion-pause");
        document.querySelector("#pause-button i").classList.remove("ion-play");
    }
    else {
        document.querySelector("#pause-button i").classList.add("ion-play");
        document.querySelector("#pause-button i").classList.remove("ion-pause");
    }
});*/

// if (gooeyAudio.readyState >= gooeyAudio.HAVE_FUTURE_DATA) {
//     console.log("CANPLAY");
//     document.querySelector("#pause-button").removeAttribute("disabled");
//     document.querySelector("#pause-button").style.color = "hsl(var(--hue), 50%, 0%)";
// };

document.querySelector("#gooey-audio").addEventListener("play", () => {
    if (audioContext.state === "suspended" || audioContext.state === "interrupted") {
        audioContext.resume();
    }
    MusicVisuals.start();
});

document.querySelector("#gooey-audio").addEventListener("pause", () => {
    for (let i = 0; i < bars.length; i++) {
        if (bars[i]) {
            // bars[i].style.transform = "translateY(30vh)";
            bars[i].style.visibility = "hidden";
        }
    }
    MusicVisuals.stop();
});

// document.querySelector("#gooey-audio").addEventListener("ended", () => {
//     MusicVisuals.stop();
//     gooeyAudio.src = gooeyAudio.src === "https://api.soundcloud.com/tracks/75308415/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb" ? "https://katiebaca.com/tutorial/odd-look.mp3" : "https://api.soundcloud.com/tracks/75308415/stream?client_id=b8f06bbb8e4e9e201f9e6e46001c3acb";
//     // if (audioContext.state === "suspended") {
//     //     audioContext.resume();
//     // }
//     gooeyAudio.play();
// });

document.querySelector("#gooey-audio").addEventListener("timeupdate", () => {
    // Maybe randomly choose a value between 30-45 sec
    if (gooeyAudio.currentTime >= 30) {
        gooeyAudio.pause();
        nextSong(2, songs.splice(randSongIndex(), 1)[0]);
        effectPlaying = 2;
    }
});

document.querySelector("#round-audio").addEventListener("timeupdate", () => {
    if (roundAudio.currentTime >= 30) {
        roundAudio.pause();
        nextSong(1, songs.splice(randSongIndex(), 1)[0]);
        effectPlaying = 1;
    }
});

// TODO: Give function parameter of which song to play just like how its done in 2nd effect below
function nextSong(eff, song) {
    // Change below line to set song directly instead of horrendous tertiary op
    if (eff === 1) {
        document.querySelector("canvas").style.visibility = "hidden";
        document.querySelector("canvas").style.opacity = "0";
        document.querySelector("canvas").style.transition = "opacity 3s, visibility 3s";
        gooeyAudio.src = song;
        if (audioContext.state === "suspended" || audioContext.state === "interrupted") {
            audioContext.resume();
        }
        gooeyAudio.play();
    } else if (eff === 2) {
        document.querySelector("canvas").style.visibility = "visible";
        document.querySelector("canvas").style.opacity = "1";
        document.querySelector("canvas").style.transition = "opacity 2s";
        Player.nextSong(song);
    }
}

function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

function vw(v) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
}

function vmin(v) {
    return Math.min(vh(v), vw(v));
};
// vmin value
// console.log(vmin(1));

// CIRCULAR ROUND BARS - EFFECT 2

var Framer = {
    countTicks: 360,

    frequencyData: [],

    tickSize: 10,

    PI: 360,

    index: 0,

    loadingAngle: 0,

    init: function (scene) {
        this.canvas = document.querySelector("canvas");
        this.scene = scene;
        this.context = scene.context;
        this.configure();
    },

    configure: function () {
        this.maxTickSize = this.tickSize * 9 * this.scene.scaleCoef;
        this.countTicks = 360 * Scene.scaleCoef;
    },

    draw: function () {
        this.drawTicks();
    },

    drawTicks: function () {
        this.context.save();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.ticks = this.getTicks(this.countTicks, this.tickSize, [0, 90]);
        for (var i = 0, len = this.ticks.length; i < len; ++i) {
            var tick = this.ticks[i];
            this.drawTick(tick.x1, tick.y1, tick.x2, tick.y2);
        }
        this.context.restore();
    },

    drawTick: function (x1, y1, x2, y2) {
        var dx1 = parseInt(this.scene.cx + x1);
        var dy1 = parseInt(this.scene.cy + y1);

        var dx2 = parseInt(this.scene.cx + x2);
        var dy2 = parseInt(this.scene.cy + y2);

        var gradient = this.context.createLinearGradient(dx1, dy1, dx2, dy2);
        // INFO: To change the color of the round bars, do it in below 3 lines
        gradient.addColorStop(0, "#FE4365");
        gradient.addColorStop(0.6, "#FE4365");
        gradient.addColorStop(1, "#F5F5F5");
        this.context.beginPath();
        this.context.strokeStyle = gradient;
        this.context.lineWidth = 2;
        this.context.moveTo(this.scene.cx + x1, this.scene.cx + y1);
        this.context.lineTo(this.scene.cx + x2, this.scene.cx + y2);
        this.context.stroke();
    },

    setLoadingPercent: function (percent) {
        this.loadingAngle = percent * 2 * Math.PI;
    },

    getTicks: function (count, size, animationParams) {
        size = 10;
        var ticks = this.getTickPoitns(count);
        var x1,
            y1,
            x2,
            y2,
            m = [],
            tick,
            k;
        var lesser = 160;
        var allScales = [];
        for (var i = 0, len = ticks.length; i < len; ++i) {
            var coef = 1 - i / (len * 2.5);
            var delta =
                ((this.frequencyData[i] || 0) - lesser * coef) * this.scene.scaleCoef;
            if (delta < 0) {
                delta = 0;
            }
            tick = ticks[i];
            if (
                animationParams[0] <= tick.angle &&
                tick.angle <= animationParams[1]
            ) {
                k =
                    this.scene.radius /
                    (this.scene.radius -
                        this.getSize(tick.angle, animationParams[0], animationParams[1]) -
                        delta);
            } else {
                k = this.scene.radius / (this.scene.radius - (size + delta));
            }
            x1 = tick.x * (this.scene.radius - size);
            y1 = tick.y * (this.scene.radius - size);
            x2 = x1 * k;
            y2 = y1 * k;
            m.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
            if (i < 20) {
                var scale = delta / 50;
                scale = scale < 1 ? 1 : scale;
                allScales.push(scale);
            }
        }
        var sum =
            allScales.reduce(function (pv, cv) {
                return pv + cv;
            }, 0) / allScales.length;
        // Change this to smaller or remove
        // this.canvas.style.transform = "scale(" + sum + ")";
        return m;
    },

    getSize: function (angle, l, r) {
        var m = (r - l) / 2;
        var x = angle - l;
        var h;

        if (x == m) {
            return this.maxTickSize;
        }
        var d = Math.abs(m - x);
        var v = 70 * Math.sqrt(1 / d);
        if (v > this.maxTickSize) {
            h = this.maxTickSize - d;
        } else {
            h = Math.max(this.tickSize, v);
        }

        if (this.index > this.count) {
            this.index = 0;
        }

        return h;
    },

    getTickPoitns: function (count) {
        var coords = [],
            step = this.PI / count;
        for (var deg = 0; deg < this.PI; deg += step) {
            var rad = (deg * Math.PI) / (this.PI / 2);
            coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
        }
        return coords;
    }
};


// INFO: Delete this as its not used but test properly
var Tracker = {
    innerDelta: 20,

    lineWidth: 70,

    prevAngle: 0.5,

    angle: 0,

    animationCount: 10,

    pressButton: false,

    init: function (scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
    },

    initHandlers: function () {
        var that = this;

        this.scene.canvas.addEventListener("mousedown", function (e) {
            if (that.isInsideOfSmallCircle(e) || that.isOusideOfBigCircle(e)) {
                return;
            }
            that.prevAngle = that.angle;
            that.pressButton = true;
            that.stopAnimation();
            that.calculateAngle(e, true);
        });

        window.addEventListener("mouseup", function () {
            if (!that.pressButton) {
                return;
            }
            var id = setInterval(function () {
                if (!that.animatedInProgress) {
                    that.pressButton = false;
                    Player.context.currentTime =
                        (that.angle / (2 * Math.PI)) * Player.source.buffer.duration;
                    clearInterval(id);
                }
            }, 100);
        });

        window.addEventListener("mousemove", function (e) {
            if (that.animatedInProgress) {
                return;
            }
            if (that.pressButton && that.scene.inProcess()) {
                that.calculateAngle(e);
            }
        });
    },

    isInsideOfSmallCircle: function (e) {
        var x = Math.abs(e.pageX - this.scene.cx - this.scene.coord.left);
        var y = Math.abs(e.pageY - this.scene.cy - this.scene.coord.top);
        return Math.sqrt(x * x + y * y) < this.scene.radius - 3 * this.innerDelta;
    },

    isOusideOfBigCircle: function (e) {
        return (
            Math.abs(e.pageX - this.scene.cx - this.scene.coord.left) >
            this.scene.radius ||
            Math.abs(e.pageY - this.scene.cy - this.scene.coord.top) >
            this.scene.radius
        );
    },

    draw: function () {
        if (!Player.buffer) {
            return;
        }
        if (!this.pressButton) {
            this.angle =
                (Player.context.currentTime / Player.source.buffer.duration) *
                2 *
                Math.PI || 0;
        }
        this.drawArc();
    },

    drawArc: function () {
        this.context.save();
        this.context.strokeStyle = "rgba(254, 67, 101, 0.8)";
        this.context.beginPath();
        this.context.lineWidth = this.lineWidth;

        this.r = this.scene.radius - (this.innerDelta + this.lineWidth / 2);
        this.context.arc(
            this.scene.radius,
            this.scene.radius,
            this.r,
            0,
            this.angle,
            false
        );
        this.context.stroke();
        this.context.restore();
    },

    calculateAngle: function (e, animatedInProgress) {
        this.animatedInProgress = animatedInProgress;
        this.mx = e.pageX;
        this.my = e.pageY;
        this.angle = Math.atan(
            (this.my - this.scene.cy - this.scene.coord.top) /
            (this.mx - this.scene.cx - this.scene.coord.left)
        );
        if (this.mx < this.scene.cx + this.scene.coord.left) {
            this.angle = Math.PI + this.angle;
        }
        if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        if (animatedInProgress) {
            this.startAnimation();
        } else {
            this.prevAngle = this.angle;
        }
    },

    startAnimation: function () {
        var that = this;
        var angle = this.angle;
        var l = Math.abs(this.angle) - Math.abs(this.prevAngle);
        var step = l / this.animationCount,
            i = 0;
        var f = function () {
            that.angle += step;
            if (++i == that.animationCount) {
                that.angle = angle;
                that.prevAngle = angle;
                that.animatedInProgress = false;
            } else {
                that.animateId = setTimeout(f, 20);
            }
        };

        this.angle = this.prevAngle;
        this.animateId = setTimeout(f, 20);
    },

    stopAnimation: function () {
        clearTimeout(this.animateId);
        this.animatedInProgress = false;
    }
};

var Scene = {
    padding: 120,

    minSize: 740,

    optimiseHeight: 982,

    _inProcess: false,

    init: function () {
        this.canvasConfigure();
        this.initHandlers();

        Framer.init(this);
        // Tracker.init(this);
        Controls.init(this);

        this.startRender();
    },

    canvasConfigure: function () {
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = "#FE4365";
        this.calculateSize();
    },

    calculateSize: function () {
        this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);
        // var size = Math.max(this.minSize, document.body.clientHeight);
        var size = Math.max(this.minSize, 100 * vmin(1));
        this.canvas.setAttribute("width", size);
        this.canvas.setAttribute("height", size);

        console.log(size); // CONTINUE FROM HERE
        // this.canvas.style.marginTop = -size / 2 + 'px';
        // this.canvas.style.marginLeft = -size / 2 + 'px';

        this.width = size;
        this.height = size;

        this.radius = (size - this.padding * 2) / 2;
        this.cx = this.radius + this.padding;
        this.cy = this.radius + this.padding;
        this.coord = this.canvas.getBoundingClientRect();
    },

    initHandlers: function () {
        var that = this;
        window.onresize = function () {
            that.canvasConfigure();
            Framer.configure();
            that.render();
        };
    },

    render: function () {
        var that = this;
        requestAnimationFrame(function () {
            that.clear();
            that.draw();
            if (that._inProcess) {
                that.render();
            }
        });
    },

    clear: function () {
        this.context.clearRect(0, 0, this.width, this.height);
    },

    draw: function () {
        Framer.draw();
        // Tracker.draw();
        Controls.draw();
    },

    startRender: function () {
        this._inProcess = true;
        this.render();
    },

    stopRender: function () {
        this._inProcess = false;
    },

    inProcess: function () {
        return this._inProcess;
    }
};

var Controls = {
    playing: false,

    init: function (scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
        // this.timeControl = document.querySelector(".time");
    },

    initHandlers: function () {
        this.initPlayButton();
        this.initPauseButton();
        // this.initSoundButton();
        // this.initPrevSongButton();
        // this.initNextSongButton();
        // this.initTimeHandler();
    },

    initPlayButton: function () {
        var that = this;
        this.playButton = document.querySelector("#gooey-audio");
        this.playButton.addEventListener("mouseup", function () {
            // that.playButton.style.display = "none";
            // that.pauseButton.style.display = "inline-block";
            Player.play();
            that.playing = true;
        });
    },

    initPauseButton: function () {
        var that = this;
        this.pauseButton = document.querySelector("#gooey-audio");
        this.pauseButton.addEventListener("mouseup", function () {
            // that.playButton.style.display = "inline-block";
            // that.pauseButton.style.display = "none";
            Player.pause();
            that.playing = false;
        });
    },

    // initPrevSongButton: function () {
    //     var that = this;
    //     this.prevSongButton = document.querySelector(".prevSong");
    //     this.prevSongButton.addEventListener("mouseup", function () {
    //         Player.prevTrack();
    //         // that.playing && Player.play();
    //     });
    // },

    // initNextSongButton: function () {
    //     var that = this;
    //     this.nextSongButton = document.querySelector(".nextSong");
    //     this.nextSongButton.addEventListener("mouseup", function () {
    //         Player.nextTrack();
    //         // that.playing && Player.play();
    //     });
    // },

    // initTimeHandler: function () {
    //     var that = this;
    //     setTimeout(function () {
    //         var rawTime = parseInt(Player.context.currentTime || 0);
    //         var secondsInMin = 60;
    //         var min = parseInt(rawTime / secondsInMin);
    //         var seconds = rawTime - min * secondsInMin;
    //         if (min < 10) {
    //             min = "0" + min;
    //         }
    //         if (seconds < 10) {
    //             seconds = "0" + seconds;
    //         }
    //         var time = min + ":" + seconds;
    //         that.timeControl.textContent = time;
    //         that.initTimeHandler();
    //     }, 300);
    // },

    draw: function () {
        this.drawPic();
    },

    drawPic: function () {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = "rgba(254, 67, 101, 0.85)";
        this.context.lineWidth = 1;
        var x = Tracker.r / Math.sqrt(Math.pow(Math.tan(Tracker.angle), 2) + 1);
        var y = Math.sqrt(Tracker.r * Tracker.r - x * x);
        if (this.getQuadrant() == 2) {
            x = -x;
        }
        if (this.getQuadrant() == 3) {
            x = -x;
            y = -y;
        }
        if (this.getQuadrant() == 4) {
            y-- >= -y;
        }
        this.context.arc(
            this.scene.radius + x,
            this.scene.radius + y,
            10,
            0,
            Math.PI * 2,
            false
        );
        this.context.fill();
        this.context.restore();
    },

    getQuadrant: function () {
        if (0 <= Tracker.angle && Tracker.angle < Math.PI / 2) {
            return 1;
        }
        if (Math.PI / 2 <= Tracker.angle && Tracker.angle < Math.PI) {
            return 2;
        }
        if (Math.PI < Tracker.angle && Tracker.angle < (Math.PI * 3) / 2) {
            return 3;
        }
        if ((Math.PI * 3) / 2 <= Tracker.angle && Tracker.angle <= Math.PI * 2) {
            return 4;
        }
    }
};

var Player = {
    roundAudio: document.querySelector("#round-audio"),
    buffer: null,

    duration: 0,

    tracks: [
        {
            artist: "Kavinsky",
            song: "Odd Look ft. The Weeknd",
            url: "/assets/songs/odd-look.mp3"
        }
    ],

    init: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.context.suspend && this.context.suspend();
        this.firstLaunch = true;
        try {
            this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
            this.javascriptNode.connect(this.context.destination);
            this.analyser = this.context.createAnalyser();
            this.analyser.connect(this.javascriptNode);
            this.analyser.smoothingTimeConstant = 0.6;
            this.analyser.fftSize = 2048;
            // this.source = this.context.createBufferSource();
            this.source = this.context.createMediaElementSource(this.roundAudio);
            this.destination = this.context.destination;
            // this.loadTrack(0);

            this.gainNode = this.context.createGain();
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.gainNode.connect(this.destination);

            this.initHandlers();
        } catch (e) {
            console.log(e);
            Framer.setLoadingPercent(1);
        }
        Framer.setLoadingPercent(1);
        Scene.init();
    },

    loadTrack: function (index) {
        var that = this;
        var request = new XMLHttpRequest();
        var track = this.tracks[index];

        // document.querySelector(".song .artist").textContent = track.artist;
        // document.querySelector(".song .name").textContent = track.song;
        this.currentSongIndex = index;

        request.open("GET", track.url, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
            that.context.decodeAudioData(request.response, function (buffer) {
                that.source.buffer = buffer;
            });
        };

        request.send();
    },

    nextTrack: function () {
        return;
        ++this.currentSongIndex;
        if (this.currentSongIndex == this.tracks.length) {
            this.currentSongIndex = 0;
        }

        this.loadTrack(this.currentSongIndex);
    },

    prevTrack: function () {
        return;
        --this.currentSongIndex;
        if (this.currentSongIndex == -1) {
            this.currentSongIndex = this.tracks.length - 1;
        }

        this.loadTrack(this.currentSongIndex);
    },

    // Call this for playing audio
    play: function () {
        if (this.context.state === "suspended" || this.context.state === "interrupted") {
            this.context.resume();
        }
        // this.context.resume && this.context.resume();
        if (this.firstLaunch) {
            // this.source.start();
            this.roundAudio.play();
            this.firstLaunch = false;
        }
    },

    stop: function () {
        this.roundAudio.currentTime = 0;
        this.context.suspend();
    },

    // This is the function I made for our use, only parameter required is the correct song URL
    nextSong: function (song) {
        if (!this.roundAudio.paused) { this.roundAudio.pause(); }
        this.roundAudio.src = song;
        if (this.context.state === "suspended" || this.context.state === "interrupted") {
            this.context.resume();
        }
        this.roundAudio.play();
    },

    // Call this function or the "stop" function so we can then change the effect
    pause: function () {
        this.context.suspend();
    },

    initHandlers: function () {
        var that = this;

        this.javascriptNode.onaudioprocess = function () {
            Framer.frequencyData = new Uint8Array(that.analyser.frequencyBinCount);
            that.analyser.getByteFrequencyData(Framer.frequencyData);
        };
    }
};

Player.init();

function revealTheme() {
    if (effectPlaying === 1) {
        gooeyAudio.pause();
    } else if (effectPlaying === 2) {
        roundAudio.pause();
    }
    $('#audios').html('');
    document.querySelector("body").style.overflow = "auto";
    setTimeout(function() {
        $("#starting").fadeOut("fast");
        $('#main-content').fadeOut("fast");
        $('#theme-reveal').fadeIn("slow");
        $("body").css("background-color", "#101010");
        // $('#logo').attr("src", "assets/img/tedx-white.png");
    }, 500);
}
