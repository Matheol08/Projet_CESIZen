import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Profil() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedRoleId = await AsyncStorage.getItem('id_role');

        if (token) {
          setIsLoggedIn(true);
          setFirstName(storedFirstName || '');
          setLastName(storedLastName || '');
          setRoleId(storedRoleId || null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    checkLoginStatus();
  }, []);

  const decodeJWT = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  };

  const handleCreateAccount = async () => {
    if (!firstName || !lastName || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.20:5000/api/auth/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: firstName, nom: lastName, password }),
      });

      const data = await response.json();
      console.log('Réponse de l\'API:', data);

      if (response.ok) {
        alert('Compte créé avec succès');
        setIsCreatingAccount(false);
      } else {
        alert(data.message || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur de création de compte:', error);
      alert('Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!firstName || !lastName || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.20:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: firstName, nom: lastName, password }),
      });
  
      const data = await response.json();
      console.log('Réponse de l\'API:', data);
  
      if (response.ok && data.token) {
        const decodedToken = decodeJWT(data.token);
        const userRoleId = decodedToken.id_role;
  
        console.log('ID de l\'utilisateur depuis le token:', decodedToken.id); 
  
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('firstName', firstName);
        await AsyncStorage.setItem('lastName', lastName);
        await AsyncStorage.setItem('id_role', userRoleId.toString());
        await AsyncStorage.setItem('userId', decodedToken.id.toString());  
  
        setIsLoggedIn(true);
        setFirstName(firstName);
        setLastName(lastName);
        setRoleId(userRoleId.toString());
  
        alert('Connexion réussie');
      } else {
        alert(data.message || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Problème de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Veuillez entrer un nouveau mot de passe.");
      return;
    }
  
    setLoading(true);
  
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('userId récupéré depuis AsyncStorage:', userId);
  
      if (!userId) {
        alert("L'ID utilisateur est manquant. Veuillez vous reconnecter.");
        return;
      }
  
      const response = await fetch(`http://192.168.1.20:5000/api/updatePassword/resetPassword/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }), 
      });
  
      const data = await response.text();
      console.log('Réponse brute:', data);
  
      try {
        const jsonData = JSON.parse(data);
        console.log('Réponse JSON:', jsonData);
        if (response.ok) {
          alert('Mot de passe réinitialisé avec succès');
        } else {
          alert(jsonData.message || 'Erreur lors de la réinitialisation du mot de passe');
        }
      } catch (error) {
        console.error('Erreur de JSON:', error);
        alert('Réponse de l\'API non valide');
      }
  
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'firstName', 'lastName', 'id_role']);
      setIsLoggedIn(false);
      setFirstName('');
      setLastName('');
      setPassword('');
      setRoleId(null);
      alert('Vous êtes déconnecté');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const roleIdAsNumber = roleId ? Number(roleId) : null;
  const roleText = roleIdAsNumber === 1 ? 'Administrateur' : 'Utilisateur';

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color="purple" />
      
      {isLoadingData ? (
        <ActivityIndicator size="large" color="purple" />
      ) : (
        <>
          {isLoggedIn && <Text style={styles.roleText}>{roleText}</Text>}

          {isLoggedIn ? (
            <View>
              <Text style={styles.title}>Mon Profil</Text>
              <Text style={styles.text}>Nom : {lastName}</Text>
              <Text style={styles.text}>Prénom : {firstName}</Text>
              <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Se déconnecter</Text>
              </TouchableOpacity>

             
              <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={handleResetPassword} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>{isCreatingAccount ? "Créer un Compte" : "Connexion"}</Text>
              <TextInput style={styles.input} placeholder="Votre prénom" value={firstName} onChangeText={setFirstName} />
              <TextInput style={styles.input} placeholder="Votre nom" value={lastName} onChangeText={setLastName} />
              <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
              <TouchableOpacity onPress={isCreatingAccount ? handleCreateAccount : handleLogin} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{isCreatingAccount ? "Créer un compte" : "Se connecter"}</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsCreatingAccount(!isCreatingAccount)} style={styles.button}>
                <Text style={styles.buttonText}>{isCreatingAccount ? "Annuler" : "Créer un compte"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
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
  roleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
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
