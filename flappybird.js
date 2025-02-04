//board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImgs = [];
let birdImgIndex = 0;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let wingsound = new Audio("./sfx_wing.wav");
let hitsound = new Audio("./sfx_hit.wav");
let bgm = new Audio("./Petalburg_City.mp3");
bgm.loop = true;

let userName = ""; // Store username from JWT
let secretKey = "hritikmani"; // Replace with your actual secret key

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    for (let i = 0; i < 4; i++) {
        let birdImg = new Image();
        birdImg.src = `./flappybird${i}.png`;
        birdImgs.push(birdImg);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Retrieve username from JWT token
    getUserNameFromToken();

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    setInterval(animateBird, 100);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("mousedown", moveBird);
    document.addEventListener("touchstart", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImgs[birdImgIndex], bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        endGame();
    }

    // Draw pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            hitsound.play();
            endGame();
        }
    }

    // Remove old pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Display Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // Display Username
    const usernameDiv = document.getElementById("username");
    if (userName) {
        usernameDiv.textContent = `Player: ${userName}`;
    }

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        bgm.pause();
        bgm.currentTime = 0;
    }
}

function animateBird() {
    birdImgIndex++;
    birdImgIndex %= birdImgs.length;
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (
        e.code == "Space" ||
        e.code == "ArrowUp" ||
        e.code == "KeyX" ||
        e.type == "mousedown" ||
        e.type == "touchstart"
    ) {
        if (bgm.paused) {
            bgm.play();
        }

        velocityY = -6;
        wingsound.play();

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Function to get and decode JWT token
function getUserNameFromToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "entry.html"; // Redirect if token is missing
        return;
    }

    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        const user = JSON.parse(jsonPayload);
        userName = user.name;
        console.log("Player Name:", userName);
    } catch (error) {
        console.error("Error decoding token:", error);
        window.location.href = "entry.html"; // Redirect on token error
    }
}

async function sendScore() {
    if (!userName) return;

    const data = {
        name: userName,
        score: score,
        secretKey: secretKey
    };

    try {
        const response = await fetch("http://localhost:3000/api/user/score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Failed to submit score");

        console.log("Redirecting...");
        setTimeout(() => {
            window.location.assign("aftergame.html");
        }, 100);

    } catch (error) {
        console.error("Error submitting score:", error);
        
            window.location.assign("aftergame.html");
        
    }
}

// Function to handle game over
// Function to handle game over and show the modal
function endGame() {
    gameOver = true;
    sendScore();

    // Show the modal with the final score
    // const modal = document.getElementById("gameOverModal");
    // const finalScoreSpan = document.getElementById("finalScore");
    // finalScoreSpan.textContent = score;
    // modal.style.display = "block";

    // setTimeout(() => {window.location.href = "aftergame.html";},2000)
     // Redirect to entry page
    
    // Stop background music
    bgm.pause();
    bgm.currentTime = 0;
}

// Event listeners for modal buttons
let placePipesInterval, animateBirdInterval;

document.getElementById("playAgainBtn").addEventListener("click", function () {
    // Hide the modal
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";

    // Reset game state
    gameOver = false;
    bird.y = birdY;
    velocityY = 0; // Reset bird velocity
    pipeArray = [];
    score = 0;

    // Clear old intervals before setting new ones
    clearInterval(placePipesInterval);
    clearInterval(animateBirdInterval);

    // Restart intervals
    placePipesInterval = setInterval(placePipes, 1500);
    animateBirdInterval = setInterval(animateBird, 100);

    // Remove previous event listeners to avoid duplicates
    document.removeEventListener("keydown", moveBird);
    document.removeEventListener("mousedown", moveBird);
    document.removeEventListener("touchstart", moveBird);

    // Re-add event listeners
    document.addEventListener("keydown", moveBird);
    document.addEventListener("mousedown", moveBird);
    document.addEventListener("touchstart", moveBird);

    // Restart the game loop
    requestAnimationFrame(update);

    // Play background music
    if (bgm.paused) {
        bgm.play();
    }
});

// Quit Button - Stops Everything Immediately
document.getElementById("quitBtn").addEventListener("click", function (event) {
    event.stopPropagation();
    event.preventDefault();

    // Stop background music immediately
    bgm.pause();
    bgm.currentTime = 0;

    // Clear all game-related intervals
    clearInterval(placePipesInterval);
    clearInterval(animateBirdInterval);

    // Stop game loop
    gameOver = true;

    // Redirect to another page
    window.location.href = "entry.html";
}, { capture: true });

// Play Again Button - Fully Resets the Game
document.getElementById("playAgainBtn").addEventListener("click", function () {
    // Hide the modal
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";

    // Show the board again
    const board = document.getElementById("board");
    board.style.display = "block";

    // Reset game state
    gameOver = false;
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;

    // Remove old intervals (ensure no duplicates)
    if (placePipesInterval) clearInterval(placePipesInterval);
    if (animateBirdInterval) clearInterval(animateBirdInterval);

    // Restart intervals
    placePipesInterval = setInterval(placePipes, 1500);
    animateBirdInterval = setInterval(animateBird, 100);

    // Remove previous event listeners to avoid duplicates
    document.removeEventListener("keydown", moveBird);
    document.removeEventListener("mousedown", moveBird);
    document.removeEventListener("touchstart", moveBird);

    // Re-add event listeners
    document.addEventListener("keydown", moveBird);
    document.addEventListener("mousedown", moveBird);
    document.addEventListener("touchstart", moveBird);

    // Restart the game loop
    requestAnimationFrame(update);

    // Play background music
    if (bgm.paused) {
        bgm.play();
    }
});



// Close modal when user clicks anywhere outside the modal
window.onclick = function(event) {
    const modal = document.getElementById("gameOverModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

