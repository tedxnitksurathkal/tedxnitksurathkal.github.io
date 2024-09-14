let blocks = [];
let score = 0;
let blockCount = 0;  // Track the number of blocks selected
let startTime;
let gameOver = false;
let interval;
let firstClick = true;

document.addEventListener("DOMContentLoaded", function() {
    const grid = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const finalScoreElement = document.getElementById('final-score');
    const gameOverContainer = document.getElementById('game-over');
    const restartBtn = document.getElementById('restart-btn');

    // Initialize blocks with 22 diamonds and 3 bombs
    blocks = new Array(22).fill('diamond').concat(new Array(3).fill('bomb'));
    blocks = shuffleArray(blocks);

    // Create the 5x5 grid of buttons with images
    blocks.forEach((block, index) => {
        const button = document.createElement('button');
        const img = document.createElement('img');
        img.src = 'X.jpeg';  // Set initial image to 'X.jpeg'
        button.appendChild(img);

        button.addEventListener('click', function() {
            if (gameOver || button.classList.contains('clicked')) return;

            if (firstClick) {
                startTimer(); // Start the timer only on the first click
                firstClick = false;
            }
            // Play sound effect
function playSoundEffect(type) {
    let audio;
    if (type === 'diamond') {
        audio = new Audio('coin.mp3');
    } else if (type === 'bomb') {
        audio = new Audio('bomb.mp3');
    }
    audio.play();
}
            button.classList.add('clicked');
            blockCount++;  // Increment block count when a block is clicked
            const currentTime = Math.round((Date.now() - startTime) / 1000);

            if (block === 'diamond') {
                playSoundEffect('diamond')
                const timeTaken = currentTime;
                const points = calculateScore(timeTaken, blockCount);  // Calculate score based on time and blocks chosen
                score += points;
                scoreElement.textContent = Math.round(score);  // Round off the score to the nearest integer
                img.src = 'diamond.png';  // Change image to 'diamond.jpeg'
            } else if (block === 'bomb') {
                img.src = 'bomb.png';  // Change image to 'bomb.jpeg'
                playSoundEffect('bomb')

                // Change background color to red with smooth transition
                document.body.style.background = 'linear-gradient(to top right, black, red)';
    document.body.style.transition = 'background 1s ease'; 

                // Disable all buttons except the restart button
                disableAllButtons();

                // End the game after a 1-second delay
                setTimeout(() => endGame(), 1000);
            }
        });

        grid.appendChild(button);
    });

    // Restart game event listener
    restartBtn.addEventListener('click', function() {
        resetGame();
    });
});

// Start the real-time timer
function startTimer() {
    startTime = Date.now();
    interval = setInterval(() => {
        const currentTime = Math.round((Date.now() - startTime) / 1000);
        const timeElement = document.getElementById('time');
        timeElement.textContent = currentTime;
    }, 1000);
}

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Disable all buttons except the restart button
function disableAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id !== 'restart-btn') {  // Check if the button is not the restart button
            button.disabled = true;
        }
    });
}

// Calculate score based on time taken and number of blocks chosen
function calculateScore(timeTaken, blockCount) {
    // Base score is related to the number of blocks chosen and time taken.
    let baseScore = 10;  // Base score for selecting a diamond
    let timeBonus = Math.max(0, 15 - timeTaken);  // Bonus score that decreases with time (caps at 10 seconds)
    let blockBonus = Math.pow(1.1, blockCount);  // Exponential increase in score based on blocks chosen
    return (baseScore + timeBonus) * blockBonus;
}

// End game when bomb is clicked
function endGame() {
    gameOver = true;
    clearInterval(interval);  // Stop the timer
    const finalTime = Math.round((Date.now() - startTime) / 1000);

    // Show the final score and restart button
    const gameOverContainer = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    finalScoreElement.textContent = Math.round(score);  // Display the rounded score
    gameOverContainer.style.display = 'block';
}

// Reset the game for a new round
function resetGame() {
    gameOver = false;
    score = 0;
    blockCount = 0;
    firstClick = true;

    // Clear the grid
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    // Hide the game over container
    const gameOverContainer = document.getElementById('game-over');
    gameOverContainer.style.display = 'none';

    // Reset the background color
    document.body.style.backgroundColor = 'black';

    // Reset score and time
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    scoreElement.textContent = 0;
    timeElement.textContent = 0;

    // Restart the game
    document.dispatchEvent(new Event('DOMContentLoaded'));
}


