// Game state
const gameState = {
    attempts: 3,
    winningBalloonIndex: null,
    balloons: [],
    isGameOver: false
};

// Balloon positions
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

document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');
    const balloonContainer = document.querySelector('#balloon-container');
    const resetButton = document.querySelector('#resetButton');

    const markerEntity = document.querySelector('[mindar-image-target]');
    markerEntity.addEventListener('targetFound', () => {
        if (!gameState.balloons.length) {
            initializeGame();
        }
    });

    function initializeGame() {
        gameState.attempts = 3;
        gameState.isGameOver = false;
        gameState.balloons = [];
        
        gameState.winningBalloonIndex = Math.floor(Math.random() * 9);

        balloonPositions.forEach((pos, index) => {
            const balloon = document.createElement('a-gltf-model');
            balloon.setAttribute('src', '#balloon-model');
            balloon.setAttribute('position', pos.position);
            balloon.setAttribute('rotation', pos.rotation);
            balloon.setAttribute('scale', '2 2 2');
            balloon.setAttribute('class', 'clickable');
            
            balloon.addEventListener('click', () => handleBalloonClick(index, balloon));
            
            balloonContainer.appendChild(balloon);
            gameState.balloons.push(balloon);
        });
    }

    function handleBalloonClick(index, balloon) {
        if (gameState.isGameOver) return;

        // Pop balloon animation and removal
        balloon.setAttribute('scale', '0 0 0');
        setTimeout(() => {
            balloon.remove();
        }, 300);
    }

    // Reset button click handler
    resetButton.addEventListener('click', () => {
        balloonContainer.innerHTML = '';
        initializeGame();
    });
});
