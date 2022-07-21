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
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createGame(event);
    });
  }

  createGame(event) {
    browser.tabs.create({
      active: true,
      url: this.newGameUrl,
    })
    .then(tab => {
      console.log('tab created!');
    });
  }
}

export { GameStart };
