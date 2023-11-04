// Constants
const canvasWidth = 400;
const canvasHeight = 400;
const playerSpeed = 4;
const bulletSpeed = 4;
const enemySpeed = 2;
const enemySpacing = 40;
const levelEnemyCount = 4;

// Player variables
let playerX;
let playerY;
let playerWidth = 40;
let playerHeight = 20;

// Bullet variables
let playerBullets = [];
let enemyBullets = [];

// Enemy variables
let enemies = [];
let enemyDirection = 1; // 1 for right, -1 for left
let enemyYIncrement = 20;
let level = 1;

// Game state
let isGamePaused = false;
let isGameOver = false;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  playerX = canvasWidth / 2;
  playerY = canvasHeight - playerHeight;

  createEnemies();
}

function draw() {
  background(0);

  if (isGamePaused) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Press SPACE to start", canvasWidth / 2, canvasHeight / 2);
  } else if (isGameOver) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(`Game Over\nScore: ${levelScore}`, canvasWidth / 2, canvasHeight / 2);
  } else {
    // Game logic
    movePlayer();
    movePlayerBullets();
    moveEnemies();
    moveEnemyBullets();
    checkCollisions();

    // Draw player
    fill(0, 0, 255);
    rect(playerX, playerY, playerWidth, playerHeight);

    // Draw bullets
    for (let bullet of playerBullets) {
      fill(255, 0, 0);
      rect(bullet.x, bullet.y, 5, 10);
    }

    for (let bullet of enemyBullets) {
      fill(0, 255, 0);
      rect(bullet.x, bullet.y, 5, 10);
    }

    // Draw enemies
    for (let enemy of enemies) {
      fill(0, 255, 0);
      rect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }
}

function keyPressed() {
  if (isGamePaused && key === ' ') {
    isGamePaused = false;
  } else if (isGameOver && key === ' ') {
    isGameOver = false;
    isGamePaused = true; // Pause until space is pressed again to start
    level = 1;
    playerBullets = [];
    enemyBullets = [];
    createEnemies();
  } else if (!isGamePaused && !isGameOver) {
    if (key === ' ' && playerBullets.length < 3) {
      playerBullets.push({ x: playerX + playerWidth / 2, y: playerY });
    }
  }
}

function createEnemies() {
  enemies = [];
  for (let i = 0; i < levelEnemyCount; i++) {
    for (let j = 0; j < 6; j++) {
      enemies.push({
        x: j * enemySpacing + 30,
        y: i * enemySpacing + 30,
        width: 30,
        height: 30,
        direction: 1,
        fireCooldown: Math.random() * 1200 + 10,
      });
    }
  }
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW) && playerX > 0) {
    playerX -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW) && playerX + playerWidth < canvasWidth) {
    playerX += playerSpeed;
  }
}

function movePlayerBullets() {
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    let bullet = playerBullets[i];
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) {
      playerBullets.splice(i, 1);
    }
  }
}

function moveEnemies() {
  for (let enemy of enemies) {
    enemy.x += enemy.direction * enemySpeed;

    if (
      enemy.x + enemy.width >= canvasWidth ||
      enemy.x <= 0
    ) {
      enemy.direction *= -1;
      enemy.y += enemyYIncrement;
    }

    enemy.fireCooldown--;
    if (enemy.fireCooldown <= 0) {
      enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
      enemy.fireCooldown = Math.random() * 1200 + 10;
    }
  }
}

function moveEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let bullet = enemyBullets[i];
    bullet.y += bulletSpeed;
    if (bullet.y > canvasHeight) {
      enemyBullets.splice(i, 1);
    }
  }
}

function checkCollisions() {
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    let playerBullet = playerBullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      if (
        playerBullet.x + 5 > enemy.x &&
        playerBullet.x < enemy.x + enemy.width &&
        playerBullet.y < enemy.y + enemy.height
      ) {
        playerBullets.splice(i, 1);
        enemies.splice(j, 1);
         levelScore++;
      }
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let enemyBullet = enemyBullets[i];
    if (
      enemyBullet.x + 5 > playerX &&
      enemyBullet.x < playerX + playerWidth &&
      enemyBullet.y + 10 > playerY
    ) {
      gameOver();
    }
  }

  if (enemies.length === 0) {
    level++;
    createEnemies();
  }
}

function gameOver() {
  isGameOver = true;
  isGamePaused = true;
}

// You can keep track of the player's score using a variable
let levelScore = 0;
