export let correctCount = 0;

export function startGame() {
  startTimer();
}

function startTimer() {
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
  document.querySelector('.app').style.display = 'none';
  document.querySelector('#theme-reveal').style.display = 'block';
}
