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
      <TouchableOpacity style={styles.navbarItem}>
        <Text style={styles.navbarLink}>Compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#34495e', 
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  navbarItem: {
    marginHorizontal: 10,
  },
  navbarLink: {
    color: '#fff', 
    textDecorationLine: 'none',
  },
  active: {
    fontWeight: 'bold',
  },
});

export default Navbar;
