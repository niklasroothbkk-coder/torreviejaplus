import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';

export default function VenueDashboardScreen({ navigation, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [venueData, setVenueData] = useState(null);
  const [stats, setStats] = useState({
    activeDeals: 0,
    activeEvents: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (currentUser) {
      loadVenueData();
    }
  }, [currentUser]);

  const loadVenueData = async () => {
    try {
      setLoading(true);

      // Hämta venue info för inloggad user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, venue_id, is_active')
        .eq('id', currentUser.id)
        .single();

      if (profileError) throw profileError;

      // Kolla att user är venue
      if (profile.user_type !== 'venue') {
        Alert.alert('Åtkomst nekad', 'Du har inte tillgång till venue-området');
        navigation.goBack();
        return;
      }

      if (!profile.is_active) {
        Alert.alert('Konto inaktivt', 'Ditt konto är för närvarande inaktivt. Kontakta support.');
        return;
      }

      // Hämta venue data
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', profile.venue_id)
        .single();

      if (venueError) throw venueError;

      setVenueData(venue);

      // Hämta statistik
      await loadStats(profile.venue_id);
    } catch (error) {
      console.error('Error loading venue data:', error);
      Alert.alert('Fel', 'Kunde inte ladda venue-data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (venueId) => {
    try {
      // Räkna aktiva deals
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, views')
        .eq('venue_id', venueId)
        .eq('active', true);

      if (dealsError) throw dealsError;

      // Räkna aktiva events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, views')
        .eq('venue_id', venueId)
        .eq('active', true);

      if (eventsError) throw eventsError;

      // Räkna totala views
      const dealsViews = deals?.reduce((sum, deal) => sum + (deal.views || 0), 0) || 0;
      const eventsViews = events?.reduce((sum, event) => sum + (event.views || 0), 0) || 0;

      setStats({
        activeDeals: deals?.length || 0,
        activeEvents: events?.length || 0,
        totalViews: dealsViews + eventsViews,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVenueData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={styles.loadingText}>Laddar dashboard...</Text>
      </View>
    );
  }

  if (!venueData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#999" />
        <Text style={styles.errorText}>Kunde inte ladda venue-data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVenueData}>
          <Text style={styles.retryButtonText}>Försök igen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Välkommen tillbaka!</Text>
        <Text style={styles.venueName}>{venueData.name}</Text>
      </View>

      {/* Credits Card */}
      <View style={styles.creditsCard}>
        <View style={styles.creditsHeader}>
          <Ionicons name="wallet" size={24} color="#0077B6" />
          <Text style={styles.creditsLabel}>Tillgängliga Credits</Text>
        </View>
        <Text style={styles.creditsAmount}>{venueData.credits || 0}</Text>
        <Text style={styles.creditsSubtext}>
          Status: {venueData.subscription_status === 'active' ? '✅ Aktiv' : '❌ Inaktiv'}
        </Text>
        {venueData.subscription_expires_at && (
          <Text style={styles.creditsExpiry}>
            Utgår: {new Date(venueData.subscription_expires_at).toLocaleDateString('sv-SE')}
          </Text>
        )}
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="pricetag" size={30} color="#0077B6" />
          <Text style={styles.statNumber}>{stats.activeDeals}</Text>
          <Text style={styles.statLabel}>Aktiva Deals</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={30} color="#0077B6" />
          <Text style={styles.statNumber}>{stats.activeEvents}</Text>
          <Text style={styles.statLabel}>Aktiva Events</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="eye" size={30} color="#0077B6" />
          <Text style={styles.statNumber}>{stats.totalViews}</Text>
          <Text style={styles.statLabel}>Totala Visningar</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Snabbåtgärder</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VenueCreateDeal', { venueId: venueData.id })}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="add-circle" size={24} color="#0077B6" />
            <Text style={styles.actionButtonText}>Skapa nytt Deal</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VenueCreateEvent', { venueId: venueData.id })}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="add-circle" size={24} color="#0077B6" />
            <Text style={styles.actionButtonText}>Skapa nytt Event</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VenueManageDeals', { venueId: venueData.id })}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="list" size={24} color="#0077B6" />
            <Text style={styles.actionButtonText}>Hantera mina Deals</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VenueManageEvents', { venueId: venueData.id })}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="list" size={24} color="#0077B6" />
            <Text style={styles.actionButtonText}>Hantera mina Events</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VenueEditProfile', { venueId: venueData.id })}
        >
          <View style={styles.actionButtonLeft}>
            <Ionicons name="settings" size={24} color="#0077B6" />
            <Text style={styles.actionButtonText}>Redigera Venue-profil</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0077B6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#0077B6',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  creditsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  creditsLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  creditsAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0077B6',
    marginVertical: 10,
  },
  creditsSubtext: {
    fontSize: 14,
    color: '#666',
  },
  creditsExpiry: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});