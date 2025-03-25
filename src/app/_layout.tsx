import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Info from './(tabs)/info';
import Profile from './(tabs)/Profile';
import Exercice from './(tabs)/exercice';

const Tab = createBottomTabNavigator();

function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Info') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
            color = focused ? 'blue' : 'gray';  
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Exercices de respirations') {
            iconName = focused ? 'fitness-center' : 'fitness-center';
            color = focused ? 'green' : 'gray';  
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            color = focused ? 'red' : 'gray';  
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'black', 
        tabBarInactiveTintColor: 'gray', 
      })}
    >
      <Tab.Screen 
        name="Info" 
        component={Info} 
        options={{ tabBarLabel: 'Info' }}
      />
      <Tab.Screen 
        name="Exercices de respirations" 
        component={Exercice} 
        options={{ tabBarLabel: 'Exercice' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

export default Layout;
