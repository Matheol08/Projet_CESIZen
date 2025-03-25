import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Info() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="information-circle-outline" size={40} color="blue" />
        <Text style={styles.title}>Santé Mentale et Prévention</Text>
      </View>

      <Text style={styles.subtitle}>Qu'est-ce que la santé mentale ?</Text>
      <Text style={styles.text}>
        La santé mentale désigne un état de bien-être psychologique dans lequel une personne est capable de gérer le stress quotidien, 
        de travailler de manière productive et de contribuer à la société.
      </Text>

      <Text style={styles.subtitle}>Facteurs influençant la santé mentale :</Text>
      <Text style={styles.text}>✔ Facteurs biologiques : génétique, équilibre chimique du cerveau.</Text>
      <Text style={styles.text}>✔ Facteurs environnementaux : stress, événements traumatisants.</Text>
      <Text style={styles.text}>✔ Habitudes de vie : alimentation, sommeil, activité physique.</Text>
      <Text style={styles.text}>✔ Soutien social : famille, amis.</Text>

      <Text style={styles.subtitle}>Prévention et entretien :</Text>
      <Text style={styles.text}>🧘‍♂️ Pratiquer la relaxation et la méditation.</Text>
      <Text style={styles.text}>💤 Avoir un sommeil réparateur (7 à 9 heures par nuit).</Text>
      <Text style={styles.text}>🥗 Adopter une alimentation équilibrée.</Text>
      <Text style={styles.text}>🏃‍♀️ Faire de l'exercice régulièrement.</Text>
      <Text style={styles.text}>👥 Maintenir des liens sociaux solides.</Text>
      <Text style={styles.text}>📱 Limiter l'exposition aux écrans et réseaux sociaux.</Text>
      <Text style={styles.text}>🆘 Consulter un professionnel en cas de besoin.</Text>

      <Text style={styles.subtitle}>Ressources utiles :</Text>
      <Text style={styles.text}>📌 OMS (Organisation Mondiale de la Santé) : www.who.int</Text>
      <Text style={styles.text}>📌 Santé publique France : www.santepubliquefrance.fr</Text>
      <Text style={styles.text}>📌 Psycom : www.psycom.org</Text>
      <Text style={styles.text}>📌 Lignes d'écoute gratuites : SOS Amitié (09 72 39 40 50)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
});

export default Info;
