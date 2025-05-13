import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity,
  TextInput, Button, Alert, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
}

interface Menu {
  id_menu: number;
  titre: string;
  contenu: string;
}

const Admin = () => {
  const [users, setUsers] = useState<utilisateur[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newNom, setNewNom] = useState('');
  const [newPrenom, setNewPrenom] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('utilisateur');

  const handleDeleteUser = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('Token manquant, veuillez vous reconnecter.');
        return;
      }

      const response = await fetch(`http://192.168.216.1:5000/api/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setUsers(users.filter(user => user.id_utilisateur !== id));
      alert('Utilisateur supprimé avec succès.');
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      alert('Erreur lors de la suppression de l\'utilisateur.');
    }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('Token manquant, veuillez vous reconnecter.');
        return;
      }

      const response = await fetch(`http://192.168.216.1:5000/api/updateMenu/${editingMenu.id_menu}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titre: newTitle,
          contenu: newContent,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      const data = await response.json();
      setMenus(menus.map(menu => (menu.id_menu === editingMenu.id_menu ? data.menu : menu)));

      setEditingMenu(null);
      setNewTitle('');
      setNewContent('');
      Alert.alert('Succès', 'Menu mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour menu:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const handleCreateUser = async () => {
    if (!newNom || !newPrenom || !newPassword || !newRole) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.216.1:5000/api/createUtilisateur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: newNom,
          prenom: newPrenom,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Erreur création utilisateur');

      setUsers([...users, data.utilisateur]);
      setNewNom('');
      setNewPrenom('');
      setNewPassword('');
      setNewRole('utilisateur');

      Alert.alert('Utilisateur créé', 'L\'utilisateur a été créé avec succès');
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.216.1:5000/api/utilisateurs');
        if (!response.ok) throw new Error('Erreur utilisateurs');
        const data: utilisateur[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erreur utilisateurs:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('http://192.168.216.1:5000/api/menu');
        if (!response.ok) throw new Error('Erreur menus');
        const data: Menu[] = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Erreur menus:', error);
      } finally {
        setLoadingMenus(false);
      }
    };
    fetchMenus();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Panel Administrateur</Text>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Créer un utilisateur</Text>
        <TextInput style={styles.input} value={newNom} onChangeText={setNewNom} placeholder="Nom" />
        <TextInput style={styles.input} value={newPrenom} onChangeText={setNewPrenom} placeholder="Prénom" />
        <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="Mot de passe" secureTextEntry />
        <Text style={styles.label}>Rôle</Text>
        <Picker selectedValue={newRole} onValueChange={(itemValue) => setNewRole(itemValue)} style={styles.input}>
          <Picker.Item label="Utilisateur" value="utilisateur" />
          <Picker.Item label="Administrateur" value="admin" />
        </Picker>
        <Button title="Créer l'utilisateur" onPress={handleCreateUser} />
      </View>

      <Text style={styles.subtitle}>Utilisateurs</Text>
      {loadingUsers ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id_utilisateur.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}><Text style={styles.bold}>Nom :</Text> {item.nom}</Text>
              <Text style={styles.label}><Text style={styles.bold}>Prénom :</Text> {item.prenom}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item.id_utilisateur)}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={styles.subtitle}>Menus</Text>
      {loadingMenus ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={menus}
          keyExtractor={(item) => item.id_menu.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.menuTitle}>{item.titre}</Text>
              <Text style={styles.menuContent}>{item.contenu}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => {
                setEditingMenu(item);
                setNewTitle(item.titre);
                setNewContent(item.contenu);
              }}>
                <Text style={styles.buttonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {editingMenu && (
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Modifier le menu</Text>
          <TextInput style={styles.input} value={newTitle} onChangeText={setNewTitle} placeholder="Titre" />
          <TextInput style={styles.input} value={newContent} onChangeText={setNewContent} placeholder="Contenu" />
          <Button title="Mettre à jour" onPress={handleUpdateMenu} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuContent: {
    fontSize: 16,
    color: '#555',
  },
});

export default Admin;
