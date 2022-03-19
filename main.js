const canvas = document.getElementById("pongGame");
const context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

const netWidth = 3;
const netHeight = canvas.height;

const paddleWidth = 5;
const paddleHeight = 85;

let upPressed = false;
let downPressed = false;

// game net
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#003f00"
};

// players paddle
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    color: "#003f00",
};

// ais paddle
const comp = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    color: "#003f00",
};

// ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#003f00'
};

// draws the net
function drawNet() {
    context.fillStyle = net.color;
    context.fillRect(net.x, net.y, net.width, net.height);
}

// draws the scoreboard
function drawScore(score, x, y) {
    context.fillStyle = "#003f00";
    context.font = "500 40px Verdana";

    context.fillText(score, x, y);
}

// draws the paddles
function drawPaddle(color, x, y, width, height) {
    context.fillStyle = color;

    context.fillRect(x, y, width, height);
}

// draws the ball
function drawBall() {
    context.fillStyle = ball.color;

    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true)
    context.closePath();
    context.fill();
}

// creates eventlistener for key presses
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

// gets activated when we press down a key
function keyDownHandler(event) {
    // get the keyCode
    switch (event.keyCode) {
        // "up arrow" key
        case 38:
            // set upArrowPressed = true
            upPressed = true;
            break;
        // "down arrow" key
        case 40:
            downPressed = true;
            break;
    }
}

// gets activated when we release the key
function keyUpHandler(event) {
    switch (event.keyCode) {
        // "up arraow" key
        case 38:
            upPressed = false;
            break;
        // "down arrow" key
        case 40:
            downPressed = false;
            break;
    }
}

// game over screen
function gameOver() {
    context.beginPath();
    context.lineWidth = "5";
    context.strokeStyle = "#003f00";
    context.rect((canvas.width / 2) - 150, (canvas.height / 2) - 60, 300, 120);
    context.stroke();

    context.fillStyle = "#a0cf0a";
    context.fillRect((canvas.width / 2) - 150, (canvas.height / 2) - 60, 300, 120);

    context.fillStyle = "#003f00";
    context.font = "bold 40px Verdana";

    context.fillText("Game Over", (canvas.width / 2) - 124, (canvas.height / 2) - 16);

    if (player.score >= 20) {
        context.fillText("Player Wins!", (canvas.width / 2) - 141, (canvas.height / 2) + 35);
    } else {
        context.fillText("Comp Wins!", (canvas.width / 2) - 134, (canvas.height / 2) + 35);
    }

    clearInterval(game);
}

// resets for next point
function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

// detects if there is collision 
function collisionDetect(gamer, ball) {
    gamer.top = gamer.y;
    gamer.right = gamer.x + gamer.width;
    gamer.bottom = gamer.y + gamer.height;
    gamer.left = gamer.x;
  
    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
  
    return ball.left < gamer.right && ball.top < gamer.bottom && ball.right > gamer.left && ball.bottom > gamer.top;
}

// updates the game
function update() {
    // move player's paddle
    if (player.y > 0 && upPressed) {
        player.y -= 11;
    } else if ((player.y < canvas.height - player.height) && downPressed) {
        player.y += 11;
    }

    // check if ball collides with top or bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y + ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
    }

    // if ball scores on ai side
    if (ball.x + ball.radius >= canvas.width) {
        player.score += 1;
        reset();
    }

    // if ball scores on player side
    if (ball.x - ball.radius <= 0) {
        comp.score += 1;
        reset();
    }

    // moving the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // move the ai paddle to follow ball
    comp.y += ((ball.y - (comp.y + comp.height / 2))) * 0.15;

    // collision detection on paddles
    let gamer = (ball.x < canvas.width / 2) ? player : comp;

    if (collisionDetect(gamer, ball)) {
        let angle = 0;

        // if ball hit the top of paddle
        if (ball.y < (gamer.y + gamer.height / 2)) {
            // -45 degrees
            angle = -1 * Math.PI / 4;
        } else if (ball.y > (gamer.y + gamer.height / 2)) {
            // bottom of paddle
            // 45 degrees
            angle = Math.PI / 4;
        }

        // adjusts ball velocity according to which paddle was hit
        ball.velocityX = (gamer === player ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // increase ball speed
        ball.speed += 0.2;
    }
}

// dispalys updated information
function render() {
    // clears the screen
    context.fillStyle = "#a0cf0a";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw net
    drawNet();
    // draw scores
    drawScore(player.score, canvas.width / 4, canvas.height / 7);
    drawScore(comp.score, 3 * canvas.width / 4, canvas.height / 7);
    // draw paddles
    drawPaddle(player.color, player.x, player.y, player.width, player.height);
    drawPaddle(comp.color, comp.x, comp.y, comp.width, comp.height);
    // draw ball
    drawBall();
}


function gameLoop() {
    // updates the game
    update();
    // dispalys the game
    render();
    // checks if game is over
    if (player.score >= 20 || comp.score >= 20) {
        gameOver();
    }
}

const game = setInterval(gameLoop, 1000 / 60);