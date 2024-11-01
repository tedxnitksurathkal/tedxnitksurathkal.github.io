var errors = 0;
var score = 0;
var matchedPairs = 0; // Track matched pairs
var totalPairs = 8; // Total pairs in the game
var startTime, timerInterval;
var cardList = ["2", "3", "4", "5", "6", "7", "8", "9"];
var cardSet, board = [];
var rows = 4, columns = 4;
var card1Selected, card2Selected;
var flipTimeout;

window.onload = function() {
    shuffleCards();
    startGame();
    document.getElementById("timer").innerText = "Time: 0s"; // Initialize timer display
}

function shuffleCards() {
    cardSet = cardList.concat(cardList);
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length);
        [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]]; // Swap
    }
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg);
            let card = document.createElement("img");
            card.id = `${r}-${c}`;
            card.src = cardImg + ".png";
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
        }
        board.push(row);
    }
    setTimeout(hideCards, 10);
}

function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            document.getElementById(`${r}-${c}`).src = "back.png";
        }
    }
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        let timeElapsed = Math.floor((new Date() - startTime) / 1000);
        document.getElementById("timer").innerText = `Time: ${timeElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function selectCard() {
    if (!startTime) startTimer();  // Start timer only on first card click
    
    if (this.src.includes("back") && !card2Selected) { // Only proceed if a card pair isn’t being processed
        if (flipTimeout) clearTimeout(flipTimeout); // Clear any pending timeout to avoid freezing
        
        if (!card1Selected) {
            card1Selected = this;
            revealCard(card1Selected);
        } else if (this != card1Selected) {
            card2Selected = this;
            revealCard(card2Selected);
            flipTimeout = setTimeout(checkMatch, 500); // Check for match after a short delay
        }
    }
}

function revealCard(card) {
    let [r, c] = card.id.split("-").map(Number);
    card.src = board[r][c] + ".png";
}

function checkMatch() {
    if (card1Selected && card2Selected) { // Proceed only if both cards are selected
        if (card1Selected.src === card2Selected.src) {
            let timeTaken = Math.floor((new Date() - startTime) / 1000);
            let tempScore = 50 - (errors * 5) - (timeTaken * 0.2);
            score += tempScore < 5 ? 5 : tempScore;
            errors = 0;
            document.getElementById("score").innerText = score;
            matchedPairs++; // Increment matched pairs

            if (matchedPairs === totalPairs) { // Check if all pairs are matched
                endGame();
            }
        } else {
            card1Selected.src = "back.png";
            card2Selected.src = "back.png";
            errors++;
        }
        card1Selected = null;
        card2Selected = null;
    }
}

function endGame() {
    stopTimer();
    document.getElementById("finalScore").innerText = score;
    document.getElementById("endModal").style.display = "flex"; // Show modal
}

function restartGame() {
    location.reload(); // Reload the page to restart the game
}

function revealTheme() {
    alert("The theme is 'Age as a Lens' – exploring how different age groups perceive life differently!");
}
