let chartColors = [
  "rgb(255, 186, 8)",
  "rgb(250, 163, 7)",
  "rgb(244, 140, 6)",
  "rgb(232, 93, 4)",
  "rgb(220, 47, 2)",
  "rgb(208, 0, 0)",
  "rgb(157, 2, 8)",
  "rgb(106, 4, 15)",
  "rgb(55, 6, 23)",
];

let mainChart, cpuChart, gpuChart, aneChart;

let showLabels;

exports.setMainChartLabels = (val) => {
  if (!mainChart) {
    //not yet loaded, save for default value
    if (val) showLabels = "auto";
    else showLabels = false;
    return;
  }
  if (val) mainChart.options.plugins.datalabels.display = "auto";
  else mainChart.options.plugins.datalabels.display = false;

  mainChart.update();
};

exports.updateIntervals = () => {
  mainChart.options.scales.xAxes[0].realtime.refresh = refresh_rate;
  cpuChart.options.scales.xAxes[0].realtime.refresh = refresh_rate;
  gpuChart.options.scales.xAxes[0].realtime.refresh = refresh_rate;
  aneChart.options.scales.xAxes[0].realtime.refresh = refresh_rate;

  mainChart.options.scales.xAxes[0].realtime.delay = refresh_rate;
  cpuChart.options.scales.xAxes[0].realtime.delay = refresh_rate;
  gpuChart.options.scales.xAxes[0].realtime.delay = refresh_rate;
  aneChart.options.scales.xAxes[0].realtime.delay = refresh_rate;

  mainChart.options.scales.xAxes[0].realtime.duration = interval;
  cpuChart.options.scales.xAxes[0].realtime.duration = interval;
  gpuChart.options.scales.xAxes[0].realtime.duration = interval;
  aneChart.options.scales.xAxes[0].realtime.duration = interval;

  mainChart.update();
  cpuChart.update();
  gpuChart.update();
  aneChart.update();
};

exports.createCharts = () => {
  var mainctx = document.getElementById("mainChart").getContext("2d");
  var cpuctx = document.getElementById("cpuChart").getContext("2d");
  var gpuctx = document.getElementById("gpuChart").getContext("2d");
  var anectx = document.getElementById("aneChart").getContext("2d");
  mainChart = new Chart(mainctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Dataset 1 (linear interpolation)",
          backgroundColor: "#00A8CC",
          borderColor: "#00A8CC",
          fill: false,
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Average M1 CPU temperature",
      },
      scales: {
        xAxes: [
          {
            type: "realtime",
            realtime: {
              duration: interval,
              refresh: refresh_rate,
              delay: refresh_rate,
              onRefresh: refreshutils.onMainChartRefresh,
            },
            ticks: {
              sampleSize: 5,
            },
          },
        ],
        yAxes: [
          {
            type: "linear",
            display: true,
            scaleLabel: {
              display: true,
              labelString: "°C",
            },
            ticks: {
              precision: 0,
              minRotation: 0,
              maxRotation: 0,
              sampleSize: 5,
              maxTicksLimit: 6,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          display: showLabels,
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          clip: true,
          color: "white",
          font: {
            weight: "bold",
            size: 10,
          },
          formatter: function (value) {
            return value.y;
          },
        },
      },
    },
  });

  cpuChart = new Chart(cpuctx, {
    type: "line",
    data: {
      datasets: [
        {
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[1],
          borderColor: chartColors[1],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[2],
          borderColor: chartColors[2],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[3],
          borderColor: chartColors[3],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[4],
          borderColor: chartColors[4],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[5],
          borderColor: chartColors[5],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[6],
          borderColor: chartColors[6],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[7],
          borderColor: chartColors[7],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[8],
          borderColor: chartColors[8],
          fill: false,
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      title: {
        display: true,
        text: "M1 CPU temperature",
      },
      scales: {
        xAxes: [
          {
            type: "realtime",
            realtime: {
              duration: interval,
              refresh: refresh_rate,
              delay: refresh_rate,
              onRefresh: refreshutils.onCpuChartRefresh,
            },
            ticks: {
              sampleSize: 5,
            },
          },
        ],
        yAxes: [
          {
            type: "linear",
            display: true,
            scaleLabel: {
              display: true,
              labelString: "°C",
            },
            ticks: {
              precision: 0,
              minRotation: 0,
              maxRotation: 0,
              sampleSize: 5,
              maxTicksLimit: 6,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          display: false,
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          clip: true,
          color: "white",
          font: {
            weight: "bold",
            size: 10,
          },
          formatter: function (value) {
            return value.y;
          },
        },
      },
    },
  });

  gpuChart = new Chart(gpuctx, {
    type: "line",
    data: {
      datasets: [
        {
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          fill: false,
          data: [],
        },
        {
          backgroundColor: chartColors[1],
          borderColor: chartColors[1],
          fill: false,
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      title: {
        display: true,
        text: "M1 GPU temperature",
      },
      scales: {
        xAxes: [
          {
            type: "realtime",
            realtime: {
              duration: interval,
              refresh: refresh_rate,
              delay: refresh_rate,
              onRefresh: refreshutils.onGpuChartRefresh,
            },
            ticks: {
              sampleSize: 5,
            },
          },
        ],
        yAxes: [
          {
            type: "linear",
            display: true,
            scaleLabel: {
              display: true,
              labelString: "°C",
            },
            ticks: {
              precision: 0,
              minRotation: 0,
              maxRotation: 0,
              sampleSize: 5,
              maxTicksLimit: 6,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          display: false,
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          clip: true,
          color: "white",
          font: {
            weight: "bold",
            size: 10,
          },
          formatter: function (value) {
            return value.y;
          },
        },
      },
    },
  });

  aneChart = new Chart(anectx, {
    type: "line",
    data: {
      datasets: [
        {
          backgroundColor: chartColors[0],
          borderColor: chartColors[0],
          fill: false,
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      title: {
        display: true,
        text: "M1 ANE temperature",
      },
      scales: {
        xAxes: [
          {
            type: "realtime",
            realtime: {
              duration: interval,
              refresh: refresh_rate,
              delay: refresh_rate,
              onRefresh: refreshutils.onAneChartRefresh,
            },
            ticks: {
              sampleSize: 5,
            },
          },
        ],
        yAxes: [
          {
            type: "linear",
            display: true,
            scaleLabel: {
              display: true,
              labelString: "°C",
            },
            ticks: {
              precision: 0,
              minRotation: 0,
              maxRotation: 0,
              sampleSize: 5,
              maxTicksLimit: 6,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          display: false,
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderRadius: 4,
          clip: true,
          color: "white",
          font: {
            weight: "bold",
            size: 10,
          },
          formatter: function (value) {
            return value.y;
          },
        },
      },
    },
  });
};
