const road = document.getElementById("road");
const ball = document.getElementById("ball");

let direction = "left"; // Default road direction
let isRunning = false;
let speed = 5; // Default speed (seconds for road animation cycle)
const maxSpeed = 1; // Maximum speed (shortest animation duration in seconds)
const minSpeed = 5; // Minimum speed (longest animation duration in seconds);

// Initialize Telegram WebApp
Telegram.WebApp.ready();

const socket = new WebSocket('wss://websocket-.glitch.me'); // Replace with backend WebSocket URL

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.action) {
        case 'start':
            startGame();
            break;
        case 'stop':
            stopGame();
            break;
        case 'speedUp':
            speedUp();
            break;
        case 'speedDown':
            speedDown();
            break;
        case 'reverse':
            reverseDirection();
            break;
        default:
            console.error('Unknown action:', data.action);
    }
};


// Update road and ball animations with the current speed
function updateAnimations() {
    const roadDuration = `${speed}s`;
    const ballDuration = `${speed / 5}s`; // Ball bounces faster as speed increases

    road.style.animation = `move-road ${roadDuration} linear infinite ${
        direction === "left" ? "normal" : "reverse"
    }`;
    ball.style.animation = `bounce ${ballDuration} ease-in-out infinite`;
}

// Start the game
function startGame() {
    updateAnimations();
    isRunning = true;
    road.style.animationPlayState = "running";
    ball.style.animationPlayState = "running";
}

// Stop the game (ball settles on the road)
function stopGame() {
    isRunning = false;
    road.style.animationPlayState = "paused";
    ball.style.animationPlayState = "paused";

    // Temporarily remove bounce animation to place the ball on the road
    ball.style.animation = "none";
    ball.style.bottom = "15px"; // Ensure ball sits on the road
}

// Reverse the road's direction
function reverseDirection() {
    
    if (isRunning){
        direction = direction === "left" ? "right" : "left";
         updateAnimations();
        }

    // Send the current direction to the bot
    Telegram.WebApp.sendData(JSON.stringify({ action: "reverse", direction }));
}

// Speed up the animations
function speedUp() {
    if (isRunning && speed > maxSpeed) {
        speed -= 0.5; // Increase speed by reducing animation duration
        updateAnimations();

        // Send speed change to the bot
        Telegram.WebApp.sendData(JSON.stringify({ action: "speedUp", speed }));
    }
}

// Slow down the animations
function speedDown() {
    if (isRunning && speed < minSpeed) {
        speed += 0.5; // Decrease speed by increasing animation duration
        updateAnimations();

        // Send speed change to the bot
        Telegram.WebApp.sendData(JSON.stringify({ action: "speedDown", speed }));
    }
}

// Example: Listen for theme changes from Telegram WebApp
Telegram.WebApp.onEvent("themeChanged", () => {
    const theme = Telegram.WebApp.themeParams;
    console.log("Theme changed:", theme);
});

// Initialize animations
stopGame();
