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
    this.numPlayerContainer = targetForm.querySelector('div.numPlayers');
    this.playerInfoFields = targetForm.querySelectorAll('div[data-player-info]');

    // Setup event handlers
    pubSub.subscribe('numPlayersChanged', this.updateNumPlayers, this);
    pubSub.subscribe('changeOrderStart', this.dragStartPlayerInfo, this);
    pubSub.subscribe('changeOrderOver', this.dragOverPlayerInfo, this);
    pubSub.subscribe('changeOrderDrop', this.dropPlayerInfo, this);

    // Submit form
    targetForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createGame(event);
    });

    // Setup events for changing player order (drag/drop)
    this.playerInfoFields.forEach(playerInfo => {
      playerInfo.addEventListener('dragstart', event => {
        pubSub.publish('changeOrderStart', { playerInfo, event });
      });

      playerInfo.addEventListener('dragover', event => {
        pubSub.publish('changeOrderOver', { playerInfo, event });
      });

      playerInfo.addEventListener('drop', event => {
        pubSub.publish('changeOrderDrop', { playerInfo, event });
      });
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

  dragStartPlayerInfo({ playerInfo, event }) {
    event.dataTransfer.dropEffect = "link";
    console.log('Drag!');
  }

  dragOverPlayerInfo({ playerInfo, event }) {
    event.preventDefault();
    console.log('Drag over');
  }

  dropPlayerInfo({ playerInfo, event }) {
    event.preventDefault();
    console.log('Drop!');
  }

  updateNumPlayers(numPlayers) {
    this.playerInfoFields.forEach(field => {
      const playerNum = parseInt(field.dataset.playerInfo, 10);

      if (playerNum <= numPlayers) {
        field.disabled = false;
        field.classList.remove('is-hidden');
        return;
      }

      field.disabled = true;
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
      const runScript = browser.tabs.executeScript(tab.id, {
        file: '/src/js/content/startGame.js',
      });

      return Promise.all([runScript, tab.id]);
    })
    .then(([results, tabId]) => {
      // Send form values to content script
      return browser.tabs.sendMessage(tabId, this.getNewGameValues(event.target));
    });
  }

  getNewGameValues({ elements }) {
    const newGameInfo = {};
    newGameInfo.title = elements.namedItem('gameTitle').value;
    newGameInfo.numPlayers = elements.namedItem('numPlayers').value;
    newGameInfo.currentPlayer = elements.namedItem('currentPlayer').value;
    newGameInfo.playerInfo = [];
    for (let i = 1; i <= newGameInfo.numPlayers; i += 1) {
      newGameInfo.playerInfo[i] = {
        name: elements.namedItem(`player${i}Name`).value,
        email: elements.namedItem(`player${i}Email`).value,
      };
    }

    return newGameInfo;
  }
}

export { GameStart };
