var URL = "https://www.skipaas.com/tenants/39/",
  LOGIN_ICON = "img/gj.png",
  LOGOUT_ICON = "img/gjm.png";

function checkUpdate() {
  var jsonUrl = URL + "notifications.json",
    req = new XMLHttpRequest();

  req.position = -1;
  req.onprogress = function(e) {
    req.position = e.position;
  };
  req.open("GET", jsonUrl, true);
  req.onreadystatechange = function () {
    var length;

    if (req.readyState === 4) {
      length = parseInt(req.getResponseHeader("Content-Length"), 10);
      if (length !== req.position) {
        chrome.browserAction.setIcon({"path": LOGOUT_ICON});
        return;
      }
      chrome.browserAction.setIcon({"path": LOGIN_ICON});
      process(req);
    }
  };
  req.send();
}

function process(req) {
  var newCount = JSON.parse(req.responseText).count,
    preCount = localStorage.pre_count || 0,
    increment = newCount - preCount;

  if (newCount && increment > 0) {
    chrome.browserAction.setBadgeText({text:String(increment)});
    notify(increment);
  } else {
    resetBadge();
    localStorage.pre_count = 0;
  }
  localStorage.pre_count = newCount;
}

function notify(increment) {
  var title = "GoodJob Notifier",
    body = increment + "件の新着GoodJob",
    dialog = webkitNotifications.createNotification(LOGIN_ICON, title, body);

  dialog.addEventListener('click', function() {
    window.open(URL);
    dialog.cancel();
    resetBadge();
  });
  dialog.show();

  var sec = localStorage.appearance_sec || 3;
  if (typeof minute === "string") {
    sec = parseInt(sec, 10);
  }
  console.log(sec);

  setTimeout(function() {
    dialog.cancel();
  }, sec * 1000);
}

function resetBadge() {
  chrome.browserAction.setBadgeText({text:String("")});
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': URL}, function(tab) {});
  resetBadge();
});

chrome.runtime.onInstalled.addListener(function() {
  checkUpdate();
  var minute = localStorage.interval_minute || 5;
  if (typeof minute === "string") {
    minute = parseInt(minute, 10);
  }
  chrome.alarms.create('checkUpdate', {periodInMinutes: minute});
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm && alarm.name === 'checkUpdate') {
    checkUpdate();
  }
});