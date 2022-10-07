const correctSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
const wrongSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';

const startModal = document.querySelector('#start-modal');
const themeReveal = document.querySelector('#theme-reveal');
const revealGame = document.querySelector('#reveal-game');
const boxes = document.querySelectorAll('.box');

const timer = document.querySelector('#timer');
const score = document.querySelector('#score');
let correctCount = 0;
let correctBox = Math.floor(Math.random() * 6);

export function startGame() {
  correctBox = Math.floor(Math.random() * 6);
  let boxColor = generateRandomColorRgb();
  for (let i = 0; i < boxes.length; i++) {
    if (i === correctBox) {
      boxes[i].style.backgroundColor = boxColor[0];
      boxes[i].addEventListener('click', e => {
        correctCount += 1;
        score.innerHTML = correctCount;
      });
    } else {
      boxes[i].style.backgroundColor = boxColor[1];
    }
  }
}

export function startTimer() {
  let timer = document.querySelector('#timer');

  function updateTimer() {
    let time = timer.innerHTML.split(':');
    let minutes = parseInt(time[0]);
    let seconds = parseInt(time[1]);
    if (minutes == 0 && seconds == 0) {
      clearInterval(interval);
      revealTheme();
      return;
    }
    seconds -= 1;
    if (seconds == -1) {
      minutes -= 1;
      seconds = 59;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    timer.innerHTML = minutes + ':' + seconds;
  }

  let interval = setInterval(updateTimer, 1000);
}

function revealTheme() {
  revealGame.style.display = 'none';
  themeReveal.style.display = 'block';
}

function generateRandomColorRgb() {
  let red = Math.floor(Math.random() * 200);
  let green = Math.floor(Math.random() * 200);
  let blue = Math.floor(Math.random() * 200);
  const commonBoxColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

  const shade = Math.floor(Math.random() * 3);
  red += shade === 0 ? 40 : 0;
  green += shade === 1 ? 40 : 0;
  blue += shade === 2 ? 40 : 0;
  const correctBoxColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

  return [correctBoxColor, commonBoxColor];
}
