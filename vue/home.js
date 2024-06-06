import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';

function Home() {
  const { isLoggedIn, userId, login, logout } = useContext(AuthContext);
  const { selectedCompteur, setSelectedCompteur } = useContext(CompteurContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [latestConso, setLatestConso] = useState(null);
  const [difference, setDifference] = useState(null);

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

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/deconnexion');
      if (response.status === 200) {
        logout();
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
        login(response.data.id, username);
        Alert.alert('Connexion réussie');
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      console.error('Erreur lors de la connexion :', error);
    }
  };

  const fetchCompteurAndData = async (userId) => {
    try {
      const responseCompteur = await axios.get(`http://localhost:3000/user/compteur/${userId}`);
      if (responseCompteur.data) {
        console.log('Compteurs:', responseCompteur.data[0].id); // Log les compteurs récupérés
        setSelectedCompteur(responseCompteur.data[0].id);
        fetchData(userId, responseCompteur.data[0].id);
      } else {
        console.error('Aucune donnée de compteur récupérée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des compteurs :', error);
    }
  };

  const fetchData = async (userId, compteurId) => {
    try {
      console.log('Fetching latest consumption...');
      const responseLatest = await axios.get(`http://localhost:3000/conso/last/${userId}/${compteurId}`);
      setLatestConso(responseLatest.data[0]);
      console.log('Latest Consumption:', responseLatest.data[0]);

      console.log('Fetching difference...');
      const responseDifference = await axios.get(`http://localhost:3000/conso/difference/${userId}/${compteurId}`);
      setDifference(responseDifference.data.difference);
      console.log('Difference:', responseDifference.data.difference);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId && !selectedCompteur) {
      fetchCompteurAndData(userId); // Fetch compteur and other data when the user logs in and selectedCompteur is not set
    }
    
  }, [isLoggedIn, userId]);

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
            <View style={styles.form}>
              <Text style={styles.title}>Veuillez vous connecter</Text>
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
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Bienvenue sur votre espace client</Text>
          <Text style={styles.usernameText}>{selectedCompteur}</Text>

          <View style={styles.row}>
            <View style={[styles.box, styles.boxBlue]}>
              <Text style={styles.boxText}>Dernière consommation: {latestConso ? `${latestConso.kw} kW` : 'N/A'}</Text>
            </View>
            <View style={[styles.box, styles.boxRed]}>
              <Text style={styles.boxText}>Différence: {difference !== null ? `${difference} kW` : 'N/A'}</Text>
            </View>
          </View>

          <View style={[styles.box, styles.boxGrey]}>
            <Text style={styles.boxText}>Moyenne: N/A</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

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
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  box: {
    width: width * 0.4,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  boxBlue: {
    backgroundColor: 'blue',
  },
  boxRed: {
    backgroundColor: 'red',
  },
  boxGrey: {
    backgroundColor: 'grey',
    width: width * 0.8, 
  },
  boxText: {
    color: 'white',
    textAlign: 'center',
  },
  loggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
