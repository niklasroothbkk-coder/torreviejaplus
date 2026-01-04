import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DealsFilterScreen from './DealsFilterScreen';
import { supabase } from '../config/supabaseClient';

const { width } = Dimensions.get('window');

// Helper function to calculate next occurrence for recurring deals
const getNextOccurrence = (deal) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (deal.is_recurring && deal.recurring_day) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const recurringDays = deal.recurring_day.split(',').map(d => d.trim());
    
    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() + i);
      const dayName = daysOfWeek[checkDate.getDay()];
      
      if (recurringDays.includes(dayName)) {
        return checkDate.toISOString().split('T')[0];
      }
    }
  }
  
  return null;
};

// Filter deals that are still valid
const filterValidDeals = (deals) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return deals.filter(deal => {
    if (deal.is_recurring && deal.recurring_day) {
      const nextOccurrence = getNextOccurrence(deal);
      return nextOccurrence !== null;
    }
    
    if (deal.end_date) {
      const dealEndDate = new Date(deal.end_date);
      dealEndDate.setHours(23, 59, 59, 999);
      return dealEndDate >= now;
    }
    
    return false;
  });
};

export default function DealsPage({ onNavigate, onOpenMenu }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(-Dimensions.get('window').height));
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({ category: 'All' });

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
          venues!deals_venue_id_fkey(name)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validDeals = filterValidDeals(data);

      const transformedDeals = validDeals.map(deal => {
        const venueName = deal.venues?.name || 'Unknown Venue';
        const dealTitle = deal.name || deal.title || 'No Title';
        
        let displayStartDate = deal.deal_date;
        let displayEndDate = deal.end_date;
        
        if (deal.is_recurring && deal.recurring_day) {
          const nextOccurrence = getNextOccurrence(deal);
          if (nextOccurrence) {
            displayStartDate = nextOccurrence;
            displayEndDate = null;
          }
        }
        
        return {
          id: deal.id,
          rating: deal.rating || 4.5,
          title: dealTitle,
          description: deal.description,
          venue: venueName,
          category: deal.category,
          startDate: displayStartDate,
          endDate: displayEndDate,
          isRecurring: deal.is_recurring,
          recurringDays: deal.recurring_day,
          discount: deal.discount_text || deal.price || 'SPECIAL',
          image: deal.image_url ? { uri: deal.image_url } : require('../../assets/backgrounds/BG_ALL.png'),
        };
      });

      setDeals(transformedDeals);
      setFilteredDeals(transformedDeals);
    } catch (error) {
      console.error('❌ Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
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
    
    let filtered = deals;
    
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(deal => deal.category === filters.category);
    }
    
    setFilteredDeals(filtered);
    closeFilter();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateRange = (deal) => {
    if (deal.isRecurring && deal.recurringDays) {
      return `Next: ${formatDate(deal.startDate)}`;
    }
    
    if (deal.startDate && deal.endDate) {
      return `${formatDate(deal.startDate)} - ${formatDate(deal.endDate)}`;
    }
    if (deal.startDate) return `From ${formatDate(deal.startDate)}`;
    if (deal.endDate) return `Until ${formatDate(deal.endDate)}`;
    return 'Ongoing';
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
          <Text style={styles.titleText}>Deals & Promotions</Text>
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
              {filteredDeals.map((deal, index) => (
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
                    <Text style={styles.dealTitle} numberOfLines={2}>{deal.title}</Text>
                    
                    <View style={styles.venueRow}>
                      <Ionicons name="location" size={12} color="#00A8E1" />
                      <Text style={styles.venueText} numberOfLines={1}>{deal.venue}</Text>
                    </View>
                    
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar-outline" size={12} color="#0077B6" />
                      <Text style={styles.dateText} numberOfLines={1}>{formatDateRange(deal)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {filteredDeals.length > 6 && (
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
            <DealsFilterScreen
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dealInfo: {
    padding: 12,
    paddingTop: 16,
  },
  dealTitle: {
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
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
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