import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';
import * as ImagePicker from 'expo-image-picker';

export default function VenueCreateDealScreen({ onNavigate, onOpenMenu }) {
  const [dealName, setDealName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [dealDate, setDealDate] = useState('');
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('12:00');
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatWeeks, setRepeatWeeks] = useState('');
  const [dealImage, setDealImage] = useState(null);
  const [priceRange, setPriceRange] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [venueId, setVenueId] = useState(null);

  const categories = [
    'Happy Hours',
    'Watersport Deals',
    'Restaurant Deals',
    'Sport Deals',
    'Pub & Bar Deals',
    'Other Deals'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadVenueId();
  }, []);

  const loadVenueId = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('venue_id')
        .eq('id', result.user.id)
        .single();
      
      if (profileData && profileData.venue_id) {
        setVenueId(profileData.venue_id);
      }
    }
  };

  const toggleDay = (day) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setDealImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
      
      const fileName = `deal_${venueId}_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('venue-images')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('venue-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!dealName.trim()) {
      Alert.alert('Error', 'Please enter a deal name');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!dealDate) {
      Alert.alert('Error', 'Please enter a date (YYYY-MM-DD)');
      return;
    }
    if (!venueId) {
      Alert.alert('Error', 'Venue not found');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (dealImage) {
        imageUrl = await uploadImage(dealImage);
      }

      // Calculate end_date
      let calculatedEndDate;
      if (isRepeat && repeatWeeks) {
        const startDate = new Date(dealDate);
        calculatedEndDate = new Date(startDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + (parseInt(repeatWeeks) * 7));
        calculatedEndDate = calculatedEndDate.toISOString().split('T')[0];
      } else {
        calculatedEndDate = dealDate;
      }

      const dealData = {
        venue_id: venueId,
        name: dealName.trim(),
        category: category,
        description: description.trim(),
        phone: phone.trim() || null,
        deal_date: dealDate,
        end_date: calculatedEndDate,
        start_time: startTime || null,
        end_time: endTime || null,
        is_recurring: isRepeat,
        recurring_day: (isRepeat && repeatDays.length > 0) ? repeatDays.join(',') : null,
        recurring_weeks: (isRepeat && repeatWeeks) ? parseInt(repeatWeeks) : null,
        price: price.trim() || null,
        price_range: priceRange || null,
        image_url: imageUrl,
        views: 0,
        registered_date: new Date().toISOString().split('T')[0],
        active: true,
      };

      const { error } = await supabase
        .from('deals')
        .insert([dealData]);

      if (error) throw error;

      Alert.alert('Success', 'Deal created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            onNavigate('venuemanage');
          }
        }
      ]);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to create deal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Create New Deal</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          {/* Deal Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deal Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50% Off Happy Hour"
              placeholderTextColor="#999"
              value={dealName}
              onChangeText={setDealName}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Deal / Promotion Category *</Text>
            <View style={styles.pickerContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your deal..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Date & Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📅 Deal Schedule Start Day</Text>
            
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.subLabel}>Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                  value={dealDate}
                  onChangeText={setDealDate}
                />
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.subLabel}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.subLabel}>End Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>
          </View>

          {/* Repeat Checkbox */}
          <View style={styles.inputGroup}>
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => setIsRepeat(!isRepeat)}
            >
              <View style={[styles.checkbox, isRepeat && styles.checkboxChecked]}>
                {isRepeat && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>🔁 Repeat (show for entire month or specific days)</Text>
            </TouchableOpacity>
          </View>

          {/* Repeat Options */}
          {isRepeat && (
            <View style={styles.repeatSection}>
              <Text style={styles.label}>Repeat on:</Text>
              <View style={styles.daysGrid}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayButton, repeatDays.includes(day) && styles.dayButtonActive]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[styles.dayButtonText, repeatDays.includes(day) && styles.dayButtonTextActive]}>
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of weeks to repeat</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 4"
                  placeholderTextColor="#999"
                  value={repeatWeeks}
                  onChangeText={setRepeatWeeks}
                  keyboardType="number-pad"
                />
                <Text style={styles.helperText}>
                  📝 Example: Select Friday + Saturday with 4 weeks = 8 deals total
                </Text>
              </View>
            </View>
          )}

          {/* Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📸 Deal Image (Max 1)</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="#0077B6" />
              <Text style={styles.imageButtonText}>Choose Image</Text>
            </TouchableOpacity>
            {dealImage && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: dealImage }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setDealImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#d12028" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Price Range & Price */}
          <View style={styles.twoColumn}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Price Range</Text>
              <View style={styles.priceRangeButtons}>
                {['€', '€€', '€€€', '€€€€'].map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[styles.priceButton, priceRange === range && styles.priceButtonActive]}
                    onPress={() => setPriceRange(range)}
                  >
                    <Text style={[styles.priceButtonText, priceRange === range && styles.priceButtonTextActive]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., €15, Buy 1 Get 1, 50% off"
                placeholderTextColor="#999"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Deal...' : 'Create Deal'}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => onNavigate('venuemanage')}
            disabled={loading}
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  dateTimeItem: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  repeatSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  dayButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 70,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  imageButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  priceRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priceButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  priceButtonActive: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  priceButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  priceButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#0077B6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
