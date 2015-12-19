//Browser Action Icon code for Chrome Extension

var BAIcon = {

  // Updates the extension's Browser Action icon and badge based
  // on the isvhsopen.com status in data.
  update : function (data) {
    console.log(data);
    var newBadgeText = "???"
    var newBadgeColor = [255, 0, 0, 255];
    
    if (data && "open" in data) {
      if (data.open) {
        newBadgeText = BAIcon.getBadgeText(data.until);
        newBadgeColor = BAIcon.getBackgroundColor(data.until);
      }
      else { //Closed
        newBadgeText = ""
        newBadgeColor = [0, 0, 0, 0];
      }
    } //else Error
	//Update the UI
    chrome.browserAction.setBadgeBackgroundColor({color: newBadgeColor });
    chrome.browserAction.getBadgeText({}, function(text) {
      if (text != newBadgeText) {
        chrome.browserAction.setBadgeText({ text: newBadgeText });
        notifyStatusChanged(data);
      }
    }); 
  },
  
  // Gets an appropriate colour, given the amount of time until closingTime.
  // Transitions from green to yellow (at 1h), and then yellow to red.
  getBackgroundColor : function (closingTime) {
    if (!closingTime) {
      return [0, 255, 127, 255];
    }
    else {
      var hc = closingTime[0];
      var mc = closingTime[1];
      var now = new Date();
      var hn = now.getHours();
      var mn = now.getMinutes();
      //Check in case closingTime is for the next day
      if (hc < hn) {
        hc += 24;
      }
      var minDiff = (hc - hn)*60 + mc - mn;
      if (minDiff < 60) {
        //Transition from Yellow to Red
        return [255, (minDiff * 4), 0, 255];
      } else {
        //Transition from Green to Yellow
        //Solid green if greater than 255+60min = 5h15m
        var r = Math.max(0, 255-(minDiff-60));
        return [r, 255, 0, 255];
      }
    }
  },
  
  // Assumes VHS is open. Converts time from format [ int hour, int min ] to "HHMM"
  // but if closingTime isn't a 2-element array, it returns "open" instead
  getBadgeText : function (closingTime) {
    if (closingTime && closingTime.length == 2) {
      //Convert to 24hr time format
      return ("0" + closingTime[0]).slice(-2) + ("0" + closingTime[1]).slice(-2);
    }
    return "open";
  }
}