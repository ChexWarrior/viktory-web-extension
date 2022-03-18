browser.runtime.onMessage.addListener((message) => {
  const { logFound } = message;

  if (logFound) {
    browser.browserAction.setBadgeText({
      'text': 'found',
    });
  }
});