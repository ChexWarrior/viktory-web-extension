console.log('startNewGame script loaded...');

// Open start new game page unless we're already on it
const newGameUrl = 'http://gamesbyemail.com/Games/Viktory2';

if (window.location.href !== newGameUrl) {
  window.location.href = newGameUrl;
}

