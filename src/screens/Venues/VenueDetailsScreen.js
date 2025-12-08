import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VenueDetailsScreen({ onNavigate, venueId }) {
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const venueData = {
    id: venueId || 1,
    name: 'The Beach Club',
    category: 'Restaurant & Bar',
    rating: 4.5,
    reviewCount: 128,
    location: 'Hua Hin Beach',
    address: '123 Beach Road, Hua Hin 77110',
    cuisine: 'International',
    priceRange: '€€€',
    phone: '+66 32 123 456',
    website: 'www.beachclub-huahin.com',
    hours: {
      monday: '11:00 - 23:00',
      tuesday: '11:00 - 23:00',
      wednesday: '11:00 - 23:00',
      thursday: '11:00 - 23:00',
      friday: '11:00 - 01:00',
      saturday: '11:00 - 01:00',
      sunday: '11:00 - 23:00',
    },
    description: 'Experience beachfront dining at its finest. The Beach Club offers a perfect blend of international cuisine with stunning ocean views. Our menu features fresh seafood, premium steaks, and creative cocktails. Whether you\'re looking for a romantic dinner or a casual lunch with friends, we provide the perfect atmosphere.',
    features: [
      'Ocean View',
      'Live Music',
      'Outdoor Seating',
      'Parking Available',
      'Wi-Fi',
      'Credit Cards Accepted',
      'Reservations Recommended',
      'Family Friendly',
    ],
    image: require('../../../assets/events/Wine.png'),
    reviews: [
      {
        id: 1,
        userName: 'Sarah Johnson',
        rating: 5,
        date: '2024-11-15',
        comment: 'Amazing experience! The sunset view was breathtaking and the food was exceptional.',
        avatar: require('../../../assets/events/Wine.png'),
      },
      {
        id: 2,
        userName: 'Michael Chen',
        rating: 4,
        date: '2024-11-10',
        comment: 'Great atmosphere and friendly staff. The seafood platter was fresh and delicious.',
        avatar: require('../../../assets/events/Wine.png'),
      },
    ],
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#FFD700' : '#DDD'}
        />
      );
    }
    return stars;
  };

  const handleShare = (platform) => {
    console.log(`Sharing to ${platform}`);
    setShareMenuOpen(false);
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
      <Image source={require('../../../assets/backgrounds/SplashBG.png')} style={styles.backgroundImage} blurRadius={50} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate('venues')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerRightButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={() => setShareMenuOpen(!shareMenuOpen)}>
            <Ionicons name="share-social" size={16} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          {shareMenuOpen && (
            <View style={styles.shareDropdown}>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('Facebook')}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={styles.shareOptionText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('Instagram')}>
                <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                <Text style={styles.shareOptionText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('WhatsApp')}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.shareOptionText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.headerButtonFavorite}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={venueData.image} style={styles.venueImage} resizeMode="cover" />
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.venueTitle}>{venueData.name}</Text>
          <Text style={styles.categoryText}>{venueData.category}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>{renderStars(Math.round(venueData.rating))}</View>
            <Text style={styles.ratingText}>
              {venueData.rating} ({venueData.reviewCount} reviews)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#0077B6" />
            <Text style={styles.infoText}>{venueData.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="restaurant" size={16} color="#0077B6" />
            <Text style={styles.infoText}>{venueData.cuisine}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash" size={16} color="#0077B6" />
            <Text style={styles.infoText}>{venueData.priceRange}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call" size={20} color="#0077B6" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="navigate" size={20} color="#0077B6" />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="globe" size={20} color="#0077B6" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.detailsText}>{venueData.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features & Amenities</Text>
            <View style={styles.featuresGrid}>
              {venueData.features.map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Ionicons name="checkmark-circle" size={14} color="#0077B6" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            {Object.entries(venueData.hours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <Text style={styles.hoursText}>{hours}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews ({venueData.reviewCount})</Text>
            {venueData.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={review.avatar} style={styles.reviewAvatar} />
                  <View style={styles.reviewHeaderText}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <View style={styles.starsRow}>{renderStars(review.rating)}</View>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Write a Review</Text>
            <View style={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                  <Ionicons
                    name={star <= selectedRating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= selectedRating ? '#FFD700' : '#DDD'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <TouchableOpacity
              style={[styles.submitButton, (!reviewText.trim() || selectedRating === 0) && styles.submitButtonDisabled]}
              onPress={submitReview}
              disabled={!reviewText.trim() || selectedRating === 0}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  shareDropdown: {
    position: 'absolute',
    top: 45,
    right: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  shareOptionText: {
    fontSize: 14,
  },
  headerButtonFavorite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width - 32,
    height: 222,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 10,
    padding: 20,
  },
  venueTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#0077B6',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#0077B6',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reviewInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#0077B6',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
