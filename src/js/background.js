browser.runtime.onMessage.addListener((message) => {
  const { logFound } = message;
  let badgeText = logFound ? '!!!': '';
  browser.browserAction.setBadgeText({
    'text': badgeText,
  });
});