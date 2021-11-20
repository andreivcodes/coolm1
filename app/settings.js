const { setMainChartLabels } = require("./charts");

exports.loadSettings = async function () {
  let hasRefresh = await ipcRenderer.invoke("hasStoreValue", "refresh_rate");
  let hasInterval = await ipcRenderer.invoke("hasStoreValue", "interval");
  let hasTheme = await ipcRenderer.invoke("hasStoreValue", "theme");
  let hasLabels = await ipcRenderer.invoke("hasStoreValue", "show_labels");
  let hasAutostart = await ipcRenderer.invoke("hasStoreValue", "autostart");
  let hasShowTemp = await ipcRenderer.invoke("hasStoreValue", "showtemp");

  if (hasRefresh)
    setRefreshRate(await ipcRenderer.invoke("getStoreValue", "refresh_rate"));
  else {
    setRefreshRate(1000);
  }

  if (hasInterval)
    setInterval(await ipcRenderer.invoke("getStoreValue", "interval"));
  else {
    setInterval(30000);
  }

  if (hasTheme) setTheme(await ipcRenderer.invoke("getStoreValue", "theme"));
  else {
    setTheme("light");
  }

  if (hasLabels)
    setLabels(await ipcRenderer.invoke("getStoreValue", "show_labels"));
  else {
    setLabels(true);
  }

  if (hasAutostart)
    setAutostart(await ipcRenderer.invoke("getStoreValue", "autostart"));
  else {
    setAutostart(true);
  }

  if (hasShowTemp)
    setShowTemp(await ipcRenderer.invoke("getStoreValue", "showtemp"));
  else {
    setShowTemp(true);
  }
};

exports.setupButtons = () => {
  document.getElementById("refresh_1s").addEventListener("click", (event) => {
    setRefreshRate(1000);
    charts.updateIntervals();
  });

  document.getElementById("refresh_5s").addEventListener("click", (event) => {
    setRefreshRate(5000);
    charts.updateIntervals();
  });

  document.getElementById("refresh_15s").addEventListener("click", (event) => {
    setRefreshRate(15000);
    charts.updateIntervals();
  });

  document.getElementById("refresh_30s").addEventListener("click", (event) => {
    setRefreshRate(30000);
    charts.updateIntervals();
  });

  document.getElementById("interval_30s").addEventListener("click", (event) => {
    setInterval(30000);
    charts.updateIntervals();
  });

  document.getElementById("interval_1m").addEventListener("click", (event) => {
    setInterval(60000);
    charts.updateIntervals();
  });

  document.getElementById("interval_5m").addEventListener("click", (event) => {
    setInterval(5 * 60000);
    charts.updateIntervals();
  });

  document.getElementById("interval_10m").addEventListener("click", (event) => {
    setInterval(10 * 60000);
    charts.updateIntervals();
  });

  document.getElementById("light_theme").addEventListener("click", (event) => {
    setTheme("light");
  });

  document.getElementById("dark_theme").addEventListener("click", (event) => {
    setTheme("dark");
  });

  document.getElementById("show_labels").addEventListener("click", (event) => {
    (async function () {
      let state = await ipcRenderer.invoke("getStoreValue", "show_labels");
      setLabels(!state);
    })();
  });

  document.getElementById("autostart").addEventListener("click", (event) => {
    (async function () {
      let state = await ipcRenderer.invoke("getStoreValue", "autostart");
      setAutostart(!state);
    })();
  });

  document.getElementById("showtemp").addEventListener("click", (event) => {
    (async function () {
      let state = await ipcRenderer.invoke("getStoreValue", "showtemp");
      setShowTemp(!state);
    })();
  });
};

function setRefreshRate(_refresh_rate) {
  document.getElementById("refresh_1s").text = "1 second";
  document.getElementById("refresh_5s").text = "5 seconds";
  document.getElementById("refresh_15s").text = "15 seconds";
  document.getElementById("refresh_30s").text = "30 seconds";

  switch (_refresh_rate) {
    case 1000:
      document.getElementById("refresh_1s").text = "✓ 1 second";
      break;
    case 5000:
      document.getElementById("refresh_5s").text = "✓ 5 seconds";
      break;
    case 15000:
      document.getElementById("refresh_15s").text = "✓ 15 seconds";
      break;
    case 30000:
      document.getElementById("refresh_30s").text = "✓ 30 seconds";
      break;
  }

  refresh_rate = _refresh_rate;
  store.set("refresh_rate", _refresh_rate);

  maxvalues = _refresh_rate * 2;
}

function setInterval(_interval) {
  document.getElementById("interval_30s").text = "30 seconds";
  document.getElementById("interval_1m").text = "1 minute";
  document.getElementById("interval_5m").text = "5 minutes";
  document.getElementById("interval_10m").text = "10 minutes";

  switch (_interval) {
    case 30000:
      document.getElementById("interval_30s").text = "✓ 30 seconds";
      break;
    case 60000:
      document.getElementById("interval_1m").text = "✓ 1 minute";
      break;
    case 5 * 60000:
      document.getElementById("interval_5m").text = "✓ 5 minutes";
      break;
    case 10 * 60000:
      document.getElementById("interval_10m").text = "✓ 10 minutes";
      break;
  }

  interval = _interval;
  store.set("interval", _interval);
}

function setTheme(theme) {
  document.getElementById("light_theme").text = "Light theme";
  document.getElementById("dark_theme").text = "Dark theme";

  let themesheet = document.createElement("theme");

  let path = require("path");
  let { rootPath } = require("electron-root-path");
  const root = rootPath;
  let themepath = path.join(root, "./Contents", "./Resources", "./themes");

  switch (theme) {
    case "light":
      document.getElementById("light_theme").text = "✓ Light theme";
      store.set("theme", "light");
      themesheet.innerHTML =
        '<link href="' + themepath + '/flatly.css" rel="stylesheet" /> ';
      break;
    case "dark":
      document.getElementById("dark_theme").text = "✓ Dark theme";
      store.set("theme", "dark");
      themesheet.innerHTML =
        '<link href="' + themepath + '/darkly.css" rel="stylesheet" />';
      break;
  }

  document.head.append(themesheet);
}

function setLabels(_show_labels) {
  if (_show_labels) {
    document.getElementById("show_labels").text = "✓ Show labels";
    setMainChartLabels(_show_labels);
  } else {
    document.getElementById("show_labels").text = "Show labels";
    setMainChartLabels(_show_labels);
  }

  store.set("show_labels", _show_labels);
}

function setAutostart(_autostart) {
  if (_autostart) {
    document.getElementById("autostart").text = "✓ Autostart";
  } else {
    document.getElementById("autostart").text = "Autostart";
  }

  store.set("autostart", _autostart);
  ipcRenderer.send("autostart", _autostart);
}

function setShowTemp(_showtemp) {
  if (_showtemp) {
    document.getElementById("showtemp").text = "✓ Show temp in tray";
  } else {
    document.getElementById("showtemp").text = "Show temp in tray";
  }

  store.set("showtemp", _showtemp);
  ipcRenderer.send("showtemp", _showtemp);
}
