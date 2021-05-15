import { show, hide } from "./utils";
import * as config from "../config";

// this page is what controls the app cycling through the different stats during exercise
export default class Cycle {
  index = 0;

  constructor(container) {
    if (!container) throw new Error("Cycle parent element is undefined");

    this.container = container;

    // remove items for non gps activities
    if(config.exerciseName == "run" || config.exerciseName == "cycling" || config.exerciseName == "hiking") {
      this.items = this.container.getElementsByTypeName("GPS");
    } else {
      this.items = this.container.getElementsByClassName("item");
    }
    
    this.touch = this.container.getElementById("touch");
    this.addEvents();
  }

  next = () => {
    this.index++;
    if (this.index >= this.items.length) {
      this.index = 0;
    }
    this.items.forEach((item, index) => {
      if (index === this.index) {
        show(item);
      } else {
        hide(item);
      }
    });
  }

  addEvents() {
    this.touch.addEventListener("click", this.next);
  }

  removeEvents() {
    this.touch.removeEventListener("click", this.next);
  }
}
