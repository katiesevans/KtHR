import { me } from "appbit";
import document from "document";

import * as config from "../config";
import { Application, View, $at } from "../lib/view";

const $ = $at("#view-select");

// button for choosing exercise type
let workout_button = document.getElementById("btn-workout");
let run_button = document.getElementById("btn-run");
let spin_button = document.getElementById("btn-spin");
let weights_button = document.getElementById("btn-weights");
let bike_button = document.getElementById("btn-bike");
let hike_button = document.getElementById("btn-hike");
let tennis_button = document.getElementById("btn-tennis");

let en = document.getElementById("exerciseName")
//export const exerciseName = 'Workout';

export class ViewSelect extends View {
  el = $();

  constructor() {
    this.btnStart = $("#btnStart");
    this.lblTitle = $("#lblTitle");

    super();
  }

  handleStart = () => {
    // choose exercise
    if(workout_button.value == 1) {
      config.exerciseName = "workout"
    } else if(run_button.value == 1) {
      config.exerciseName = "run"
    } else if(spin_button.value == 1) {
      config.exerciseName = "spinning"
    } else if(weights_button.value == 1) {
      config.exerciseName = "weights"
    } else if(bike_button.value == 1) {
      config.exerciseName = "bike"
    } else if(hike_button.value == 1) {
      config.exerciseName = "hike"
    } else if(tennis_button.value == 1) {
      config.exerciseName = "tennis"
    }

    // if GPS
    //if (config.exerciseName == "run" || config.exerciseName == "hike" || config.exerciseName == "bike") {
 //       Application.switchTo("ViewExerciseGPS");
 //   } else {
 //       Application.switchTo("ViewExercise");
 //   }
    Application.switchTo("ViewExerciseGPS");
  }
    

  handleKeypress = (evt) => {
    if (evt.key === "down") this.handleStart();
  }
  
  onMount() {
    me.appTimeoutEnabled = false; // Disable timeout

    this.btnStart.addEventListener("click", this.handleStart);
    document.addEventListener("keypress", this.handleKeypress);
  }

  onRender() {
    this.lblTitle.text = config.exerciseName;
  }

  onUnmount() {
    this.btnStart.removeEventListener("click", this.handleStart);
    document.removeEventListener("keypress", this.handleKeypress);
  }
}


