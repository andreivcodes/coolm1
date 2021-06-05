exports.onMainChartRefresh = (chart) => {
  chart.data.datasets.forEach(function (dataset) {
    dataset.data.push({
      x: Date.now(),
      y: computeutils.calculateAvg(),
    });
  });

  ipcRenderer.send("settemp", computeutils.calculateAvg());
  let max = 0;
  let min = 100;

  chart.data.datasets[0].data.forEach((element) => {
    if (!isNaN(element.y)) {
      max = Math.max(max, element.y);
      min = Math.min(min, element.y);
    }
  });

  chart.options.scales.yAxes[0].ticks.max = Math.ceil((max + 10) / 5) * 5;
  chart.options.scales.yAxes[0].ticks.min = Math.ceil((min - 10) / 5) * 5;
};

exports.onCpuChartRefresh = (chart) => {
  for (i = 0; i < chart.data.datasets.length; i++) {
    chart.data.datasets[i].data.push({
      x: Date.now(),
      y: computeutils.getCpuTemp(i),
    });

    if (chart.data.datasets[i].data.length > maxvalues)
      chart.data.datasets[i].data.shift();
  }

  let max = 0;
  let min = 100;

  chart.data.datasets.forEach((dataset) => {
    dataset.data.forEach((element) => {
      if (!isNaN(element.y)) {
        max = Math.max(max, element.y);
        min = Math.min(min, element.y);
      }
    });
  });

  chart.options.scales.yAxes[0].ticks.max = Math.ceil((max + 10) / 10) * 10;
  chart.options.scales.yAxes[0].ticks.min = Math.ceil((min - 10) / 10) * 10;
};

exports.onGpuChartRefresh = (chart) => {
  for (i = 0; i < chart.data.datasets.length; i++) {
    chart.data.datasets[i].data.push({
      x: Date.now(),
      y: computeutils.getGpuTemp(i),
    });

    if (chart.data.datasets[i].data.length > maxvalues)
      chart.data.datasets[i].data.shift();
  }

  let max = 0;
  let min = 100;

  chart.data.datasets.forEach((dataset) => {
    dataset.data.forEach((element) => {
      if (!isNaN(element.y)) {
        max = Math.max(max, element.y);
        min = Math.min(min, element.y);
      }
    });
  });

  chart.options.scales.yAxes[0].ticks.max = Math.ceil((max + 10) / 10) * 10;
  chart.options.scales.yAxes[0].ticks.min = Math.ceil((min - 10) / 10) * 10;
};

exports.onAneChartRefresh = (chart) => {
  for (i = 0; i < chart.data.datasets.length; i++) {
    chart.data.datasets[i].data.push({
      x: Date.now(),
      y: computeutils.getAneTemp(i),
    });

    if (chart.data.datasets[i].data.length > maxvalues)
      chart.data.datasets[i].data.shift();
  }

  let max = 0;
  let min = 100;

  chart.data.datasets.forEach((dataset) => {
    dataset.data.forEach((element) => {
      if (!isNaN(element.y)) {
        max = Math.max(max, element.y);
        min = Math.min(min, element.y);
      }
    });
  });

  chart.options.scales.yAxes[0].ticks.max = Math.ceil((max + 10) / 10) * 10;
  chart.options.scales.yAxes[0].ticks.min = Math.ceil((min - 10) / 10) * 10;
};
