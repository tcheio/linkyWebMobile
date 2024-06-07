import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './Controlleur/AuthContext';
import { CompteurProvider } from './Controlleur/CompteurContext';
import HomeScreen from './vue/home';
import GlobalScreen from './vue/global';
import CompteScreen from './vue/compte';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <AuthProvider>
      <CompteurProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Statistiques Globales" component={GlobalScreen} />
          <Tab.Screen name="Compte" component={CompteScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      </CompteurProvider>
    </AuthProvider>
  );
}

export default App;
