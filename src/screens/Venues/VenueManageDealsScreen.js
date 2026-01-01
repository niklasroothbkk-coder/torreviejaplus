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

export default function VenueManageDealsScreen({ navigation, route, currentUser }) {
  const { venueId } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDeals(data || []);
    } catch (error) {
      console.error('Error loading deals:', error);
      Alert.alert('Fel', 'Kunde inte ladda deals');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeals();
    setRefreshing(false);
  };

  const toggleDealStatus = async (dealId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('deals')
        .update({ active: !currentStatus })
        .eq('id', dealId);

      if (error) throw error;

      // Uppdatera lokalt
      setDeals(deals.map(deal =>
        deal.id === dealId ? { ...deal, active: !currentStatus } : deal
      ));

      Alert.alert('Success', `Deal ${!currentStatus ? 'aktiverat' : 'inaktiverat'}`);
    } catch (error) {
      console.error('Error toggling deal status:', error);
      Alert.alert('Fel', 'Kunde inte ändra status');
    }
  };

  const deleteDeal = (dealId, dealTitle) => {
    Alert.alert(
      'Ta bort deal',
      `Är du säker på att du vill ta bort "${dealTitle}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('deals')
                .delete()
                .eq('id', dealId);

              if (error) throw error;

              setDeals(deals.filter(deal => deal.id !== dealId));
              Alert.alert('Success', 'Deal borttaget');
            } catch (error) {
              console.error('Error deleting deal:', error);
              Alert.alert('Fel', 'Kunde inte ta bort deal');
            }
          },
        },
      ]
    );
  };

  const renderDealItem = ({ item }) => (
    <View style={styles.dealCard}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.dealImage} />
      )}
      <View style={styles.dealContent}>
        <View style={styles.dealHeader}>
          <Text style={styles.dealTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, item.active ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{item.active ? 'Aktiv' : 'Inaktiv'}</Text>
          </View>
        </View>

        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.dealStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color="#666" />
            <Text style={styles.statText}>{item.views || 0} visningar</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="pricetag" size={16} color="#666" />
            <Text style={styles.statText}>{item.price}</Text>
          </View>
        </View>

        <View style={styles.dealActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('VenueEditDeal', { dealId: item.id })}
          >
            <Ionicons name="create" size={20} color="#0077B6" />
            <Text style={styles.actionBtnText}>Redigera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleDealStatus(item.id, item.active)}
          >
            <Ionicons name={item.active ? 'pause' : 'play'} size={20} color="#FF9500" />
            <Text style={styles.actionBtnText}>{item.active ? 'Inaktivera' : 'Aktivera'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => deleteDeal(item.id, item.title)}
          >
            <Ionicons name="trash" size={20} color="#FF3B30" />
            <Text style={[styles.actionBtnText, { color: '#FF3B30' }]}>Ta bort</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={styles.loadingText}>Laddar deals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mina Deals</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('VenueCreateDeal', { venueId })}
          style={styles.addButton}
        >
          <Ionicons name="add" size={28} color="#0077B6" />
        </TouchableOpacity>
      </View>

      {deals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pricetag-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Inga deals ännu</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('VenueCreateDeal', { venueId })}
          >
            <Text style={styles.createButtonText}>Skapa ditt första deal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={deals}
          renderItem={renderDealItem}
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
  dealCard: {
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
  dealImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  dealContent: {
    padding: 15,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dealTitle: {
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
  dealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  dealStats: {
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
  dealActions: {
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