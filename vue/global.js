import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries } from 'react-vis';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';

function Global() {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const { selectedCompteur } = useContext(CompteurContext);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axios.get(`http://localhost:3000/conso/latest/${userId}/${selectedCompteur}/2024-04-27/2024-05-03`);
          setData(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des données depuis l\'API:', error);
        }
      }
    };

    fetchData();
  }, [isLoggedIn, userId]);

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

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Veuillez vous connecter pour voir les données.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <XYPlot height={500} width={500}>
        <HorizontalGridLines />
        <VerticalBarSeries data={barSeries} barWidth={0.2} />
        <XAxis tickValues={uniqueDates} tickFormat={d => `${d.getDate()}/${d.getMonth() + 1}`} />
        <YAxis />
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
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    margin: 20,
  },
});

export default Global;
