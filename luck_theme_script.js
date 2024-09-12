const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 800;

const playerImage = new Image();
playerImage.src = 'luck_theme_assets/luck_cat_large.png';

let score = 0;

const spriteWidth = 756;
const spriteHeight = 567;

let sprite_itr = 0;
let currFrame = 0;
const staggerFrames = 10;

canvas.onclick = () => {
    score++;
    console.log("You score is " + score);
}

function animate()
{
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 0, sprite_itr * spriteHeight, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if(currFrame % staggerFrames == 0)
    {
        sprite_itr = (sprite_itr + 1)%13;
        currFrame = 0;
    }
    currFrame++;
    requestAnimationFrame(animate);
};

animate();