import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, ToastAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevSettings } from 'react-native';

const handleRefresh = () => {
  DevSettings.reload();
};

interface DecodedToken {
  isAdmin: boolean;
}

interface Menu {
  id: number;
  titre: string;
  contenu: string;
}

function Info() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [editedMenu, setEditedMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const base64Url = token.split('.')[1]; 
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
              .join('')
          );

          const decoded = JSON.parse(jsonPayload); 

          if (decoded.id_role === 1) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.log("Erreur lors de la vérification du token", error);
      }
    };

    checkUserStatus();
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.216.1:5000/api/menu');
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      ToastAndroid.show("Erreur lors de la récupération des menus", ToastAndroid.SHORT);
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Menu, value: string) => {
    if (editedMenu) {
      setEditedMenu({ ...editedMenu, [field]: value });
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenuId(menu.id);
    setEditedMenu(menu);
  };

  const handleSave = async () => {
    if (editedMenu) {
      try {
        const response = await fetch(`http://192.168.216.1:5000/api/menu/${editedMenu.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedMenu),
        });

        if (response.ok) {
          fetchMenus();  
          setEditingMenuId(null);
          setEditedMenu(null);
        } else {
          ToastAndroid.show("Erreur lors de la mise à jour du menu", ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show("Erreur lors de la mise à jour du menu", ToastAndroid.SHORT);
        console.error('Error updating menu:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingMenuId(null);
    setEditedMenu(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {isAdmin && (
          <View style={styles.adminBanner}>
            <Text style={styles.adminText}>Vous êtes Administrateur</Text>
          </View>
        )}
        <Text style={styles.title}>
          <Ionicons name="information-circle-outline" size={30} color="blue" />
          Menu
        </Text>

        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Rafraîchir</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          menus.map((menu, index) => (
            <View key={index} style={styles.menuContainer}>
              {editingMenuId === menu.id ? (
                <View>
                  <TextInput
                    style={styles.input}
                    value={editedMenu?.titre}
                    onChangeText={(text) => handleInputChange('titre', text)}
                  />
                  <TextInput
                    style={styles.input}
                    value={editedMenu?.contenu}
                    onChangeText={(text) => handleInputChange('contenu', text)}
                    multiline
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.menuTitle}>{menu.titre}</Text>
                  <Text style={styles.menuContent}>{menu.contenu}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  adminBanner: {
    backgroundColor: 'lightblue',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  adminText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkblue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'bleu',
  },
  scrollContainer: {
    width: '100%',
  },
  menuContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContent: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  refreshButton: {
    backgroundColor: 'blue', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white', 
    fontSize: 16,
  },
});

export default Info;
