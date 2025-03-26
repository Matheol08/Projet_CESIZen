import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Profil() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!firstName || !lastName || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    console.log("Données envoyées:", { firstName, lastName, password });

    setLoading(true);

    try {
      const response = await fetch('http://192.168.216.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: firstName, nom: lastName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        setIsLoggedIn(true);
        alert('Connexion réussie');
      } else {
        alert(data.message || 'Identifiants incorrects');
      }
    } catch (error) {
      alert('Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setFirstName('');
    setLastName('');
    setPassword('');
    alert('Vous êtes déconnecté');
  };

  const handleCreateAccount = async () => {
    if (!firstName || !lastName || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true); 

    try {
      const response = await fetch('http://192.168.216.1:5000/api/auth/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: firstName, nom: lastName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Compte créé avec succès !');
        setIsCreatingAccount(false); 
      } else {
        alert(data.message || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      alert('Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color="purple" />
      {isLoggedIn ? (
        <View>
          <Text style={styles.title}>Mon Profil</Text>
          <Text style={styles.text}>Bienvenue, {firstName} !</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      ) : isCreatingAccount ? (
        <View>
          <Text style={styles.title}>Créer un Compte</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handleCreateAccount} style={styles.button} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Créer un compte</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCreatingAccount(false)} style={styles.button}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Votre nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Se connecter</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCreatingAccount(true)} style={styles.button}>
            <Text style={styles.buttonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    backgroundColor: 'purple',
    padding: 12,
    marginTop: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: 220,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default Profil;
