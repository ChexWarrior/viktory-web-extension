import { TabTarget } from "./tabTarget.mjs";

class GameStart extends TabTarget {
  /**
   *
   * @param {HTMLFormElement} targetForm
   * @param {PubSub} pubSub
   */
  constructor(targetForm, pubSub) {
    super(targetForm, pubSub);
    this.newGameForm = targetForm;
    this.newGameUrl = 'http://gamesbyemail.com/Games/Viktory2';
    this.numPlayerContainer = targetForm.querySelector('div.numPlayers');
    this.playerInfoFields = targetForm.querySelectorAll('div[data-player-info]');

    // Submit form
    targetForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.createGame(event);
    });

    // Setup events for changing player order (drag/drop)
    this.playerInfoFields.forEach(playerInfo => {
      const playerLabel = playerInfo.querySelector('label.label');
      playerLabel.addEventListener('dragstart', event => {
        this.dragStartPlayerInfo(event);
      });

      playerLabel.addEventListener('dragover', event => {
        this.dragOverPlayerInfo(event);
      });

      playerLabel.addEventListener('drop', event => {
        this.dropPlayerInfo(event);
      });

      playerLabel.addEventListener('dragenter', event => {
        console.log('drag enter');
        this.toggleDragStyle(event);
      });

      playerLabel.addEventListener('dragleave', event => {
        console.log('drag leave');
        this.toggleDragStyle(event);
      });
    });

    // Change number of players
    this.numPlayerContainer.addEventListener('click', (event) => {
      const { target } = event;

      if (target.tagName === 'INPUT') {
        const numPlayers = parseInt(target.value, 10);
        this.updateNumPlayers(numPlayers);
      }
    });

    // Handle the initial number of players
    let initialNumPlayers = this.numPlayerContainer.querySelector('input[checked]').value;
    this.updateNumPlayers(initialNumPlayers);
  }

  dragStartPlayerInfo(event) {
    console.log('Drag!');
    event.dataTransfer.dropEffect = "link";
    event.dataTransfer.effectAllowed = "copyLink";

    const playerContainer = event.currentTarget.parentElement.parentElement;

    event.dataTransfer.setData('text/plain', playerContainer.dataset.playerInfo);
  }

  dragOverPlayerInfo(event) {
    event.preventDefault();
    console.log('Drag over');
  }

  dropPlayerInfo(event) {
    event.preventDefault();
    console.log('Drop!');
    const draggedPlayerOrder = event.dataTransfer.getData('text/plain');
    const targetPlayerOrder = event.currentTarget.parentElement.parentElement.dataset.playerInfo;

    const draggedPlayerContainer = this.newGameForm.querySelector(`div[data-player-info="${draggedPlayerOrder}"]`);
    const targetPlayerContainer = this.newGameForm.querySelector(`div[data-player-info="${targetPlayerOrder}"]`);

    const draggedPlayerData = this.getPlayerInfo(draggedPlayerContainer);
    const targetPlayerData = this.getPlayerInfo(targetPlayerContainer);

    // Swap values
    this.setPlayerInfo(draggedPlayerContainer, targetPlayerData);
    this.setPlayerInfo(targetPlayerContainer, draggedPlayerData);

    targetPlayerContainer.classList.remove('dragged');
  }

  toggleDragStyle(event) {
    const draggedPlayerNum = event.dataTransfer.getData('text/plain');
    const playerInfoContainer = event.currentTarget.parentElement.parentElement;

    // Dont show effect if dragging over self
    if (draggedPlayerNum !== playerInfoContainer.dataset.playerInfo) {
      console.log('different info...');
      playerInfoContainer.classList.toggle('dragged');
    }
  };

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
