import React from 'react';
import { View, StyleSheet } from 'react-native';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';


function Global() {
  return (
        <XYPlot
      width={600}
      height={600}>
      <HorizontalGridLines />
      <LineSeries
        data={[
          {x: 1, y: 10},
          {x: 2, y: 5},
          {x: 3, y: 15}
        ]}/>
      <XAxis />
      <YAxis />
    </XYPlot>
  );
}



export default Global;
