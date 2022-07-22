console.log('start new game script called...');

const gameTitleInput = document.querySelector('#Foundation_Elemental_5_GameTitle');

// Setup listener from gameStart component
browser.runtime.onMessage.addListener((data, sender) => {
  const { message } = data;
  gameTitleInput.value = message;
});
