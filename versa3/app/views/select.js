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
let treadmill_button = document.getElementById("btn-treadmill");
let hike_button = document.getElementById("btn-hike");

let en = document.getElementById("exerciseName")

export class ViewSelect extends View {
  el = $();

  constructor() {
    this.btnStart = $("#btnStart");
    this.lblTitle = $("#lblTitle");

    super();
  }


  handleStart = () => {
    Application.switchTo("ViewExercise");
  }
    

  handleKeypress = (evt) => {
    if (evt.key === "down") this.handleStart();
  }
  
  onMount() {
    me.appTimeoutEnabled = false; // Disable timeout
    
    // set workout name
    workout_button.addEventListener("click", (evt) => {
      config.exerciseName = "workout";
      workout_button.style.fill = "grey";
    })
    
    run_button.addEventListener("click", (evt) => {
      config.exerciseName = "run";
      run_button.style.fill = "grey";
    })
    
    weights_button.addEventListener("click", (evt) => {
      config.exerciseName = "weights";
      weights_button.style.fill = "grey";
    })
    
    spin_button.addEventListener("click", (evt) => {
      config.exerciseName = "spin";
      spin_button.style.fill = "grey";
    })
    
    treadmill_button.addEventListener("click", (evt) => {
      config.exerciseName = "treadmill";
      bike_button.style.fill = "grey";
    })
    
    hike_button.addEventListener("click", (evt) => {
      config.exerciseName = "hike";
      hike_button.style.fill = "grey";
    })

    // start workout
    this.btnStart.addEventListener("click", this.handleStart);
    document.addEventListener("keypress", this.handleKeypress);
  }

  onRender() {
    //lblTitle.text = config.exerciseName;
  }

  onUnmount() {
    this.btnStart.removeEventListener("click", this.handleStart);
    document.removeEventListener("keypress", this.handleKeypress);
  }
}


