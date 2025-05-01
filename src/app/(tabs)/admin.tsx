import React, { useEffect, useState } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button, Alert,ScrollView  } from 'react-native'; 
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
  
     
      const response = await fetch(`http://192.168.1.20:5000/api/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      if (!response.ok) throw new Error('Erreur lors de la suppression');
  
      setUsers(users.filter(user => user.id_utilisateur !== id));
  
      alert('L\'utilisateur a bien été supprimé.');
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
  
      const response = await fetch(`http://192.168.1.20:5000/api/updateMenu/${editingMenu.id_menu}`, {
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
  
      if (!response.ok) throw new Error('Erreur lors de la mise à jour du menu');
  
      const data = await response.json();
      setMenus(menus.map(menu => (menu.id_menu === editingMenu.id_menu ? data.menu : menu)));
  
      setEditingMenu(null);
      setNewTitle('');
      setNewContent('');
  
      Alert.alert('Menu mis à jour', 'Le menu a été mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour menu:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du menu');
    }
  };
  

  const handleCreateUser = async () => {
    if (!newNom || !newPrenom || !newPassword || !newRole) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('userToken');
  
      const response = await fetch('http://192.168.1.20:5000/api/createUtilisateur', {
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
  
      console.log('STATUS:', response.status);
  
      const data = await response.json();
      console.log('REPONSE JSON:', data);
  
      if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur page admin');

      setUsers([...users, data.utilisateur]);
  
      setNewNom('');
      setNewPrenom('');
      setNewPassword('');
      setNewRole('utilisateur');
  
      Alert.alert('Utilisateur créé', 'L\'utilisateur a été créé avec succès');
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création de l\'utilisateur');
    }
  };
  
  
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.1.20:5000/api/utilisateurs');
        if (!response.ok) throw new Error('Erreur de récupération des utilisateurs');
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
        const response = await fetch('http://192.168.1.20:5000/api/menu');
        if (!response.ok) throw new Error('Erreur de récupération des menus');
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
    <View style={styles.container}>
      <Text style={styles.title}>Panel Administrateur</Text>

      
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Créer un nouvel utilisateur</Text>
        <TextInput
          style={styles.input}
          value={newNom}
          onChangeText={setNewNom}
          placeholder="Nom"
        />
        <TextInput
          style={styles.input}
          value={newPrenom}
          onChangeText={setNewPrenom}
          placeholder="Prénom"
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mot de passe"
          secureTextEntry
        />
        {/* Sélection du rôle */}
        <Text style={styles.label}>Rôle</Text>
        <Picker
          selectedValue={newRole}
          onValueChange={(itemValue) => setNewRole(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Utilisateur" value="utilisateur" />
          <Picker.Item label="Administrateur" value="admin" />
        </Picker>

        <Button title="Créer l'utilisateur" onPress={handleCreateUser} />
      </View>

      {/* Liste des utilisateurs */}
      <Text style={styles.subtitle}>Liste des utilisateurs :</Text>
      {loadingUsers ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id_utilisateur.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.label}><Text style={styles.bold}>Nom :</Text> {item.nom}</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Prénom :</Text> {item.prenom}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item.id_utilisateur)}>
                  <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Liste des menus */}
      <Text style={styles.subtitle}>Liste des menus :</Text>
      {loadingMenus ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={menus}
          keyExtractor={(item) => item.id_menu.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.menuTitle}>{item.titre}</Text>
                  <Text style={styles.menuContent}>{item.contenu}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => {
                  setEditingMenu(item);
                  setNewTitle(item.titre);
                  setNewContent(item.contenu);
                }}>
                  <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {editingMenu && (
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Modifier le menu</Text>
          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Titre"
          />
          <TextInput
            style={styles.input}
            value={newContent}
            onChangeText={setNewContent}
            placeholder="Contenu"
          />
          <Button title="Mettre à jour" onPress={handleUpdateMenu} />
        </View>
      )}
    </View>
    </ScrollView>
  );
};const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  editButton: {
    backgroundColor: '#3498db', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#003366', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
    color: 'purple'
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  menuContent: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});



export default Admin;
