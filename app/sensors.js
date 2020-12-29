createSensor = ({ name, values }) => ({
  name,
  values,

  setName(sensorName) {
    this.name = sensorName;
  },

  addValue(val) {
    this.values.push(val);

    if (this.values.length > maxvalues) this.values.shift();
  },
});

exports.addNames = (argArray) => {
  for (let i = 0; i < argArray.length; i++) {
    let sensor = createSensor({ name: argArray[i], values: [] });
    sensorList.push(sensor);
  }
};

exports.addValues = (argArray) => {
  for (let i = 0; i < argArray.length; i++) {
    sensorList[i].addValue(argArray[i]);
  }
};
