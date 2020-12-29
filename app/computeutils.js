exports.calculateAvg = () => {
  let avgtemp = 0;

  if (!Array.prototype.last) {
    Array.prototype.last = function () {
      return this[this.length - 1];
    };
  }

  avgtemp =
    (parseFloat(
      sensorList
        .find((element) => element.name == "eACC MTR Temp Sensor0")
        .values.last()
    ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "eACC MTR Temp Sensor3")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor2")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor3")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor4")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor5")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor7")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor8")
          .values.last()
      ) +
      parseFloat(
        sensorList
          .find((element) => element.name == "pACC MTR Temp Sensor9")
          .values.last()
      )) /
    9;

  if (!isNaN(avgtemp)) return avgtemp.toFixed(2);
};

exports.getCpuTemp = (index) => {
  switch (index) {
    case 0:
      return sensorList
        .find((element) => element.name == "eACC MTR Temp Sensor0")
        .values.last();
    case 1:
      return sensorList
        .find((element) => element.name == "eACC MTR Temp Sensor3")
        .values.last();
    case 2:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor2")
        .values.last();
    case 3:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor3")
        .values.last();
    case 4:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor4")
        .values.last();
    case 5:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor5")
        .values.last();
    case 6:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor7")
        .values.last();
    case 7:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor8")
        .values.last();
    case 8:
      return sensorList
        .find((element) => element.name == "pACC MTR Temp Sensor9")
        .values.last();
  }
};

exports.getGpuTemp = (index) => {
  switch (index) {
    case 0:
      return sensorList
        .find((element) => element.name == "GPU MTR Temp Sensor1")
        .values.last();
    case 1:
      return sensorList
        .find((element) => element.name == "GPU MTR Temp Sensor4")
        .values.last();
  }
};

exports.getAneTemp = (index) => {
  switch (index) {
    case 0:
      return sensorList
        .find((element) => element.name == "ANE MTR Temp Sensor1")
        .values.last();
  }
};
