import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';

export default function VenueManageEventsScreen({ navigation, route, currentUser }) {
  const { venueId } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('venue_id', venueId)
        .order('event_date', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Fel', 'Kunde inte ladda events');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const toggleEventStatus = async (eventId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ active: !currentStatus })
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.map(event =>
        event.id === eventId ? { ...event, active: !currentStatus } : event
      ));

      Alert.alert('Success', `Event ${!currentStatus ? 'aktiverat' : 'inaktiverat'}`);
    } catch (error) {
      console.error('Error toggling event status:', error);
      Alert.alert('Fel', 'Kunde inte ändra status');
    }
  };

  const deleteEvent = (eventId, eventName) => {
    Alert.alert(
      'Ta bort event',
      `Är du säker på att du vill ta bort "${eventName}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId);

              if (error) throw error;

              setEvents(events.filter(event => event.id !== eventId));
              Alert.alert('Success', 'Event borttaget');
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Fel', 'Kunde inte ta bort event');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Inget datum';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderEventItem = ({ item }) => {
    const isPast = item.event_date && new Date(item.event_date) < new Date();

    return (
      <View style={styles.eventCard}>
        {item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.eventImage} />
        )}
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{item.name}</Text>
            <View style={[styles.statusBadge, item.active ? styles.statusActive : styles.statusInactive]}>
              <Text style={styles.statusText}>{item.active ? 'Aktiv' : 'Inaktiv'}</Text>
            </View>
          </View>

          {isPast && (
            <View style={styles.pastBadge}>
              <Text style={styles.pastText}>⏰ Passerat</Text>
            </View>
          )}

          <Text style={styles.eventCategory}>{item.category}</Text>
          
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.eventInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.infoText}>{formatDate(item.event_date)}</Text>
            </View>
            {item.price && (
              <View style={styles.infoItem}>
                <Ionicons name="pricetag" size={16} color="#666" />
                <Text style={styles.infoText}>{item.price}</Text>
              </View>
            )}
          </View>

          <View style={styles.eventStats}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color="#666" />
              <Text style={styles.statText}>{item.views || 0} visningar</Text>
            </View>
          </View>

          <View style={styles.eventActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('VenueEditEvent', { eventId: item.id })}
            >
              <Ionicons name="create" size={20} color="#0077B6" />
              <Text style={styles.actionBtnText}>Redigera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => toggleEventStatus(item.id, item.active)}
            >
              <Ionicons name={item.active ? 'pause' : 'play'} size={20} color="#FF9500" />
              <Text style={styles.actionBtnText}>{item.active ? 'Inaktivera' : 'Aktivera'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => deleteEvent(item.id, item.name)}
            >
              <Ionicons name="trash" size={20} color="#FF3B30" />
              <Text style={[styles.actionBtnText, { color: '#FF3B30' }]}>Ta bort</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={styles.loadingText}>Laddar events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mina Events</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('VenueCreateEvent', { venueId })}
          style={styles.addButton}
        >
          <Ionicons name="add" size={28} color="#0077B6" />
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Inga events ännu</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('VenueCreateEvent', { venueId })}
          >
            <Text style={styles.createButtonText}>Skapa ditt första event</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#0077B6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  eventContent: {
    padding: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pastBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pastText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '600',
  },
  eventCategory: {
    fontSize: 14,
    color: '#0077B6',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  eventInfo: {
    marginBottom: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  eventStats: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  eventActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  actionBtnText: {
    fontSize: 14,
    color: '#0077B6',
    fontWeight: '500',
  },
});