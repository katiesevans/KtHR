import document from "document";
import exercise from "exercise";

import * as config from "../config";
import Cycle from "../lib/cycle"
import { Application, View, $at } from "../lib/view";
import * as utils from "../lib/utils";
import Clock from "../subviews/clock";
import GPS from "../subviews/gps";
import HRM from "../subviews/hrm";
import Popup from "../subviews/popup";

const $ = $at("#view-exercise");

export class ViewExercise extends View {
  el = $();

  btnFinish2 = $("#btnFinish");
  btnToggle2 = $("#btnToggle");
  lblStatus2 = $("#lblStatus");

  elBoxStats2 = $("#boxStats");
  //lblSpeed = $("#lblSpeed");
  //lblSpeedUnits = $("#lblSpeedUnits");
  //lblSpeedAvg = $("#lblSpeedAvg");
  //lblSpeedAvgUnits = $("#lblSpeedAvgUnits");
  //lblSpeedMax = $("#lblSpeedMax");
  //lblSpeedMaxUnits = $("#lblSpeedMaxUnits");
  //lblDistance = $("#lblDistance");
  //lblDistanceUnits = $("#lblDistanceUnits");
  lblActiveTime2 = $("#lblActiveTime");
  lblCalories2 = $("#lblCalories");

  handlePopupNo = () => {
    this.remove(this.popup);
  };

  handlePopupYes = () => {
    this.remove(this.popup);
    exercise.stop();
    Application.switchTo("ViewEnd");
  };

  handleToggle = () => {
    if (exercise.state === "started") {
      this.handlePause();
    } else {
      this.handleResume();
    }
  };

  handlePause = () => {
    exercise.pause();
    this.lblStatus.text = "paused";
    this.setComboIcon(this.btnToggle, config.icons.play);
    utils.show(this.btnFinish);
  };

  handleResume = () => {
    exercise.resume();
    this.lblStatus.text = "";
    this.setComboIcon(this.btnToggle, config.icons.pause);
    utils.hide(this.btnFinish);
  };

  setComboIcon(combo, icon) {
    combo.getElementById("combo-button-icon").href = icon;
    combo.getElementById("combo-button-icon-press").href = icon;
  }

  handleFinish = () => {
    let popupSettings = {
      title: "End activity?",
      message: `Are you sure you want to finish this ${
        config.exerciseName
      } session?`,
      btnLeftLabel: "Cancel",
      btnLeftCallback: this.handlePopupNo,
      btnRightLabel: "End",
      btnRightCallback: this.handlePopupYes
    };
    this.popup2 = new Popup("#popup", popupSettings);
    this.insert(this.popup);
  };

  handleCancel = () => {
    this.gps.callback = undefined;
    Application.switchTo("ViewSelect");
  }

  handleLocationSuccess = () => {
    utils.show(this.btnToggle2);
    exercise.start(config.exerciseName, config.exerciseOptions);
    this.lblStatus2.text = "";
    this.gps.callback = undefined;
  };

  handleRefresh = () => {
    this.render();
  }

  handleButton = (evt) => {
    evt.preventDefault();
    switch (evt.key) {
      case "back":
        if (exercise.state === "stopped") {
          this.handleCancel();
        } else {
          this.cycle.next();
        }
        break;
      case "up":
        if (exercise.state === "paused") {
          this.handleFinish();
        }
        break;
      case "down":
        if (exercise.state === "started") {
          this.handleToggle();
        }
        break;
    }
  }

  onMount() {
    utils.hide(this.btnFinish2);
    utils.hide(this.btnToggle2);
    this.setComboIcon(this.btnToggle2, config.icons.pause);
    //this.lblStatus.text = "connecting";

    this.clock2 = new Clock("#subview-clock", "seconds", this.handleRefresh);
    this.insert(this.clock2);

    this.hrm2 = new HRM("#subview-hrm");
    this.insert(this.hrm2);

    this.gps2 = new GPS("#subview-gps2", this.handleLocationSuccess);
    this.insert(this.gps2);

    this.cycle2 = new Cycle(this.elBoxStats2);

    this.btnToggle.addEventListener("click", this.handleToggle2);
    this.btnFinish.addEventListener("click", this.handleFinish2);
    document.addEventListener("keypress", this.handleButton2);
  }

  onRender() {
    if (exercise && exercise.stats) {

      //const speed = utils.formatSpeed(exercise.stats.speed.current);
      //this.lblSpeed.text = speed.value;
      //this.lblSpeedUnits.text = `Speed ${speed.units}`;

      //const speedAvg = utils.formatSpeed(exercise.stats.speed.average);
      //this.lblSpeedAvg.text = speedAvg.value;
      //this.lblSpeedAvgUnits.text = `Avg Speed ${speedAvg.units}`;

      //const speedMax = utils.formatSpeed(exercise.stats.speed.max);
      //this.lblSpeedMax.text = speedMax.value;
      //this.lblSpeedMaxUnits.text = `Max Speed ${speedMax.units}`;

      //const distance = utils.formatDistance(exercise.stats.distance);
      //this.lblDistance.text = distance.value;
      //this.lblDistanceUnits.text = `Distance ${distance.units}`;

      this.lblActiveTime2.text = utils.formatActiveTime(exercise.stats.activeTime);

      this.lblCalories2.text = utils.formatCalories(exercise.stats.calories);
    }
  }

  onUnmount() {
    this.cycle.removeEvents();

    this.btnToggle2.removeEventListener("click", this.handleToggle);
    this.btnFinish2.removeEventListener("click", this.handleFinish);
    document.removeEventListener("keypress", this.handleButton);
  }
}
