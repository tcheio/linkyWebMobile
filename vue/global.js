import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries } from 'react-vis';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';

function Global() {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const { selectedCompteur } = useContext(CompteurContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && userId && selectedCompteur) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/conso/latest/${userId}/${selectedCompteur}`);
          setData(response.data.reverse());  // Reversing to ensure chronological order
        } catch (error) {
          console.error('Erreur lors de la récupération des données depuis l\'API:', error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, userId, selectedCompteur]);

  const formattedData = data.map(item => ({
    x: new Date(item.date).getTime(),  // Use timestamp for x values
    y: item.kw
  }));

  // Calculate min, max, and average
  const consumptionValues = data.map(item => item.kw);
  const minConsumption = Math.min(...consumptionValues);
  const maxConsumption = Math.max(...consumptionValues);
  const avgConsumption = consumptionValues.reduce((sum, value) => sum + value, 0) / consumptionValues.length;

  // Format dates for X-axis ticks
  const tickValues = formattedData.map(item => item.x);
  const tickFormat = timestamp => {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Veuillez vous connecter pour voir les données.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.graphContainer}>
        <XYPlot height={500} width={500} margin={{ left: 60, right: 10, top: 10, bottom: 50 }}>
          <HorizontalGridLines />
          <VerticalBarSeries data={formattedData} barWidth={0.4} />
          <XAxis 
            tickValues={tickValues} 
            tickFormat={tickFormat}
          />
          <YAxis/>
        </XYPlot>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Consommation Moyenne: {avgConsumption.toFixed(2)} kW</Text>
          <Text style={styles.infoText}>Consommation Min: {minConsumption} kW</Text>
          <Text style={styles.infoText}>Consommation Max: {maxConsumption} kW</Text>
        </View>
      </View>
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
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 20,
    padding: 10,
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    margin: 20,
  },
});

export default Global;
