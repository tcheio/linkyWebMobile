import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';

function Home() {
  const { isLoggedIn, username, login, logout } = useContext(AuthContext);
  const [clientId, setClientId] = useState(null);
  const [latestConso, setLatestConso] = useState(null);
  const [difference, setDifference] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [localUsername, setLocalUsername] = useState('');
  const [localPassword, setLocalPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/inscription', {
        nom: name,
        email: email,
        tel: tel,
        username: localUsername,
        password: localPassword,
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
          setClientId(clientId);
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
      {!isLoggedIn ? (
        <View style={styles.formContainer}>
          {showSignUp ? (
            <View style={styles.form}>
              <Text style={styles.title}>S'inscrire</Text>
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
              <Button title="S'inscrire" onPress={handleSignUp} />
              <Button title="Déjà inscrit ? Se connecter" onPress={() => setShowSignUp(false)} />
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.title}>Veuillez vous connecter</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
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
              <Button title="S'inscrire" onPress={() => setShowSignUp(true)} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.welcomeText}>Bienvenue {username}</Text>
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
          <Button title="Se déconnecter" onPress={logout} />
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
    padding: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  form: {
    width: '100%',
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
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
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
});

export default Home;
