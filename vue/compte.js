import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';

function CompteScreen() {
  const { isLoggedIn, username, login, userId, logout } = useContext(AuthContext);
  const [clientInfo, setClientInfo] = useState(null);
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/info/all/${userId}`);
        if (response.data && response.data.id) {
          setClientInfo(response.data);
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

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Veuillez vous connecter</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur ou Email"
            onChangeText={text => setLocalUsername(text)}
            value={localUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            onChangeText={text => setLocalPassword(text)}
            value={localPassword}
            secureTextEntry
          />
          <Button title="Se connecter" onPress={() => login(localUsername, localPassword)} />
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.welcomeText}>Bienvenue {username}</Text>
          {clientInfo && (
            <View style={styles.clientInfo}>
              <Text style={styles.infoText}>Numero User: {clientInfo.id}</Text>
              <Text style={styles.infoText}>Nom: {clientInfo.nom}</Text>
              <Text style={styles.infoText}>Téléphone: {clientInfo.tel}</Text>
              <Text style={styles.infoText}>Email: {clientInfo.email}</Text>
            </View>
          )}
          <Button title="Déconnexion" onPress={logout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  clientInfo: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
});

export default CompteScreen;
