const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 800);

const playerImage = new Image();
playerImage.src = "luck_theme_assets/luck_cat_large.png";

const rayImage = new Image();
rayImage.src = "luck_theme_assets/Rays.png";

let score = 0;

const spriteWidth = 756;
const spriteHeight = 567;

let sprite_itr = 0;
let currFrame = 0;
const staggerFrames = 10;

let angle = 0; // Initialize rotation angle

canvas.onclick = () => {
  score++;
  console.log("Your score is " + score);
};

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

  // Increment the rotation angle for anticlockwise rotation
  angle -= 1;

  requestAnimationFrame(animate);
}

animate();
