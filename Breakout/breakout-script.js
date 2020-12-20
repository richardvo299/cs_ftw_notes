
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

/*
Variables about our Game's State
*/
let ballRadius = 10;
let x = canvas.width/2;
let y = 300;
let dx = 3;
let dy = 3;

// Brick Variables
let brickWidth = 75;
let brickHeight = 20;
let bricks = [];
let brickColumnCount = 5;
let brickRowCount = 3;

let brickOffsetLeft = 30;
let brickOffsetTop = 70;
let brickPadding = 10;

// Controlling Variables
let leftPressed = false;
let rightPressed = false;

// Paddle Variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight;

// Background Image
const bg = new Image();
bg.src = "bg.jpg"

// Life Variables
let life = 3;
const lifeImg = new Image();
lifeImg.src = "life.png";

// Score Variables
let score = 0;
const scoreUnit = 10;
const scoreImg = new Image();
scoreImg.src = "score.png";

// Game over Variables
let gameOver = false; 

// Sound Variables
const hitSound = new Audio();
hitSound.src = "hit.mp3";

const winSound = new Audio();
winSound.src = "win.mp3";

const lifeLostSound = new Audio();
lifeLostSound.src = "lifelost.mp3";

const pointSound = new Audio();
pointSound.src = "point.wav";
/**********************/

function createBricks() {
  for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[r][c] = {
      x : brickOffsetLeft + c * (brickWidth + brickPadding),
      y : brickOffsetTop + r * (brickHeight + brickPadding),
      status: true
      }
    }
  }
}

createBricks();

function drawBricks(){
  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      let b = bricks[r][c];
      // If the brick is still there
      if(b.status){
        ctx.fillStyle ="#C77361";
        ctx.fillRect(b.x, b.y, brickWidth, brickHeight);
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#C7A34E";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "	#cd8500";
  ctx.fill();
  ctx.closePath();
}

// Controlling

function keydownHandler(event) {
  if (event.key === "ArrowRight") {
    rightPressed = true;
  }
  else if (event.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyupHandler(event) {
  if (event.key === "ArrowRight") {
    rightPressed = false;
  }
  else if (event.key === "ArrowLeft") {
    leftPressed = false;
  }
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

function movePaddle() {
if (rightPressed && paddleX + paddleWidth < canvas.width) {
  paddleX = paddleX + 5;
}
else if (leftPressed && paddleX > 0) {
  paddleX = paddleX - 5;
}
}

// Game operating

function ballBrickCollision() {
  for(let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      let b = bricks[r][c];
      if (b.status) {
        if(x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
          pointSound.play();
          dy = -dy;
          console.log("hey you hit the brick");
          b.status = false;
          score += scoreUnit;
          if(score == brickRowCount*brickColumnCount*scoreUnit) {
            winSound.play();
            alert("WINNER WINNER CHICKEN DINNER!");
            document.location.reload();
            clearInterval(interval);
        }
        }
      }
    }
  }
}

function update() {
  if (x - ballRadius < 0 || x + ballRadius > canvas.width) {
    dx = -dx;
  }
  if (y - ballRadius < 0) {
    dy = -dy;
  }

  // hit the paddle
  if(x >= paddleX && x <= paddleX + paddleWidth) {
    if(y + ballRadius >= canvas.height - paddleHeight) {
      hitSound.play();
      dy = -dy;
    }
  }

  // hit the ground
  if (y + ballRadius > canvas.height) {
    life--;
    lifeLostSound.play();
    if(life == 0) {
      alert("GO CRY IN THE CORNER!");
      document.location.reload();
      clearInterval(interval);}
    else {resetBall();}
  }
  x = x + dx;
  y = y + dy;
  movePaddle();
  ballBrickCollision();
}

function resetBall() {
  x = canvas.width/2;
  y = paddleY - ballRadius;
  dx = 3 * (Math.random() * 2 - 1);
  dy = -3;
}

function showGameStats (text,textX, textY, img, imgX, imgY){
  // draw text
  ctx.fillStyle = "#FFF";
  ctx.font = "30px Helvetica";
  ctx.fillText(text, textX, textY);

  //draw image
  ctx.drawImage(img, imgX, imgY, width=24, height=24);
}

function endGame(){
  if (life<=0);
    gameOver=true;
    console.log="game over";
}

function draw() {

  drawBall();
  drawBricks();
  drawPaddle();

  //show score
  showGameStats(score, 58, 28, scoreImg, 25, 5);
  //show life
  showGameStats(life, canvas.width-80, 28, lifeImg, canvas.width-55, 5);
}

function main() {
  ctx.drawImage(bg, 0, 0);
  update();
  draw();
  window.requestAnimationFrame(main);
}

main();