// Creates a notification popup to notify the user whenever the status of isvhsopen.com changes
function notifyStatusChanged(data) {
  var msg = "is " + (data.open ? "open" : "closed") + (data.until ? " until " + ("0" + data.until[0]).substr(-2) + ":" + ("0" + data.until[1]).substr(-2) : "") + ".";
  chrome.notifications.create('reminder', {
      type: 'basic',
      iconUrl: 'images/128.png',
      title: 'Vancouver Hack Space',
      message: msg
     });
}