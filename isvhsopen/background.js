//Background page code for Chrome Extension

// How many minutes to wait between polling.
// When put in the Chrome store, maximum rate is once per minute (pollingDelay >= 1)
var pollingDelay = 1;

// Performs an anychronous HTTP GET request on specified url
function http_get(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = xhr.responseText;
        callback(data);
      } else {
        // TODO remove log msg
        console.log('response was not 200', xhr.status);
        callback(null);
      }
    }
  }
  // Note that any URL fetched here must be matched by a permission in
  // the manifest.json file!
  xhr.open('GET', url, true);
  xhr.send();
}

// Parses JSON response from isvhsopen.com/api/status/
// and returns an object of format:
// { open : true, until : [ int hours , int mins ] }
// { open : true, until : null }
// { open : false }
function parse_response(data) {
  console.log(data);
  if (data) {
    var j = JSON.parse(data);
    if ("status" in j && j["status"].toString().toLowerCase() == "open") {
      var until = j["openUntil"];
      if (until && until.length == 24) {
    var d = new Date(Date.parse(until));
        var hoursMins = [ d.getHours(), d.getMinutes() ];
        return { open: true, until: hoursMins };
      }
      return { open: true, until: null };
    }
  }
  return { open: false };
}

// Queries isvhsopen.com for current status and returns as object of format:
// { open : true, until : [ int hours , int mins ] } (see parse_response for more info)
function check_isvhsopen(callback) {
  http_get("http://www.isvhsopen.com/api/status/",
    function (data) {
      callback(parse_response(data));
    });
}

// Process messages sent from the Browser Action code
function onMessageReceived(request, sender, sendResponse) {
  if (request.action == 'check_isvhsopen') {
    check_isvhsopen(function (data) {
      sendResponse(data);
      BAIcon.update(data);
    });
	//Need to return true to allow the async response to finish
	//http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true;
  }
}

function alarmHandler(alarm) {
  console.log("Got an alarm!", alarm);
  if (alarm.name == "poll_isvhsopen") {
    check_isvhsopen(BAIcon.update);
  }
}

// Wire up the listeners
chrome.runtime.onMessage.addListener(onMessageReceived);
chrome.alarms.onAlarm.addListener(alarmHandler);
chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.clear("poll_isvhsopen"); //TODO: Might not be necessary
  chrome.alarms.create("poll_isvhsopen", {delayInMinutes: pollingDelay, periodInMinutes: pollingDelay});
  });