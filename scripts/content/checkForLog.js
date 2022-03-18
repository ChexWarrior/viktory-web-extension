console.log('checkForLog loaded...');
let totalTime = 0;
const interval = 500;
const maxTime = 5000;

let intervalId = setInterval(() => {
  let logContainer = document.querySelector('#Foundation_Elemental_1_log');
  if (logContainer) {
    console.log('Log found...');
    browser.runtime.sendMessage({
      logFound: true,
    });
    clearInterval(intervalId);
  } else {
    console.log('Log not found...');
  }

  if (totalTime >= maxTime) {
    console.log('Stop checking for log...');
    clearInterval(intervalId);
  }

  totalTime += interval;
}, interval);




