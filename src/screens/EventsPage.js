import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventsFilterScreen from './EventsFilterScreen';

const { width } = Dimensions.get('window');

export default function EventsPage({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterFadeAnim] = useState(new Animated.Value(0));

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
    filterFadeAnim.setValue(0);
    Animated.timing(filterFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(filterFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowFilter(false));
  };

  const events = [
    {
      id: 1,
      rating: 4.0,
      title: 'Wine Tasting',
      venue: 'WineGuro',
      date: '2025-12-09 (14:00)',
      price: '€10:00',
      image: require('../../assets/events/Wine.png'),
    },
    {
      id: 2,
      rating: 4.3,
      title: 'Friday Market',
      venue: 'Plaza Antonio X',
      date: '2025-12-09 (10:00)',
      price: 'FREE',
      image: require('../../assets/events/market-photo.png'),
    },
    {
      id: 3,
      rating: 5.0,
      title: 'Spain vs Sweden',
      venue: 'Plaza Elit',
      date: '2025-12-09 (16:00)',
      price: 'FREE',
      image: require('../../assets/events/fotball-photo.png'),
    },
    {
      id: 4,
      rating: 4.4,
      title: 'Boat Day',
      venue: 'Playa del Cura',
      date: '2025-12-10',
      price: '€5:00',
      image: require('../../assets/events/Boat.png'),
    },
    {
      id: 5,
      rating: 3.9,
      title: 'Night Club Event',
      venue: 'Club Elite',
      date: '2025-12-11 (22:00)',
      price: '€15:00',
      image: require('../../assets/events/candy-photo.png'),
    },
    {
      id: 6,
      rating: 3.7,
      title: 'Get 2 Pay 1',
      venue: 'La Tasca',
      date: 'Whole December',
      price: '€3:00',
      image: require('../../assets/events/happy-hour-photo.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../assets/backgrounds/BG2.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Header Image Background */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={require('../../assets/backgrounds/Header Image Container.png')} 
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        {/* Hamburger Menu Button */}
        <TouchableOpacity 
          style={styles.menuButtonWrapper}
          onPress={openMenu}
        >
          <View style={styles.menuButtonContainer}>
            <Ionicons name="menu" size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Filter Button */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={openFilter}
        >
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          <Text style={styles.filterButtonText}>FILTER</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Happenings & Events</Text>
        </View>
      </View>

      {/* Events Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {events.map((event, index) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventCard,
                (index === 0 || index === 1) && styles.eventCardFeatured
              ]}
              onPress={() => {
                if (event.id === 1) {
                  onNavigate && onNavigate('winetastingdetails');
                } else if (event.id === 2) {
                  onNavigate && onNavigate('fridaymarketdetails');
                } else if (event.id === 3) {
                  onNavigate && onNavigate('footballmatchdetails');
                } else if (event.id === 4) {
                  onNavigate && onNavigate('boatdaydetails');
                } else if (event.id === 5) {
                  onNavigate && onNavigate('nightclubdetails');
                } else if (event.id === 6) {
                  onNavigate && onNavigate('happyhoureventdetails');
                }
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
                
                <Text style={styles.dateText}>{event.date}</Text>
                
                <Text style={styles.priceText}>Price: {event.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Show More Button */}
        <TouchableOpacity style={styles.showMoreButton}>
          <Text style={styles.showMoreButtonText}>Show more</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Hamburger Menu Modal */}
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
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('venues'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Venues & Services</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.activeMenuItem]}
                onPress={closeMenu}
              >
                <Text style={[styles.menuItemText, styles.activeMenuItemText]}>Happenings & Events</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('testdeals'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Great Deals</Text>
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

            {/* Logo at Bottom */}
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

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="none"
        onRequestClose={closeFilter}
      >
        <Animated.View 
          style={[
            styles.filterModalContainer,
            { opacity: filterFadeAnim }
          ]}
        >
          {/* Filter content (65% from top) */}
          <View style={styles.filterContent}>
            <EventsFilterScreen 
              onClose={closeFilter}
              onApply={(filters) => {
                console.log('Applied filters:', filters);
                closeFilter();
              }}
            />
          </View>
          
          {/* Touchable overlay (35% at bottom) */}
          <TouchableOpacity 
            style={styles.filterOverlay}
            activeOpacity={1}
            onPress={closeFilter}
          />
        </Animated.View>
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
    top: 60,
    left: 0,
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
    top: 50,
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
    top: 50,
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
    fontSize: 12,
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
    fontSize: 16,
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
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  eventInfo: {
    padding: 12,
    paddingTop: 16,
  },
  eventTitle: {
    fontSize: 9,
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
    fontSize: 9,
    color: '#666',
  },
  dateText: {
    fontSize: 9,
    color: '#999',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 9,
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
    fontSize: 12,
    fontWeight: 'bold',
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
    fontSize: 12,
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
    fontSize: 9,
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
    fontSize: 12,
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
    justifyContent: 'flex-start',
  },
  filterOverlay: {
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterContent: {
    height: '70%',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
});
