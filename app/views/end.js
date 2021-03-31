import exercise from "exercise";

import * as utils from "../lib/utils";
import { View, $at } from "../lib/view";
import Clock from "../subviews/clock";

const $ = $at("#view-end");

export class ViewEnd extends View {
  el = $();

  lblActiveTime = $("#lblActiveTime");
  lblHeartRateAvg = $("#lblHeartRateAvg");
  lblHeartRateMax = $("#lblHeartRateMax");
  lblSpeedAvg = $("#lblSpeedAvg");
  lblSpeedMax = $("#lblSpeedMax");
  lblDistance = $("#lblDistance");

  onMount() {
    this.clock = new Clock("#subview-clock2", "seconds");
    this.insert(this.clock);

    this.lblActiveTime.text = `Active Time: ${utils.formatActiveTime(
      exercise.stats.activeTime || 0
    )}`;

    this.lblHeartRateAvg.text = `Avg Heart Rate: ${exercise.stats.heartRate
      .average || 0} bpm`;
    this.lblHeartRateMax.text = `Max Heart Rate: ${exercise.stats.heartRate
      .max || 0} bpm`;
    
    // gps activities
    //if(config.exerciseName == "run" || config.exerciseName == "hike" ||  config.exerciseName == "bike") {
      const speedAvg = utils.formatSpeed(exercise.stats.speed.average || 0);
      this.lblSpeedAvg.text = `Avg Speed: ${speedAvg.value} ${speedAvg.units}`;

      const speedMax = utils.formatSpeed(exercise.stats.speed.max || 0);
      this.lblSpeedMax.text = `Max Speed: ${speedMax.value} ${speedMax.units}`;

      const distance = utils.formatDistance(exercise.stats.distance || 0);
      this.lblDistance.text = `Distance: ${distance.value} ${distance.units}`;
    
   // }
  }

  onRender() {}

  onUnmount() {}
}
