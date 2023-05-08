// leaderboard.js

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
  
  function showLeaderboard() {
    const players = JSON.parse(localStorage.getItem('playerData'));
    const leaderboardList = $('#leaderboard-list');
  
    // Clear the current list
    leaderboardList.empty();
  
    if (players) {
      const sortedPlayers = players.sort((a, b) => b.wpm - a.wpm);
      const topPlayers = sortedPlayers.slice(0, 10); // get only top 10 players
  
      topPlayers.forEach((player, index) => {
        const listItem = $('<li>').text(`${index + 1}. ${player.name} - ${player.wpm} WPM`);
        leaderboardList.append(listItem);
      });
    }
  }
  
  const leaderboardBtn = $("#leaderboard-btn");
  leaderboardBtn.on("click", showLeaderboard);
  
  const closeButton = $("#close-modal");
  closeButton.on('click', function() {
    // Hide the modal container
    modalContainer.css('display', 'none');
  });
  
const clearButton = $("#clear-leaderboard-btn");
  clearButton.on("click", clearLeaderboard);
  function clearLeaderboard() {
    localStorage.removeItem('playerData');
    showLeaderboard();
  }