import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './vue/home';
import GlobalScreen from './vue/global';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/*function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function GlobalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Global" component={GlobalScreen} />
    </Stack.Navigator>
  );
}*/

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Analyse" component={GlobalScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


export default App;
