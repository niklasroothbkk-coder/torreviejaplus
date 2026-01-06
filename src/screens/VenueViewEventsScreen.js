import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';

export default function VenueViewEventsScreen({ onNavigate, onOpenMenu }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [venueId, setVenueId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUser();
      if (result.success && result.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('venue_id')
          .eq('id', result.user.id)
          .single();
        
        if (profileData && profileData.venue_id) {
          setVenueId(profileData.venue_id);
          
          const { data: eventsData, error } = await supabase
            .from('events')
            .select('*')
            .eq('venue_id', profileData.venue_id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Mark events as expired if end_date has passed
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          const processedEvents = eventsData.map(event => {
            let isExpired = false;
            if (event.end_date) {
              const endDate = new Date(event.end_date);
              endDate.setHours(23, 59, 59, 999);
              isExpired = endDate < now;
            } else if (event.event_date) {
              const eventDate = new Date(event.event_date);
              eventDate.setHours(23, 59, 59, 999);
              isExpired = eventDate < now;
            }
            return { ...event, isExpired };
          });
          
          setEvents(processedEvents);
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    if (filter === 'active') {
      return events.filter(e => e.active && !e.isExpired);
    } else if (filter === 'inactive') {
      return events.filter(e => !e.active || e.isExpired);
    }
    return events;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  const handleEdit = (event) => {
    onNavigate('venueEditEvent', { event });
  };

  const handleReactivate = (event) => {
    onNavigate('venueEditEvent', { event, reactivate: true });
  };

  const handlePause = async (event) => {
    Alert.alert(
      'Pause Event',
      `Are you sure you want to pause "${event.name}"? It will be hidden from the app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('events')
                .update({ active: false })
                .eq('id', event.id);
              
              if (error) throw error;
              loadEvents();
            } catch (error) {
              Alert.alert('Error', 'Failed to pause event');
            }
          }
        }
      ]
    );
  };

  const handleUnpause = async (event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ active: true })
        .eq('id', event.id);
      
      if (error) throw error;
      loadEvents();
    } catch (error) {
      Alert.alert('Error', 'Failed to unpause event');
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG_NEW.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <TouchableOpacity 
        style={styles.menuButtonWrapper}
        onPress={onOpenMenu}
      >
        <View style={styles.menuButtonContainer}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => onNavigate('venuemanage')}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Events</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'inactive' && styles.filterTabActive]}
          onPress={() => setFilter('inactive')}
        >
          <Text style={[styles.filterText, filter === 'inactive' && styles.filterTextActive]}>Inactive</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0077B6" style={{ marginTop: 40 }} />
        ) : filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No events found</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => onNavigate('venueCreateEvent')}
            >
              <Text style={styles.createButtonText}>Create Your First Event</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              {/* Status Badge */}
              <View style={[
                styles.statusBadge,
                event.active && !event.isExpired ? styles.statusActive : styles.statusInactive
              ]}>
                <Text style={styles.statusText}>
                  {event.isExpired ? 'Expired' : (event.active ? 'Active' : 'Paused')}
                </Text>
              </View>

              {/* Event Image */}
              {event.image_url && (
                <Image source={{ uri: event.image_url }} style={styles.eventImage} />
              )}

              {/* Event Info */}
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventCategory}>{event.category}</Text>
                
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Start: {formatDate(event.event_date)}</Text>
                </View>
                
                {event.end_date && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>End: {formatDate(event.end_date)}</Text>
                  </View>
                )}
                
                {event.start_time && (
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {event.start_time.slice(0, 5)} - {event.end_time ? event.end_time.slice(0, 5) : ''}
                    </Text>
                  </View>
                )}
                
                {event.is_recurring && (
                  <View style={styles.detailRow}>
                    <Ionicons name="repeat" size={16} color="#0077B6" />
                    <Text style={styles.detailText}>{event.recurring_day}</Text>
                  </View>
                )}

                {event.price && event.price !== 'Free' && (
                  <View style={styles.detailRow}>
                    <Ionicons name="pricetag" size={16} color="#666" />
                    <Text style={styles.detailText}>{event.price}</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {event.active && !event.isExpired ? (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.editBtn]}
                      onPress={() => handleEdit(event)}
                    >
                      <Ionicons name="pencil" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.pauseBtn]}
                      onPress={() => handlePause(event)}
                    >
                      <Ionicons name="pause" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Pause</Text>
                    </TouchableOpacity>
                  </>
                ) : event.isExpired ? (
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.reactivateBtn]}
                    onPress={() => handleReactivate(event)}
                  >
                    <Ionicons name="refresh" size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Reactivate with New Date</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.unpauseBtn]}
                      onPress={() => handleUnpause(event)}
                    >
                      <Ionicons name="play" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Unpause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.editBtn]}
                      onPress={() => handleEdit(event)}
                    >
                      <Ionicons name="pencil" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
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
  backButton: {
    position: 'absolute',
    top: 65,
    right: 20,
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
    zIndex: 1000,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: '#0077B6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#0077B6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  statusActive: {
    backgroundColor: '#00a32a',
  },
  statusInactive: {
    backgroundColor: '#d63638',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventInfo: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventCategory: {
    fontSize: 14,
    color: '#0077B6',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  editBtn: {
    backgroundColor: '#0077B6',
  },
  pauseBtn: {
    backgroundColor: '#f59e0b',
  },
  unpauseBtn: {
    backgroundColor: '#00a32a',
  },
  reactivateBtn: {
    backgroundColor: '#00a32a',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
