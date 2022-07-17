console.log('startNewGame script loaded...');

// Open start new game page unless we're already on it
const newGameUrl = 'http://gamesbyemail.com/Games/Viktory2';

if (window.location.href !== newGameUrl) {
  console.log('Navigate to new game page...');
  window.location.href = newGameUrl;
}

console.log('On new game page...');

// Setup message listeners
browser.runtime.onMessage.addListener((message, sender) => {
  const { greeting } = message;
  console.log(`Received ${greeting} from bg script!`);
});