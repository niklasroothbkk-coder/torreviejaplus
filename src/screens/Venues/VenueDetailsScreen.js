import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Linking, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';
import CustomAlert from '../../components/CustomAlert';
import { addFavorite, removeFavorite, isFavorite as checkIsFavorite } from '../../services/favoritesService';

const { width } = Dimensions.get('window');

export default function VenueDetailsScreen({ onNavigate, venueId, authParams }) {
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [venueData, setVenueData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const flatListRef = React.useRef(null);
  const scrollViewRef = React.useRef(null);
  const textInputRef = React.useRef(null);
  
  // CustomAlert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  // Chat states
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const viewsIncrementedRef = React.useRef(false);

  // Check favorite status
  const checkFavoriteStatus = async () => {
    const favorited = await checkIsFavorite('venue', venueId);
    setIsFavorite(favorited);
  };

  const toggleFavorite = async () => {
    try {
      // Check if user is logged in FIRST
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Show login required popup
        setAlertTitle('Login Required');
        setAlertMessage('Please sign in to add favorites');
        setShowAlert(true);
        return;
      }
      
      // User is logged in, proceed
      if (isFavorite) {
        await removeFavorite('venue', venueId);
        setIsFavorite(false);
      } else {
        await addFavorite('venue', venueId);
        setIsFavorite(true);
      }
    } catch (error) {
      // Only log error, DON'T show to user
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    fetchVenueData();
    fetchReviews();
    checkFavoriteStatus();
    
    // Only increment views once per venue visit
    if (!viewsIncrementedRef.current) {
      incrementViews();
      viewsIncrementedRef.current = true;
    }
    
    // Reset flag when venueId changes
    return () => {
      viewsIncrementedRef.current = false;
    };
  }, [venueId]);

  const incrementViews = async () => {
    try {
      await fetch(
        `https://vfponburmjbuqqneigjr.supabase.co/rest/v1/rpc/increment_venue_views`,
        {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ venue_id_param: venueId })
        }
      );
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const fetchVenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://vfponburmjbuqqneigjr.supabase.co/rest/v1/venues?id=eq.${venueId}&select=*`,
        {
          method: 'GET',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data && data.length > 0) {
        setVenueData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Only fetch PUBLISHED reviews
      const response = await fetch(
        `https://vfponburmjbuqqneigjr.supabase.co/rest/v1/reviews?venue_id=eq.${venueId}&status=eq.published&select=*&order=created_at.desc`,
        {
          method: 'GET',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    // Validate input
    if (!reviewText.trim() || selectedRating === 0) {
      setAlertTitle('Error');
      setAlertMessage('Please select a rating and write a review');
      setShowAlert(true);
      return;
    }

    try {
      setSubmitting(true);
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAlertTitle('Login Required');
        setAlertMessage('Please sign in to submit a review');
        setShowAlert(true);
        setSubmitting(false);
        return;
      }
      
      // Get user's name from profiles
      let userName = 'Anonymous';
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        
        if (profileData?.name) {
          userName = profileData.name;
        }
      } catch (profileError) {
        console.log('Could not fetch profile name, using default');
      }
      
      // Get session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Submit review with status='pending' for admin approval
      const reviewResponse = await fetch(
        'https://vfponburmjbuqqneigjr.supabase.co/rest/v1/reviews',
        {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM',
            'Authorization': `Bearer ${session?.access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcG9uYnVybWpidXFxbmVpZ2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTUwODgsImV4cCI6MjA4MDk5MTA4OH0.4osS6AQ6tUaRpoO8dtwlBBOsbnNymzFR7SB2aWVj7DM'}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            venue_id: parseInt(venueId),
            user_id: user.id,
            user_name: userName,
            rating: selectedRating,
            comment: reviewText,
            status: 'pending'
          })
        }
      );

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      // Success! Review submitted for approval
      setAlertTitle('Thank You!');
      setAlertMessage('Your review has been submitted and is pending approval. It will appear once approved by our team.');
      setShowAlert(true);
      setReviewText('');
      setSelectedRating(0);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to submit review. Please try again.');
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0077B6" />
      </View>
    );
  }

  if (!venueData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Venue not found</Text>
      </View>
    );
  }

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (width - 32));
    setCurrentImageIndex(index);
  };

  const scrollToImage = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentImageIndex(index);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color="#FFD700" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#DDD" />
        );
      }
    }
    return stars;
  };

  const handlePhonePress = () => {
    if (venueData.phone) {
      Linking.openURL(`tel:${venueData.phone}`);
    }
  };

  const handleSocialPress = (platform) => {
    switch(platform) {
      case 'facebook':
        if (venueData.facebook) Linking.openURL(venueData.facebook);
        break;
      case 'instagram':
        if (venueData.instagram) Linking.openURL(venueData.instagram);
        break;
      case 'tiktok':
        if (venueData.tiktok) Linking.openURL(venueData.tiktok);
        break;
      case 'twitter':
        if (venueData['x/twitter']) Linking.openURL(venueData['x/twitter']);
        break;
      case 'line':
        if (venueData.line) Linking.openURL(`https://line.me/R/ti/p/${venueData.line}`);
        break;
      case 'whatsapp':
        if (venueData.whatsapp) Linking.openURL(`https://wa.me/${venueData.whatsapp.replace(/\s+/g, '')}`);
        break;
    }
  };

  const handleShare = (platform) => {
    const shareUrl = `https://torreviejaplus.com/venue/${venueId}`;
    const shareText = `Check out ${venueData?.name} on TorreviejaPlus!`;
    
    switch(platform) {
      case 'facebook':
        Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'instagram':
        setAlertTitle('Share');
        setAlertMessage('Please share via Instagram app');
        setShowAlert(true);
        break;
      case 'tiktok':
        setAlertTitle('Share');
        setAlertMessage('Please share via TikTok app');
        setShowAlert(true);
        break;
      case 'twitter':
        Linking.openURL(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const handleOpenBookingChat = () => {
    if (!isLoggedIn) {
      setAlertTitle('Login Required');
      setAlertMessage('Please login to make a booking.');
      setShowAlert(true);
      return;
    }
    setChatModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      text: chatMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const imageUrls = venueData.images || [];

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/backgrounds/BG_ALL.png')} style={styles.backgroundImage} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => {
          if (authParams?.returnTo === 'favorites' && authParams?.favoriteTab) {
            onNavigate('favorites', { favoriteTab: authParams.favoriteTab });
          } else {
            onNavigate(authParams?.returnTo || 'venues');
          }
        }}>
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
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={28} 
              color={isFavorite ? "#d12028" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        {imageUrls.length > 0 && (
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={imageUrls}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={width - 32}
              snapToAlignment="center"
              keyExtractor={(item, index) => index.toString()}
              onMomentumScrollEnd={handleScrollEnd}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.venueImage} resizeMode="cover" />
              )}
            />
            
            {currentImageIndex > 0 && (
              <TouchableOpacity 
                style={styles.leftArrow}
                onPress={() => scrollToImage(currentImageIndex - 1)}
              >
                <Ionicons name="chevron-back" size={50} color="#FFF" />
              </TouchableOpacity>
            )}
            
            {currentImageIndex < imageUrls.length - 1 && (
              <TouchableOpacity 
                style={styles.rightArrow}
                onPress={() => scrollToImage(currentImageIndex + 1)}
              >
                <Ionicons name="chevron-forward" size={50} color="#FFF" />
              </TouchableOpacity>
            )}
            
            <View style={styles.dotContainer}>
              {imageUrls.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex && styles.activeDot
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.contentCard}>
          <Text style={styles.venueTitle}>{venueData.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#0077B6" />
              <Text style={styles.metaText}>{venueData.location}</Text>
            </View>
          </View>

          {venueData.rating > 0 && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.metaText}>{Number(venueData.rating).toFixed(1)} ({venueData.review_count || 0} Reviews)</Text>
              </View>
            </View>
          )}

          {venueData.views > 0 && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="eye" size={14} color="#999" />
                <Text style={styles.metaText}>{venueData.views} views</Text>
              </View>
            </View>
          )}

          {venueData.price_range && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="cash-outline" size={14} color="#0077B6" />
                <Text style={styles.metaText}>
                  Price Level: {venueData.price_range}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.description}>{venueData.description}</Text>

          {venueData.opening_hours && Object.values(venueData.opening_hours).some(hours => hours) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Open</Text>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                const hours = venueData.opening_hours[day];
                return hours ? (
                  <View key={day} style={styles.hoursRow}>
                    <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                    <Text style={styles.hoursText}>{hours}</Text>
                  </View>
                ) : null;
              })}
            </View>
          )}

          {venueData.cuisine && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cuisine</Text>
              <View style={styles.featuresGrid}>
                {(() => {
                  let cuisineArray = [];
                  if (Array.isArray(venueData.cuisine)) {
                    cuisineArray = venueData.cuisine;
                  } else if (typeof venueData.cuisine === 'string') {
                    try {
                      cuisineArray = JSON.parse(venueData.cuisine);
                    } catch (e) {
                      cuisineArray = [venueData.cuisine];
                    }
                  }
                  return cuisineArray.map((cuisineType, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{cuisineType}</Text>
                    </View>
                  ));
                })()}
              </View>
            </View>
          )}

          {venueData.features && venueData.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {venueData.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(venueData.phone || venueData.email || venueData.website || venueData.whatsapp || venueData.line) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              
              {venueData.phone && (
                <TouchableOpacity onPress={handlePhonePress} style={styles.contactTextRow}>
                  <Text style={styles.contactLabel}>Phone:</Text>
                  <Text style={styles.contactValue}>{venueData.phone}</Text>
                </TouchableOpacity>
              )}

              {venueData.email && (
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${venueData.email}`)} style={styles.contactTextRow}>
                  <Text style={styles.contactLabel}>Email:</Text>
                  <Text style={styles.contactValue}>{venueData.email}</Text>
                </TouchableOpacity>
              )}

              {(venueData.whatsapp || venueData.line) && (
                <View style={styles.contactIconsRow}>
                  {venueData.whatsapp && (
                    <TouchableOpacity 
                      style={styles.contactIconButton} 
                      onPress={() => handleSocialPress('whatsapp')}
                    >
                      <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                      <Text style={styles.contactIconText}>WhatsApp</Text>
                    </TouchableOpacity>
                  )}
                  
                  {venueData.line && (
                    <TouchableOpacity 
                      style={styles.contactIconButton} 
                      onPress={() => handleSocialPress('line')}
                    >
                      <Ionicons name="chatbubble-ellipses" size={24} color="#00B900" />
                      <Text style={styles.contactIconText}>Line</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {(venueData.website || venueData.facebook || venueData.instagram || venueData.tiktok || venueData['x/twitter']) && (
                <View style={styles.socialMediaSection}>
                  <Text style={styles.sectionTitle}>Social Media</Text>
                  <View style={styles.socialButtons}>
                    {venueData.website && (
                      <TouchableOpacity 
                        style={styles.socialButton} 
                        onPress={() => Linking.openURL(venueData.website)}
                      >
                        <Ionicons name="globe-outline" size={24} color="#0077B6" />
                      </TouchableOpacity>
                    )}
                    
                    {venueData.facebook && (
                      <TouchableOpacity 
                        style={styles.socialButton} 
                        onPress={() => handleSocialPress('facebook')}
                      >
                        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                      </TouchableOpacity>
                    )}
                    
                    {venueData.instagram && (
                      <TouchableOpacity 
                        style={styles.socialButton} 
                        onPress={() => handleSocialPress('instagram')}
                      >
                        <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                      </TouchableOpacity>
                    )}
                    
                    {venueData.tiktok && (
                      <TouchableOpacity 
                        style={styles.socialButton} 
                        onPress={() => handleSocialPress('tiktok')}
                      >
                        <Ionicons name="logo-tiktok" size={24} color="#000" />
                      </TouchableOpacity>
                    )}
                    
                    {venueData['x/twitter'] && (
                      <TouchableOpacity 
                        style={styles.socialButton} 
                        onPress={() => handleSocialPress('twitter')}
                      >
                        <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Give a Review</Text>
            
            <View style={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                  <Ionicons
                    name={star <= selectedRating ? 'star' : 'star-outline'}
                    size={28}
                    color={star <= selectedRating ? '#FFD700' : '#DDD'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Write Review</Text>
            <Text style={styles.maxWords}>Max 250 words</Text>
            
            <TextInput
              ref={textInputRef}
              style={styles.reviewInput}
              placeholder="Write here..."
              placeholderTextColor="#999"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitReviewButton} onPress={submitReview} disabled={submitting}>
              <Text style={styles.submitReviewButtonText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 && (
            <View style={styles.section}>
              <View style={styles.reviewsHeader}>
                <View style={styles.reviewsHeaderLeft}>
                  <Text style={styles.sectionTitle}>Reviews</Text>
                  <View style={styles.starsRow}>{renderStars(venueData.rating)}</View>
                  <Text style={styles.reviewsCount}>{Number(venueData.rating).toFixed(1)} ({venueData.review_count || 0} Reviews)</Text>
                </View>
              </View>
              
              {reviews.slice(0, visibleReviews).map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewHeaderText}>
                      <Text style={styles.reviewUserName}>{review.user_name}</Text>
                      <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.reviewRatingBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
              
              {visibleReviews < reviews.length && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => setVisibleReviews(prev => Math.min(prev + 10, reviews.length))}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeVenueButton}
            onPress={() => {
              if (authParams?.returnTo === 'favorites' && authParams?.favoriteTab) {
                onNavigate('favorites', { favoriteTab: authParams.favoriteTab });
              } else {
                onNavigate(authParams?.returnTo || 'venues');
              }
            }}
          >
            <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.closeVenueButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.bookButton} onPress={handleOpenBookingChat}>
          <Text style={styles.bookButtonText}>Make a Booking (Chat)</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={chatModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChatModalOpen(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlayCenter}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.chatModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chat with {venueData?.name}</Text>
              <TouchableOpacity 
                onPress={() => setChatModalOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#414141" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatMessagesContainer}>
              {chatMessages.length === 0 ? (
                <View style={styles.emptyChatContainer}>
                  <Ionicons name="chatbubbles-outline" size={48} color="#999" />
                  <Text style={styles.emptyChatText}>No messages yet.</Text>
                  <Text style={styles.emptyChatSubText}>Start the conversation by making your booking request!</Text>
                </View>
              ) : (
                chatMessages.map((msg) => (
                  <View key={msg.id} style={styles.chatMessage}>
                    <Text style={styles.chatMessageSender}>{msg.sender}</Text>
                    <Text style={styles.chatMessageText}>{msg.text}</Text>
                    <Text style={styles.chatMessageTime}>{msg.timestamp}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your booking request..."
                placeholderTextColor="#999"
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CustomAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
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
  venueImage: {
    width: width - 32,
    height: 222,
  },
  leftArrow: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 50,
    padding: 8,
  },
  rightArrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 50,
    padding: 8,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 20,
    marginBottom: 80,
  },
  venueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
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
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 0,
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
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
  },
  contactTextRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  contactValue: {
    fontSize: 16,
    color: '#0077B6',
    flex: 1,
  },
  contactIconsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  contactIconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contactIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reviewsHeaderLeft: {
    flex: 1,
  },
  reviewsCount: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  reviewDate: {
    fontSize: 16,
    color: '#999',
    marginTop: 2,
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  reviewComment: {
    fontSize: 16,
    color: '#666',
    lineHeight: 18,
  },
  viewAllButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
  },
  ratingSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  maxWords: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  reviewInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  submitReviewButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 38,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  featureText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  closeVenueButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 25,
  },
  closeVenueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  socialMediaSection: {
    marginTop: 25,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatModal: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    paddingRight: 0,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chatMessagesContainer: {
    flex: 1,
    marginBottom: 15,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  emptyChatSubText: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  chatMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  chatMessageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 5,
  },
  chatMessageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  chatMessageTime: {
    fontSize: 16,
    color: '#999',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#0077B6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});