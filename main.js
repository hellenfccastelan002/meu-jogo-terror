const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const gameOverScreen = document.getElementById("game-over-screen");
const scoreElement = document.querySelector(".score span");
const monstro = document.querySelector(".monstro");
const startButton = document.getElementById("startButton"); 
alert("O JavaScript está funcionando!");

audioStart = new Audio("./sound/audio_theme.mp3");
const gameOverSound = new Audio("./sound/audio_gameover.mp3");

let gameStarted = false;
let score = 0;
let loopInterval; 

let marioLeft = 100; 
let monstroLeft = -250; 
const marioSpeed = 2; 
const monstroSpeed = 1;  



const restartGame = () => {
    window.location.reload();
}

gameOverScreen.addEventListener('click', restartGame);


const handleGameOver = (objectPosition, marioCurrentPosition) => {
    pipe.style.animation = "none";
    pipe.style.left = `${objectPosition.pipe}px`; 

    mario.style.animation = "none";
    mario.style.left = `${marioCurrentPosition}px`; 
    mario.style.bottom = `${+window.getComputedStyle(mario).bottom.replace("px", "")}px`; 

    mario.src = "./imagem/game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";

    monstro.style.animation = "none";
    monstro.style.left = `${monstroLeft}px`;

    audioStart.pause();
    gameOverSound.play();

    clearInterval(loopInterval);

    gameOverScreen.classList.remove("hidden");
    setTimeout(() => {
        gameOverScreen.classList.add("game-over-active");
    }, 50);

    document.removeEventListener("keydown", jump);
    document.removeEventListener("keydown", moveMario); 
    document.removeEventListener("keyup", stopMoveMario); 
}


let marioMovingRight = false;
let marioMovingLeft = false;

const moveMario = (event) => {
    if (!gameStarted) return;

    if (event.key === "ArrowRight") {
        marioMovingRight = true;
    } else if (event.key === "ArrowLeft") {
        marioMovingLeft = true;
    }
}

const stopMoveMario = (event) => {
    if (event.key === "ArrowRight") {
        marioMovingRight = false;
    } else if (event.key === "ArrowLeft") {
        marioMovingLeft = false;
    }
}

const startGame = () => {
    gameStarted = true;
    //audioStart.play();

    
    pipe.style.animation = "pipe-animation 1.5s infinite linear";

    startButton.style.display = "none";

    mario.style.opacity = "1";
    pipe.style.opacity = "1";

    monstro.style.opacity = "1";

    loopInterval = setInterval(loop, 10);

    document.addEventListener("keydown", moveMario);
    document.addEventListener("keyup", stopMoveMario);
}
startButton.addEventListener('click', startGame);

const jump = () => {
    if (!gameStarted || mario.classList.contains("jump")) return; 

    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    }, 500);
}


const updateScore = () => {
    score += 1;
    scoreElement.textContent = score;

    const animationSpeed = 1.5 / (1 + score / 500);
    pipe.style.animation = `pipe-animation ${animationSpeed}s infinite linear`;
}


const loop = () => {
    
    const pipePosition = pipe.offsetLeft;
    const marioBottomPosition = +window.getComputedStyle(mario).bottom.replace("px", "");

    if (marioMovingRight) {
        marioLeft += marioSpeed;
    }
    if (marioMovingLeft) {
        marioLeft -= marioSpeed;
    }

    if (marioLeft < 0) marioLeft = 0;
    if (marioLeft > window.innerWidth - mario.offsetWidth) marioLeft = window.innerWidth - mario.offsetWidth;
    
    mario.style.left = `${marioLeft}px`;


    if (monstroLeft < marioLeft - 150) { 
        monstroLeft += monstroSpeed;
    } else if (monstroLeft > marioLeft - 100) { 
        monstroLeft -= monstroSpeed / 2; 
    }
    monstro.style.left = `${monstroLeft}px`;


    if (pipePosition <= marioLeft + mario.offsetWidth && pipePosition + pipe.offsetWidth >= marioLeft && marioBottomPosition < 80) {
        
        handleGameOver({pipe: pipePosition}, marioLeft); 
    }

    
    if (monstroLeft + monstro.offsetWidth - 20 >= marioLeft && monstroLeft <= marioLeft + mario.offsetWidth - 20 && marioBottomPosition < 100) {
        handleGameOver({pipe: pipePosition}, marioLeft); 
    }

    else if (pipePosition < -80 && gameStarted) { 
        pipe.style.left = ''; 
        updateScore(); 
    }
}


document.addEventListener("keydown", jump);
