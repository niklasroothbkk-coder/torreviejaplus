import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DealsFilterScreen({ onClose, onApply }) {
  const [selectedCategory, setSelectedCategory] = useState('Happy Hour');
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = [
    'Happy Hour',
    'Watersport Deals',
    'Restaurant Deals',
    'Sport Deals',
    'Tour Deals',
    'Pub & Bar Deals',
  ];

  const prices = ['€', '€€', '€€€'];

  const togglePrice = (price) => {
    if (selectedPrices.includes(price)) {
      setSelectedPrices(selectedPrices.filter(p => p !== price));
    } else {
      setSelectedPrices([...selectedPrices, price]);
    }
  };

  const handleApply = () => {
    onApply && onApply({
      category: selectedCategory,
      prices: selectedPrices,
    });
    onClose && onClose();
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