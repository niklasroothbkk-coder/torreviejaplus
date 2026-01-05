import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';

export default function VenueSettingsScreen({ onNavigate, onOpenMenu }) {
  const [venueData, setVenueData] = useState(null);
  const [notifications, setNotifications] = useState({
    newDeals: true,
    newEvents: true,
    credits: true,
    reviews: true,
  });

  useEffect(() => {
    loadVenueData();
  }, []);

  const loadVenueData = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('venue_id')
        .eq('id', result.user.id)
        .single();
      
      if (profileData && profileData.venue_id) {
        const { data: venueInfo } = await supabase
          .from('venues')
          .select('*')
          .eq('id', profileData.venue_id)
          .single();
        
        if (venueInfo) {
          setVenueData(venueInfo);
        }
      }
    }
  };

  const handleToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Logout functionality will be handled by App.js
            console.log('Logout pressed');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG_NEW.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Hamburger Menu Button */}
      <TouchableOpacity 
        style={styles.menuButtonWrapper}
        onPress={onOpenMenu}
      >
        <View style={styles.menuButtonContainer}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        {venueData && (
          <Text style={styles.headerSubtitle}>{venueData.name}</Text>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('venuedashboard')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Coming Soon', 'Change password functionality will be available soon')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="pricetag-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>New Deals Posted</Text>
            </View>
            <Switch
              value={notifications.newDeals}
              onValueChange={() => handleToggle('newDeals')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.newDeals ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="calendar-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>New Events Posted</Text>
            </View>
            <Switch
              value={notifications.newEvents}
              onValueChange={() => handleToggle('newEvents')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.newEvents ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="card-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Credit Updates</Text>
            </View>
            <Switch
              value={notifications.credits}
              onValueChange={() => handleToggle('credits')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.credits ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="star-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>New Reviews</Text>
            </View>
            <Switch
              value={notifications.reviews}
              onValueChange={() => handleToggle('reviews')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.reviews ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Coming Soon', 'Subscription management will be available soon')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="card-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Manage Subscription</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Coming Soon', 'Purchase credits functionality will be available soon')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="add-circle-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Purchase Credits</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('faq')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Help & FAQ</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Contact Support', 'Email: support@torreviejaplus.com\nPhone: +34 123 456 789')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Terms of Service', 'Terms of Service content will be displayed here')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy Policy content will be displayed here')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  menuButtonWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuButtonContainer: {
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d12028',
    borderRadius: 15,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 100,
  },
});
