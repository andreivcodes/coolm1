/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: '#08130D',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#1E2923',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};

const data = {
  labels: [],
  datasets: [
    {
      data: [30, 90, 67, 54, 10, 2],
    },
  ],
};

function App(): JSX.Element {
  const [chartParentWidth, setChartParentWidth] = useState(0);

  return (
    <View
      style={{padding: 16, flexDirection: 'column'}}
      onLayout={({nativeEvent}) => {
        setChartParentWidth(nativeEvent.layout.width);
      }}>
      <LineChart
        data={data}
        width={chartParentWidth - 50}
        height={175}
        chartConfig={chartConfig}
        bezier
        style={{
          borderTopRightRadius: 7.5,
          borderTopLeftRadius: 7.5,
        }}
      />
      <Text style={{width: '100%', textAlign: 'center', padding: 5}}>
        Average M1 CPU Temperature
      </Text>

      <LineChart
        data={data}
        width={chartParentWidth - 50}
        height={100}
        chartConfig={chartConfig}
        bezier
        style={{
          borderTopRightRadius: 7.5,
          borderTopLeftRadius: 7.5,
        }}
      />
      <Text style={{width: '100%', textAlign: 'center', padding: 5}}>
        M1 CPU Temperature
      </Text>

      <LineChart
        data={data}
        width={chartParentWidth - 50}
        height={100}
        chartConfig={chartConfig}
        bezier
        style={{
          borderTopRightRadius: 7.5,
          borderTopLeftRadius: 7.5,
        }}
      />
      <Text style={{width: '100%', textAlign: 'center', padding: 5}}>
        M1 GPU Temperature
      </Text>

      <LineChart
        data={data}
        width={chartParentWidth - 50}
        height={100}
        chartConfig={chartConfig}
        bezier
        style={{
          borderTopRightRadius: 7.5,
          borderTopLeftRadius: 7.5,
        }}
      />
      <Text style={{width: '100%', textAlign: 'center', padding: 5}}>
        M1 ANE Temperature
      </Text>
    </View>
  );
}

export default App;
