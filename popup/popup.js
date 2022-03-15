const scrapeBtn = document.querySelector('#scrape');
scrapeBtn.addEventListener('click', function(e) {
  browser.windows.getAll()
    .then(windows => {
        document.querySelector('#windowCount').innerHTML = windows.length;
        return browser.windows.getLastFocused();
    })
    .then(lastWindow => {
      document.querySelector('#windowTitle').innerHTML = lastWindow.title;
    })
    .catch(error => {
      document.querySelector('#windowTitle').innerHTML = error;
    });
});

