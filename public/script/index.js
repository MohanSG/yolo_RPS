console.log("JS Loaded");

const width = 360;
let height = 0;

let streaming = false;

const loadingText = document.getElementById("overlay-text")
const statusText = document.getElementById("status-text");
const winnerText = document.getElementById("winner-text");

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");

const computerChoiceImage = document.getElementById("computer-choice");
const playerChoiceImage = document.getElementById("player-choice");

const startButton = document.getElementById("start-button");

var hand_images = ["/images/rps-paper.svg", "/images/rps-rock.svg", "/images/rps-scissors.svg"];
const hand_text = ["Paper", "Rock", "Scissors"]

var playerChoice = "";
var computerChoice = "";

var picking = false;

window.onload = function(){
    navigator.mediaDevices
        .getUserMedia({video: true, audio:false})
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) =>{
            console.error(`An error occurred: ${err}`);
        });

    setInterval(() => {
        changeImage()
    }, 200);
}

video.addEventListener("canplay", (ev) =>{
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);

        video.style.border = "#4A70A9 solid 5px";
        streaming = true;
    }
});

startButton.addEventListener("click", (ev) => {
    if (startButton.innerHTML === "Play again") {
        restart()
    } else {
        countdown(3)
        ev.preventDefault();
    }
});

function countdown(time){
    picking = true;
    if (time>0){
        loadingText.style.display = "block";
        loadingText.innerHTML = `${time}`;
        setTimeout(function(){countdown(time-1)},1000);
    }else{
        takePicture();
    }
}

async function sendPhoto(image) {
    const formData = new FormData();
    const blob = await (await fetch(image)).blob();
    formData.append("image", blob);

    const response = await fetch("/run_model", {
        method: "POST",
        body: formData
    });
    const data = await response.json();
    const detections = data.model_prediction[0]

    return detections;
}

function clearPhoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#aaaaaa";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
}

async function takePicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const image = canvas.toDataURL("image/png");
        console.log("Picture taken")

        playerChoiceImage.style.display = "none";
        loadingText.innerHTML = "Running model..."

        const data = await sendPhoto(image);
        if(data) {
            console.log(`Inference made: ${data.class_name}`);
            updatePlayerChoice(data.class_name);
            evaluateResult();
        } else {
            console.log("No detections");
            statusText.innerHTML = "No Detections, please try again. Sorry!";
            statusText.style.display = "block";
            startButton.innerHTML = "Play again"
            picking = false;
            computerChoiceImage.src = "/images/computer.svg"
            playerChoiceImage.style.display = "None";
            loadingText.style.display = "None";
        }
    } else {
        clearPhoto()
    }
}

var x = 0;
function changeImage() {
        if (x < 3 && picking === true) {
            computerChoiceImage.src = hand_images[x]
            x+=1;
        } else if (x > 2 && picking === true) {
            x=0;
            computerChoiceImage.src = hand_images[x]
        }

}

function updatePlayerChoice(class_name) {
    switch(class_name) {
        case "Paper":
            playerChoiceImage.src = hand_images[0];
            playerChoice = class_name;
            break;
        case "Rock":
            playerChoiceImage.src = hand_images[1];
            playerChoice = class_name;
            break;
        case "Scissors":
            playerChoiceImage.src = hand_images[2];
            playerChoice = class_name;
            break;
    }

    loadingText.style.display = "none";
    playerChoiceImage.style.display = "block";
}

function evaluateResult() {
    picking = false;
    var randomInt = Math.floor(Math.random() * 3);
    computerChoiceImage.src = hand_images[randomInt];
    computerChoice = hand_text[randomInt];

    chooseWinner();
}

function chooseWinner() {
    if (playerChoice === computerChoice) {
        console.log("It's a draw")
        winnerText.innerHTML = "It's a draw"

    } else if (playerChoice === "Rock" && computerChoice === "Scissors"
        || playerChoice === "Paper" && computerChoice === "Rock"
            || playerChoice === "Scissors" && computerChoice === "Paper") {

        console.log("Player Wins");
        winnerText.innerHTML = "You win!"
    } else {
        console.log("Computer Wins");
        winnerText.innerHTML = "Computer wins!"
    }

    winnerText.style.display = "block";
    startButton.innerHTML = "Play again";
}

function restart() {
    startButton.innerHTML = "Play"
    picking = false;
    computerChoiceImage.src = "/images/computer.svg"
    playerChoiceImage.style.display = "none";
    statusText.style.display = "none";
    winnerText.style.display = "none"
}





