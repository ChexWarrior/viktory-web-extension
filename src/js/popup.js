import { TabDisplay } from "/src/js/modules/tabDisplay.mjs";
import { LogScraper } from "/src/js/modules/logScraper.mjs";
import { PubSub } from "/src/js/modules/pubSub.mjs";

const pubSub = new PubSub();
const scrapeForm = document.querySelector('#scrapeForm');
const gameLogScraper = new LogScraper(scrapeForm, pubSub);
const tabDisplay = new TabDisplay(document.querySelector('div.tabs'), pubSub);
