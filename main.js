function getCurrentProjectId() {
  var queryString = window.location.search.substring(1);
  var queries = queryString.split('&');

  var projectId = null;
  queries.forEach(function(query) {
    var keyAndValue = query.split('=');
    if (keyAndValue[0] === 'project') {
      projectId = keyAndValue[1];
    }
  });

  return projectId;
}

function getCurrentHeader() {
  return document.querySelector('[md-theme=platform-bar]') || document.querySelector('.pcc-platform-bar-blue');
}

function changeHeaderColor() {
  var defaultSetting = {
    conditions: []
  };
  chrome.storage.sync.get(defaultSetting, function(setting) {
    var header = getCurrentHeader();
    if (!header) {
      console.error("can't get valid header");
      return;
    }

    var projectId = getCurrentProjectId();
    if (!projectId) {
      console.error("can't get projectId");
      return;
    }

    var conditions = setting.conditions;
    for (var i = 0; i < conditions.length; i++) {
      var condition = conditions[i];
      if (projectId.match(condition.pattern)) {
        var colorRgb = 'rgb(' + condition.color.r + ', '
                              + condition.color.g + ', '
                              + condition.color.b + ')';
        header.style.backgroundColor = colorRgb;
        return;
      }
    }

    // No patterns matched, so back to original color
    header.style.backgroundColor = null;
  });
}

(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    changeHeaderColor();
  });
  changeHeaderColor();
}());
