const correctSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
const wrongSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';

const boxes = document.querySelectorAll('.box');
const score = document.querySelector('#score');

export let correctCount = 0;
let correctBox = Math.floor(Math.random() * 6);

export function startGame() {
  correctBox = Math.floor(Math.random() * 6);
  let boxColor = generateRandomColorRgb();
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].removeEventListener('click', correctBoxClick);
    boxes[i].style.filter = '';
    if (i === correctBox) {
      boxes[i].style.backgroundColor = boxColor;
      boxes[i].style.filter = `brightness(${Math.random() > 0.5 ? 1.25 : 0.75})`;
      boxes[i].addEventListener('click', correctBoxClick);
    } else {
      boxes[i].style.backgroundColor = boxColor;
      boxes[i].addEventListener('click', e => {});
    }
  }
}

function correctBoxClick() {
  correctCount += 1;
  score.innerHTML = correctCount;
  startGame();
}

function generateRandomColorRgb() {
  let red = 50 + Math.floor(Math.random() * 205);
  let green = 50 + Math.floor(Math.random() * 205);
  let blue = 50 + Math.floor(Math.random() * 205);
  return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}
