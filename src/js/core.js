(function() {

  // 監視間隔を設定(10分)
  var interval = 10 * 60 * 1000,
    preCount = 0,
    req = new XMLHttpRequest();

  function checkUpdate() {
    var url = "https://www.skipaas.com/tenants/39/notifications.json";
    req.open("GET", url, true);
    //req.onreadystatechange = process;

    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        var cType = req.getResponseHeader("Content-Type");
        if (cType.toLowerCase().indexOf("text/plain") == -1) {
          chrome.browserAction.setIcon({"path": "img/goodjob_black.png"});
        }
      }
      process();
    };

    req.send();
    setTimeout(checkUpdate, interval);
  }

  function process() {
    var newCount = JSON.parse(req.responseText).count,
      increment = newCount - preCount;

    if (req.readyState !== 4) {
      return;
    }

    // 前回との差が+1以上の時通知
    if (increment) {
      notify(increment);
    }
    chrome.browserAction.setBadgeText({text:String(increment)});
    preCount = newCount;
  }

  function notify(increment) {
    var title = "GoodJob Notifier",
      body = increment + "件の新着GoodJobがあります｡",
      icon = "img/goodjob.png",
      dialog = webkitNotifications.createNotification(icon, title, body);

    dialog.addEventListener('click', function() {
      dialog.cancel();
      window.open('https://www.skipaas.com/tenants/39/');
    });

    dialog.show();

    setTimeout(function() {
      dialog.cancel();
    }, 3000);
  }

  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': 'https://www.skipaas.com/tenants/39/'}, function(tab) {
      chrome.browserAction.setBadgeText({text:String("")});
    });
  });

  checkUpdate();

}());