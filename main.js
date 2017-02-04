(function() {
  var headers = document.getElementsByTagName('header');
  if (headers.length != 1) {
    console.error("can't get valid header");
    return;
  }
  var header = headers[0];

  chrome.storage.sync.get(function(item) {
    console.log(item);
    header.style.backgroundColor = 'rgba(' + item.red + ', '
                                           + item.green + ', '
                                           + item.blue + ', '
                                           + item.alpha + ')';
  });
}());
