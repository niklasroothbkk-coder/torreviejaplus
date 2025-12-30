import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventsFilterScreen from './EventsFilterScreen';
import { supabase } from '../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function EventsPage({ onNavigate, onOpenMenu }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(-Dimensions.get('window').height));
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({ category: 'All' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .order('event_date', { ascending: true });

      if (error) throw error;

      const transformedEvents = data.map(event => ({
        id: event.id,
        rating: 4.5,
        title: event.name,
        venue: event.category,
        category: event.category,
        eventDate: event.event_date,
        startTime: event.start_time,
        endTime: event.end_time,
        image: event.image_url ? { uri: event.image_url } : require('../../assets/events/market-photo.png'),
      }));

      setEvents(transformedEvents);
      setFilteredEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime) return '';
    const start = startTime.substring(0, 5);
    if (endTime) {
      const end = endTime.substring(0, 5);
      return `${start} - ${end}`;
    }
    return start;
  };

  const openFilter = () => {
    setShowFilter(true);
    Animated.timing(filterSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(filterSlideAnim, {
      toValue: -Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowFilter(false));
  };

  const applyFilters = (filters) => {
    setActiveFilters(filters);
    
    let filtered = events;
    
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(event => event.category === filters.category);
    }
    
    setFilteredEvents(filtered);
    closeFilter();
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
          style={styles.menuButtonWrapper}
          onPress={onOpenMenu}
        >
          <View style={styles.menuButtonContainer}>
            <Ionicons name="menu" size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={openFilter}
        >
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          <Text style={styles.filterButtonText}>FILTER</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Happenings & Events</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0077B6" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.grid}>
              {filteredEvents.map((event, index) => (
                <TouchableOpacity
                  key={event.id}
                  style={[
                    styles.eventCard,
                    (index === 0 || index === 1) && styles.eventCardFeatured
                  ]}
                  onPress={() => {
                    onNavigate && onNavigate('eventdetails', { eventId: event.id });
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.imageContainer}>
                    <Image source={event.image} style={styles.eventImage} />
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{event.rating}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    
                    <View style={styles.venueRow}>
                      <Ionicons name="location" size={14} color="#00A8E1" />
                      <Text style={styles.venueText}>{event.venue}</Text>
                    </View>
                    
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar-outline" size={14} color="#0077B6" />
                      <Text style={styles.dateText}>{formatDate(event.eventDate)}</Text>
                    </View>
                    
                    {event.startTime && (
                      <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={14} color="#0077B6" />
                        <Text style={styles.timeText}>{formatTime(event.startTime, event.endTime)}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {filteredEvents.length > 6 && (
              <TouchableOpacity style={styles.showMoreButton}>
                <Text style={styles.showMoreButtonText}>Show more</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showFilter}
        transparent={true}
        animationType="none"
        onRequestClose={closeFilter}
      >
        <View style={styles.filterModalContainer}>
          <Animated.View 
            style={[
              styles.filterBottomSheet,
              { transform: [{ translateY: filterSlideAnim }] }
            ]}
          >
            <View style={styles.filterHandle} />
            <EventsFilterScreen
              onClose={closeFilter}
              onApply={applyFilters}
            />
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.filterOverlay}
            activeOpacity={1}
            onPress={closeFilter}
          />
        </View>
      </Modal>
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
  filterButton: {
    position: 'absolute',
    top: 65,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventCard: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventCardFeatured: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventInfo: {
    padding: 12,
    paddingTop: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3,
  },
  venueText: {
    fontSize: 14,
    color: '#666',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  showMoreButton: {
    backgroundColor: '#0077b6',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  showMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterModalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  filterOverlay: {
    flex: 1,
  },
  filterBottomSheet: {
    height: '55%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  filterHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
});
