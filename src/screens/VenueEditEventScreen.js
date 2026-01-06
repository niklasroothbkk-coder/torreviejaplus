import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function VenueEditEventScreen({ onNavigate, onOpenMenu, route }) {
  const { event, reactivate } = route?.params || {};
  
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState('20:00');
  const [endTime, setEndTime] = useState('23:00');
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatDays, setRepeatDays] = useState([]);
  const [repeatWeeks, setRepeatWeeks] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [venueId, setVenueId] = useState(null);
  const [venuePhone, setVenuePhone] = useState(null);
  const [venueWebsite, setVenueWebsite] = useState(null);

  const categories = ['Concerts & Festivals', 'Sports Events', 'Markets & Attractions', 'Tours & Trips', 'Other Events'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadVenueData();
    if (event) loadEventData();
  }, []);

  const loadEventData = () => {
    setEventName(event.name || '');
    setCategory(event.category || '');
    setDescription(event.description || '');
    setPrice(event.price || '');
    setStartTime(event.start_time ? event.start_time.slice(0, 5) : '20:00');
    setEndTime(event.end_time ? event.end_time.slice(0, 5) : '23:00');
    setIsRepeat(event.is_recurring || false);
    setExistingImageUrl(event.image_url || null);
    if (event.recurring_day) setRepeatDays(event.recurring_day.split(',').map(d => d.trim()));
    if (event.recurring_weeks) setRepeatWeeks(event.recurring_weeks.toString());
    if (!reactivate && event.event_date) setEventDate(new Date(event.event_date));
  };

  const loadVenueData = async () => {
    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        const { data: profileData } = await supabase.from('profiles').select('venue_id').eq('id', result.user.id).single();
        if (profileData?.venue_id) {
          setVenueId(profileData.venue_id);
          const { data: venueData } = await supabase.from('venues').select('phone, website').eq('id', profileData.venue_id).single();
          if (venueData) {
            setVenuePhone(venueData.phone);
            setVenueWebsite(venueData.website);
          }
        }
      }
    } catch (error) {
      console.error('Error loading venue data:', error);
    }
  };

  const toggleDay = (day) => {
    if (repeatDays.includes(day)) setRepeatDays(repeatDays.filter(d => d !== day));
    else setRepeatDays([...repeatDays, day]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Required', 'Photo library permission is required'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled) { setEventImage(result.assets[0].uri); setExistingImageUrl(null); }
  };

  const uploadImage = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
    const fileName = `event_${venueId}_${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('venue-images').upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('venue-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const onDateChange = (e, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setEventDate(selectedDate);
  };

  const formatDate = (date) => date.toISOString().split('T')[0];
  const formatDisplayDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTimeInput = (value) => {
    let cleaned = value.replace(/[^0-9:]/g, '');
    if (!cleaned.includes(':')) {
      if (cleaned.length === 1) return `0${cleaned}:00`;
      if (cleaned.length === 2) return `${cleaned}:00`;
      if (cleaned.length === 3) return `0${cleaned[0]}:${cleaned.slice(1)}`;
      if (cleaned.length === 4) return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }
    if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      let hours = parts[0].padStart(2, '0');
      let minutes = (parts[1] || '00').padStart(2, '0').slice(0, 2);
      if (parseInt(hours) > 23) hours = '23';
      if (parseInt(minutes) > 59) minutes = '59';
      return `${hours}:${minutes}`;
    }
    return cleaned;
  };

  const handleStartTimeBlur = () => { if (startTime) setStartTime(formatTimeInput(startTime)); };
  const handleEndTimeBlur = () => { if (endTime) setEndTime(formatTimeInput(endTime)); };

  const handleSubmit = async () => {
    if (!eventName.trim()) { Alert.alert('Error', 'Please enter an event name'); return; }
    if (!category) { Alert.alert('Error', 'Please select a category'); return; }
    if (!description.trim()) { Alert.alert('Error', 'Please enter a description'); return; }
    if (!venueId) { Alert.alert('Error', 'Venue not found'); return; }

    setLoading(true);
    try {
      let imageUrl = existingImageUrl;
      if (eventImage) imageUrl = await uploadImage(eventImage);

      const eventDateStr = formatDate(eventDate);
      let calculatedEndDate = eventDateStr;
      if (isRepeat && repeatWeeks) {
        const endDate = new Date(eventDate);
        endDate.setDate(endDate.getDate() + (parseInt(repeatWeeks) * 7));
        calculatedEndDate = endDate.toISOString().split('T')[0];
      }

      const eventData = {
        name: eventName.trim(), category, description: description.trim(),
        phone: venuePhone || null, website: venueWebsite || null,
        event_date: eventDateStr, end_date: calculatedEndDate,
        start_time: startTime || null, end_time: endTime || null,
        is_recurring: isRepeat,
        recurring_day: (isRepeat && repeatDays.length > 0) ? repeatDays.join(',') : null,
        recurring_weeks: (isRepeat && repeatWeeks) ? parseInt(repeatWeeks) : null,
        price: price.trim() || 'Free', image_url: imageUrl, active: true,
      };

      const { error } = await supabase.from('events').update(eventData).eq('id', event.id);
      if (error) throw error;

      Alert.alert('Success', reactivate ? 'Event reactivated!' : 'Event updated!', [{ text: 'OK', onPress: () => onNavigate('venueViewEvents') }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/backgrounds/BG_NEW.png')} style={styles.backgroundImage} resizeMode="cover" />
      <TouchableOpacity style={styles.menuButtonWrapper} onPress={onOpenMenu}>
        <View style={styles.menuButtonContainer}><Ionicons name="menu" size={32} color="#FFFFFF" /></View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('venueViewEvents')}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.header}><Text style={styles.headerTitle}>{reactivate ? 'Reactivate Event' : 'Edit Event'}</Text></View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {reactivate && (
            <View style={styles.reactivateNotice}>
              <Ionicons name="information-circle" size={24} color="#0077B6" />
              <Text style={styles.reactivateText}>Set a new start date to reactivate this event</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Name *</Text>
            <TextInput style={styles.input} placeholder="e.g., Live Music Night" placeholderTextColor="#999" value={eventName} onChangeText={setEventName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.categoryButton, category === cat && styles.categoryButtonActive]} onPress={() => setCategory(cat)}>
                  <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your event..." placeholderTextColor="#999" value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📅 Event Schedule Start Day *</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(!showDatePicker)}>
              <Ionicons name="calendar-outline" size={24} color="#0077B6" />
              <Text style={styles.datePickerText}>{formatDisplayDate(eventDate)}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={eventDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} minimumDate={new Date()} />}
            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.subLabel}>Start Time</Text>
                <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor="#999" value={startTime} onChangeText={setStartTime} onBlur={handleStartTimeBlur} keyboardType="numeric" />
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.subLabel}>End Time</Text>
                <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor="#999" value={endTime} onChangeText={setEndTime} onBlur={handleEndTimeBlur} keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsRepeat(!isRepeat)}>
              <View style={[styles.checkbox, isRepeat && styles.checkboxChecked]}>{isRepeat && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}</View>
              <Text style={styles.checkboxLabel}>🔁 Repeat</Text>
            </TouchableOpacity>
          </View>

          {isRepeat && (
            <View style={styles.repeatSection}>
              <Text style={styles.label}>Repeat on:</Text>
              <View style={styles.daysGrid}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity key={day} style={[styles.dayButton, repeatDays.includes(day) && styles.dayButtonActive]} onPress={() => toggleDay(day)}>
                    <Text style={[styles.dayButtonText, repeatDays.includes(day) && styles.dayButtonTextActive]}>{day.substring(0, 3)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of weeks</Text>
                <TextInput style={styles.input} placeholder="e.g., 4" placeholderTextColor="#999" value={repeatWeeks} onChangeText={setRepeatWeeks} keyboardType="number-pad" />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📸 Event Image (Max 1)</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="#0077B6" />
              <Text style={styles.imageButtonText}>Choose Image</Text>
            </TouchableOpacity>
            {(eventImage || existingImageUrl) && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: eventImage || existingImageUrl }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => { setEventImage(null); setExistingImageUrl(null); }}>
                  <Ionicons name="close-circle" size={24} color="#d12028" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (optional)</Text>
            <TextInput style={styles.input} placeholder="e.g. 15 Euro, €15" placeholderTextColor="#999" value={price} onChangeText={setPrice} />
          </View>

          <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={loading}>
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>{loading ? 'Saving...' : (reactivate ? 'Reactivate Event' : 'Save Changes')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => onNavigate('venueViewEvents')} disabled={loading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  menuButtonWrapper: { position: 'absolute', top: 65, left: 20, zIndex: 1000 },
  menuButtonContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0077B6', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  backButton: { position: 'absolute', top: 65, right: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#0077B6', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5, zIndex: 1000 },
  header: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 100, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  reactivateNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 12, borderRadius: 12, marginBottom: 20, gap: 10 },
  reactivateText: { flex: 1, fontSize: 14, color: '#0077B6' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  subLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 6 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#E0E0E0' },
  textArea: { minHeight: 100, paddingTop: 16 },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryButton: { backgroundColor: '#F5F5F5', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  categoryButtonActive: { backgroundColor: '#0077B6', borderColor: '#0077B6' },
  categoryButtonText: { fontSize: 14, color: '#333' },
  categoryButtonTextActive: { color: '#FFFFFF', fontWeight: '600' },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E0E0E0', gap: 12 },
  datePickerText: { flex: 1, fontSize: 16, color: '#333' },
  timeRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  timeItem: { flex: 1 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#E0E0E0', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#0077B6', borderColor: '#0077B6' },
  checkboxLabel: { fontSize: 16, color: '#333' },
  repeatSection: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, marginBottom: 20 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 15 },
  dayButton: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', minWidth: 70, alignItems: 'center' },
  dayButtonActive: { backgroundColor: '#0077B6', borderColor: '#0077B6' },
  dayButtonText: { fontSize: 14, color: '#333' },
  dayButtonTextActive: { color: '#FFFFFF', fontWeight: '600' },
  imageButton: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  imageButtonText: { fontSize: 16, color: '#0077B6', fontWeight: '600' },
  imagePreview: { marginTop: 12, position: 'relative' },
  previewImage: { width: '100%', height: 200, borderRadius: 12 },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFFFFF', borderRadius: 12 },
  submitButton: { backgroundColor: '#0077B6', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 },
  submitButtonDisabled: { backgroundColor: '#999' },
  submitButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  cancelButton: { backgroundColor: 'transparent', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
});
