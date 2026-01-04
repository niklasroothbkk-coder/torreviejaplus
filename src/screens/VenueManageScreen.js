import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';

export default function VenueManageScreen({ onNavigate, onOpenMenu }) {
  const [venueData, setVenueData] = useState(null);
  const [dealsCount, setDealsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    loadVenueData();
  }, []);

  const loadVenueData = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      // Fetch profile to get venue_id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('venue_id')
        .eq('id', result.user.id)
        .single();
      
      if (profileData && profileData.venue_id) {
        // Fetch venue information
        const { data: venueInfo } = await supabase
          .from('venues')
          .select('*')
          .eq('id', profileData.venue_id)
          .single();
        
        if (venueInfo) {
          setVenueData(venueInfo);
          
          // Count active deals
          const { data: deals } = await supabase
            .from('deals')
            .select('id')
            .eq('venue_id', profileData.venue_id);
          
          setDealsCount(deals?.length || 0);
          
          // Count upcoming events
          const { data: events } = await supabase
            .from('events')
            .select('id')
            .eq('venue_id', profileData.venue_id);
          
          setEventsCount(events?.length || 0);
        }
      }
    }
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
        <Text style={styles.headerTitle}>Manage Content</Text>
        {venueData && (
          <Text style={styles.headerSubtitle}>{venueData.name}</Text>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="pricetag" size={32} color="#0077B6" />
            </View>
            <Text style={styles.statNumber}>{dealsCount}</Text>
            <Text style={styles.statLabel}>Active Deals</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={32} color="#0077B6" />
            </View>
            <Text style={styles.statNumber}>{eventsCount}</Text>
            <Text style={styles.statLabel}>Upcoming Events</Text>
          </View>
        </View>

        {/* Manage Deals Card */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => onNavigate('venueCreateDeal')}
        >
          <View style={styles.actionCardContent}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="pricetag" size={36} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Create New Deal</Text>
              <Text style={styles.actionDescription}>
                Attract customers with special offers and promotions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#0077B6" />
          </View>
        </TouchableOpacity>

        {/* Manage Events Card */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => onNavigate('venueCreateEvent')}
        >
          <View style={styles.actionCardContent}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="calendar" size={36} color="#FFFFFF" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Create New Event</Text>
              <Text style={styles.actionDescription}>
                Share upcoming events and happenings at your venue
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#0077B6" />
          </View>
        </TouchableOpacity>

        {/* View All Deals */}
        <TouchableOpacity 
          style={styles.viewAllCard}
          onPress={() => onNavigate('venueViewDeals')}
        >
          <Text style={styles.viewAllText}>View & Edit All Deals</Text>
          <Ionicons name="chevron-forward" size={20} color="#0077B6" />
        </TouchableOpacity>

        {/* View All Events */}
        <TouchableOpacity 
          style={styles.viewAllCard}
          onPress={() => onNavigate('venueViewEvents')}
        >
          <Text style={styles.viewAllText}>View & Edit All Events</Text>
          <Ionicons name="chevron-forward" size={20} color="#0077B6" />
        </TouchableOpacity>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Ionicons name="information-circle" size={24} color="#0077B6" />
          <Text style={styles.helpText}>
            Need help? Contact support at support@torreviejaplus.es
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Profile */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('venuedashboard')}
        >
          <Ionicons name="person-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* New Deals & Events (Active) */}
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <View style={styles.activeNavButton}>
            <Ionicons name="add-circle" size={20} color="#0077B6" />
            <Text style={styles.activeNavText}>Manage</Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  menuButtonWrapper: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 1000,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0077B6',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#E0E0E0',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  viewAllCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077B6',
  },
  helpCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  navButtonActive: {
  },
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
