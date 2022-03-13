// const logBtnSel = '#Foundation_Elemental_2_openLog';

// document.querySelector(logBtnSel).click();

const logWindow = document.querySelector('#Foundation_Elemental_1_log');

if (logWindow) {
  const log = logWindow.textContent;
  console.log(log);
} else {
  console.log('no log...');
}