import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VenueBottomNavigation({ currentScreen, onNavigate }) {
  return (
    <View style={styles.container}>
      {/* Dashboard */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => onNavigate('venuedashboard')}
      >
        <Ionicons 
          name={currentScreen === 'venuedashboard' ? 'home' : 'home-outline'} 
          size={28} 
          color={currentScreen === 'venuedashboard' ? '#0077B6' : '#FFFFFF'} 
        />
      </TouchableOpacity>

      {/* New Post */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => onNavigate('venueManage')}
      >
        <Ionicons 
          name={currentScreen === 'venueManage' ? 'add-circle' : 'add-circle-outline'} 
          size={32} 
          color={currentScreen === 'venueManage' ? '#0077B6' : '#FFFFFF'} 
        />
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => onNavigate('venuesettings')}
      >
        <Ionicons 
          name={currentScreen === 'venuesettings' ? 'settings' : 'settings-outline'} 
          size={28} 
          color={currentScreen === 'venuesettings' ? '#0077B6' : '#FFFFFF'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#0077B6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});