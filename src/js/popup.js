import { LogScraper } from "/src/js/modules/logScraper.mjs";

const gameLogSelect = document.querySelector('#gameLogs');
const scrapeBtn = document.querySelector('#scrapeBtn');
const gameLogScraper = new LogScraper(gameLogSelect, scrapeBtn);

// scrapeBtn.addEventListener('click', function(e) {
//   browser.windows.getAll({ populate: true })
//     .then(windows => {
//       document.querySelector('#winLength').innerHTML = windows.length;
//       for (const w of windows) {
//         let title = w.title;
//         if (title.includes('Log')) {
//           let windowTabId = w.tabs[0].id;
//           document.querySelector('div').innerHTML = windowTabId ?? 'hello';
//           browser.tabs.executeScript(
//             windowTabId,
//             { file: '/content_scripts/scrapeLog.js' }
//           );
//         }
//       }
//     });
// });

