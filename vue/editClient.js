import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';

function EditClient({ navigation }) {
  const { userId } = useContext(AuthContext);
  const [clientData, setClientData] = useState({
    nom: '',
    email: '',
    tel: '',
    // Ajoutez d'autres champs si nécessaire
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.21:3000/client/${userId}`);
        setClientData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du client :', error);
        Alert.alert('Erreur', 'Impossible de récupérer les informations du client');
      }
    };

    fetchClientData();
  }, [userId]);

  const handleInputChange = (name, value) => {
    setClientData({ ...clientData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`hhttp://192.168.1.21:3000/client/${userId}`, clientData);
      Alert.alert('Succès', 'Informations du client mises à jour avec succès');
      navigation.goBack(); // Retourner à la page précédente après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations du client :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour les informations du client');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={clientData.nom}
        onChangeText={(value) => handleInputChange('nom', value)}
      />
      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={clientData.email}
        onChangeText={(value) => handleInputChange('email', value)}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={clientData.tel}
        onChangeText={(value) => handleInputChange('tel', value)}
      />
      {/* Ajoutez d'autres champs si nécessaire */}
      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default EditClient;
