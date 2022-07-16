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
    // Test: When button clicked we open new viktory game page and fill an input
    browser.tabs.executeScript({
      file: '/src/js/content/startNewGame.js'
    });
  }
}

export { GameStart };
