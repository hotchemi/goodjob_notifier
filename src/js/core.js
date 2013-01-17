(function() {

  var minute = localStorage["interval_minute"] || 10,
    interval = minute * 60 * 1000,
    url = "https://www.skipaas.com/tenants/39/",
    preCount = 0,
    req = new XMLHttpRequest();

  req.position = -1;
  req.onprogress = function (e) {
    req.position =  e.position;
  };

  function checkUpdate() {
    var jsonUrl = url + "notifications.json",
      length = 0;

    req.open("GET", jsonUrl, true);
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        try {
          length = parseInt(req.getResponseHeader("Content-Length"), 10);
        } catch (e) {
          throw e;
        }
        if (length !== req.position) {
          chrome.browserAction.setIcon({"path": "img/gjm.png"});
          return;
        }
        process();
      }
    };
    req.send();
    setTimeout(checkUpdate, interval);
  }

  function process() {
    var newCount = JSON.parse(req.responseText).count,
      increment = newCount - preCount;

    chrome.browserAction.setIcon({"path": "img/gj.png"});

    if (increment) {
      notify(increment);
    } else {
      increment = "";
    }
    chrome.browserAction.setBadgeText({text:String(increment)});
    preCount = newCount;
  }

  function notify(increment) {
    var title = "GoodJob Notifier",
      body = increment + "件の新着GoodJobがあります!!",
      icon = "img/gj.png",
      dialog = webkitNotifications.createNotification(icon, title, body);

    dialog.addEventListener('click', function() {
      dialog.cancel();
      resetBadge();
      window.open(url);
    });

    dialog.show();
    setTimeout(function() {
      dialog.cancel();
    }, 3000);
  }

  function resetBadge() {
    chrome.browserAction.setBadgeText({text:String("")});
    preCount = 0;
  }

  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': url}, function(tab) {
      resetBadge();
    });
  });

  checkUpdate();
}());