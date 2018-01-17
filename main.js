function getCurrentProjectId() {
  var projectId = null;
  var hostname = window.location.hostname;

  if (hostname === 'console.cloud.google.com') {
    var queryString = window.location.search.substring(1);
    var queries = queryString.split('&');

    var projectId = null;
    queries.forEach(function(query) {
      var keyAndValue = query.split('=');
      if (keyAndValue[0] === 'project') {
        projectId = keyAndValue[1];
      }
    });
  } else if (hostname === 'bigquery.cloud.google.com') {
      var pathname = window.location.pathname;
      var dirnames = pathname.split('/')
      if (dirnames.length > 2) {
        projectId = dirnames[2].split(':')[0]
      }
  }

  return projectId;
}

function getCurrentHeader() {
  var header = null;
  var hostname = window.location.hostname;

  if (hostname === 'console.cloud.google.com') {
    header = document.querySelector('[md-theme=platform-bar]');
  } else if (hostname === 'bigquery.cloud.google.com') {
    header = document.querySelector('#gb div.gb_kb');
  }
  return header;
}

function changeHeaderColor() {
  var defaultSetting = {
    conditions: []
  };
  chrome.storage.sync.get(defaultSetting, function(setting) {
    var projectId = getCurrentProjectId();
    var conditions = setting.conditions;

    for (var i = 0; i < conditions.length; i++) {
      var condition = conditions[i];
      if (projectId.match(condition.pattern)) {
        var header = getCurrentHeader();
        if (!header) {
          console.error("can't get valid header");
          return;
        }

        var colorRgb = 'rgb(' + condition.color.r + ', '
                              + condition.color.g + ', '
                              + condition.color.b + ')';
        header.style.backgroundColor = colorRgb;
        return;
      }
    }

    // No patterns matched, so back to original color
    var header = getCurrentHeader();
    if (!header) {
      console.error("can't get valid header");
      return;
    }
    header.style.backgroundColor = null;
  });
}

(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    changeHeaderColor();
  });
  changeHeaderColor();
}());
