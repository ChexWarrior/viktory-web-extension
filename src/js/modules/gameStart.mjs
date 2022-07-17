import { TabTarget } from "./tabTarget.mjs";

class GameStart extends TabTarget {
  /**
   *
   * @param {HTMLFormElement} targetForm
   * @param {PubSub} pubSub
   */
  constructor(targetForm, pubSub) {
    super(targetForm, pubSub);
    this.form = targetForm;
    this.createGameBtn = this.form.querySelector('button');
    this.createGameBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.createGame(event);
    });
  }

  createGame(event) {
    // Check if we're on the new game page otherwise navigate us there...
    browser.tabs.executeScript({ file: '/src/js/content/startNewGame.js' })
      .then(response => {
        return browser.windows.getCurrent({
          populate: true
        });
      })
      .then(currentWindow => {
        const [activeTab] = currentWindow.tabs.filter(t => t.active);

        return browser.tabs.sendMessage(
          activeTab.id,
          { greeting: 'This is a message!' },
        );
      });
  }
}

export { GameStart };
