import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';

function CompteScreen({ navigation }) {
  const { isLoggedIn, username, userId, logout, isPrincipal } = useContext(AuthContext);
  const { selectedCompteur, setSelectedCompteur } = useContext(CompteurContext);
  const [clientInfo, setClientInfo] = useState(null);
  const [compteurs, setCompteurs] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCompteurModal, setShowCompteurModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCompteurNum, setNewCompteurNum] = useState('');
  const [notification, setNotification] = useState(null);

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

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Affiche la notification pendant 3 secondes
  };

  const handleEdit = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/client/${userId}`);
      console.log(isPrincipal);
      if (response.data && isPrincipal === 1) {
        navigation.navigate('Modifier ses Informations');
      } else {
        showNotification('Ce compte n\'est pas le login principal');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du compte principal :', error);
      Alert.alert('Erreur', 'Impossible de vérifier le statut du compte.');
    }
  };

  const handleAddLogin = async () => {
    try {
      if (isPrincipal != 1) {
        showNotification('Ce compte n\'est pas le login principal');
        return;
      }
      const response = await axios.post('http://localhost:3000/ajoutLogin', {
        userId,
        username: newUsername,
        password: newPassword,
      });

      if (response.status === 201) {
        Alert.alert('Login ajouté avec succès');
        setNewUsername('');
        setNewPassword('');
        setShowLoginModal(false);
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du login');
      console.error('Erreur lors de l\'ajout du login :', error);
    }
  };

  const handleAddCompteur = async () => {
    try {
      if (isPrincipal != 1) {
        showNotification('Ce compte n\'est pas le login principal');
        return;
      }
      const response = await axios.post('http://localhost:3000/ajoutCompteur', {
        numCompteur: newCompteurNum,
      });

      if (response.status === 201) {
        Alert.alert('Compteur ajouté avec succès', `ID: ${response.data.compteurId}`);
        setNewCompteurNum('');
        setShowCompteurModal(false);
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du compteur');
      console.error('Erreur lors de l\'ajout du compteur :', error);
    }
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
      {notification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}
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

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.buttonLogout]} onPress={logout}>
            <Text style={styles.buttonText}>Déconnexion</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonEdit]} onPress={handleEdit}>
            <Text style={styles.buttonText}>Modifier les informations</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={() => setShowLoginModal(true)}>
            <Text style={styles.buttonText}>Ajouter un login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => setShowCompteurModal(true)}>
            <Text style={styles.buttonText}>Ajouter un compteur</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showLoginModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ajouter un Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            onChangeText={setNewUsername}
            value={newUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleAddLogin}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => setShowLoginModal(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showCompteurModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ajouter un Compteur</Text>
          <TextInput
            style={styles.input}
            placeholder="Numéro de Compteur"
            onChangeText={setNewCompteurNum}
            value={newCompteurNum}
          />
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleAddCompteur}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => setShowCompteurModal(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
  },
  buttonSecondary: {
    backgroundColor: '#2ecc71',
  },
  buttonEdit: {
    backgroundColor: '#9b59b6',
  },
  buttonLogout: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  notification: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'red',
    zIndex: 1000,
  },
  notificationText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  }
});

export default CompteScreen;
