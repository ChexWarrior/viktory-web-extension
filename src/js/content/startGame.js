console.log('start new game script called...');

const playerBtnTemplate = '#Foundation_Elemental_5_PlayerInfo_';
const nameTemplate = '#Foundation_Elemental_5_PlayerTitle_';
const emailTemplate = '#Foundation_Elemental_5_PlayerId_';

function setPlayerInfo(playerInfo, index) {
  // Wait for element to exist
  console.log(`Set info for player ${index}!`);
  const interval1 = setInterval(() => {
    console.log('Clicking player button..');
    const playerBtn = document.querySelector(`${playerBtnTemplate}${index} input`);

    if (playerBtn) {
      playerBtn.click();
      clearInterval(interval1);

      // Need to wait for click to take effect
      const interval2 = setInterval(() => {
        // Set info
        const nameInput = document.querySelector(`${nameTemplate}${index}`);
        const emailInput = document.querySelector(`${emailTemplate}${index}`);

        if (nameInput && emailInput) {
          nameInput.value = playerInfo.name;
          emailInput.value = playerInfo.email;
          clearInterval(interval2);
        }
      }, 100);
    }
  }, 100);

}

// Setup listener from gameStart component
browser.runtime.onMessage.addListener((gameInfo, sender) => {
  const { title, numPlayers, playerInfo, currentPlayer } = gameInfo;

  // Grab page form elements
  const gameTitleInput = document.querySelector('#Foundation_Elemental_5_GameTitle');
  const numPlayerInput = document.querySelector(`input[type="radio"][value="${numPlayers}"]`);

  // Set game values
  gameTitleInput.value = title;
  numPlayerInput.click();

  // If user is playing we need to click their user first
  // TODO: Handle when user isn't playing
  if (currentPlayer > 0) {
    setPlayerInfo(playerInfo[currentPlayer], currentPlayer - 1);
  }

  playerInfo.forEach((info, index) => {
    if (index + 1 !== currentPlayer) setPlayerInfo(info, index - 1);
  });
});
