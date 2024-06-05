// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './Controlleur/AuthContext';
import HomeScreen from './vue/home';
import GlobalScreen from './vue/global';
import CompteScreen from './vue/compte';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Consommation sur les 7 derniers jours" component={GlobalScreen} />
          <Tab.Screen name="Compte" component={CompteScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
