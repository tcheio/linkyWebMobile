import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// État global pour déterminer si l'utilisateur est connecté ou non
let isUserLoggedIn = null;

function CompteScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);

  // Fonction pour simuler la connexion de l'utilisateur
  const handleLogin = () => {
    setIsLoggedIn(true);
    isUserLoggedIn = true; // Met à jour l'état global
  };

  // Fonction pour simuler la déconnexion de l'utilisateur
  const handleLogout = () => {
    setIsLoggedIn(false);
    isUserLoggedIn = false; // Met à jour l'état global
  };

  return (
    <View style={styles.container}>
      {isLoggedIn === null ? ( // Vérifie si l'utilisateur est connecté
        // Affiche le formulaire de connexion si l'utilisateur n'est pas connecté
        <View>
          <Text>Veuillez vous connecter</Text>
          <Button title="Se connecter" onPress={handleLogin} />
        </View>
      ) : (
        // Affiche les informations du compte si l'utilisateur est connecté
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
});

export default CompteScreen;
