/*
  Watch the current location to warmup the GPS.
*/
import { me } from "appbit";
import { geolocation } from "geolocation";
import * as config from "../config";

import { View, $at } from "../lib/view";

export default class GPS extends View {
  constructor(parent, callback) {
    if (!parent) throw new Error("GPS parent element is undefined");

    const $ = $at(parent);
    this.iconGps = $("#icon-gps");
    this.callback = callback;
    super();
  }

  onMount() {
    if (me.permissions.granted("access_location")) {
      this.watch();
    } else {
      // gps only can go bad if run, bike, hike
      if(config.exerciseName == "run" || config.exerciseName == "cycling" || config.exerciseName == "hiking") {
          this.gpsBad();
      } else {
        //this.watch()
        this.gpsGood();
      }
    }
  }

  onUnmount() {
    if (this.watchId) {
      geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
    }
  }

  watch() {
    this.watchId = geolocation.watchPosition(
      this.handleSuccess,
      this.handleError
    );
  }

  gpsGood() {
    if (this.iconGps) this.iconGps.style.fill = "fb-green";
  }

  gpsBad() {
    if (this.iconGps) this.iconGps.style.fill = "fb-red";
  }

  handleSuccess = (position) => {
    this.gpsGood();
    if (typeof this.callback === "function") this.callback();
  }

  handleError = (error) => {
    console.error(JSON.stringify(error));
    this.gpsBad();
  }
}
