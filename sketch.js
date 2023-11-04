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
let bullets = [];

// Enemy variables
let enemies = [];
let enemyDirection = 1; // 1 for right, -1 for left
let enemyYIncrement = 10;
let level = 1;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  playerX = canvasWidth / 2;
  playerY = canvasHeight - playerHeight;

  createEnemies();
}

function draw() {
  background(0);

  // Draw player
  fill(0, 0, 255);
  rect(playerX, playerY, playerWidth, playerHeight);

  // Move player
  if (keyIsDown(LEFT_ARROW) && playerX > 0) {
    playerX -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW) && playerX + playerWidth < canvasWidth) {
    playerX += playerSpeed;
  }

  // Draw bullets and move them
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    fill(255, 0, 0);
    rect(bullet.x, bullet.y, 5, 10);
    bullet.y -= bulletSpeed;

    // Remove bullets that go off-screen
    if (bullet.y < 0) {
      bullets.splice(i, 1);
    }
  }

  // Move and draw enemies
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    fill(0, 255, 0);
    rect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.x += enemyDirection * enemySpeed;

    // Ensure enemies stay within the canvas boundaries
    if (enemy.x >= ( canvasWidth - enemy.width)){
      enemyDirection*=-1
    }
   // Ensure enemies stay within the canvas boundaries
    if (enemy.x <= 0){
      enemyDirection*=-1
    }
    // Enemy shoots back
    if (random(1) < 0.001) {
      enemyBullets.push({ x: enemy.x + enemy.width / 2, y: enemy.y });
    }

    // Check for bullet collisions with enemies
    for (let j = bullets.length - 1; j >= 0; j--) {
      let bullet = bullets[j];
      if (
        bullet.x + 5 > enemy.x &&
        bullet.x < enemy.x + enemy.width &&
        bullet.y < enemy.y + enemy.height
      ) {
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        levelScore++;
      }
    }
  }

  // Move and draw enemy bullets
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let enemyBullet = enemyBullets[i];
    fill(255, 0, 0);
    rect(enemyBullet.x, enemyBullet.y, 5, 10);
    enemyBullet.y += bulletSpeed;

    // Remove enemy bullets that go off-screen
    if (enemyBullet.y > canvasHeight) {
      enemyBullets.splice(i, 1);
    }

    // Check for enemy bullet collisions with player
    if (
      enemyBullet.x + 5 > playerX &&
      enemyBullet.x < playerX + playerWidth &&
      enemyBullet.y + 10 > playerY
    ) {
      gameOver();
    }
  }

  // Check if all enemies are destroyed to move to the next level
  if (enemies.length === 0) {
    level++;
    createEnemies();
  }
}

function keyPressed() {
  if (key === ' ' && bullets.length < 3) {
    bullets.push({ x: playerX + playerWidth / 2, y: playerY });
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
      });
    }
  }
}

function gameOver() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Game Over\nScore: ${levelScore}`, canvasWidth / 2, canvasHeight / 2);
  noLoop();
}

// You can keep track of the player's score using a variable
let levelScore = 0;

// Create an array to store enemy bullets
let enemyBullets = [];
