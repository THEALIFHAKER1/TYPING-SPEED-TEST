const typingText = $(".typing-text p");
const inpField = $(".wrapper .input-field");
const startBtn = $(".content button");
const timeTag = $(".time span b");
const mistakeTag = $(".mistake span");
const wpmTag = $(".wpm span");
const cpmTag = $(".cpm span");
// Get the leaderboard button and modal container
const leaderboardButton = document.querySelector('.navbar-button');
const modalContainer = document.querySelector('#modal-container');

// Add an event listener to the leaderboard button
leaderboardButton.addEventListener('click', function() {
  // Show the modal container
  modalContainer.style.display = 'block';
});


let latestWpm;
let timer,
maxTime = 30,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * texts.length);
    typingText.html("");
    [...texts[ranIndex]].forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.append(span);
    });
    typingText.find("span:first").addClass("active");
    $(document).on("keydown", () => inpField.focus());
    typingText.on("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.find("span");
    let typedChar = inpField.val().split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters.eq(charIndex).hasClass("incorrect")) {
                    mistakes--;
                }
                characters.eq(charIndex).removeClass("correct incorrect");
            }
        } else {
            if(characters.eq(charIndex).text() == typedChar) {
                characters.eq(charIndex).addClass("correct");
            } else {
                mistakes++;
                characters.eq(charIndex).addClass("incorrect");
            }
            charIndex++;
        }
        characters.removeClass("active");
        characters.eq(charIndex).addClass("active");

        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        wpmTag.text(wpm);
        mistakeTag.text(mistakes);
        cpmTag.text(charIndex - mistakes);
    } else {
        clearInterval(timer);
        inpField.val("");
    }   
}

function showNameInput() {
    inpField.prop("disabled", true);
    const modal = document.getElementById("modal");
    const wpmSpan = document.getElementById("wpm");

    wpmSpan.textContent = latestWpm;
    modal.style.display = "block";

    const submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", () => {
        const playerName = document.getElementById("name-input").value;
        const playerData = {
            name: playerName,
            wpm: latestWpm
        };
        let players = JSON.parse(localStorage.getItem('playerData')) || [];
        players.push(playerData);
        localStorage.setItem('playerData', JSON.stringify(players));
        modal.style.display = "none";
        startGame();
    });
}
const leaderboardBtn = document.getElementById("leaderboard-btn");
leaderboardBtn.addEventListener("click", showLeaderboard);
const closeButton = document.getElementById('close-modal');
closeButton.addEventListener('click', function() {
  // Hide the modal container
  modalContainer.style.display = 'none';
});

function showLeaderboard() {
    const players = JSON.parse(localStorage.getItem('playerData'));
    const leaderboardList = document.getElementById('leaderboard-list');

    // Clear the current list
    leaderboardList.innerHTML = '';

    if (players) {
        const sortedPlayers = players.sort((a, b) => b.wpm - a.wpm);
        sortedPlayers.forEach((player, index) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${index + 1}. ${player.name} - ${player.wpm} WPM`;
            leaderboardList.appendChild(listItem);
        });
    }
}

  


function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.text(timeLeft);
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpmTag.text(wpm);
        latestWpm = wpm;
    } else {
        clearInterval(timer);
        showNameInput();
        startBtn.text("Restart");
        return latestWpm;
    }
}


function startGame() {
    inpField.prop("disabled", false);
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.val("");
    timeTag.text(timeLeft);
    wpmTag.text(0);
    mistakeTag.text(0);
    cpmTag.text(0);
    startBtn.text("Start");
}



function showLeaderboard() {
    const players = JSON.parse(localStorage.getItem('playerData'));
    const leaderboardList = document.getElementById('leaderboard-list');

    // Clear the current list
    leaderboardList.innerHTML = '';

    if (players) {
        const sortedPlayers = players.sort((a, b) => b.wpm - a.wpm);
        const topPlayers = sortedPlayers.slice(0, 10); // get only top 10 players

        topPlayers.forEach((player, index) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${index + 1}. ${player.name} - ${player.wpm} WPM`;
            leaderboardList.appendChild(listItem);
        });
    }
}

  

loadParagraph();
inpField.on("input", initTyping);
startBtn.on("click", startGame);