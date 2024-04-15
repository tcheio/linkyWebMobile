import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

function Home() {
  const [latestConso, setLatestConso] = useState(null);

  useEffect(() => {
    const fetchLatestConso = async () => {
      try {
        const clientId = 1; // L'ID du client pour lequel tu veux récupérer la dernière consommation
        const response = await axios.get(`http://localhost:3000/conso/latest/${clientId}`);
        setLatestConso(response.data[0]); // On récupère la première (et unique) entrée dans le tableau de résultats
      } catch (error) {
        console.error('Erreur lors de la récupération de la dernière consommation :', error);

        console.log(response.data)
      }
    };

    fetchLatestConso();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Consommation de la veille:</Text>
      {latestConso && (
        <View style={styles.consoContainer}>
          <Text style={styles.kw}>Kw: {latestConso.kw}</Text>
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
  },
});

export default Home;
