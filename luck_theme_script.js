const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 800);

const playerImage = new Image();
playerImage.src = "luck_theme_assets/luck_cat_large.png";

const rayImage = new Image();
rayImage.src = "luck_theme_assets/Rays.png";

const coinImage = new Image();
coinImage.src = "luck_theme_assets/coin.png"; // Add the coin image

let score = 0;

const spriteWidth = 756;
const spriteHeight = 567;

let sprite_itr = 0;
let currFrame = 0;
const staggerFrames = 10;

let angle = 0; // Initialize rotation angle

let clickCount = 0; // Track the number of clicks
let showCoins = false; // Control when to show the coin shower
let coins = []; // Array to store the falling coins

// Coin object constructor
function Coin(x, y) {
  this.x = x;
  this.y = y;
  this.speed = Math.random() * 3 + 2; // Random fall speed
}

canvas.onclick = () => {
  score++;
  clickCount++; // Increment click count
  // console.log("Your score is " + score);

  // Trigger coin shower after 15 clicks
  if (clickCount >= 7) {
    //increment fortune by 10
    incrementFortune(11);
    showCoins = true;
    clickCount = 0; // Reset click count after showing the coins

    // Create a bunch of coins with random starting positions
    for (let i = 0; i < 20; i++) {
      coins.push(
        new Coin(Math.random() * CANVAS_WIDTH, Math.random() * -CANVAS_HEIGHT)
      );
    }
  }
};

function animateCoins() {
  if (showCoins) {

    // Loop through all coins and update their position
    for (let i = 0; i < coins.length; i++) {
      let coin = coins[i];
      ctx.drawImage(coinImage, coin.x, coin.y, 50, 50); // Draw each coin
      coin.y += coin.speed; // Move coin down

      // Remove coins that fall off the canvas
      if (coin.y > CANVAS_HEIGHT) {
        coins.splice(i, 1);
        i--;
      }
    }

    // If all coins are gone, stop showing coins
    if (coins.length === 0) {
      showCoins = false;

    }
  }
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Save the current context
  ctx.save();

  // Move to the center of the canvas to rotate the ray image
  ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.rotate((angle * Math.PI) / 180); // Rotate in radians

  // Draw the ray image behind the sprite
  ctx.drawImage(
    rayImage,
    -CANVAS_WIDTH / 2,
    -CANVAS_HEIGHT / 2,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  // Restore the context to its original state before drawing the sprite
  ctx.restore();

  // Draw the sprite on top of the rays
  ctx.drawImage(
    playerImage,
    0,
    sprite_itr * spriteHeight,
    spriteWidth,
    spriteHeight,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  if (currFrame % staggerFrames == 0) {
    sprite_itr = (sprite_itr + 1) % 13;
    currFrame = 0;
  }
  currFrame++;

  // Animate coins if needed
  animateCoins();

  // Increment the rotation angle for anticlockwise rotation
  angle -= 1;

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("scroll", function () {
  var petMeText = document.querySelector(".pet-me-text");
  var scrollPosition = window.scrollY || document.documentElement.scrollTop;

  // Get the height of the div to know when it's out of view
  var divPosition = petMeText.offsetTop + petMeText.offsetHeight;

  // Hide div when scrolled past
  if (scrollPosition > divPosition) {
    petMeText.style.opacity = "0";
  } else {
    petMeText.style.opacity = "1";
  }
});

//fortune counter
function incrementFortune(x=111) {
  console.log('called');
  let scoreText = document.getElementById('luck-bar').textContent;
  let currentScore = parseInt(scoreText.replace('Fortune Count: ', ''));
  currentScore += x;
  document.getElementById('luck-bar').textContent = 'Fortune Count: ' + currentScore;
}