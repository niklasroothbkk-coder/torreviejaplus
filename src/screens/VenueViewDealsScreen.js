import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';

export default function VenueViewDealsScreen({ onNavigate, onOpenMenu }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [venueId, setVenueId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
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
          
          const { data: dealsData, error } = await supabase
            .from('deals')
            .select('*')
            .eq('venue_id', profileData.venue_id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          // Mark deals as expired if end_date has passed
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          const processedDeals = dealsData.map(deal => {
            let isExpired = false;
            if (deal.end_date) {
              const endDate = new Date(deal.end_date);
              endDate.setHours(23, 59, 59, 999);
              isExpired = endDate < now;
            }
            return { ...deal, isExpired };
          });
          
          setDeals(processedDeals);
        }
      }
    } catch (error) {
      console.error('Error loading deals:', error);
      Alert.alert('Error', 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDeals = () => {
    if (filter === 'active') {
      return deals.filter(d => d.active && !d.isExpired);
    } else if (filter === 'inactive') {
      return deals.filter(d => !d.active || d.isExpired);
    }
    return deals;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };

  const handleEdit = (deal) => {
    onNavigate('venueEditDeal', { deal });
  };

  const handleReactivate = (deal) => {
    onNavigate('venueEditDeal', { deal, reactivate: true });
  };

  const handlePause = async (deal) => {
    Alert.alert(
      'Pause Deal',
      `Are you sure you want to pause "${deal.name}"? It will be hidden from the app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('deals')
                .update({ active: false })
                .eq('id', deal.id);
              
              if (error) throw error;
              loadDeals();
            } catch (error) {
              Alert.alert('Error', 'Failed to pause deal');
            }
          }
        }
      ]
    );
  };

  const handleUnpause = async (deal) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ active: true })
        .eq('id', deal.id);
      
      if (error) throw error;
      loadDeals();
    } catch (error) {
      Alert.alert('Error', 'Failed to unpause deal');
    }
  };

  const filteredDeals = getFilteredDeals();

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
        <Text style={styles.headerTitle}>My Deals</Text>
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
        ) : filteredDeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="pricetag-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No deals found</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => onNavigate('venueCreateDeal')}
            >
              <Text style={styles.createButtonText}>Create Your First Deal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDeals.map((deal) => (
            <View key={deal.id} style={styles.dealCard}>
              {/* Status Badge */}
              <View style={[
                styles.statusBadge,
                deal.active && !deal.isExpired ? styles.statusActive : styles.statusInactive
              ]}>
                <Text style={styles.statusText}>
                  {deal.isExpired ? 'Expired' : (deal.active ? 'Active' : 'Paused')}
                </Text>
              </View>

              {/* Deal Image */}
              {deal.image_url && (
                <Image source={{ uri: deal.image_url }} style={styles.dealImage} />
              )}

              {/* Deal Info */}
              <View style={styles.dealInfo}>
                <Text style={styles.dealName}>{deal.name}</Text>
                <Text style={styles.dealCategory}>{deal.category}</Text>
                
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>Start: {formatDate(deal.deal_date)}</Text>
                </View>
                
                {deal.end_date && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>End: {formatDate(deal.end_date)}</Text>
                  </View>
                )}
                
                {deal.is_recurring && (
                  <View style={styles.detailRow}>
                    <Ionicons name="repeat" size={16} color="#0077B6" />
                    <Text style={styles.detailText}>{deal.recurring_day}</Text>
                  </View>
                )}

                {deal.price && (
                  <View style={styles.detailRow}>
                    <Ionicons name="pricetag" size={16} color="#666" />
                    <Text style={styles.detailText}>{deal.price}</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {deal.active && !deal.isExpired ? (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.editBtn]}
                      onPress={() => handleEdit(deal)}
                    >
                      <Ionicons name="pencil" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.pauseBtn]}
                      onPress={() => handlePause(deal)}
                    >
                      <Ionicons name="pause" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Pause</Text>
                    </TouchableOpacity>
                  </>
                ) : deal.isExpired ? (
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.reactivateBtn]}
                    onPress={() => handleReactivate(deal)}
                  >
                    <Ionicons name="refresh" size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Reactivate with New Date</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.unpauseBtn]}
                      onPress={() => handleUnpause(deal)}
                    >
                      <Ionicons name="play" size={18} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Unpause</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.editBtn]}
                      onPress={() => handleEdit(deal)}
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
  dealCard: {
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
  dealImage: {
    width: '100%',
    height: 150,
  },
  dealInfo: {
    padding: 16,
  },
  dealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dealCategory: {
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
