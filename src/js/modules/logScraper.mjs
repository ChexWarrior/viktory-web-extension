import { TabTarget } from "./tabTarget.mjs";

class LogScraper extends TabTarget {
  /**
   *
   * @param {HTMLFormElement} targetForm
   * @param {PubSub} pubSub
   * @param {RegExp} titleRegex
   */
  constructor(targetForm, pubSub, titleRegex = /^(.+) - Game Log/) {
    super(targetForm, pubSub);
    this.options = [];
    this.form = targetForm;
    this.logSelect = this.form.querySelector('select');
    this.scrapeBtn = this.form.querySelector('button');

    if (!this.logSelect) {
      throw new Error('Could not create logSelect property!');
    }

    if (!this.scrapeBtn) {
      throw new Error('Could not create scrapeBtn property!');
    }

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
          this.logSelect.append(...this.options);
          this.scrapeBtn.disabled = false;

          this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.scrapeLog(e);
          });

          return;
        }
      });
  }

  scrapeLog(event) {
    // Grab window id of selected game log
    const targetLogWindowId = parseInt(this.logSelect.selectedOptions[0].value, 10);
    console.log(targetLogWindowId);

    // Insert content script to scrape log
    browser.tabs.executeScript(
      targetLogWindowId, {
        code: `document.querySelector('#Foundation_Elemental_1_log').innerHTML;`
      }
    ).then(results => {
      let [log] = results;
      console.log(`Log Parsed:\n${log}`);

      // TODO: Send raw log to backend
      // TODO: Receive formatted log and add a new row to LogList component via event
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
