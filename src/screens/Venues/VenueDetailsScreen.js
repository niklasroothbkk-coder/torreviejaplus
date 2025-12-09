import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Linking, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VenueDetailsScreen({ onNavigate, venueId }) {
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = React.useRef(null);

  const venueData = {
    id: venueId || 1,
    name: 'Sweden Restaurant',
    location: 'Soi 18/3 poonsuk RD, Hua Hin.',
    rating: 4.0,
    reviewCount: 40,
    views: 7921,
    registeredDate: '2025-11-15',
    description: 'Sweden restaurant is a great place that almost always are full in the highs season. They serve great Swedish, Thai and International food.',
    hours: {
      monday: '16:00 - 23:00',
      tuesday: '16:00 - 23:00',
      wednesday: '16:00 - 23:00',
      thursday: '16:00 - 23:00',
      friday: '16:00 - 23:00',
      saturday: '16:00 - 23:00',
      sunday: '16:00 - 23:00',
    },
    kitchenCloseNote: '(Kitchen close 1 hour before closing time)',
    phone: '+66 81 880 7119',
    website: 'http://www.sweden-restaurant.asia/',
    email: 'ann@sweden-restaurant.asia',
    facebook: 'https://facebook.com/swedenrestaurant',
    instagram: 'https://instagram.com/swedenrestaurant',
    line: 'swedenrestaurant',
    whatsapp: '+66321234567',
    images: [
      require('../../../assets/venuephotos/Sweden1.png'),
      require('../../../assets/venuephotos/Sweden2.png'),
      require('../../../assets/venuephotos/Sweden3.png'),
    ],
    mapImage: require('../../../assets/ui/Map.png'),
    reviews: [
      {
        id: 1,
        userName: 'Sophia Martinez',
        rating: 4.1,
        date: 'Dec 11, 2020',
        comment: 'Breathtaking views and incredible natural beauty. A must-see destination for every traveler!',
        avatar: require('../../../assets/ui/Kvinna1.png'),
      },
    ],
  };

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
    Linking.openURL(`tel:${venueData.phone}`);
  };

  const handleChatPress = () => {
    // Open chat functionality
    console.log('Open chat');
  };

  const handleSocialPress = (platform) => {
    switch(platform) {
      case 'facebook':
        Linking.openURL(venueData.facebook);
        break;
      case 'instagram':
        Linking.openURL(venueData.instagram);
        break;
      case 'line':
        Linking.openURL(`https://line.me/R/ti/p/${venueData.line}`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${venueData.whatsapp.replace(/\s+/g, '')}`);
        break;
    }
  };

  const handleBookOrChat = () => {
    console.log('Book or ask anything (Chat)');
  };

  const submitReview = () => {
    if (reviewText.trim() && selectedRating > 0) {
      console.log('Submitting review:', { rating: selectedRating, text: reviewText });
      setReviewText('');
      setSelectedRating(0);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/backgrounds/BG1.png')} style={styles.backgroundImage} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate('venues')}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButtonFavorite}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#0077B6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery with Swipe */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={venueData.images}
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
              <Image source={item} style={styles.venueImage} resizeMode="cover" />
            )}
          />
          
          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <TouchableOpacity 
              style={styles.leftArrow}
              onPress={() => scrollToImage(currentImageIndex - 1)}
            >
              <Ionicons name="chevron-back" size={50} color="#FFF" />
            </TouchableOpacity>
          )}
          
          {currentImageIndex < venueData.images.length - 1 && (
            <TouchableOpacity 
              style={styles.rightArrow}
              onPress={() => scrollToImage(currentImageIndex + 1)}
            >
              <Ionicons name="chevron-forward" size={50} color="#FFF" />
            </TouchableOpacity>
          )}
          
          {/* Dot Indicators */}
          <View style={styles.dotContainer}>
            {venueData.images.map((_, index) => (
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

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title and Basic Info */}
          <Text style={styles.venueTitle}>{venueData.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#0077B6" />
              <Text style={styles.metaText}>{venueData.location}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="eye" size={14} color="#0077B6" />
              <Text style={styles.metaText}>{venueData.views} views (Registered {venueData.registeredDate})</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="thumbs-up" size={14} color="#0077B6" />
              <View style={styles.starsRow}>{renderStars(venueData.rating)}</View>
              <Text style={styles.metaText}>{venueData.rating} ({venueData.reviewCount} Reviews)</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{venueData.description}</Text>

          {/* Opening Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open</Text>
            {Object.entries(venueData.hours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <Text style={styles.hoursText}>{hours}</Text>
              </View>
            ))}
            <Text style={styles.kitchenNote}>{venueData.kitchenCloseNote}</Text>
          </View>

          {/* Contact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handlePhonePress}>
                <Ionicons name="call" size={20} color="#0077B6" />
                <Text style={styles.contactButtonText}>Phone</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactButton} 
                onPress={() => Linking.openURL(venueData.website)}
              >
                <Ionicons name="globe" size={20} color="#0077B6" />
                <Text style={styles.contactButtonText}>Web</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleChatPress}>
                <Ionicons name="chatbubbles" size={20} color="#0077B6" />
                <Text style={styles.contactButtonText}>Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactButton} 
                onPress={() => Linking.openURL(`mailto:${venueData.email}`)}
              >
                <Ionicons name="mail" size={20} color="#0077B6" />
                <Text style={styles.contactButtonText}>E-mail</Text>
              </TouchableOpacity>
            </View>

            {/* Social Media */}
            <Text style={styles.socialTitle}>Social Media</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialPress('facebook')}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialPress('instagram')}
              >
                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialPress('line')}
              >
                <Ionicons name="chatbubble-ellipses" size={24} color="#00B900" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialPress('whatsapp')}
              >
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Map */}
          <View style={styles.section}>
            <View style={styles.locationHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TouchableOpacity>
                <Text style={styles.viewLink}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <Image source={venueData.mapImage} style={styles.mapImage} resizeMode="cover" />
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <View style={styles.reviewsHeaderLeft}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <View style={styles.starsRow}>{renderStars(venueData.rating)}</View>
                <Text style={styles.reviewsCount}>{venueData.rating} ({venueData.reviewCount} Reviews)</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewLink}>View All</Text>
              </TouchableOpacity>
            </View>

            {venueData.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={review.avatar} style={styles.reviewAvatar} />
                  <View style={styles.reviewHeaderText}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.reviewRatingBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>

          {/* Give a Review */}
          <View style={styles.section}>
            <View style={styles.giveReviewHeader}>
              <Text style={styles.sectionTitle}>Give a Review</Text>
              <TouchableOpacity>
                <Text style={styles.viewLink}>View All</Text>
              </TouchableOpacity>
            </View>
            
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

          {/* Write Review */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Write Review</Text>
            <Text style={styles.maxWords}>Max 250 words</Text>
            
            <TextInput
              style={styles.reviewInput}
              placeholder="Write here..."
              placeholderTextColor="#999"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
            />

            {/* Add Photo/Video */}
            <TouchableOpacity style={styles.addMediaButton}>
              <Ionicons name="camera" size={32} color="#0077B6" />
              <Text style={styles.addMediaText}>Add a photo or video</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookOrChat}>
          <Text style={styles.bookButtonText}>Book or ask anything (Chat)</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonFavorite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  description: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 12,
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
    fontSize: 11,
    color: '#333',
  },
  hoursText: {
    fontSize: 11,
    color: '#666',
  },
  kitchenNote: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0077B6',
  },
  contactButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0077B6',
  },
  socialTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewLink: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '600',
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  mapImage: {
    width: '100%',
    height: '100%',
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
    fontSize: 11,
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
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  reviewDate: {
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  reviewComment: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  giveReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  maxWords: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  reviewInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 11,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
  },
  addMediaButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#0077B6',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  addMediaText: {
    fontSize: 11,
    color: '#0077B6',
    marginTop: 8,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookButton: {
    backgroundColor: '#0077B6',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
});
