import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function EventDetailsScreen({ route, onNavigate }) {
  const { eventId } = route?.params || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0077B6" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Event not found</Text>
      </View>
    );
  }

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM from HH:MM:SS
  };

  const handleShare = (platform) => {
    // Share functionality can be implemented here
    setShowShareMenu(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/backgrounds/BG_ALL.png')} style={styles.backgroundImage} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate('events')}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>

        <View style={styles.headerRightButtons}>
          <View>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => setShowShareMenu(!showShareMenu)}
            >
              <Ionicons name="share-social" size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>SHARE</Text>
            </TouchableOpacity>

            {showShareMenu && (
              <View style={styles.shareDropdown}>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('facebook')}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.shareOptionText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('instagram')}>
                  <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                  <Text style={styles.shareOptionText}>Instagram</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('tiktok')}>
                  <Ionicons name="logo-tiktok" size={20} color="#000000" />
                  <Text style={styles.shareOptionText}>TikTok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('twitter')}>
                  <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                  <Text style={styles.shareOptionText}>X (Twitter)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.headerButtonFavorite}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        {event.image_url && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: event.image_url }} style={styles.eventImage} resizeMode="cover" />
          </View>
        )}

        <View style={styles.contentCard}>
          <Text style={styles.eventTitle}>{event.name}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.scheduleRow}>
              <Ionicons name="calendar" size={16} color="#0077B6" />
              <Text style={styles.scheduleText}>{formatDate(event.event_date)}</Text>
            </View>
            
            {(event.start_time || event.end_time) && (
              <View style={styles.scheduleRow}>
                <Ionicons name="time" size={16} color="#0077B6" />
                <Text style={styles.scheduleText}>
                  {event.start_time && formatTime(event.start_time)}
                  {event.start_time && event.end_time && ' - '}
                  {event.end_time && formatTime(event.end_time)}
                </Text>
              </View>
            )}
          </View>

          {event.price && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="cash" size={14} color="#0077B6" />
                  <Text style={styles.priceText}>{event.price === 'FREE' ? 'Free' : event.price}</Text>
                </View>
              </View>
            </View>
          )}

          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this Event</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {event.is_recurring && event.recurring_day && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recurring Event</Text>
              <View style={styles.scheduleRow}>
                <Ionicons name="repeat" size={16} color="#0077B6" />
                <Text style={styles.scheduleText}>Repeats: Every {event.recurring_day}</Text>
              </View>
            </View>
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  shareDropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    paddingVertical: 8,
    minWidth: 160,
    zIndex: 1000,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  shareOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  headerButtonFavorite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width - 32,
    height: 222,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 20,
    marginBottom: 80,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    maxWidth: '100%',
  },
  metaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});
