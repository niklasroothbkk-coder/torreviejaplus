import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

const LogoHeader = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>TORREVIEJA+</Text>
    <Text style={styles.logoSubtext}>EXPLORE THE BEST</Text>
  </View>
);

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: '#1a5490' },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: 'rgba(255,255,255,0.7)',
        headerStyle: { backgroundColor: '#00a8e1' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Hem',
          drawerLabel: '🏠 Hem',
          headerTitle: () => <LogoHeader />,
        }}
      />
      <Drawer.Screen 
        name="Events" 
        component={EventsScreen}
        options={{ drawerLabel: '📅 Events' }}
      />
      <Drawer.Screen 
        name="CreateEvent" 
        component={CreateEventScreen}
        options={{ drawerLabel: '➕ Skapa Event' }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ drawerLabel: '👤 Profil' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoSubtext: {
    fontSize: 10,
    color: '#fff',
  },
});