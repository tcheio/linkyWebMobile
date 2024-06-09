import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CompteScreen from '../vue/compte';
import EditClient from '../vue/editClient';

const CompteStack = createStackNavigator();

function CompteStackScreen() {
  return (
    <CompteStack.Navigator>
      <CompteStack.Screen name="Information" component={CompteScreen} />
      <CompteStack.Screen name="Modifier ses Informations" component={EditClient} />
    </CompteStack.Navigator>
  );
}

export default CompteStackScreen;
