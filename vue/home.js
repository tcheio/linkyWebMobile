import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

let isUserLoggedIn = false;

function Home() {
  const [clientid, setClient_id] = useState(null); 
  const [latestConso, setLatestConso] = useState(null);
  const [difference, setDifference] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false); // New state for showing sign-up form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');

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
      console.error('Erreur lors de la connexion :', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/inscription', {
        nom: name,
        email: email,
        tel: tel,
        username: username,
        password: password,
      });

      if (response.status === 201) {
        Alert.alert('Inscription réussie');
        setShowSignUp(false);
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      console.error('Erreur lors de l\'inscription :', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLoggedIn && username) {
          console.log('Fetching client ID...');
          const responseInfo = await axios.get(`http://localhost:3000/info/${username}`);
          const clientId = responseInfo.data.id;
          setClient_id(clientId);
          console.log('Client ID:', clientId);

          console.log('Fetching latest consumption...');
          const responseLatest = await axios.get(`http://localhost:3000/conso/last/${clientId}`);
          setLatestConso(responseLatest.data[0]);
          console.log('Latest Consumption:', responseLatest.data[0]);

          console.log('Fetching difference...');
          const responseDifference = await axios.get(`http://localhost:3000/conso/difference/${clientId}`);
          setDifference(responseDifference.data.difference);
          console.log('Difference:', responseDifference.data.difference);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [isLoggedIn, username]);

  return (
    <View style={styles.container}>
      {isLoggedIn === false ? (
        <View>
          {showSignUp ? (
            // Sign-Up Form
            <View>
              <Text>S'inscrire</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                onChangeText={text => setName(text)}
                value={name}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                value={email}
              />
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                onChangeText={text => setTel(text)}
                value={tel}
              />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                onChangeText={text => setUsername(text)}
                value={username}
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
              />
              <Button title="S'inscrire" onPress={handleSignUp} />
              <Button title="Déjà inscrit ? Se connecter" onPress={() => setShowSignUp(false)} />
            </View>
          ) : (
            // Login Form
            <View>
              <Text>Veuillez vous connecter</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                onChangeText={text => setUsername(text)}
                value={username}
              />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
              />
              <Button title="Se connecter" onPress={handleSubmit} />
              <Button title="S'inscrire" onPress={() => setShowSignUp(true)} />
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Bienvenue sur votre espace personnel{'\n'}{username}</Text>
          <Text style={styles.text}>Consommation de la veille:</Text>
          {latestConso && (
            <View style={styles.consoContainer}>
              <Text style={styles.kw}>Kw: {latestConso.kw}</Text>
            </View>
          )}
          {difference !== null && ( 
            <View style={styles.differenceContainer}>
              <Text style={styles.differenceText}>Différence par rapport à il y a deux jours: {difference}</Text>
            </View>
          )}
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
    marginBottom: 20,
  },
  differenceContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  differenceText: {
    fontSize: 18,
  },
  input: {
    height: 40,
    width: 250,
    margin: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default Home;
