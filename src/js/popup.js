import { TabDisplay } from "/src/js/modules/tabDisplay.mjs";
import { LogScraper } from "/src/js/modules/logScraper.mjs";
import { PubSub } from "/src/js/modules/pubSub.mjs";
import { GameStart } from "/src/js/modules/gameStart.mjs";

const pubSub = new PubSub();
new LogScraper(document.querySelector('#scrapeForm'), pubSub);
new GameStart(document.querySelector('#gameStart'), pubSub);
new TabDisplay(document.querySelector('div.tabs'), pubSub);
