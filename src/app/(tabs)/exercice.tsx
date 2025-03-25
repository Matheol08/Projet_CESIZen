import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


function Exercice() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="fitness-center" size={30} color="green" />
      <Text style={styles.title}>Exercices de Respiration</Text>
      <Text style={styles.text}>
        Voici quelques exercices pour améliorer votre respiration...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
  },
});

export default Exercice;
