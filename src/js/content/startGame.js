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
        console.log('Fill out player info...');
        const nameInput = document.querySelector(`${nameTemplate}${index}`);
        const emailInput = document.querySelector(`${emailTemplate}${index}`);

        if (nameInput && emailInput) {
          nameInput.value = playerInfo.name;
          nameInput.dispatchEvent(new Event('keyup'));
          nameInput.dispatchEvent(new Event('change'));
          emailInput.value = playerInfo.email;
          emailInput.dispatchEvent(new Event('keyup'));
          emailInput.dispatchEvent(new Event('change'));
          clearInterval(interval2);
        }
      }, 100);
    }
  }, 100);
}

// Setup listener from gameStart component
browser.runtime.onMessage.addListener((gameInfo, sender) => {
  const { title, numPlayers, playerInfo } = gameInfo;
  let { currentPlayer } = gameInfo;

  // Grab page form elements
  const gameTitleInput = document.querySelector('#Foundation_Elemental_5_GameTitle');
  const numPlayerInput = document.querySelector(`input[type="radio"][value="${numPlayers}"]`);

  // Set game values
  gameTitleInput.value = title;
  numPlayerInput.click();

  /**
   * If the user isn't playing we need to ensure we DON'T click
   * the first user since that will allow the current user to
   * actually play another players first turn!
   */
  if (currentPlayer < 1) {
    console.log('User is not playing this game!');
    currentPlayer = 1;
  }

  // If user is playing we need to click their user first
  setPlayerInfo(playerInfo[currentPlayer], currentPlayer);
  setTimeout(() => {
    playerInfo.forEach((info, index) => {
      if (index !== currentPlayer) setPlayerInfo(info, index);
    });
  }, 100)
});
