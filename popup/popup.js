const scrapeBtn = document.querySelector('#scrape');
scrapeBtn.addEventListener('click', function(e) {
  browser.windows.getAll({ populate: true })
    .then(windows => {
      document.querySelector('#winLength').innerHTML = windows.length;
      for (const w of windows) {
        let title = w.title;
        if (title.includes('Log')) {
          //document.querySelector('div').innerHTML = title;
          let windowTabId = w.tabs[0].id;
          document.querySelector('div').innerHTML = windowTabId ?? 'hello';
          browser.tabs.executeScript(
            windowTabId,
            { file: '/content_scripts/scrapeLog.js' }
          );
        }
      }
    });
});

