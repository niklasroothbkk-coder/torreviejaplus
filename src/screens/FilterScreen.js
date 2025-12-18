import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FilterScreen({ onClose, onApply }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPubTypes, setSelectedPubTypes] = useState([]); // Changed to array for multiple selection
  const [selectedSpaType, setSelectedSpaType] = useState('All');
  const [selectedSportType, setSelectedSportType] = useState('All');
  const [selectedAttractionType, setSelectedAttractionType] = useState('All');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCuisineDropdown, setShowCuisineDropdown] = useState(false);
  const [showPubTypeDropdown, setShowPubTypeDropdown] = useState(false);
  const [showSpaTypeDropdown, setShowSpaTypeDropdown] = useState(false);
  const [showSportTypeDropdown, setShowSportTypeDropdown] = useState(false);
  const [showAttractionTypeDropdown, setShowAttractionTypeDropdown] = useState(false);

  const categories = [
    'All',
    'Restaurants',
    'Sports Bars & Pubs',
    'Massage & Spa',
    'Sports Activities',
    'Markets & Attractions',
  ];

  const cuisines = [
    'All',
    'Thai',
    'Burger',
    'Chinese',
    'French',
    'Indian',
    'International',
    'Mediterranean',
    'Mexican',
    'Pizza & Pasta',
    'Spanish',
    'Steak',
    'Swedish',
  ];

  const pubTypes = [
    'English Pub',
    'Irish Pub',
    'Sportbar',
    'Live Band',
    'Serve Food',
  ];

  const spaTypes = [
    'All',
    'Massage',
    'Spa',
  ];

  const sportTypes = [
    'All',
    'Golf',
    'Padel',
    'Tennis',
    'Watersports',
  ];

  const attractionTypes = [
    'All',
    'Beaches',
    'Culture',
    'Markets',
    'Shopping',
    'Tours',
  ];

  const prices = ['€', '€€', '€€€'];

  const togglePrice = (price) => {
    if (selectedPrices.includes(price)) {
      setSelectedPrices(selectedPrices.filter(p => p !== price));
    } else {
      setSelectedPrices([...selectedPrices, price]);
    }
  };

  // Toggle pub type selection (multiple selection)
  const togglePubType = (pubType) => {
    if (selectedPubTypes.includes(pubType)) {
      setSelectedPubTypes(selectedPubTypes.filter(p => p !== pubType));
    } else {
      setSelectedPubTypes([...selectedPubTypes, pubType]);
    }
  };

  const handleApply = () => {
    onApply && onApply({
      category: selectedCategory,
      cuisine: selectedCategory === 'Restaurants' ? selectedCuisine : null,
      pubTypes: selectedCategory === 'Sports Bars & Pubs' ? selectedPubTypes : [],
      spaType: selectedCategory === 'Massage & Spa' ? selectedSpaType : null,
      sportType: selectedCategory === 'Sports Activities' ? selectedSportType : null,
      attractionType: selectedCategory === 'Markets & Attractions' ? selectedAttractionType : null,
      prices: selectedPrices,
    });
    onClose && onClose();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowDropdown(false);
    // Reset sub-categories when changing category
    if (category !== 'Restaurants') {
      setSelectedCuisine('All');
    }
    if (category !== 'Sports Bars & Pubs') {
      setSelectedPubTypes([]);
    }
    if (category !== 'Massage & Spa') {
      setSelectedSpaType('All');
    }
    if (category !== 'Sports Activities') {
      setSelectedSportType('All');
    }
    if (category !== 'Markets & Attractions') {
      setSelectedAttractionType('All');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
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
                onPress={() => handleCategoryChange(category)}
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

        {/* Cuisine Filter - Only show when Restaurants is selected */}
        {selectedCategory === 'Restaurants' && (
          <>
            <Text style={styles.sectionTitle}>Cuisine</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowCuisineDropdown(!showCuisineDropdown)}
            >
              <Text style={styles.dropdownText}>{selectedCuisine}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Cuisine Dropdown Menu */}
            {showCuisineDropdown && (
              <View style={styles.dropdownMenu}>
                {cuisines.map((cuisine, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCuisine(cuisine);
                      setShowCuisineDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedCuisine === cuisine && styles.dropdownItemTextActive
                    ]}>
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Pub Type Filter - Only show when Sports Bars & Pubs is selected - MULTIPLE SELECTION */}
        {selectedCategory === 'Sports Bars & Pubs' && (
          <>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.multiSelectContainer}>
              {pubTypes.map((pubType, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.multiSelectButton,
                    selectedPubTypes.includes(pubType) && styles.multiSelectButtonActive
                  ]}
                  onPress={() => togglePubType(pubType)}
                >
                  <Text style={[
                    styles.multiSelectText,
                    selectedPubTypes.includes(pubType) && styles.multiSelectTextActive
                  ]}>
                    {pubType}
                  </Text>
              
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Spa Type Filter - Only show when Massage & Spa is selected */}
        {selectedCategory === 'Massage & Spa' && (
          <>
            <Text style={styles.sectionTitle}>Type</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowSpaTypeDropdown(!showSpaTypeDropdown)}
            >
              <Text style={styles.dropdownText}>{selectedSpaType}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Spa Type Dropdown Menu */}
            {showSpaTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {spaTypes.map((spaType, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedSpaType(spaType);
                      setShowSpaTypeDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedSpaType === spaType && styles.dropdownItemTextActive
                    ]}>
                      {spaType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Sport Type Filter - Only show when Sports Activities is selected */}
        {selectedCategory === 'Sports Activities' && (
          <>
            <Text style={styles.sectionTitle}>Sport Type</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowSportTypeDropdown(!showSportTypeDropdown)}
            >
              <Text style={styles.dropdownText}>{selectedSportType}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Sport Type Dropdown Menu */}
            {showSportTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {sportTypes.map((sportType, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedSportType(sportType);
                      setShowSportTypeDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedSportType === sportType && styles.dropdownItemTextActive
                    ]}>
                      {sportType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Attraction Type Filter - Only show when Markets & Attractions is selected */}
        {selectedCategory === 'Markets & Attractions' && (
          <>
            <Text style={styles.sectionTitle}>Attraction Type</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => setShowAttractionTypeDropdown(!showAttractionTypeDropdown)}
            >
              <Text style={styles.dropdownText}>{selectedAttractionType}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Attraction Type Dropdown Menu */}
            {showAttractionTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {attractionTypes.map((attractionType, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedAttractionType(attractionType);
                      setShowAttractionTypeDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedAttractionType === attractionType && styles.dropdownItemTextActive
                    ]}>
                      {attractionType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Price Level */}
        <Text style={styles.sectionTitle}>Price Level</Text>
        <View style={styles.priceContainer}>
          <TouchableOpacity
            style={[
              styles.priceButton,
              selectedPrices.length === 0 && styles.priceButtonActive
            ]}
            onPress={() => setSelectedPrices([])}
          >
            <Text style={[
              styles.priceText,
              selectedPrices.length === 0 && styles.priceTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {prices.map((price) => (
            <TouchableOpacity
              key={price}
              style={[
                styles.priceButton,
                selectedPrices.includes(price) && styles.priceButtonActive
              ]}
              onPress={() => togglePrice(price)}
            >
              <Text style={[
                styles.priceText,
                selectedPrices.includes(price) && styles.priceTextActive
              ]}>
                {price}
              </Text>
            </TouchableOpacity>
          ))}
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
  scrollContentContainer: {
    paddingTop: 70,
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
  // NEW: Multiple selection styles for pub types
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  multiSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0077B6',
  },
  multiSelectButtonActive: {
    backgroundColor: '#0077B6',
  },
  multiSelectText: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '500',
  },
  multiSelectTextActive: {
    color: '#FFFFFF',
  },
  checkIcon: {
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  priceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0077B6',
    minWidth: 60,
    justifyContent: 'center',
  },
  priceButtonActive: {
    backgroundColor: '#0077B6',
  },
  priceText: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '500',
  },
  priceTextActive: {
    color: '#FFFFFF',
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