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
        pubSub.publish('changeOrderStart', event);
      });

      playerInfo.addEventListener('dragover', event => {
        pubSub.publish('changeOrderOver', event);
      });

      playerInfo.addEventListener('drop', event => {
        pubSub.publish('changeOrderDrop', event);
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

  dragStartPlayerInfo(event) {
    console.log('Drag!');
    event.dataTransfer.dropEffect = "link";
    event.dataTransfer.effectAllowed = "copyLink";

    event.dataTransfer.setData('text/plain', event.currentTarget.dataset.playerInfo);
  }

  dragOverPlayerInfo(event) {
    event.preventDefault();
    console.log('Drag over');
  }

  dropPlayerInfo(event) {
    event.preventDefault();
    console.log('Drop!');
    const draggedPlayerOrder = event.dataTransfer.getData('text/plain');
    const targetPlayerOrder = event.currentTarget.dataset.playerInfo;

    const draggedPlayerContainer = document.querySelector(`div[data-player-info="${draggedPlayerOrder}"]`);
    const targetPlayerContainer = document.querySelector(`div[data-player-info="${targetPlayerOrder}"]`);

    const draggedPlayerData = this.getPlayerInfo(draggedPlayerContainer);
    const targetPlayerData = this.getPlayerInfo(targetPlayerContainer);

    // Swap values
    this.setPlayerInfo(draggedPlayerContainer, targetPlayerData);
    this.setPlayerInfo(targetPlayerContainer, draggedPlayerData);
  }

  /**
   *
   * @param {HTMLElement} playerInfoContainer
   */
  getPlayerInfo(playerInfoContainer) {
    return {
      name: playerInfoContainer.querySelector('input[type="text"]').value,
      email: playerInfoContainer.querySelector('input[type="email"]').value,
      current: playerInfoContainer.querySelector('input[type="radio"]').checked,
    };
  }

  setPlayerInfo(playerInfoContainer, playerData) {
    playerInfoContainer.querySelector('input[type="text"]').value = playerData.name;
    playerInfoContainer.querySelector('input[type="email"]').value = playerData.email;
    playerInfoContainer.querySelector('input[type="radio"]').checked = playerData.current;
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
