import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MeatballDetailsScreen({ onNavigate }) {
  const [reviewText, setReviewText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../../assets/backgrounds/BG1.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Header with Back, Share and Favorite */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => onNavigate && onNavigate('testdeals')}
        >
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>

        <View style={styles.headerRightButtons}>
          <View>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => setShareMenuOpen(!shareMenuOpen)}
            >
              <Ionicons name="share-social" size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>SHARE</Text>
            </TouchableOpacity>

            {/* Share Dropdown Menu */}
            {shareMenuOpen && (
              <View style={styles.shareDropdown}>
                <TouchableOpacity style={styles.shareOption}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.shareOptionText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                  <Text style={styles.shareOptionText}>Instagram</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <Ionicons name="logo-tiktok" size={20} color="#000000" />
                  <Text style={styles.shareOptionText}>TikTok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                  <Text style={styles.shareOptionText}>X (Twitter)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.headerButtonFavorite}>
            <Ionicons name="heart-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Deal Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/deals/Meatballs.png')} 
            style={styles.dealImage}
            resizeMode="cover"
          />
        </View>

        {/* Deal Title and Info */}
        <View style={styles.contentCard}>
          <Text style={styles.dealTitle}>Meatball Deal</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color="#0077B6" />
              <Text style={styles.infoText}>Caramels Café</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="star" size={16} color="#0077B6" />
              <Text style={styles.infoText}>4.0 (40 Reviews)</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={16} color="#0077B6" />
              <Text style={styles.infoText}>2025-12-19</Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.detailsText}>
              This sunday 2025-12-19 we serve meatballs with mash potato and lingonberry for €10 include a small beer or a glas of wine.{'\n\n'}
              Please book your seat to be sure.
            </Text>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TouchableOpacity>
                <Text style={styles.viewLink}>View</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapContainer}>
              <Image 
                source={require('../../../assets/ui/Map.png')} 
                style={styles.mapImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsMainHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FFFFFF" />
                <Text style={styles.ratingText}>4.0 (40 Reviews)</Text>
              </View>
            </View>

            {/* Review Card 1 */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <Image 
                    source={require('../../../assets/ui/Kvinna1.png')} 
                    style={styles.avatarImage}
                  />
                  <View>
                    <Text style={styles.reviewerName}>Sophia Martinez</Text>
                    <Text style={styles.reviewDate}>Dec 11, 2020</Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={14} color="#0077B6" />
                  <Text style={styles.reviewRatingText}>4.1</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>
                Breathtaking views and incredible natural beauty. A must-see destination for every traveler!
              </Text>
            </View>

            {/* Review Card 2 */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <Image 
                    source={require('../../../assets/ui/Man1.png')} 
                    style={styles.avatarImage}
                  />
                  <View>
                    <Text style={styles.reviewerName}>Liam Chen</Text>
                    <Text style={styles.reviewDate}>July 14, 2024</Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={14} color="#0077B6" />
                  <Text style={styles.reviewRatingText}>3.9</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>
                The power and beauty of Niagara Falls is truly an unforgettable experience!
              </Text>
            </View>

            {/* View All Button */}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Give a Review Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Give a Review</Text>

            {/* Star Rating */}
            <View style={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star}
                  onPress={() => setSelectedRating(star)}
                >
                  <Ionicons 
                    name={star <= selectedRating ? "star" : "star-outline"} 
                    size={32} 
                    color="#0077B6" 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Write Review Section */}
          <View style={styles.section}>
            <View style={styles.writeReviewHeader}>
              <Text style={styles.sectionTitle}>Write Review</Text>
              <Text style={styles.maxWords}>Max 250 words</Text>
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Write here..."
              placeholderTextColor="#999"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Add Photo/Video */}
            <TouchableOpacity style={styles.addMediaButton}>
              <Ionicons name="camera" size={32} color="#0077B6" />
              <Text style={styles.addMediaText}>Add a photo or video</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Book Now Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>€10:00</Text>
          <Text style={styles.perPerson}>/person</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
    paddingHorizontal: 20,
    paddingTop: 50,
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
    fontSize: 12,
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
    fontSize: 11,
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
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 20,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  viewLink: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
  },
  detailsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  mapContainer: {
    width: '100%',
    height: 222,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: 222,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 24,
    color: '#666',
  },
  reviewsMainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 6,
    color: '#666',
  },
  reviewerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  reviewDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 18,
  },
  viewAllButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
  },
  starRating: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  writeReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maxWords: {
    fontSize: 11,
    color: '#999',
  },
  reviewInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: '#000',
    height: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
  },
  addMediaButton: {
    borderWidth: 2,
    borderColor: '#0077B6',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addMediaText: {
    fontSize: 13,
    color: '#0077B6',
    fontWeight: '500',
    marginTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  perPerson: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#0077B6',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 15,
  },
  bookButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
