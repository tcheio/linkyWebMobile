import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries } from 'react-vis';
import axios from 'axios';

function Global() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/conso/latest/1');
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données depuis l\'API:', error);
      }
    };

    fetchData();
  }, []);

  const formattedData = data.map(item => ({ x: new Date(item.date), y: item.kw }));

  // Obtenir les dates uniques
  const uniqueDates = [...new Set(formattedData.map(item => item.x))];

  // Données pour le graphique
  const barSeries = uniqueDates.map((date, index) => {
    const barsForDate = formattedData.filter(item => item.x.getTime() === date.getTime());
    const totalBars = barsForDate.length;
    return barsForDate.map((item, index) => ({
      x: item.x.getTime() + (index - (totalBars - 1) / 2) * 1000 * 60 * 60 * 24,
      y: item.y
    }));
  }).flat();

  return (
    <View style={styles.container}>
      <XYPlot height={500} width={500}>
        <HorizontalGridLines />
        <VerticalBarSeries data={barSeries} barWidth={0.2} />
        <XAxis tickValues={uniqueDates} tickFormat={d => `${d.getDate()}/${d.getMonth() + 1}`} />
        <YAxis/>
      </XYPlot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default Global;
