console.log('checkForLog loaded...');
let totalTime = 0;
const interval = 1000;
const maxTime = 5000;
const gameId = window.opener.window.location.search.substr(1);

// Check for log and add indicator to browser_action if found
let intervalId = setInterval(() => {
  let logContainer = document.querySelector('#Foundation_Elemental_1_log');
  if (logContainer) {
    console.log(`Log found for game ${gameId}`);
    browser.runtime.sendMessage({
      logFound: true,
    });
    clearInterval(intervalId);
  } else {
    console.log(`Log not found for game ${gameId}`);
  }

  if (totalTime >= maxTime) {
    console.log('Stop checking for log...');
    clearInterval(intervalId);
  }

  totalTime += interval;
}, interval);





