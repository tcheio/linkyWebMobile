import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

let isUserLoggedIn = false;

function CompteScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Connexion
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/connexion', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        isUserLoggedIn = true;
        Alert.alert('Connexion réussie');
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      console.error('Erreur lors ade la connexion :', error);
    }
  };

  // Déconnexion
 const handleLogout = async () => {
  try {
    const response = await axios.post('http://localhost:3000/deconnexion');
    if (response.status === 200) {
      setIsLoggedIn(false);
      isUserLoggedIn = false;
      Alert.alert('Déconnexion réussie');
    } else {
      Alert.alert('Erreur', response.data.error);
    }
  } catch (error) {
    Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
    console.error('Erreur lors de la déconnexion :', error);
  }
};

  return (
    <View style={styles.container}>
      {isLoggedIn === false ? (
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
          <Text>Informations du compte</Text>
          <Button title="Se déconnecter" onPress={handleLogout} />
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
