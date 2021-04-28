import { me } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
let document = require("document");

import { View, $at } from "../lib/view";

// background color initialize
const background = document.getElementById("background");
let sublabel = document.getElementById("sub");

export default class HRM extends View {
  constructor(parent) {
    if (!parent) throw new Error("HRM parent element is undefined");

    const $ = $at(parent);
    this.label = $("#lblHrm");
  }

  eventHandler = () => {
    if (display.on) {
      this.bodySensor.start();
      this.hrmSensor.start();
    } else {
      if (this.hrmSensor) this.hrmSensor.stop();
      if (this.bodySensor) this.bodySensor.stop();
    }
  }

  setupEvents() {
    display.addEventListener("change", this.eventHandler);
    this.eventHandler();
  }

  getBPM() {
    if (!this.bodySensor.present) {
      return "--"; // off-wrist
    }
    // change background by heart rate zone
      var maxhr = 211 - (0.64 * user.age); 
      var heartrate = this.hrmSensor.heartRate;
      if(heartrate < maxhr * 0.5) {
        background.style.fill = "#D0D0D0"; // < 50%
      } else if(heartrate < maxhr * 0.6) {
        background.style.fill = "#545353"; // 50-59%
      } else if(heartrate < maxhr * 0.7) {
        background.style.fill = "#050CF2"; // 60-69%
      } else if(heartrate < maxhr * 0.8) {
        background.style.fill = "#1F891F"; // 70-79%
      } else if(heartrate < maxhr * 0.9) {
        background.style.fill = "#F1F904"; // 80-89%
      } else {
        background.style.fill = "#F23907"; // 90-100%
      }    
    // update percent based on heart rate
    return this.hrmSensor.heartRate;
  }

  getZone() {
    return user.heartRateZone(this.hrmSensor.heartRate || 0);
  }

  onMount() {
    if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_activity")) {
      this.bodySensor = new BodyPresenceSensor();
      this.hrmSensor = new HeartRateSensor();
      this.setupEvents();
    } else {
      console.warn("Denied Heart Rate or User Profile permissions");
    }
  }

  onRender() {
    this.label.text = Math.round(this.getBPM() / (220 - user.age) * 100).toString() + "%" || "--";
    sublabel.text = this.getBPM();
  }

  onUnmount() {
    display.removeEventListener("change", this.eventHandler);
    if (this.hrmSensor) this.hrmSensor.stop();
    if (this.bodySensor) this.bodySensor.stop();
  }
}
