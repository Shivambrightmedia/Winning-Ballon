// Game state
const gameState = {
    attempts: 3,
    winningBalloonIndex: null,
    balloons: [],
    isGameOver: false
};

// Balloon positions (arranged in a 3x3 grid pattern with reduced vertical spacing)
const balloonPositions = [
    // Bottom row
    { position: '-1.5 -1.5 -2', rotation: '0 0 0' },
    { position: '-0.75 -1.5 -2', rotation: '0 0 0' },
    { position: '0 -1.5 -2', rotation: '0 0 0' },
    // Middle row
    { position: '-1.5 -0.5 -2', rotation: '0 0 0' },
    { position: '-0.75 -0.5 -2', rotation: '0 0 0' },
    { position: '0 -0.5 -2', rotation: '0 0 0' },
    // Top row
    { position: '-1.5 0.5 -2', rotation: '0 0 0' },
    { position: '-0.75 0.5 -2', rotation: '0 0 0' },
    { position: '0 0.5 -2', rotation: '0 0 0' }
];

// Wait for scene to load
document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');
    const balloonContainer = document.querySelector('#balloon-container');

    // Initialize game when marker is found
    const markerEntity = document.querySelector('[mindar-image-target]');
    markerEntity.addEventListener('targetFound', () => {
        if (!gameState.balloons.length) {
            initializeGame();
        }
    });

    function initializeGame() {
        // Reset game state
        gameState.attempts = 3;
        gameState.isGameOver = false;
        gameState.balloons = [];
        
        // Randomly select winning balloon
        gameState.winningBalloonIndex = Math.floor(Math.random() * 9);

        // Create balloons
        balloonPositions.forEach((pos, index) => {
            const balloon = document.createElement('a-gltf-model');
            balloon.setAttribute('src', '#balloon-model');
            balloon.setAttribute('position', pos.position);
            balloon.setAttribute('rotation', pos.rotation);
            balloon.setAttribute('scale', '2 2 2');
            balloon.setAttribute('class', 'clickable');
            
            // Removed animation to make balloons stable

            // Add click handler
            balloon.addEventListener('click', () => handleBalloonClick(index, balloon));
            
            balloonContainer.appendChild(balloon);
            gameState.balloons.push(balloon);
        });
    }

    function handleBalloonClick(index, balloon) {
        if (gameState.isGameOver) return;

        gameState.attempts--;

        if (index === gameState.winningBalloonIndex) {
            // Win condition
            gameState.isGameOver = true;
            balloon.setAttribute('src', '#coin-model');
            
            // Add winning animation
            balloon.setAttribute('animation', {
                property: 'rotation',
                to: '0 360 0',
                dur: 1000,
                loop: true
            });
        } else {
            // Pop balloon animation
            balloon.setAttribute('scale', '0 0 0');
            setTimeout(() => {
                balloon.remove();
            }, 500);

            // Check if game over
            if (gameState.attempts <= 0) {
                gameState.isGameOver = true;
                
                // Show the winning balloon
                const winningBalloon = gameState.balloons[gameState.winningBalloonIndex];
                winningBalloon.setAttribute('src', '#coin-model');
            }
        }
    }

    // Add reset functionality (optional)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            balloonContainer.innerHTML = '';
            initializeGame();
        }
    });
});
