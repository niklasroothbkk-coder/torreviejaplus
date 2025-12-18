import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DealsFilterScreen from './DealsFilterScreen';
import { supabase } from '../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function DealsPage({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(-Dimensions.get('window').height));
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch deals from Supabase
  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          venues!deals_venue_id_fkey(name, location_short)
        `)
        .eq('active', true)
        .gte('deal_date', new Date().toISOString().split('T')[0])
        .order('deal_date', { ascending: true });
      
      if (error) throw error;
      
      // Map data to match the format expected by the UI
      const mappedDeals = data.map(deal => {
        // Format time to HH:MM
        let timeString = '';
        if (deal.start_time) {
          const startTime = deal.start_time.substring(0, 5); // Gets HH:MM from HH:MM:SS
          timeString = ` (${startTime})`;
          if (deal.end_time) {
            const endTime = deal.end_time.substring(0, 5);
            timeString = ` (${startTime}-${endTime})`;
          }
        }
        
        return {
          id: deal.id,
          rating: 0, // We don't have ratings on deals yet
          title: deal.name,
          venue: deal.venues?.name || 'Unknown Venue',
          date: `${deal.deal_date}${timeString}`,
          price: deal.price || 'N/A',
          image: deal.image_url ? { uri: deal.image_url } : require('../../assets/deals/HH.png'),
          category: deal.category,
        };
      });
      
      setDeals(mappedDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../assets/backgrounds/BG_ALL.png')} 
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
          <Text style={styles.titleText}>Deals & Promotions</Text>
        </View>
      </View>

      {/* Deals Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077B6" />
            <Text style={styles.loadingText}>Loading deals...</Text>
          </View>
        ) : deals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color="#999" />
            <Text style={styles.emptyTitle}>No Deals Yet</Text>
            <Text style={styles.emptyText}>Check back soon for exciting deals and promotions!</Text>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {deals.map((deal, index) => (
            <TouchableOpacity 
              key={deal.id} 
              style={[
                styles.dealCard,
                (index === 0 || index === 1) && styles.dealCardFeatured
              ]}
              onPress={() => {
                onNavigate && onNavigate('dealdetails', { dealId: deal.id });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image source={deal.image} style={styles.dealImage} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{deal.rating}</Text>
                </View>
              </View>
              
              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                
                <View style={styles.venueRow}>
                  <Ionicons name="location" size={14} color="#00A8E1" />
                  <Text style={styles.venueText}>{deal.venue}</Text>
                </View>
                
                <Text style={styles.priceText}>Price: {deal.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Show More Button */}
        <TouchableOpacity style={styles.showMoreButton}>
          <Text style={styles.showMoreButtonText}>Show more</Text>
        </TouchableOpacity>
      </>
    )}
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

              {/* <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('events'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Happenings & Events</Text>
              </TouchableOpacity> */}

              <TouchableOpacity 
                style={[styles.menuItem, styles.activeMenuItem]}
                onPress={closeMenu}
              >
                <Text style={[styles.menuItemText, styles.activeMenuItemText]}>Deals & Promotions</Text>
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

            {/* Large Logo at Bottom */}
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
        <View style={styles.filterModalContainer}>
          <Animated.View 
            style={[
              styles.filterBottomSheet,
              { transform: [{ translateY: filterSlideAnim }] }
            ]}
          >
            <View style={styles.filterHandle} />
            <DealsFilterScreen 
              onClose={closeFilter}
              onApply={(filters) => {
                console.log('Applied filters:', filters);
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
  dealCard: {
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
  dealCardFeatured: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
  },
  dealImage: {
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
  dealInfo: {
    padding: 12,
    paddingTop: 16,
  },
  dealTitle: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
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
    backgroundColor: 'transparent',
  },
  filterOverlay: {
    flex: 1,
  },
  filterBottomSheet: {
    height: '50%',
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
