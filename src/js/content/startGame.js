console.log('start new game script called...');


// Setup listener from gameStart component
browser.runtime.onMessage.addListener((gameInfo, sender) => {
  const { title, numPlayers, playerInfo } = gameInfo;

  // Grab page form elements
  const gameTitleInput = document.querySelector('#Foundation_Elemental_5_GameTitle');
  const numPlayerInput = document.querySelector(`input[type="radio"][value="${numPlayers}"]`);

  // Set game values
  gameTitleInput.value = title;
  numPlayerInput.click();
  
});
