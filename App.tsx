/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {View, Text, NativeModules} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {ChartConfig} from 'react-native-chart-kit/dist/HelperTypes';

const chartConfig: ChartConfig = {
  backgroundGradientFrom: '#08130D',
  backgroundGradientFromOpacity: 0.7,
  backgroundGradientTo: '#1E2923',
  backgroundGradientToOpacity: 0,
  color: () => 'rgba(26, 255, 200, 0.7)',
  labelColor: () => 'rgba(26, 255, 200, 0.7)',
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};

function calculateColor(temperature: number): string {
  const green = 100;
  const red = 255;
  const minTemperature = 30;
  const maxTemperature = 65;

  const normalizedTemperature = Math.min(
    1,
    Math.max(
      0,
      (temperature - minTemperature) / (maxTemperature - minTemperature),
    ),
  );

  const r = Math.round(green + normalizedTemperature * (red - green));
  const g = Math.round(255 - normalizedTemperature * (255 - green));

  return `rgba(${r}, ${g}, 100, 0.7)`;
}

const {TempSensors} = NativeModules;
function App(): JSX.Element {
  const [chartParentWidth, setChartParentWidth] = useState(0);

  const [pmuTdie8Data, setPmuTdie8Data] = useState<Array<number>>([]);
  const isAppVisible = useRef(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const productNames = await TempSensors.getProductNames();
        const thermalValues = await TempSensors.getThermalValues();

        let namesAndTemperatures = new Map();

        for (let i = 0; i < productNames.length; i++) {
          const name = productNames[i];
          const temperature = thermalValues[i];

          namesAndTemperatures.set(name, temperature);
        }

        if (isMounted && isAppVisible.current) {
          setPmuTdie8Data(prevData => {
            const newData = [
              ...prevData,
              namesAndTemperatures.get('PMU tdie8') || 0,
            ];
            const truncatedData = newData.slice(
              Math.max(newData.length - 25, 0),
            ); // Keep at most 20 values

            return truncatedData;
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch initial data
    fetchData();

    // Set interval to fetch data every second
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on component unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View
      style={{padding: 16, flexDirection: 'column'}}
      onLayout={({nativeEvent}) => {
        setChartParentWidth(nativeEvent.layout.width);
      }}>
      {pmuTdie8Data.length > 0 && (
        <LineChart
          data={{labels: [''], datasets: [{data: pmuTdie8Data}]}}
          width={chartParentWidth - 50}
          height={175}
          chartConfig={{
            ...chartConfig,
            color: () =>
              calculateColor(pmuTdie8Data[pmuTdie8Data.length - 1] || 0),
            labelColor: () =>
              calculateColor(pmuTdie8Data[pmuTdie8Data.length - 1] || 0),
          }}
          bezier
          style={{
            borderRadius: 7.5,
          }}
        />
      )}
      <Text style={{width: '100%', textAlign: 'center', padding: 5}}>
        PMU tdie8 Temperature
      </Text>
      {/* Add other LineCharts and Text components for different temperature types */}
    </View>
  );
}

export default App;
