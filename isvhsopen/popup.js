// This event fires when the user clicks the Browser Action Icon
document.addEventListener("DOMContentLoaded", function(event) { 
  var statusDiv = document.getElementById("status");
  statusDiv.innerText = "Refreshing...";
  chrome.runtime.sendMessage({ action: "check_isvhsopen"}, function(response) {
    console.log(response);
    if (response.open) {
      var msg = "VHS is open";
      var closingTime = response.until;
      if (closingTime && closingTime.length == 2) {
        //Convert to 24hr time format
        var time = ("0" + closingTime[0]).slice(-2) + ("0" + closingTime[1]).slice(-2);
        msg = msg + " until " + time;
      }
      statusDiv.innerText = msg;
    }
    else {
      statusDiv.innerText = "VHS is closed";
    }
	
	// Close popup after 5 seconds
	setTimeout(function() { 
	  this.close(); }, 5000);
  });
});