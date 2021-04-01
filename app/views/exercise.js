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

// show or hide gps icon depending on the type of activity
let gps_icon = document.getElementById("subview-gps2");
let dist_page = document.getElementById("distancePage");
let speed_page = document.getElementById("speedPage");
let speed_page2 = document.getElementById("speedPage2");
let speed_page3 = document.getElementById("speedPage3");


export class ViewExercise extends View {
  el = $();

  btnFinish = $("#btnFinish");
  btnToggle = $("#btnToggle");
  lblStatus = $("#lblStatus");

  elBoxStats = $("#boxStats");
  lblSpeed = $("#lblSpeed");
  lblSpeedUnits = $("#lblSpeedUnits");
  lblSpeedAvg = $("#lblSpeedAvg");
  lblSpeedAvgUnits = $("#lblSpeedAvgUnits");
  lblSpeedMax = $("#lblSpeedMax");
  lblSpeedMaxUnits = $("#lblSpeedMaxUnits");
  lblDistance = $("#lblDistance");
  lblDistanceUnits = $("#lblDistanceUnits");
  lblActiveTime = $("#lblActiveTime");
  lblCalories = $("#lblCalories");
  lblZoneMins = $("#lblZoneMins");

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
    this.lblStatus.text = ""; // dont like this, covers up my heart
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
    this.popup = new Popup("#popup", popupSettings);
    this.insert(this.popup);
  };

  handleCancel = () => {
    this.gps.callback = undefined;
    Application.switchTo("ViewSelect");
  }

  handleLocationSuccess = () => {
    utils.show(this.btnToggle);
    
    // set gps to true for run, bike, or hike. Else default is false
    if(config.exerciseName == "run" || config.exerciseName == "bike" || config.exerciseName == "hike") {
      config.exerciseOptions.gps = true
    }
    exercise.start(config.exerciseName, config.exerciseOptions);
    this.lblStatus.text = "";
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
    
    utils.hide(this.btnFinish);
    utils.hide(this.btnToggle);
    this.setComboIcon(this.btnToggle, config.icons.pause);

    this.clock = new Clock("#subview-clock", "seconds", this.handleRefresh);
    this.insert(this.clock);
    
    // show or hide gps icon
    if(config.exerciseName == "run" ||
      config.exerciseName == "bike" ||
      config.exerciseName == "hike") {
      gps_icon.style.display = "inline";
      this.lblStatus.text = "connecting";
      this.gps = new GPS("#subview-gps2", this.handleLocationSuccess);
      this.insert(this.gps);
    } else {
      gps_icon.style.display = "none";
      this.lblStatus.text = "";
      utils.show(this.btnToggle);
      exercise.start(config.exerciseName, config.exerciseOptions);
    }

    this.hrm = new HRM("#subview-hrm");
    this.insert(this.hrm);

    this.cycle = new Cycle(this.elBoxStats);

    this.btnToggle.addEventListener("click", this.handleToggle);
    this.btnFinish.addEventListener("click", this.handleFinish);
    document.addEventListener("keypress", this.handleButton);
  }

  onRender() {
    if (exercise && exercise.stats) {

      const speed = utils.formatSpeed(exercise.stats.speed.current);
      this.lblSpeed.text = speed.value;
      this.lblSpeedUnits.text = `Speed ${speed.units}`;

      const speedAvg = utils.formatSpeed(exercise.stats.speed.average);
      this.lblSpeedAvg.text = speedAvg.value;
      this.lblSpeedAvgUnits.text = `Avg Speed ${speedAvg.units}`;

      const speedMax = utils.formatSpeed(exercise.stats.speed.max);
      this.lblSpeedMax.text = speedMax.value;
      this.lblSpeedMaxUnits.text = `Max Speed ${speedMax.units}`;

      const distance = utils.formatDistance(exercise.stats.distance);
      this.lblDistance.text = distance.value;
      this.lblDistanceUnits.text = `Distance ${distance.units}`;

      this.lblActiveTime.text = utils.formatActiveTime(exercise.stats.activeTime);

      this.lblCalories.text = utils.formatCalories(exercise.stats.calories);
      
      // add active zone minutes
      this.lblZoneMins.text = exercise.stats.activeZoneMinutes.toString();
    }
  }

  onUnmount() {
    this.cycle.removeEvents();

    this.btnToggle.removeEventListener("click", this.handleToggle);
    this.btnFinish.removeEventListener("click", this.handleFinish);
    document.removeEventListener("keypress", this.handleButton);
  }
}
