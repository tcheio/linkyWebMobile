import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput, Modal } from 'react-native';
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

  const handleEdit = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/client/${userId}`);
      console.log(isPrincipal);
      if (response.data && isPrincipal === 1) {
        navigation.navigate('Modifier ses Informations');
      } else {
        Alert.alert('Erreur', 'Vous n\'êtes pas le compte principal.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du compte principal :', error);
      Alert.alert('Erreur', 'Impossible de vérifier le statut du compte.');
    }
  };

  const handleAddLogin = async () => {
    try {
      if(isPrincipal != 1){
        Alert.alert('Erreur', 'Vous n\'êtes pas le compte principal.');
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

      if(isPrincipal != 1){
        Alert.alert('Erreur', 'Vous n\'êtes pas le compte principal.');
        return;
      }
      const response = await axios.post('http://localhost:3000/ajoutCompteur', {
        numCompteur: newCompteurNum,
        idClient: userId
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
        <Button title="Modifier les informations" onPress={handleEdit} />
        <Button title="Ajouter un login" onPress={() => setShowLoginModal(true)} />
        <Button title="Ajouter un compteur" onPress={() => setShowCompteurModal(true)} />
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
          <Button title="Ajouter" onPress={handleAddLogin} />
          <Button title="Annuler" onPress={() => setShowLoginModal(false)} />
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
          <Button title="Ajouter" onPress={handleAddCompteur} />
          <Button title="Annuler" onPress={() => setShowCompteurModal(false)} />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
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
});

export default CompteScreen;