import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';

function CompteScreen() {
  const { isLoggedIn, username, login, userId, logout } = useContext(AuthContext);
  const { selectedCompteur, setSelectedCompteur } = useContext(CompteurContext);
  const [clientInfo, setClientInfo] = useState(null);
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const [compteurs, setCompteurs] = useState([]);

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

    const fetchCompteurs = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/compteurs/${userId}`);
        if (response.data) {
          console.log('Compteurs:', response.data);  // Log les compteurs récupérés
          setCompteurs(Array.isArray(response.data) ? response.data : []);
        } else {
          console.error('Aucune donnée de compteur récupérée');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des compteurs :', error);
      }
    };

    if (isLoggedIn && username) {
      fetchClientInfo();
      fetchCompteurs();
    }
  }, [isLoggedIn, username]);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Veuillez vous connecter pour voir les données.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <Text style={styles.label}>Sélectionnez un compteur:</Text>
        <Picker
          selectedValue={selectedCompteur}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedCompteur(itemValue)}
        >
          {Array.isArray(compteurs) && compteurs.map(compteur => (
            <Picker.Item key={compteur.id} label={compteur.numCompteur} value={compteur.id} />
          ))}
        </Picker>
        <Button title="Déconnexion" onPress={logout} />
      </View>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default CompteScreen;
