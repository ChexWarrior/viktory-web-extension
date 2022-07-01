class LogScraper {
  /**
   *
   * @param HTMLSelectElement targetSelect
   * @param HTMLButtonElement scrapeBtn
   * @param RegExp titleRegex
   */
  constructor(targetSelect, scrapeBtn, titleRegex = /^(.+) - Game Log/) {
    // Represent <option> elements holding game titles
    this.options = [];

    // Build out component
    browser.windows.getAll({
        populate: true
      })
      .then(windows => {
        console.log(windows.length);
        for (const window of windows) {
          const { title } = window;

          if (title) {
            console.log(`Window ${title}`);
            const matches = title.match(titleRegex);

            if (matches !== null) {
              this.buildOptions(window, matches);
            }
          }
        }

        // Setup Scrape action if valid game logs found
        if (this.options.length > 0) {
          targetSelect.append(...this.options);
          scrapeBtn.disabled = false;
          scrapeBtn.addEventListener('submit', function(e) {
            // Insert content script to scrape log
            // Send raw log to backend
            // Receive formatted log and add a new row to LogList component via event
          });

          return;
        }

        // Remove badge text if no game logs found
        browser.browserAction.setBadgeText({
          text: ''
        });
      });
  }

  /**
   * @param Window window
   * @param Array matches
   */
  buildOptions(window, matches) {
    const [, gameTitle] = matches;
    const optionNode = document.createElement('option');
    const windowId = window.tabs[0].id;
    optionNode.name = gameTitle;
    optionNode.value = windowId;
    optionNode.appendChild(document.createTextNode(gameTitle));
    console.log(`Game Log Window with name ${gameTitle} and id ${windowId}`);
    this.options.push(optionNode);
  }
}

export { LogScraper };
