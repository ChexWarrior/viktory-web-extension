const gameTitleRegex = /^(.+) - Game Log/;
const gameLogOptions = [];
const gameLogSelect = document.querySelector('#gameLogs');
browser.windows.getAll({ populate: true })
  .then(windows => {
    console.log(windows.length);
    for (const window of windows) {
      const { title } = window;

      if (title) {
        console.log(`Window ${title}`);
        const matches = title.match(gameTitleRegex);

        if (matches !== null) {
          const [, gameTitle] = matches;
          const optionNode = document.createElement('option');
          const windowId = window.tabs[0].id;
          optionNode.name = gameTitle;
          optionNode.value = windowId;
          optionNode.appendChild(document.createTextNode(gameTitle));
          console.log(`Game Log Window with name ${gameTitle} and id ${windowId}`);
          gameLogOptions.push(optionNode);
        }
      }
    }

    if (gameLogOptions.length > 0) {
      gameLogSelect.append(...gameLogOptions);
      return;
    }

    browser.browserAction.setBadgeText({ text: '' });
  });

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

