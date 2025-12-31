import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import CustomAlert from '../components/CustomAlert';

export default function NotificationSettingsScreen({ onNavigate, onOpenMenu }) {
  const [newVenues, setNewVenues] = useState(true);
  const [allNotifications, setAllNotifications] = useState(true);
  const [deals, setDeals] = useState(true);
  const [events, setEvents] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Load notification settings from user preferences
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.notifications) {
        const settings = user.user_metadata.notifications;
        setNewVenues(settings.newVenues ?? true);
        setAllNotifications(settings.all ?? true);
        setDeals(settings.deals ?? true);
        setEvents(settings.events ?? true);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (settingName, value) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentSettings = user?.user_metadata?.notifications || {};
      
      const updatedSettings = {
        ...currentSettings,
        [settingName]: value
      };

      const { error } = await supabase.auth.updateUser({
        data: {
          notifications: updatedSettings
        }
      });

      if (error) throw error;

      setAlertTitle('Saved');
      setAlertMessage('Notification settings updated successfully!');
      setShowAlert(true);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to save settings');
      setShowAlert(true);
    }
  };

  const handleToggle = (settingName, currentValue, setter) => {
    const newValue = !currentValue;
    setter(newValue);
    saveNotificationSettings(settingName, newValue);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG_ALL.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.headerImageContainer}>
        <Image 
          source={require('../../assets/backgrounds/Header Image Container.png')} 
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        <TouchableOpacity 
          style={styles.backButtonWrapper}
          onPress={onOpenMenu}
        >
          <View style={styles.backButtonContainer}>
            <Ionicons name="menu" size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Notification Settings</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* All Notifications */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>All Notifications</Text>
            <Switch
              value={allNotifications}
              onValueChange={() => handleToggle('all', allNotifications, setAllNotifications)}
              trackColor={{ false: '#E0E0E0', true: '#0077B6' }}
              thumbColor={allNotifications ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          <View style={styles.divider} />

          {/* New Venues */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>New Venues</Text>
            <Switch
              value={newVenues}
              onValueChange={() => handleToggle('newVenues', newVenues, setNewVenues)}
              trackColor={{ false: '#E0E0E0', true: '#0077B6' }}
              thumbColor={newVenues ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          <View style={styles.divider} />

          {/* Deals */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Deals</Text>
            <Switch
              value={deals}
              onValueChange={() => handleToggle('deals', deals, setDeals)}
              trackColor={{ false: '#E0E0E0', true: '#0077B6' }}
              thumbColor={deals ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
          <View style={styles.divider} />

          {/* Events */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Events</Text>
            <Switch
              value={events}
              onValueChange={() => handleToggle('events', events, setEvents)}
              trackColor={{ false: '#E0E0E0', true: '#0077B6' }}
              thumbColor={events ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#0077B6" />
          <Text style={styles.infoText}>
            Enable notifications to stay updated on new venues, exclusive deals, and upcoming events in Torrevieja!
          </Text>
        </View>
      </ScrollView>

      <CustomAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Profile */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('profile')}
        >
          <Ionicons name="person-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Favorites */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('favorites')}
        >
          <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Messages/Chat */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => {
            setAlertTitle('Coming Soon');
            setAlertMessage('Messages feature coming soon!');
            setShowAlert(true);
          }}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Notifications (Active) */}
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <View style={styles.activeNavButton}>
            <Ionicons name="notifications" size={20} color="#0077B6" />
            <Text style={styles.activeNavText}>Notifications</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 1000,
  },
  backButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  bottomNav: {
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
  navButtonActive: {},
  activeNavButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  activeNavText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0077B6',
  },
});
