import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

// État global pour déterminer si l'utilisateur est connecté ou non
let isUserLoggedIn = null;

function CompteScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = () => {
    // Ici, vous pouvez implémenter la logique de connexion avec votre backend
    // Par exemple, vérifier les identifiants dans une base de données

    // Pour cet exemple, nous allons simplement simuler une connexion réussie si les champs ne sont pas vides
    if (username !== '' && password !== '') {
      setIsLoggedIn(true);
      isUserLoggedIn = true; // Met à jour l'état global
    }
  };

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    setIsLoggedIn(false);
    isUserLoggedIn = false; // Met à jour l'état global
  };

  return (
    <View style={styles.container}>
      {isLoggedIn === null ? (
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
