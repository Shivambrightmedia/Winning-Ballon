AFRAME.registerComponent('balloon-handler', {
    init: function() {
        this.el.setAttribute('isClicked', false);
        
        this.el.addEventListener('click', () => {
            if (this.el.getAttribute('isClicked') || gameState.isGameOver) return;
            
            this.el.setAttribute('isClicked', true);
            console.log('balloon clicked');
            
            const balloonIndex = gameState.balloons.indexOf(this.el);

            if (balloonIndex === gameState.winningBalloonIndex) {
                // Player wins
                console.log('🎉 You found the winning balloon!');
                alert('🎉 You win!');
                gameState.isGameOver = true;
            } else {
                // Decrement attempts
                gameState.attempts--;
                console.log(`❌ Wrong balloon! Attempts left: ${gameState.attempts}`);

                if (gameState.attempts <= 0) {
                    // Player loses
                    console.log('💔 Game over. No attempts left!');
                    alert('💔 Game over!');
                    gameState.isGameOver = true;
                }
            }

            this.el.setAttribute('animation', {
                property: 'scale',
                to: '0 0 0',
                dur: 300,
                easing: 'easeInQuad'
            });

            setTimeout(() => {
                if (this.el.parentNode) {
                    this.el.parentNode.removeChild(this.el);
                }
            }, 300);
        });
    }
});

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
        // Reset game state
        gameState.attempts = 3;
        gameState.isGameOver = false;
        gameState.balloons = [];
        gameState.winningBalloonIndex = Math.floor(Math.random() * 9);
        
        console.log('Game initialized! Find the winning balloon!');
        console.log(`You have ${gameState.attempts} attempts.`);

        balloonPositions.forEach((pos, index) => {
            const balloon = document.createElement('a-gltf-model');
            balloon.setAttribute('src', '#balloon-model');
            balloon.setAttribute('position', pos.position);
            balloon.setAttribute('rotation', pos.rotation);
            balloon.setAttribute('scale', '2 2 2');
            balloon.setAttribute('class', 'clickable');
            balloon.setAttribute('balloon-handler', '');
            balloon.setAttribute('isClicked', false);
            
            balloonContainer.appendChild(balloon);
            gameState.balloons.push(balloon);
        });
    }

    // Reset button click handler
    resetButton.addEventListener('click', () => {
        balloonContainer.innerHTML = '';
        gameState.balloons = [];
        initializeGame();
        console.log('Game reset! Try again!');
    });
});
