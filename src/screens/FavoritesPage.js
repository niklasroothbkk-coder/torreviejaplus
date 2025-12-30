import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFavoriteVenues, getFavoriteEvents, getFavoriteDeals, removeFavorite } from '../services/favoritesService';

const { width } = Dimensions.get('window');

export default function FavoritesPage({ onNavigate, onOpenMenu, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'venues');
  const [favorites, setFavorites] = useState({
    venues: [],
    events: [],
    deals: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const [venues, events, deals] = await Promise.all([
        getFavoriteVenues(),
        getFavoriteEvents(),
        getFavoriteDeals(),
      ]);
      setFavorites({ venues, events, deals });
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (type, itemId) => {
    try {
      await removeFavorite(type, itemId);
      setFavorites(prev => ({
        ...prev,
        [type + 's']: prev[type + 's'].filter(item => item.id !== itemId)
      }));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderVenues = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={styles.emptyText}>Loading favorites...</Text>
        </View>
      );
    }

    if (favorites.venues.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No Favorite Venues Yet</Text>
          <Text style={styles.emptyText}>Start exploring and tap the heart icon to save your favorites!</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => onNavigate('venues')}
          >
            <Text style={styles.exploreButtonText}>Explore Venues</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {favorites.venues.map((venue) => (
          <TouchableOpacity
            key={venue.id}
            style={styles.card}
            onPress={() => onNavigate('venuedetails', { venueId: venue.id, returnTo: 'favorites', favoriteTab: 'venues' })}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: venue.images?.[0] || venue.image_url || 'https://via.placeholder.com/150' }} 
                style={styles.cardImage} 
              />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleRemoveFavorite('venue', venue.id)}
              >
                <Ionicons name="heart" size={20} color="#d12028" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>{venue.name}</Text>
              {venue.category && (
                <View style={styles.categoryRow}>
                  <Ionicons name="pricetag" size={12} color="#0077B6" />
                  <Text style={styles.categoryText}>{venue.category}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEvents = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={styles.emptyText}>Loading favorites...</Text>
        </View>
      );
    }

    if (favorites.events.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No Favorite Events Yet</Text>
          <Text style={styles.emptyText}>Start exploring and tap the heart icon to save your favorites!</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => onNavigate('events')}
          >
            <Text style={styles.exploreButtonText}>Explore Events</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {favorites.events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.card}
            onPress={() => onNavigate('eventdetails', { eventId: event.id, returnTo: 'favorites', favoriteTab: 'events' })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: event.image_url }} style={styles.cardImage} />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleRemoveFavorite('event', event.id)}
              >
                <Ionicons name="heart" size={20} color="#d12028" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>{event.name}</Text>
              {event.event_date && (
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={12} color="#0077B6" />
                  <Text style={styles.dateText}>{event.event_date}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDeals = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={styles.emptyText}>Loading favorites...</Text>
        </View>
      );
    }

    if (favorites.deals.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No Favorite Deals Yet</Text>
          <Text style={styles.emptyText}>Start exploring and tap the heart icon to save your favorites!</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => onNavigate('testdeals')}
          >
            <Text style={styles.exploreButtonText}>Explore Deals</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {favorites.deals.map((deal) => (
          <TouchableOpacity
            key={deal.id}
            style={styles.card}
            onPress={() => onNavigate('dealdetails', { dealId: deal.id, returnTo: 'favorites', favoriteTab: 'deals' })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: deal.image_url }} style={styles.cardImage} />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleRemoveFavorite('deal', deal.id)}
              >
                <Ionicons name="heart" size={20} color="#d12028" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>{deal.name}</Text>
              {deal.venues?.name && (
                <View style={styles.venueRow}>
                  <Ionicons name="location" size={12} color="#00A8E1" />
                  <Text style={styles.venueText}>{deal.venues.name}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/backgrounds/BG_ALL.png')} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.headerImageContainer}>
        <Image source={require('../../assets/backgrounds/Header Image Container.png')} style={styles.headerImage} resizeMode="cover" />
        <TouchableOpacity style={styles.menuButtonWrapper} onPress={onOpenMenu}>
          <View style={styles.menuButtonContainer}>
            <Ionicons name="menu" size={32} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>My Favorites</Text>
        </View>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'venues' && styles.activeTab]} onPress={() => setActiveTab('venues')}>
          <Text style={[styles.tabText, activeTab === 'venues' && styles.activeTabText]}>Venues ({favorites.venues.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'events' && styles.activeTab]} onPress={() => setActiveTab('events')}>
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events ({favorites.events.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'deals' && styles.activeTab]} onPress={() => setActiveTab('deals')}>
          <Text style={[styles.tabText, activeTab === 'deals' && styles.activeTabText]}>Deals ({favorites.deals.length})</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'venues' && renderVenues()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'deals' && renderDeals()}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => onNavigate('userprofile')}>
          <Ionicons name="person-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonActive]}>
          <View style={styles.activeNavButton}>
            <Ionicons name="heart" size={20} color="#0077B6" />
            <Text style={styles.activeNavText}>Favorites</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  headerImageContainer: { position: 'relative', width: '100%', height: 180 },
  headerImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  menuButtonWrapper: { position: 'absolute', top: 65, left: 20, zIndex: 1000 },
  menuButtonContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0077B6', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  titleContainer: { position: 'absolute', bottom: 20, left: 30 },
  titleText: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F5F5F5', alignItems: 'center' },
  activeTab: { backgroundColor: '#0077B6' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 90 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  exploreButton: { backgroundColor: '#0077B6', borderRadius: 25, paddingVertical: 14, paddingHorizontal: 32, shadowColor: '#0077B6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  exploreButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: (width - 40) / 2, backgroundColor: '#FFFFFF', borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  imageContainer: { position: 'relative' },
  cardImage: { width: '100%', height: 120, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  favoriteButton: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  cardInfo: { padding: 12, paddingTop: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  categoryText: { fontSize: 14, color: '#666', flex: 1 },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  venueText: { fontSize: 14, color: '#666', flex: 1 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dateText: { fontSize: 14, color: '#666', flex: 1 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#0077B6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 10, zIndex: 100 },
  navButton: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  navButtonActive: {},
  activeNavButton: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  activeNavText: { fontSize: 14, fontWeight: '700', color: '#0077B6' },
});
