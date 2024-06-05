// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/connexion', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setUsername(username);
        Alert.alert('Connexion réussie');
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      console.error('Erreur lors de la connexion :', error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/deconnexion');
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUsername('');
        Alert.alert('Déconnexion réussie');
      } else {
        Alert.alert('Erreur', response.data.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
