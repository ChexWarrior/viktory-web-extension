import { TabTarget } from "./tabTarget.mjs";

class GameStart extends TabTarget {
  /**
   *
   * @param {HTMLFormElement} targetForm
   * @param {PubSub} pubSub
   */
  constructor(targetForm, pubSub) {
    super(targetForm, pubSub);
    this.lastTabId = null;
    this.newGameUrl = 'http://gamesbyemail.com/Games/Viktory2';
    this.form = targetForm;
    this.numPlayerContainer = this.form.querySelector('div.numPlayers');
    this.playerInfoFields = this.form.querySelectorAll('div[data-player-info]');

    // Setup event handlers
    pubSub.subscribe('numPlayersChanged', this.updateNumPlayers, this);

    // Submit form
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createGame(event);
    });

    // Change number of players
    this.numPlayerContainer.addEventListener('click', (event) => {
      const { target } = event;

      if (target.tagName === 'INPUT') {
        const numPlayers = parseInt(target.value, 10);
        pubSub.publish('numPlayersChanged', numPlayers);
      }
    });

    // Handle the initial number of players
    let initialNumPlayers = this.numPlayerContainer.querySelector('input[checked]').value;
    pubSub.publish('numPlayersChanged', initialNumPlayers);
  }

  updateNumPlayers(numPlayers) {
    /**
    * Show playerInfo fields with a number <= numPlayers and
    * hide those with a number > numPlayers
    */
    this.playerInfoFields.forEach(field => {
      const playerNum = parseInt(field.dataset.playerInfo, 10);

      if (playerNum <= numPlayers) {
        field.classList.remove('is-hidden');
        return;
      }

      field.classList.add('is-hidden');
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
