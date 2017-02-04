(function() {
  // send event to content_scripts to run a script on history change
  chrome.webNavigation.onHistoryStateUpdated.addListener(function (event) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {});
    });
  });
})();
