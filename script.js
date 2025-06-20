document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const p1ScoreElement = document.getElementById('p1-score');
    const p2ScoreElement = document.getElementById('p2-score');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Game settings
    const GRID_SIZE = 20;
    const P1_COLOR = '#ff3366';
    const P2_COLOR = '#3366ff';
    const TRAIL_COLOR = 'rgba(0, 255, 204, 0.2)';

    // Players
    let player1 = {
        x: 100,
        y: 200,
        dx: GRID_SIZE,
        dy: 0,
        trail: [],
        score: 0
    };

    let player2 = {
        x: 500,
        y: 200,
        dx: -GRID_SIZE,
        dy: 0,
        trail: [],
        score: 0
    };

    let gameRunning = false;
    let gameLoop;

    // Initialize game
    function init() {
        player1 = {
            x: 100,
            y: 200,
            dx: GRID_SIZE,
            dy: 0,
            trail: [],
            score: player1.score
        };

        player2 = {
            x: 500,
            y: 200,
            dx: -GRID_SIZE,
            dy: 0,
            trail: [],
            score: player2.score
        };

        gameRunning = false;
        clearInterval(gameLoop);
        draw();
    }

    // Draw game state
    function draw() {
        // Clear canvas with dark background
        ctx.fillStyle = '#111122';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw trails
        drawTrail(player1, P1_COLOR);
        drawTrail(player2, P2_COLOR);

        // Draw players
        ctx.fillStyle = P1_COLOR;
        ctx.fillRect(player1.x, player1.y, GRID_SIZE, GRID_SIZE);

        ctx.fillStyle = P2_COLOR;
        ctx.fillRect(player2.x, player2.y, GRID_SIZE, GRID_SIZE);
    }

    // Draw player trail
    function drawTrail(player, color) {
        ctx.fillStyle = TRAIL_COLOR;
        player.trail.forEach(pos => {
            ctx.fillRect(pos.x, pos.y, GRID_SIZE, GRID_SIZE);
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        player.trail.forEach(pos => {
            ctx.strokeRect(pos.x, pos.y, GRID_SIZE, GRID_SIZE);
        });
    }

    // Update game state
    function update() {
        if (!gameRunning) return;

        // Move players
        movePlayer(player1);
        movePlayer(player2);

        // Check collisions
        if (checkCollision(player1) || checkCollision(player2)) {
            endGame();
            return;
        }

        draw();
    }

    // Move a player
    function movePlayer(player) {
        player.trail.push({ x: player.x, y: player.y });
        player.x += player.dx;
        player.y += player.dy;
    }

    // Check if player collides with walls or trails
    function checkCollision(player) {
        // Wall collision
        if (
            player.x < 0 || player.y < 0 ||
            player.x >= canvas.width || player.y >= canvas.height
        ) {
            return true;
        }

        // Trail collision (check both players' trails)
        const allTrails = [...player1.trail, ...player2.trail];
        return allTrails.some(pos => pos.x === player.x && pos.y === player.y);
    }

    // End game and declare winner
    function endGame() {
        gameRunning = false;
        clearInterval(gameLoop);

        const p1Dead = checkCollision(player1);
        const p2Dead = checkCollision(player2);

        if (p1Dead && p2Dead) {
            alert("Double KO! It's a tie!");
        } else if (p1Dead) {
            player2.score++;
            p2ScoreElement.textContent = player2.score;
            alert("Player 2 wins!");
        } else {
            player1.score++;
            p1ScoreElement.textContent = player1.score;
            alert("Player 1 wins!");
        }
    }

    // Start game
    function startGame() {
        if (gameRunning) return;
        init();
        gameRunning = true;
        gameLoop = setInterval(update, 100);
    }

    // Event listeners for controls
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;

        // Player 1 (WASD)
        if (e.key === 'a' && player1.dx === 0) {
            player1.dx = -GRID_SIZE;
            player1.dy = 0;
        }
        if (e.key === 'd' && player1.dx === 0) {
            player1.dx = GRID_SIZE;
            player1.dy = 0;
        }
        if (e.key === 'w' && player1.dy === 0) {
            player1.dx = 0;
            player1.dy = -GRID_SIZE;
        }
        if (e.key === 's' && player1.dy === 0) {
            player1.dx = 0;
            player1.dy = GRID_SIZE;
        }

        // Player 2 (Arrow Keys)
        if (e.key === 'ArrowLeft' && player2.dx === 0) {
            player2.dx = -GRID_SIZE;
            player2.dy = 0;
        }
        if (e.key === 'ArrowRight' && player2.dx === 0) {
            player2.dx = GRID_SIZE;
            player2.dy = 0;
        }
        if (e.key === 'ArrowUp' && player2.dy === 0) {
            player2.dx = 0;
            player2.dy = -GRID_SIZE;
        }
        if (e.key === 'ArrowDown' && player2.dy === 0) {
            player2.dx = 0;
            player2.dy = GRID_SIZE;
        }
    });

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', init);

    // Initial draw
    draw();
});