import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Navbar() {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navbarItem}>
        <Text style={styles.navbarLink}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navbarItem}>
        <Text style={styles.navbarLink}>Analyse</Text>
      </TouchableOpacity>
      {/* Ajoutez d'autres liens au besoin */}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#34495e', // Couleur de fond
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  navbarItem: {
    marginHorizontal: 10,
  },
  navbarLink: {
    color: '#fff', // Couleur du texte
    textDecorationLine: 'none',
  },
  active: {
    fontWeight: 'bold',
  },
});

export default Navbar;
