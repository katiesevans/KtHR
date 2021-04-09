import document from "document";
import exercise from "exercise";

import * as config from "../config";
import Cycle from "../lib/cycle"
import { Application, View, $at } from "../lib/view";
import * as utils from "../lib/utils";
import Clock from "../subviews/clock";
import GPS from "../subviews/gps";
import HRM from "../subviews/hrm";
//import Popup from "../subviews/popup";

const $ = $at("#view-exercise");

// show or hide gps icon depending on the type of activity
let gps_icon = document.getElementById("subview-gps2");
let dist_page = document.getElementById("distancePage");
let speed_page = document.getElementById("speedPage");
let speed_page2 = document.getElementById("speedPage2");
let speed_page3 = document.getElementById("speedPage3");

// play pause button
const btnToggle = document.getElementById("btnToggle");
const btnFinish = document.getElementById("btnFinish");
const lblStatus = document.getElementById("lblStatus");

export class ViewExercise extends View {
  el = $();

  //btnFinish = $("#btnFinish");
  //btnToggle = $("#btnToggle");
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
            console.log("handlepopupno")

    this.remove(this.popup);
  };

  handlePopupYes = () => {
        console.log("handlepopupyes")

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
    lblStatus.text = ""; // dont like this, covers up my heart
    //this.setComboIcon(this.btnToggle, config.icons.play);
    //btnToggle.fill = "fb-pink"
    btnToggle.image = "images/icons/play.png"
    btnToggle.style.fill = "fb-green";
    utils.show(btnFinish);
  };

  handleResume = () => {
    exercise.resume();
    lblStatus.text = "";
    //this.setComboIcon(this.btnToggle, config.icons.pause);
    //btnToggle.fill = "fb-green"
    btnToggle.image = "images/icons/pause.png"
    btnToggle.style.fill = "fb-yellow";
    utils.hide(btnFinish);
  };

  //setComboIcon(combo, icon) {
    //combo.getElementById("combo-button-icon").href = icon;
    //combo.getElementById("combo-button-icon-press").href = icon;
  //}

  handleFinish = () => {
    // not working right now
    /*
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
    */
    exercise.stop();
    Application.switchTo("ViewEnd");
  };

  handleCancel = () => {
    this.gps.callback = undefined;
    Application.switchTo("ViewSelect");
  }

  handleLocationSuccess = () => {
    utils.show(btnToggle);
    
    // set gps to true for run, bike, or hike. Else default is false
    if(config.exerciseName == "run" || config.exerciseName == "hike") {
      config.exerciseOptions.gps = true
    }
    exercise.start(config.exerciseName, config.exerciseOptions);
    lblStatus.text = "";
    this.gps.callback = undefined;
  };

  handleRefresh = () => {
    this.render();
  }

  handleButton = (evt) => {
    console.log("handlebutton")
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
    
    utils.hide(btnFinish);
    utils.show(btnToggle);
    //this.setComboIcon(this.btnToggle, config.icons.pause);

    this.clock = new Clock("#subview-clock", "seconds", this.handleRefresh);
    this.insert(this.clock);
    
    // show or hide gps icon
    if(config.exerciseName == "run" ||
      config.exerciseName == "hike") {
        gps_icon.style.display = "inline";
        lblStatus.text = "connecting";
        this.gps = new GPS("#subview-gps2", this.handleLocationSuccess);
        this.insert(this.gps);
    } else {
        gps_icon.style.display = "none";
        lblStatus.text = "";
        utils.show(btnToggle);
        exercise.start(config.exerciseName, config.exerciseOptions);
    }

    this.hrm = new HRM("#subview-hrm");
    this.insert(this.hrm);

    this.cycle = new Cycle(this.elBoxStats);

    btnToggle.addEventListener("click", this.handleToggle);
    btnFinish.addEventListener("click", this.handleFinish);
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
      //this.lblZoneMins.text = exercise.stats.activeZoneMinutes.toString();
    }
 
  }

  onUnmount() {
    this.cycle.removeEvents();

    btnToggle.removeEventListener("click", this.handleToggle);
    btnFinish.removeEventListener("click", this.handleFinish);
    document.removeEventListener("keypress", this.handleButton);
  }
}
