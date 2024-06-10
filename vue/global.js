import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries } from 'react-vis';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', handleResize);
    return () => Dimensions.removeEventListener('change', handleResize);
  }, []);

  return windowDimensions;
}

function Global() {
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const { selectedCompteur } = useContext(CompteurContext);
  const [loading, setLoading] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const graphWidth = screenWidth * 0.9;
  const graphHeight = screenHeight * 0.6;

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn && userId && selectedCompteur) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/conso/latest/${userId}/${selectedCompteur}`);
          setData(response.data.reverse());
        } catch (error) {
          console.error('Erreur lors de la récupération des données depuis l\'API:', error);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, userId, selectedCompteur]);

  const formattedData = data.map(item => ({
    x: new Date(item.date).getTime(),
    y: item.kw
  }));

  // Calculate min, max, and average
  const consumptionValues = data.map(item => item.kw);
  const minConsumption = Math.min(...consumptionValues);
  const maxConsumption = Math.max(...consumptionValues);
  const avgConsumption = consumptionValues.reduce((sum, value) => sum + value, 0) / consumptionValues.length;


  const tickValues = formattedData.map(item => item.x);
  const tickFormat = timestamp => {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit'};
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
        <XYPlot height={graphHeight} width={graphWidth} margin={{ left: 60, right: 10, top: 10, bottom: 50 }}>
          <HorizontalGridLines />
          <VerticalBarSeries data={formattedData} barWidth={0.4} />
          <XAxis 
            tickValues={tickValues} 
            tickFormat={tickFormat}
          />
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
    padding: 10,
  },
  graphContainer: {
    width: '100%',
    alignItems: 'center',
  },
  infoContainer: {
    width: '90%',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
    alignItems: 'center',
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