import { TabTarget } from "./tabTarget.mjs";

class GameStart extends TabTarget {
  /**
   *
   * @param {HTMLFormElement} targetForm
   * @param {PubSub} pubSub
   */
  constructor(targetForm, pubSub) {
    super(targetForm, pubSub);
    this.newGameUrl = 'http://gamesbyemail.com/Games/Viktory2';
    this.form = targetForm;
    this.lastTabId = null;
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createGame(event);
    });
  }

  createGame(event) {
    //TODO: Disable submit button until action complete...
    browser.tabs.create({
      active: true,
      url: this.newGameUrl,
    })
    .then(tab => {
      // Inject script that setups listner
      this.lastTabId = tab.id;
      return browser.tabs.executeScript(tab.id, {
        file: '/src/js/content/startGame.js',
      });
    })
    .then(results => {
      // Trigger form submit via message
      return browser.tabs.sendMessage(this.lastTabId, {
        message: 'hello content script!',
      });
    });
  }
}

export { GameStart };
