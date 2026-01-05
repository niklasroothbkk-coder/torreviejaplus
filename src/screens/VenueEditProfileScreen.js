import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser } from '../services/authService';
import { supabase } from '../config/supabaseClient';
import CustomAlert from '../components/CustomAlert';

export default function VenueEditProfileScreen({ onNavigate, onOpenMenu }) {
  const [user, setUser] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVenueProfile();
  }, []);

  const loadVenueProfile = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      setUser(result.user);
      setEmail(result.user.email || '');
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, user_type, venue_id')
        .eq('id', result.user.id)
        .single();
      
      if (profileData && profileData.venue_id) {
        const { data: venueInfo } = await supabase
          .from('venues')
          .select('*')
          .eq('id', profileData.venue_id)
          .single();
        
        if (venueInfo) {
          setVenueData(venueInfo);
          setVenueName(venueInfo.name || '');
          setPhone(venueInfo.phone || '');
        }
      } else {
        setVenueName(profileData?.name || 'Venue');
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!venueData) {
        setAlertTitle('Error');
        setAlertMessage('No venue data found');
        setShowAlert(true);
        return;
      }

      if (!venueName.trim()) {
        setAlertTitle('Error');
        setAlertMessage('Venue name cannot be empty');
        setShowAlert(true);
        return;
      }

      setLoading(true);

      const { error } = await supabase
        .from('venues')
        .update({
          name: venueName.trim(),
          phone: phone.trim(),
        })
        .eq('id', venueData.id);

      if (error) throw error;

      setAlertTitle('Success');
      setAlertMessage('Venue profile updated successfully!');
      setShowAlert(true);
      
      setTimeout(() => {
        onNavigate('venuesettings');
      }, 1500);
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage('Failed to update profile: ' + error.message);
      setShowAlert(true);
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
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('venuesettings')}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue Name *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter venue name"
                placeholderTextColor="#999"
                value={venueName}
                onChangeText={setVenueName}
                autoCapitalize="words"
              />
              <Ionicons name="business-outline" size={20} color="#999" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                placeholder="Enter email"
                placeholderTextColor="#999"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
            </View>
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter phone"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => onNavigate('venuesettings')}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
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
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 45,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    color: '#999',
    backgroundColor: '#F8F8F8',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
});
