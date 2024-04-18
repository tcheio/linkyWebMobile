import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

function Home() {
  const [latestConso, setLatestConso] = useState(null);
  const [difference, setDifference] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientId = 1; // PROVISOIRE (en attendant la gestion de l'authentification)
        const responseLatest = await axios.get(`http://localhost:3000/conso/last/${clientId}`);
        setLatestConso(responseLatest.data[0]);
        const responseDifference = await axios.get(`http://localhost:3000/conso/difference/${clientId}`);
        setDifference(responseDifference.data.difference);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Consommation de la veille:</Text>
      {latestConso && (
        <View style={styles.consoContainer}>
          <Text style={styles.kw}>Kw: {latestConso.kw}</Text>
        </View>
      )}
      {difference !== null && ( 
        <View style={styles.differenceContainer}>
          <Text style={styles.differenceText}>Différence par rapport à il y a deux jours: {difference}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  kw: {
    fontSize: 18,
    marginBottom: 12,
  },
  consoContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  differenceContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  differenceText: {
    fontSize: 18,
  },
});

export default Home;
