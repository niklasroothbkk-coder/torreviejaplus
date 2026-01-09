import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterScreen from './FilterScreen';
import { supabase } from '../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function VenuesPage({ onNavigate, onOpenMenu }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(-Dimensions.get('window').height));
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    cuisine: null,
    pubTypes: [],
    spaType: null,
    sportType: null,
    attractionType: null,
    healthcareType: null,
    ratings: [],
    priceRange: null
  });

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

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [venues, activeFilters]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      console.log('Fetching venues from Supabase...');
      
      const response = await fetch(
        'https://vfponburmjbuqqneigjr.supabase.co/rest/v1/venues?select=*&active=eq.true&order=created_at.desc',
        {
          method: 'GET',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const mappedVenues = data.map(venue => ({
        id: venue.id,
        rating: venue.rating || 0,
        title: venue.name,
        category: venue.category || 'Restaurants',
        location: venue.location_short || venue.location,
        cuisine: venue.cuisine,
        pubTypes: venue.pub_types || [],
        spaType: venue.spa_type,
        sportType: venue.sport_type,
        attractionType: venue.attraction_type,
        healthcareType: venue.healthcare_type,
        priceRange: venue.price_range,
        views: venue.views || 0,
        image: (venue.images && venue.images.length > 0) 
          ? { uri: venue.images[0] } 
          : require('../../assets/venuephotos/Sweden1.png'),
      }));

      setVenues(mappedVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...venues];

    if (activeFilters.category && activeFilters.category !== 'All') {
      filtered = filtered.filter(venue => venue.category === activeFilters.category);
    }

    if (activeFilters.cuisine && activeFilters.cuisine !== 'All') {
      filtered = filtered.filter(venue => venue.cuisine === activeFilters.cuisine);
    }

    if (activeFilters.pubTypes && activeFilters.pubTypes.length > 0) {
      filtered = filtered.filter(venue => {
        if (!venue.pubTypes || venue.pubTypes.length === 0) return false;
        return activeFilters.pubTypes.some(filterType => venue.pubTypes.includes(filterType));
      });
    }

    if (activeFilters.spaType && activeFilters.spaType !== 'All') {
      filtered = filtered.filter(venue => venue.spaType === activeFilters.spaType);
    }

    if (activeFilters.sportType && activeFilters.sportType !== 'All') {
      filtered = filtered.filter(venue => venue.sportType === activeFilters.sportType);
    }

    if (activeFilters.attractionType && activeFilters.attractionType !== 'All') {
      filtered = filtered.filter(venue => venue.attractionType === activeFilters.attractionType);
    }

    if (activeFilters.healthcareType && activeFilters.healthcareType !== 'All') {
      filtered = filtered.filter(venue => venue.healthcareType === activeFilters.healthcareType);
    }

    if (activeFilters.ratings && activeFilters.ratings.length > 0) {
      filtered = filtered.filter(venue => {
        const venueRating = Math.floor(venue.rating);
        return activeFilters.ratings.includes(venueRating);
      });
    }

    if (activeFilters.priceRange && activeFilters.priceRange !== 'all') {
      filtered = filtered.filter(venue => {
        if (!venue.priceRange) return false;
        const priceValue = venue.priceRange.length;
        
        if (activeFilters.priceRange === '1-50') {
          return priceValue <= 2;
        } else if (activeFilters.priceRange === '51-100') {
          return priceValue >= 3;
        }
        return true;
      });
    }

    setFilteredVenues(filtered);
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
          <Text style={styles.titleText}>Restaurants, Bars & More</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077B6" />
            <Text style={styles.loadingText}>Loading venues...</Text>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {filteredVenues.map((venue, index) => (
                <TouchableOpacity
                  key={venue.id}
                  style={[
                    styles.venueCard,
                    (index === 0 || index === 1) && styles.venueCardFeatured
                  ]}
                  onPress={() => {
                    onNavigate && onNavigate('venuedetails', { venueId: venue.id });
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.imageContainer}>
                    <Image source={venue.image} style={styles.venueImage} />
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{Number(venue.rating).toFixed(1)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.venueInfo}>
                    <Text style={styles.venueTitle}>{venue.title}</Text>
                    
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={12} color="#00A8E1" />
                      <Text style={styles.locationText}>{venue.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={styles.showMoreButton}>
              <Text style={styles.showMoreButtonText}>Show more</Text>
            </TouchableOpacity>
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
            <FilterScreen
              onClose={closeFilter}
              onApply={(filters) => {
                setActiveFilters({
                  category: filters.category,
                  cuisine: filters.cuisine,
                  pubTypes: filters.pubTypes || [],
                  spaType: filters.spaType,
                  sportType: filters.sportType,
                  attractionType: filters.attractionType,
                  healthcareType: filters.healthcareType,
                  ratings: filters.ratings,
                  priceRange: filters.priceRange
                });
                closeFilter();
              }}
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
  venueCard: {
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
  venueCardFeatured: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
  },
  venueImage: {
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
  venueInfo: {
    padding: 12,
    paddingTop: 16,
  },
  venueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#999',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  filterModalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  filterOverlay: {
    flex: 1,
  },
  filterBottomSheet: {
    height: '65%',
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
