import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilterScreen({ onClose, onApply }) {
  const [selectedCategory, setSelectedCategory] = useState('Markets');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = [
    'Markets',
    'Sport Events',
    'Trips & Tours',
    'Party Event',
    'Concerts',
    'Happy Hour',
  ];

  const ratings = [1, 2, 3, 4, 5];

  const toggleRating = (rating) => {
    if (rating === 'All') {
      if (selectedRatings.length === 5) {
        setSelectedRatings([]);
      } else {
        setSelectedRatings([1, 2, 3, 4, 5]);
      }
    } else {
      if (selectedRatings.includes(rating)) {
        setSelectedRatings(selectedRatings.filter(r => r !== rating));
      } else {
        setSelectedRatings([...selectedRatings, rating]);
      }
    }
  };

  const handleApply = () => {
    onApply && onApply({
      category: selectedCategory,
      ratings: selectedRatings,
      priceRange: selectedPriceRange,
    });
    onClose && onClose();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sort by */}
        <Text style={styles.sectionTitle}>Sort by</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>{selectedCategory}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCategory(category);
                  setShowDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedCategory === category && styles.dropdownItemTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Rating */}
        <Text style={styles.sectionTitle}>Rating</Text>
        <View style={styles.ratingContainer}>
          {ratings.map((rating) => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                selectedRatings.includes(rating) && styles.ratingButtonActive
              ]}
              onPress={() => toggleRating(rating)}
            >
              <Ionicons 
                name="star" 
                size={16} 
                color={selectedRatings.includes(rating) ? "#FFFFFF" : "#0077B6"} 
              />
              <Text style={[
                styles.ratingText,
                selectedRatings.includes(rating) && styles.ratingTextActive
              ]}>
                {rating}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.ratingButton,
              selectedRatings.length === 5 && styles.ratingButtonActive
            ]}
            onPress={() => toggleRating('All')}
          >
            <Text style={[
              styles.allText,
              selectedRatings.length === 5 && styles.allTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Price Range */}
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.priceRangeContainer}>
          <TouchableOpacity
            style={[
              styles.priceRangeButton,
              selectedPriceRange === '1-50' && styles.priceRangeButtonActive
            ]}
            onPress={() => setSelectedPriceRange('1-50')}
          >
            <Text style={[
  styles.priceRangeButtonText,
  selectedPriceRange === '1-50' && styles.priceRangeButtonTextActive
]}>
  €1-€50
</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.priceRangeButton,
              selectedPriceRange === '51-100' && styles.priceRangeButtonActive
            ]}
            onPress={() => setSelectedPriceRange('51-100')}
          >
            <Text style={[
            styles.priceRangeButtonText,
            selectedPriceRange === '51-100' && styles.priceRangeButtonTextActive
            ]}>
            €51-€100
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.priceRangeButton,
              selectedPriceRange === 'all' && styles.priceRangeButtonActive
            ]}
            onPress={() => setSelectedPriceRange('all')}
          >
            <View style={styles.allPricesContainer}>
              <Text style={[
                styles.priceRangeButtonText,
                selectedPriceRange === 'all' && styles.priceRangeButtonTextActive
              ]}>
                All Prices
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 24,
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 12,
    color: '#666',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#666',
  },
  dropdownItemTextActive: {
    color: '#0077B6',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0077B6',
    minWidth: 50,
    justifyContent: 'center',
  },
  ratingButtonActive: {
    backgroundColor: '#0077B6',
  },
  ratingText: {
    fontSize: 9,
    color: '#0077B6',
    fontWeight: '500',
  },
  ratingTextActive: {
    color: '#FFFFFF',
  },
  allText: {
    fontSize: 9,
    color: '#0077B6',
    fontWeight: '500',
  },
  allTextActive: {
    color: '#FFFFFF',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  priceRangeButton: {
    minWidth: 100,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0077B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRangeButtonActive: {
    backgroundColor: '#0077B6',
  },
  priceRangeButtonText: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '600',
  },
  priceRangeButtonSubText: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '600',
    marginTop: 2,
  },
  priceRangeButtonTextActive: {
    color: '#FFFFFF',
  },
  allPricesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
    marginBottom: 40,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0077B6',
  },
  cancelButtonText: {
    color: '#0077B6',
    fontSize: 12,
    fontWeight: 'bold',
  },
});