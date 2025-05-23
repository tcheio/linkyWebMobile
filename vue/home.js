import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Dimensions, ScrollView, TouchableOpacity, CheckBox } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../Controlleur/AuthContext';
import { CompteurContext } from '../Controlleur/CompteurContext';


function Home({ navigation }) {
  const { isLoggedIn, userId, login, logout, isPrincipal } = useContext(AuthContext);
  const { selectedCompteur, setSelectedCompteur, numCompteur, setNumCompteur } = useContext(CompteurContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [latestConso, setLatestConso] = useState(null);
  const [difference, setDifference] = useState(null);
  const [average, setAverage] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(Dimensions.get('window').width < 400);
  const [errorMessage, setErrorMessage] = useState(''); // État pour le message d'erreur
  const [acceptTerms, setAcceptTerms] = useState(false); // État pour la case à cocher

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(Dimensions.get('window').width < 400);
    };
    
    Dimensions.addEventListener('change', handleResize);
    return () => {
      Dimensions.removeEventListener('change', handleResize);
    };
  }, []);

  const validatePassword = (password, confirmPassword) => {
    const passwordErrors = [];
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{12,}$/;

    if (password.length < 12) {
      passwordErrors.push('Le mot de passe doit comporter au moins 12 caractères.');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('Le mot de passe doit contenir au moins une lettre minuscule.');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('Le mot de passe doit contenir au moins une lettre majuscule.');
    }
    if (!/\d/.test(password)) {
      passwordErrors.push('Le mot de passe doit contenir au moins un chiffre.');
    }
    if (!/[@$!%*?&#]/.test(password)) {
      passwordErrors.push('Le mot de passe doit contenir au moins un caractère spécial.');
    }
    if (password !== confirmPassword) {
      passwordErrors.push('Les mots de passe ne correspondent pas.');
    }

    return passwordErrors;
  };

  const handleSignUp = async () => {
    const errors = validatePassword(password, confirmPassword);
    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Vous devez accepter les termes de confidentialité pour vous inscrire.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.21:3000/inscription', {
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
      const response = await axios.post('http://192.168.1.21:3000/deconnexion');
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
      const response = await axios.post('http://192.168.1.21:3000/connexion', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        console.log(response.data.isComptePrincipal);
        login(response.data.id, username, response.data.isComptePrincipal);
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
      const responseCompteur = await axios.get(`http://192.168.1.21:3000/user/compteur/${userId}`);
      if (responseCompteur.data) {
        console.log('Compteurs:', responseCompteur.data[0]);
        setSelectedCompteur(responseCompteur.data[0].id);
        setNumCompteur(responseCompteur.data[0].numCompteur);
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
      const responseLatest = await axios.get(`http://192.168.1.21:3000/conso/last/${userId}/${compteurId}`);
      setLatestConso(responseLatest.data[0]);
      console.log('Latest Consumption:', responseLatest.data[0]);

      console.log('Fetching difference...');
      const responseDifference = await axios.get(`http://192.168.1.21:3000/conso/difference/${userId}/${compteurId}`);
      setDifference(responseDifference.data.difference);
      console.log('Difference:', responseDifference.data.difference);

      console.log('Fetching average...');
      const responseAverage = await axios.get(`http://192.168.1.21:3000/average/${userId}/${compteurId}`);
      setAverage(parseInt(responseAverage.data.average));
      console.log('Average:', responseAverage.data.average);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId && !selectedCompteur) {
      fetchCompteurAndData(userId);
    } else if (selectedCompteur){
      fetchData(userId, selectedCompteur);
    }
  }, [isLoggedIn, userId, selectedCompteur]);

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
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                onChangeText={text => setConfirmPassword(text)}
                value={confirmPassword}
                secureTextEntry
              />
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={acceptTerms}
                  onValueChange={setAcceptTerms}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel} onPress={() => navigation.navigate(PrivacyPolicy)}>
                  J'accepte les <Text style={styles.link}>termes de confidentialité</Text>
                </Text>
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={handleSignUp}>
                <Text style={styles.buttonText}>S'inscrire</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => setShowSignUp(false)}>
                <Text style={styles.buttonText}>Retour</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.title}>Se connecter</Text>
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
              <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={() => setShowSignUp(true)}>
                <Text style={styles.buttonText}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContent}>
            <Text style={styles.welcomeText}>Bienvenue sur votre espace client</Text>
            <Text style={styles.usernameText}>{username}</Text>

            <View style={[styles.row, isSmallScreen ? styles.column : null]}>
              <View style={[styles.box, styles.boxBlue]}>
                <Text style={styles.boxText}>Dernière consommation: {latestConso ? 
                `${latestConso.kw} kW` : 'N/A'}</Text>
              </View>
              <View style={[styles.box, styles.boxRed]}>
                <Text style={styles.boxText}>Différence: {difference !== null ? 
                `${difference} kW` : 'N/A'}</Text>
              </View>
            </View>

            <View style={[styles.box, styles.boxGrey]}>
              <Text style={styles.boxText}>Moyenne: {average !== null ? 
              `${average} kW` : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.compteurText}>Compteur: {numCompteur}</Text>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  box: {
    width: '45%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  boxBlue: {
    backgroundColor: 'blue',
    width: '95%',
  },
  boxRed: {
    backgroundColor: 'red',
    width: '95%',
  },
  boxGrey: {
    backgroundColor: 'grey',
    width: '90%',
  },
  boxText: {
    color: 'white',
    textAlign: 'center',
  },
  mainContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  compteurText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonBlue: {
    backgroundColor: 'blue',
  },
  buttonRed: {
    backgroundColor: 'red',
  },
  buttonGreen: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default Home;
