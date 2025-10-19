const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const highscoresContainer = document.getElementById("highscoresContainer");

const startBtn = document.getElementById("startBtn");
const highscoreBtn = document.getElementById("highscoreBtn");
const backBtn = document.getElementById("backBtn");
const backFromHSBtn = document.getElementById("backFromHSBtn");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const box = 20;
let snake, food, dx, dy, score, gameInterval;

startBtn.addEventListener("click", startGame);
highscoreBtn.addEventListener("click", showHighscores);
backBtn.addEventListener("click", backToMenu);
backFromHSBtn.addEventListener("click", backToMenu);

document.addEventListener("keydown", changeDirection);

function startGame() {
  menu.classList.add("hidden");
  highscoresContainer.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  snake = [{ x: 10, y: 10 }];
  food = spawnFood();
  dx = 1;
  dy = 0;
  score = 0;
  scoreDisplay.textContent = "Score: " + score;

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(draw, 120);
}

function backToMenu() {
  menu.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  highscoresContainer.classList.add("hidden");
  if (gameInterval) clearInterval(gameInterval);
}

function showHighscores() {
  menu.classList.add("hidden");
  highscoresContainer.classList.remove("hidden");

  const highscores = JSON.parse(localStorage.getItem("snakeHighscores")) || [];
  const list = document.getElementById("highscoreList");
  list.innerHTML = "";
  highscores.forEach(score => {
    const li = document.createElement("li");
    li.textContent = score;
    list.appendChild(li);
  });
}

function changeDirection(event) {
  if (!snake) return;
  if (event.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  if (event.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  if (event.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  if (event.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#0f0";
  snake.forEach(part => ctx.fillRect(part.x * box, part.y * box, box-2, box-2));

  // Draw food
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * box, food.y * box, box-2, box-2);

  move();
}

function move() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Game over
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width / box || head.y >= canvas.height / box ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    alert("Game Over! Score: " + score);
    saveHighscore(score);
    backToMenu();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function spawnFood() {
  let newFood;
  do {
    newFood = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  } while (snake.some(part => part.x === newFood.x && part.y === newFood.y));
  return newFood;
}

function saveHighscore(score) {
  let highscores = JSON.parse(localStorage.getItem("snakeHighscores")) || [];
  highscores.push(score);
  highscores.sort((a,b) => b - a);
  highscores = highscores.slice(0, 10);
  localStorage.setItem("snakeHighscores", JSON.stringify(highscores));
}
