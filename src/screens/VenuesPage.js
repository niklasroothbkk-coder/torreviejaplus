import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterScreen from './FilterScreen';
import { supabase } from '../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function VenuesPage({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(-Dimensions.get('window').height));
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    cuisine: null,
    pubTypes: [], // Changed to array for multiple selection
    spaType: null,
    sportType: null,
    attractionType: null,
    healthcareType: null,
    ratings: [],
    priceRange: null
  });

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
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

  // Fetch venues from Supabase
  useEffect(() => {
    fetchVenues();
  }, []);

  // Apply filters whenever venues or activeFilters change
  useEffect(() => {
    applyFilters();
  }, [venues, activeFilters]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      console.log('Fetching venues from Supabase...');
      console.log('URL:', 'https://vfponburmjbuqqneigjr.supabase.co/rest/v1/venues?select=*&active=eq.true&order=created_at.desc');
      
      // Use direct fetch instead of Supabase client - ONLY fetch active venues
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

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched venues:', data);
      console.log('Number of venues:', data.length);

      // Map data to match existing structure
      const mappedVenues = data.map(venue => ({
        id: venue.id,
        rating: venue.rating || 0,
        title: venue.name,
        category: venue.category || 'Restaurants',
        location: venue.location_short || venue.location,
        cuisine: venue.cuisine,
        pubTypes: venue.pub_types || [], // Array for multiple pub types
        spaType: venue.spa_type,
        sportType: venue.sport_type,
        attractionType: venue.attraction_type,
        healthcareType: venue.healthcare_type,
        priceRange: venue.price_range,
        views: venue.views || 0,
        // Use first image from images array, or placeholder if no images
        image: (venue.images && venue.images.length > 0) 
          ? { uri: venue.images[0] } 
          : require('../../assets/venuephotos/Sweden1.png'),
      }));

      console.log('Mapped venues:', mappedVenues);
      setVenues(mappedVenues);
    } catch (error) {
      console.error('Error fetching venues:', error.message);
      console.error('Error name:', error.name);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...venues];

    // Filter by category (skip if 'All')
    if (activeFilters.category && activeFilters.category !== 'All') {
      filtered = filtered.filter(venue => venue.category === activeFilters.category);
    }

    // Filter by cuisine (only for Restaurants)
    if (activeFilters.cuisine && activeFilters.cuisine !== 'All') {
      filtered = filtered.filter(venue => venue.cuisine === activeFilters.cuisine);
    }

    // Filter by pub types (only for Sports Bars & Pubs) - MULTIPLE SELECTION
    if (activeFilters.pubTypes && activeFilters.pubTypes.length > 0) {
      filtered = filtered.filter(venue => {
        if (!venue.pubTypes || venue.pubTypes.length === 0) return false;
        // Check if venue has ANY of the selected pub types
        return activeFilters.pubTypes.some(filterType => venue.pubTypes.includes(filterType));
      });
    }

    // Filter by spa type (only for Massage & Spa)
    if (activeFilters.spaType && activeFilters.spaType !== 'All') {
      filtered = filtered.filter(venue => venue.spaType === activeFilters.spaType);
    }

    // Filter by sport type (only for Sports Activities)
    if (activeFilters.sportType && activeFilters.sportType !== 'All') {
      filtered = filtered.filter(venue => venue.sportType === activeFilters.sportType);
    }

    // Filter by attraction type (only for Markets & Attractions)
    if (activeFilters.attractionType && activeFilters.attractionType !== 'All') {
      filtered = filtered.filter(venue => venue.attractionType === activeFilters.attractionType);
    }

    // Filter by healthcare type (only for Healthcare & Emergency)
    if (activeFilters.healthcareType && activeFilters.healthcareType !== 'All') {
      filtered = filtered.filter(venue => venue.healthcareType === activeFilters.healthcareType);
    }

    // Filter by rating
    if (activeFilters.ratings && activeFilters.ratings.length > 0) {
      filtered = filtered.filter(venue => {
        const venueRating = Math.floor(venue.rating);
        return activeFilters.ratings.includes(venueRating);
      });
    }

    // Filter by price range
    if (activeFilters.priceRange && activeFilters.priceRange !== 'all') {
      filtered = filtered.filter(venue => {
        if (!venue.priceRange) return false;
        const priceValue = venue.priceRange.length; // $ = 1, $$ = 2, $$$ = 3, $$$$ = 4
        
        if (activeFilters.priceRange === '1-50') {
          return priceValue <= 2; // $ or $$
        } else if (activeFilters.priceRange === '51-100') {
          return priceValue >= 3; // $$$ or $$$$
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
          onPress={openMenu}
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
                  <Text style={styles.ratingText}>{venue.rating}</Text>
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
        visible={menuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.menuModalOverlay}>
          <Animated.View 
            style={[
              styles.menuPanel,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={closeMenu} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('splash'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.activeMenuItem]}
                onPress={closeMenu}
              >
                <Text style={[styles.menuItemText, styles.activeMenuItemText]}>Venues & Services</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('events'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Events & Happenings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('testdeals'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Deals & Promotions</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('faq'), 300);
                }}
              >
                <Text style={styles.menuItemText}>FAQ & Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('taxi'), 300);
                }}
              >
                <View style={styles.menuItemRow}>
                  <Text style={styles.menuItemText}>Share Airport Taxi</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {isLoggedIn ? (
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => {
                  setIsLoggedIn(false);
                  closeMenu();
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('signin'), 300);
                }}
              >
                <Text style={styles.logoutText}>Sign In / Sign Up</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.bottomLogoSection}
              onPress={() => {
                closeMenu();
                setTimeout(() => onNavigate && onNavigate('walkthrough'), 300);
              }}
            >
              <Image
                source={require('../../assets/icons/logo.png')}
                style={styles.bottomLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeMenu}
          />
        </View>
      </Modal>

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
                console.log('Applied filters:', filters);
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3,
  },
  categoryText: {
    fontSize: 9,
    color: '#666',
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
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisineText: {
    fontSize: 9,
    color: '#666',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A8E1',
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
  menuModalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menuPanel: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  overlayTouchable: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.25,
    height: '100%',
  },
  menuHeader: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 0,
  },
  menuItems: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  newBadge: {
    backgroundColor: '#d12028',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeMenuItem: {
    backgroundColor: '#0077B6',
    borderRadius: 10,
  },
  activeMenuItemText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 40,
    marginLeft: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  bottomLogoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  bottomLogo: {
    width: 480,
    height: 160,
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