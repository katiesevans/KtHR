import { show, hide } from "../lib/utils";
import { View, $at, $ as x$ } from "../lib/view";
import document from "document";

let btnLeft = document.getElementById("btnLeft");
let btnRight = document.getElementById("btnRight");
let lblTitle = document.getElementById("lblTitle");
let lblMessage = document.getElementById("lblMessage");

export default class Popup extends View {
  
  constructor(parent, settings = {}) {
    if (!parent) throw new Error("Popup parent element is undefined");

    this.parent = x$(parent);

    const $ = $at(parent);

   // this.lblTitle = $("#header");
    //this.lblMessage = $("#copy");
    //this.btnLeft = $("#btnLeft");
    //this.btnRight = $("#btnRight");

    this.settings = {
      ...{
        //title: "Default Title",
        //message: "Default question?",
        btnLeftLabel: "No",
        btnLeftCallback: undefined,
        btnRightLabel: "Yes",
        btnRightCallback: undefined
      },
      ...settings
    };

    super();
  }

  onMount() {
    this.addEvents();

    /*
    lblTitle.text = this.settings.title;
    lblMessage.text = this.settings.message;
    btnLeft.text = this.settings.btnLeftLabel;
    btnRight.text = this.settings.btnRightLabel;
    */
    lblTitle.text = "Default title"
    lblMessage.text = "Message"
    btnLeft.text = "No"
    btnRight.text = "Yes"
    show(this.parent);
  }

  onRender() {}

  onUnmount() {
    hide(this.parent);
    this.removeEvents();
  }

  handleButton = callback => {
    if (typeof callback === "function") callback();
  };

  handleLeft = () => {
    this.handleButton(this.settings.btnLeftCallback);
  };

  handleRight = () => {
    this.handleButton(this.settings.btnRightCallback);
  };

  addEvents = () => {
    btnLeft.addEventListener("click", this.handleLeft);
    btnRight.addEventListener("click", this.handleRight);
  };

  removeEvents = () => {
    btnLeft.removeEventListener("click", this.handleLeft);
    btnRight.removeEventListener("click", this.handleRight);
  };
}
