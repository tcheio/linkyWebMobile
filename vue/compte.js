import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

function CompteScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [clientId, setClientId] = useState(null);
  const [clientInfo, setClientInfo] = useState(null); // Ajout de l'état pour stocker les informations du client

  useEffect(() => {
    // Fonction pour récupérer les informations du client à partir de l'API
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/info/all/${username}`);
        if (response.data && response.data.id) {
          setClientInfo(response.data); // Met à jour l'état avec les informations complètes du client récupérées
        } else {
          console.error('Aucune donnée de client récupérée');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du client :', error);
      }
    };

    if (isLoggedIn && username) {
      fetchClientInfo();
    }
  }, [isLoggedIn, username]);

  // Déconnexion
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/deconnexion');
      if (response.status === 200) {
        setIsLoggedIn(false);
        Alert.alert('Déconnexion réussie');
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Connexion
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/connexion', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        Alert.alert('Connexion réussie');
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View>
          <Text>Veuillez vous connecter</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur ou Email"
            onChangeText={text => setUsername(text)}
            value={username}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry // Masque le texte saisi
          />
          <Button title="Se connecter" onPress={handleSubmit} />
        </View>
      ) : (
        <View>
          <Text>Bienvenue {username}</Text>
          {clientInfo && (
            <View>
              <Text>Numero User: {clientInfo.id}</Text>
              <Text>Nom: {clientInfo.nom}</Text>
              <Text>Téléphone: {clientInfo.tel}</Text>
              <Text>Email: {clientInfo.email}</Text>
            </View>
          )}
          <Button title="Déconnexion" onPress={handleLogout} />
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
  input: {
    height: 40,
    width: 250,
    margin: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default CompteScreen;
