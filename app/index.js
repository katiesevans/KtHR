let document = require("document");
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
import { me } from "appbit";
import exercise from "exercise"; // for exercise tracking

// Fetch UI elements we will need to change
let hrLabel = document.getElementById("hrm");
let updatedLabel = document.getElementById("updated");
let percentLabel = document.getElementById("percent");
let timeLabel = document.getElementById("time");

// Keep a timestamp of the last reading received. Start when the app is started.
let lastValueTimestamp = Date.now();

// background color initialize
const background = document.getElementById("background");

// Initialize the UI with some values
hrLabel.text = "--";
//updatedLabel.text = "...";
percentLabel.text = "0%"
timeLabel.text = "00:00:00"

// disable app timeout
me.appTimeoutEnabled = false;


// This function takes a number of milliseconds and returns a string
// such as "5min ago".
function convertMsAgoToString(millisecondsAgo) {
  var ms = millisecondsAgo % 1000;
  millisecondsAgo = (millisecondsAgo - ms) / 1000;
  var secs = millisecondsAgo % 60;
  millisecondsAgo = (millisecondsAgo - secs) / 60;
  var mins = millisecondsAgo % 60;
  var hrs = (millisecondsAgo - mins) / 60;
  
  if(mins < 10) { mins = "0" + mins};
  if(secs < 10) { secs = "0" + secs};

  return hrs + ':' + mins + ':' + secs;
}

// This function updates the label on the display that shows when data was last updated.
function updateDisplay() {
  if (lastValueTimestamp !== undefined) {
    timeLabel.text = convertMsAgoToString(Date.now() - lastValueTimestamp);
  }
}

// Create a new instance of the HeartRateSensor object
var hrm = new HeartRateSensor();

// get max heart rate from fitbit user - maxHeartRate
//var usr = new user();

//console.log((user.age || "Unknown") + " BPM");

// Declare an event handler that will be called every time a new HR value is received.
hrm.onreading = function() {

  // Peek the current sensor values
  console.log("Current heart rate: " + hrm.heartRate);
  hrLabel.text = hrm.heartRate;
  //lastValueTimestamp = Date.now();
  
  // update background based on heart rate
  var maxhr = 220 - user.age;
  //var maxhr = 193
  if(hrm.heartRate < maxhr * 0.5) {
    background.style.fill = "#D0D0D0"; // < 50%
  } else if(hrm.heartRate < maxhr * 0.6) {
    background.style.fill = "#545353"; // 50-59%
  } else if(hrm.heartRate < maxhr * 0.7) {
    background.style.fill = "#050CF2"; // 60-69%
  } else if(hrm.heartRate < maxhr * 0.8) {
    background.style.fill = "#1F891F"; // 70-79%
  } else if(hrm.heartRate < maxhr * 0.9) {
    background.style.fill = "#F1F904"; // 80-89%
  } else {
    background.style.fill = "#F23907"; // 90-100%
  }
  
  // update percent based on heart rate
  percentLabel.text =  Math.round(hrm.heartRate / maxhr * 100).toString() + "%"
}

// Begin monitoring the sensor
hrm.start();

// And update the display every second
setInterval(updateDisplay, 1000);


