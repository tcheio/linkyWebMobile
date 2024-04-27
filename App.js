import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './vue/home';
import GlobalScreen from './vue/global';
import CompteScreen from './vue/compte';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Analyse" component={GlobalScreen} />
        <Tab.Screen name="Compte" component={CompteScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
