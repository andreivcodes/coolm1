const { ipcRenderer } = require("electron");
let $ = require("jquery");
require("popper.js");
require("bootstrap");
const Store = require("electron-store");

const Chart = require("chart.js");
require("chartjs-adapter-moment");
require("chartjs-plugin-streaming");
require("chartjs-plugin-datalabels");

const computeutils = require("./app/computeutils");
const refreshutils = require("./app/refreshutils");
const charts = require("./app/charts");
const settings = require("./app/settings");
const sensors = require("./app/sensors");

let interval;
let refresh_rate;
let maxvalues;

let autostart = false;
let theme = "./themes/flatly.css";

let sensorList = [];
let store = new Store();

getNames();
settings.loadSettings().then(() => {
  getValues();
  setInterval(getValues, refresh_rate);
  charts.createCharts();
});

settings.setupButtons();

document.getElementById("cpuChart").style.display = "none";
document.getElementById("gpuChart").style.display = "none";
document.getElementById("aneChart").style.display = "none";

document.getElementById("buymeacoffee").addEventListener("click", () => {
  const shell = require("electron").shell;
  shell.openExternal("https://www.buymeacoffee.com/andreivdev");
});

document.getElementById("showallbutton").addEventListener("click", () => {
  ipcRenderer.send("index", "showalltoggle");
  document.getElementById("cpuChart").style.display =
    document.getElementById("cpuChart").style.display == "none"
      ? "flex"
      : "none";
  document.getElementById("gpuChart").style.display =
    document.getElementById("gpuChart").style.display == "none"
      ? "flex"
      : "none";
  document.getElementById("aneChart").style.display =
    document.getElementById("aneChart").style.display == "none"
      ? "flex"
      : "none";
});

document.getElementById("close").addEventListener("click", () => {
  ipcRenderer.send("index", "close");
});

function getNames() {
  ipcRenderer.send("index", "getNames");
}

function getValues() {
  ipcRenderer.send("index", "getValues");
}

ipcRenderer.on("names", (event, arg) => {
  let argArray = arg.split("_");
  sensors.addNames(argArray);
});

ipcRenderer.on("values", (event, arg) => {
  let argArray = arg.split("_");
  sensors.addValues(argArray);
});

ipcRenderer.on("visibility", (event, arg) => {
  if (arg) {
    document.getElementById("mainChart").hidden = false;
    document.getElementById("cpuChart").hidden = false;
    document.getElementById("gpuChart").hidden = false;
    document.getElementById("aneChart").hidden = false;
  } else {
    document.getElementById("mainChart").hidden = true;
    document.getElementById("cpuChart").hidden = true;
    document.getElementById("gpuChart").hidden = true;
    document.getElementById("aneChart").hidden = true;
  }
});
