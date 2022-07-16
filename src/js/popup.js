import { TabDisplay } from "/src/js/modules/tabDisplay.mjs";
import { LogScraper } from "/src/js/modules/logScraper.mjs";
import { PubSub } from "/src/js/modules/pubSub.mjs";
import { GameStart } from "/src/js/modules/gameStart.mjs";

const pubSub = new PubSub();
const gameLogScraper = new LogScraper(document.querySelector('#scrapeForm'), pubSub);
const gameStart = new GameStart(document.querySelector('#gameStart'), pubSub);
const tabDisplay = new TabDisplay(document.querySelector('div.tabs'), pubSub);

