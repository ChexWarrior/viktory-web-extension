/**
 * Check if any log windows are open:
 * If any are then enable scrape button
 * If there are none remove badgetext and disable button
 */
const scrapeBtn = document.querySelector('#scrape');
const gameLogTitle = 'Game Log';
browser.windows.getAll()
  .then(windows => {
    if (windows.some(w => w.title.includes(gameLogTitle))) {
      scrapeBtn.removeAttribute('disabled');
    } else {
      scrapeBtn.setAttribute('disabled', 'true');
      browser.browserAction.setBadgeText({
        text: ''
      });
    }
  })


// const scrapeBtn = document.querySelector('#scrape');
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

