function addCondition(condition) {
  var $table = $('#conditions');
  var $condition = $('<tr class="condition">');
  var $pattern = $('<td><input type="text" placeholder="pattern" class="pattern"></input></td>');
  var $color = $('<td><input type="text" class="color" style="background-color: rgb(255, 0, 0)"></input></td>');
  var $remove = $('<td><a href="#" id="remove">remove</a></td>');

  $condition.append($pattern);
  $condition.append($color);
  $condition.append($remove);

  var pickerColor = new Colors({
    // color: 'rgb(32, 100, 227)',
  });
  if (condition) {
    $pattern.find('.pattern')[0].value = condition.pattern;
    // pickerColor = Colors({
      // color: 'rgb(' + condition.color. + ')';
    // });
  }
  $condition.append($remove);
  $table.append($condition);

  // set event handler
  $remove.click(function(event) {
    $condition.remove();
  });
  $('.color').colorPicker({
    // color: pickerColor,
    // color: 'rgb(32, 100, 227)',
    color: 'rgb(100, 100, 227)',
    opacity: false,
    dark: '#fff',
    light: '#fff',
  });
}

function addEmptyCondition() {
  addCondition(undefined);
}

function saveConditions() {
  var conditions = [];
  $('.condition').each(function(i, elem) {
    var pattern = $(elem).find('.pattern')[0].value;
    var color = $(elem).find('.color')[0].style.backgroundColor;
    var colorParts = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)

    conditions.push({
      pattern: pattern,
      color: {
        r: parseInt(colorParts[1]),
        g: parseInt(colorParts[2]),
        b: parseInt(colorParts[3]),
      },
    });
  });

  var setting = {
    conditions: conditions
  };
  console.log("save setting: ", setting);

  chrome.storage.sync.set(setting, function() {
    console.log('saved!');
  });
}

(function() {
  // initialize
  $('#save').click(function(event) {
    saveConditions();
  });
  $('#add').click(function(event) {
    addEmptyCondition();
  });

  var defaultSetting = {
    conditions: []
  };

  chrome.storage.sync.get(defaultSetting, function(setting) {
    console.log("get setting: ", setting);
    var conditions = setting.conditions;
    if (conditions.length === 0) {
      addEmptyCondition();
      return;
    }

    conditions.forEach(function(condition) {
      addCondition(condition);
    });
  });
}());
