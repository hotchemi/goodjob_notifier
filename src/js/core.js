(function() {
    var URL = "https://www.skipaas.com/tenants/[tenant_id]/";

    function checkUpdate() {
        var jsonUrl = URL + "notifications.json",
            length = 0,
            req = new XMLHttpRequest();

        req.position = -1;
        req.onprogress = function (e) {
            req.position =  e.position;
        };

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
                process(req);
            }
        };
        req.send();
    }

    function process(req) {
        var newCount = JSON.parse(req.responseText).count,
            preCount = localStorage["pre_count"] || 0,
            increment = newCount - preCount;

        chrome.browserAction.setIcon({"path": "img/gj.png"});

        if (newCount && increment > 0) {
            notify(increment);
            chrome.browserAction.setBadgeText({text:String(increment)});
        } else {
            resetBadge();
        }
        localStorage["pre_count"] = newCount;
    }

    function notify(increment) {
        var title = "GoodJob Notifier",
            body = increment + "件の新着GoodJob",
            icon = "img/gj.png",
            dialog = webkitNotifications.createNotification(icon, title, body);

        dialog.addEventListener('click', function() {
            dialog.cancel();
            resetBadge();
            window.open(URL);
        });

        dialog.show();
        setTimeout(function() {
            dialog.cancel();
        }, 3000);
    }

    function resetBadge() {
        chrome.browserAction.setBadgeText({text:String("")});
        localStorage["pre_count"] = 0;
    }

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.create({'url': URL}, function(tab) {
            resetBadge();
        });
    });

    chrome.runtime.onInstalled.addListener(function() {
        checkUpdate();
        var minute = localStorage["interval_minute"] || 10;
        chrome.alarms.create('checkUpdate', {periodInMinutes: minute});
    });

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm && alarm.name === 'checkUpdate') {
            checkUpdate();
        }
    });

}());