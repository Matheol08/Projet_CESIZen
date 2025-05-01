import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Info from './(tabs)/info';
import Profile from './(tabs)/Profile';
import Exercice from './(tabs)/exercice';
import Admin from './(tabs)/admin';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Tab = createBottomTabNavigator();

function Layout() {
  const [roleId, setRoleId] = useState<number | null>(null); 
  const [isLoading, setIsLoading] = useState(true);  
  const [isConnected, setIsConnected] = useState(false); 

  useEffect(() => {
    const checkRole = async () => { 
      const storedRoleId = await AsyncStorage.getItem('id_role');  
      if (storedRoleId) {
        setRoleId(Number(storedRoleId)); 
        setIsConnected(true);    
      }
      setIsLoading(false);
    };
    checkRole();
  }, []); 

  if (isLoading) return null; 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Info') {
            iconName = focused ? 'information-circle' : 'information-circle-outline'; 
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Exercices') {
            iconName = 'self-improvement';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Admin') {
            iconName = 'shield-checkmark';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Info" component={Info} options={{ tabBarLabel: 'Info' }} />
      <Tab.Screen name="Exercices" component={Exercice} options={{ tabBarLabel: 'Exercice' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Profil' }} />
      
      {roleId === 1 && (
        <Tab.Screen name="Admin" component={Admin} options={{ tabBarLabel: 'Admin' }} />
      )}
    </Tab.Navigator>
  );
}

export default Layout;
