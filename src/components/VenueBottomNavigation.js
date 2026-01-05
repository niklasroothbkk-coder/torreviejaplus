import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VenueBottomNavigation({ currentScreen, onNavigate }) {
  return (
    <View style={styles.container}>
      {/* Dashboard */}
      <TouchableOpacity 
        style={[
          styles.navButton,
          currentScreen === 'venuedashboard' && styles.activeButton
        ]}
        onPress={() => onNavigate('venuedashboard')}
      >
        <Ionicons 
          name="home-outline" 
          size={28} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>

      {/* New Post */}
      <TouchableOpacity 
        style={[
          styles.navButton,
          currentScreen === 'venuemanage' && styles.activeButton
        ]}
        onPress={() => onNavigate('venuemanage')}
      >
        <Ionicons 
          name="add-circle-outline" 
          size={32} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>

      {/* Messages */}
      <TouchableOpacity 
        style={[
          styles.navButton,
          currentScreen === 'messages' && styles.activeButton
        ]}
        onPress={() => onNavigate('messages')}
      >
        <Ionicons 
          name="chatbubble-outline" 
          size={28} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity 
        style={[
          styles.navButton,
          currentScreen === 'venuesettings' && styles.activeButton
        ]}
        onPress={() => onNavigate('venuesettings')}
      >
        <Ionicons 
          name="settings-outline" 
          size={28} 
          color="#FFFFFF" 
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
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});