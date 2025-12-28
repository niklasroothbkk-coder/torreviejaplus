import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function EventDetailsScreen({ route, onNavigate }) {
  const { eventId } = route?.params || {};
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

  const formatEventDate = (date, startTime, endTime) => {
    if (!date) return 'TBA';
    
    const eventDate = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);
    
    if (startTime && endTime) {
      return `${formattedDate}\n${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`;
    } else if (startTime) {
      return `${formattedDate}\n${startTime.substring(0, 5)}`;
    }
    
    return formattedDate;
  };

  const handleCall = () => {
    if (event?.phone) {
      Linking.openURL(`tel:${event.phone}`);
    }
  };

  const handleWebsite = () => {
    if (event?.website) {
      Linking.openURL(event.website);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Event not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate && onNavigate('events')}
        >
          <Text style={styles.backButtonText}>Back to Events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image 
        source={require('../../../assets/backgrounds/BG_ALL.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButtonTop}
        onPress={() => onNavigate && onNavigate('events')}
      >
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {/* Event Image */}
        {event.image_url ? (
          <Image 
            source={{ uri: event.image_url }} 
            style={styles.eventImage}
            resizeMode="cover"
          />
        ) : (
          <Image 
            source={require('../../../assets/events/market-photo.png')} 
            style={styles.eventImage}
            resizeMode="cover"
          />
        )}

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.eventTitle}>{event.name}</Text>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={16} color="#0077B6" />
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>

          {/* Date & Time Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="calendar" size={24} color="#0077B6" />
              <Text style={styles.infoTitle}>Date & Time</Text>
            </View>
            <Text style={styles.dateText}>{formatEventDate(event.event_date, event.start_time, event.end_time)}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="cash" size={24} color="#0077B6" />
              <Text style={styles.infoTitle}>Price</Text>
            </View>
            <Text style={styles.priceText}>{event.price || 'Free'}</Text>
          </View>

          {/* Description Section */}
          {event.description && (
            <View style={styles.infoSection}>
              <View style={styles.infoHeader}>
                <Ionicons name="document-text" size={24} color="#0077B6" />
                <Text style={styles.infoTitle}>About This Event</Text>
              </View>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>
          )}

          {/* Contact Section */}
          {(event.phone || event.website) && (
            <View style={styles.infoSection}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color="#0077B6" />
                <Text style={styles.infoTitle}>Contact Information</Text>
              </View>

              {event.phone && (
                <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                  <Ionicons name="call" size={20} color="#0077B6" />
                  <Text style={styles.contactButtonText}>{event.phone}</Text>
                </TouchableOpacity>
              )}

              {event.website && (
                <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
                  <Ionicons name="globe" size={20} color="#0077B6" />
                  <Text style={styles.contactButtonText}>Visit Website</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Recurring Info */}
{event.is_recurring && (
  <View style={styles.infoSection}>
    <View style={styles.infoHeader}>
      <Ionicons name="repeat" size={24} color="#0077B6" />
      <Text style={styles.infoTitle}>Recurring Event</Text>
    </View>
    {event.recurring_day && (
      <Text style={styles.recurringText}>
        Repeats: Every {event.recurring_day}
      </Text>
    )}
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
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButtonTop: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1000,
  },
  backButtonCircle: {
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
  scrollView: {
    flex: 1,
  },
  eventImage: {
    width: width,
    height: 300,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3F9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 25,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0077B6',
  },
  infoSection: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginLeft: 34,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077B6',
    marginLeft: 34,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginLeft: 34,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 34,
    gap: 10,
  },
  contactButtonText: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '500',
  },
  recurringText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 34,
    marginBottom: 5,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});