import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CreateEventScreen() {
  const [contentType, setContentType] = useState('event'); // 'event' or 'deal'
  const [eventName, setEventName] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [price, setPrice] = useState('');
  const [isRecurring, setIsRecurring] = useState('No');
  const [recurringDays, setRecurringDays] = useState('');
  const [needsBooking, setNeedsBooking] = useState('No');

  const handleUploadImage = () => {
    Alert.alert(
      'Image Upload',
      'Image upload coming soon! This feature requires expo-image-picker.',
      [{ text: 'OK' }]
    );
    console.log('Upload image clicked');
  };

  const validatePhone = (phone) => {
    const re = /^[\d\s\+\-\(\)]{8,}$/;
    return re.test(phone);
  };

  const handleSaveEvent = () => {
    // Validation
    if (!eventName.trim()) {
      Alert.alert('Error', `${contentType === 'event' ? 'Event' : 'Deal'} name is required`);
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Content is required');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    if (!timeFrom.trim()) {
      Alert.alert('Error', 'Start time is required');
      return;
    }

    if (!timeTo.trim()) {
      Alert.alert('Error', 'End time is required');
      return;
    }

    if (!phoneNumber.trim() || !validatePhone(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Error', 'Price is required');
      return;
    }

    if (isRecurring === 'Yes' && !recurringDays.trim()) {
      Alert.alert('Error', 'Please specify which days the event recurs');
      return;
    }

    // Create event/deal data
    const eventData = {
      contentType,
      eventName,
      content,
      location,
      timeFrom,
      timeTo,
      phoneNumber,
      price,
      isRecurring,
      recurringDays: isRecurring === 'Yes' ? recurringDays : null,
      needsBooking,
      timestamp: new Date().toISOString(),
    };

    console.log(`=== SAVING ${contentType.toUpperCase()} ===`);
    console.log(JSON.stringify(eventData, null, 2));
    console.log('====================');

    Alert.alert(
      'Success! ✅',
      `${contentType === 'event' ? 'Event' : 'Deal'} "${eventName}" has been created!\n\nLocation: ${location}\nTime: ${timeFrom} - ${timeTo}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setEventName('');
            setContent('');
            setLocation('');
            setTimeFrom('');
            setTimeTo('');
            setPhoneNumber('');
            setPrice('');
            setIsRecurring('No');
            setRecurringDays('');
            setNeedsBooking('No');
            console.log('Form cleared');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>You must be registered as a company to use this service.</Text>
        </View>

        {/* Event/Deal Type Selection */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              contentType === 'event' && styles.typeButtonActive,
            ]}
            onPress={() => setContentType('event')}
          >
            <Text
              style={[
                styles.typeText,
                contentType === 'event' && styles.typeTextActive,
              ]}
            >
              Event
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              contentType === 'deal' && styles.typeButtonActive,
            ]}
            onPress={() => setContentType('deal')}
          >
            <Text
              style={[
                styles.typeText,
                contentType === 'deal' && styles.typeTextActive,
              ]}
            >
              Deal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {/* Event/Deal name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{contentType === 'event' ? 'Event' : 'Deal'} name *</Text>
            <TextInput
              style={styles.input}
              value={eventName}
              onChangeText={setEventName}
              placeholder={contentType === 'event' ? "E.g. Live music on Fridays" : "E.g. Happy Hour 2-for-1"}
              placeholderTextColor="#999"
            />
          </View>

          {/* Content */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder={contentType === 'event' ? "Describe the event..." : "Describe the deal..."}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Address or location name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Time (from and to) */}
          <View style={styles.rowInputGroup}>
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>From (time) *</Text>
              <TextInput
                style={styles.input}
                value={timeFrom}
                onChangeText={setTimeFrom}
                placeholder="18:00"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>To (time) *</Text>
              <TextInput
                style={styles.input}
                value={timeTo}
                onChangeText={setTimeTo}
                placeholder="22:00"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Phone number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone number *</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+34 123 456 789"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="E.g. Free, 10€, 50€"
              placeholderTextColor="#999"
            />
          </View>

          {/* Image upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image *</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
              <Text style={styles.uploadButtonText}>UPLOAD IMAGE</Text>
            </TouchableOpacity>
          </View>

          {/* Recurring event */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Should the {contentType === 'event' ? 'event' : 'deal'} be recurring? *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={isRecurring}
                onValueChange={(itemValue) => setIsRecurring(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="No" value="No" />
                <Picker.Item label="Yes" value="Yes" />
              </Picker>
            </View>
          </View>

          {/* Which days (shows only if Yes) */}
          {isRecurring === 'Yes' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Which days? *</Text>
              <TextInput
                style={styles.input}
                value={recurringDays}
                onChangeText={setRecurringDays}
                placeholder="E.g. Monday, Wednesday, Friday"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {/* Needs booking */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Requires booking? *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={needsBooking}
                onValueChange={(itemValue) => setNeedsBooking(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="No" value="No" />
                <Picker.Item label="Yes" value="Yes" />
              </Picker>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
            <Text style={styles.saveButtonText}>CREATE {contentType === 'event' ? 'EVENT' : 'DEAL'}</Text>
          </TouchableOpacity>

          <Text style={styles.footnote}>* = Required fields</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#21bad9',
    marginHorizontal: 20,
    marginTop: 80,
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1a9bb8',
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#d12028',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  typeTextActive: {
    color: '#fff',
  },
  formContainer: {
    padding: 20,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowInputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInputGroup: {
    width: '48%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#414141',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 13,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#21bad9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#d12028',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footnote: {
    fontSize: 12,
    color: '#414141',
    textAlign: 'center',
    marginTop: 10,
  },
});