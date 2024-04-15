import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

function Home() {
  const [latestConso, setLatestConso] = useState(null);
  const [difference, setDifference] = useState(null); // Ajout de l'état pour stocker la différence

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientId = 1; // L'ID du client pour lequel tu veux récupérer les données
        // Appel à l'API pour récupérer la consommation de la veille
        const responseLatest = await axios.get(`http://localhost:3000/conso/latest/${clientId}`);
        setLatestConso(responseLatest.data[0]);

        // Appel à l'API pour récupérer la différence entre les deux dernières entrées
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
      {difference !== null && ( // Vérifie si la différence a été récupérée
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
