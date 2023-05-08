const typingText = $(".typing-text p");
const inpField = $(".wrapper .input-field");
const startBtn = $(".content button");
const timeTag = $(".time span b");
const mistakeTag = $(".mistake span");
const wpmTag = $(".wpm span");
const cpmTag = $(".cpm span");
const leaderboardButton = $('.navbar-button');
const modalContainer = $('#modal-container');

// Add an event listener to the leaderboard button
leaderboardButton.on('click', function() {
  // Show the modal container
  modalContainer.css('display', 'block');

  // Call the showLeaderboard function from leaderboard.js
  showLeaderboard();
});

let latestWpm;
let timer,
maxTime = 10,
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
    } else if(timeLeft === 0) {
        clearInterval(timer);
        showNameInput();
        startBtn.text("Restart");
        return latestWpm;
    }   
}

loadParagraph();
inpField.on("input", initTyping);
startBtn.on("click", startGame);

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
