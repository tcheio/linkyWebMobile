import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Compte() {
  return (
    <View style={styles.container}>
      <Text>Compte utilisateur</Text>
      {/* Ajoutez ici le contenu de votre page de compte utilisateur */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Compte;
