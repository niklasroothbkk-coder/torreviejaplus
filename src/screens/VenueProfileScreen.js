import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, updatePassword, signOut } from '../services/authService';
import { supabase } from '../config/supabaseClient';
import CustomAlert from '../components/CustomAlert';

export default function VenueProfileScreen({ onNavigate, onOpenMenu }) {
  const [user, setUser] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageRefresh, setImageRefresh] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [venueData, setVenueData] = useState(null);

  useEffect(() => {
    loadVenueProfile();
  }, []);

  const loadVenueProfile = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      setUser(result.user);
      setEmail(result.user.email || '');
      
      // Fetch profile and venue data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, user_type, venue_id')
        .eq('id', result.user.id)
        .single();
      
      if (profileData && profileData.venue_id) {
        // Fetch venue information
        const { data: venueInfo, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', profileData.venue_id)
          .single();
        
        if (venueInfo) {
          setVenueData(venueInfo);
          setVenueName(venueInfo.name || '');
          setPhone(venueInfo.phone || '');
          setProfileImage(venueInfo.image_url || null);
        }
      } else {
        // Fallback if no venue_id
        setVenueName(profileData?.name || 'Venue');
      }
    }
  };

  const handleImagePicker = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await takePhoto();
          } else if (buttonIndex === 2) {
            await pickImage();
          }
        }
      );
    } else {
      Alert.alert(
        'Venue Photo',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImage },
        ]
      );
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setAlertTitle('Permission Required');
      setAlertMessage('Camera permission is required to take photos.');
      setShowAlert(true);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadVenueImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setAlertTitle('Permission Required');
      setAlertMessage('Photo library permission is required to choose photos.');
      setShowAlert(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadVenueImage(result.assets[0].uri);
    }
  };

  const uploadVenueImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
      
      // Upload to Supabase Storage
      const fileName = `venue_${venueData.id}_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('venues')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        setAlertTitle('Upload Failed');
        setAlertMessage('Failed to upload image: ' + error.message);
        setShowAlert(true);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('venues')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      console.log('✅ Venue image uploaded! URL:', imageUrl);

      // Update venue table with new image URL
      const { error: updateError } = await supabase
        .from('venues')
        .update({ image_url: imageUrl })
        .eq('id', venueData.id);

      if (updateError) {
        console.error('Update error:', updateError);
        setAlertTitle('Update Failed');
        setAlertMessage('Failed to update venue image: ' + updateError.message);
        setShowAlert(true);
        return;
      }

      setProfileImage(imageUrl);
      setImageRefresh(prev => prev + 1);
      await loadVenueProfile();
      
      setAlertTitle('Success');
      setAlertMessage('Venue photo updated successfully!');
      setShowAlert(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertTitle('Error');
      setAlertMessage('An error occurred: ' + error.message);
      setShowAlert(true);
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

      // Update venue information
      const { error } = await supabase
        .from('venues')
        .update({
          name: venueName,
          phone: phone,
        })
        .eq('id', venueData.id);

      if (error) throw error;

      setAlertTitle('Success');
      setAlertMessage('Venue profile updated successfully!');
      setShowAlert(true);
      await loadVenueProfile();
    } catch (error) {
      setAlertTitle('Error');
      setAlertMessage('Failed to update profile: ' + error.message);
      setShowAlert(true);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setAlertTitle('Error');
      setAlertMessage('Please enter and confirm your new password');
      setShowAlert(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertTitle('Error');
      setAlertMessage('Passwords do not match!');
      setShowAlert(true);
      return;
    }

    if (newPassword.length < 6) {
      setAlertTitle('Error');
      setAlertMessage('Password must be at least 6 characters');
      setShowAlert(true);
      return;
    }

    const result = await updatePassword(newPassword);
    if (result.success) {
      setAlertTitle('Success');
      setAlertMessage('Password changed successfully!');
      setShowAlert(true);
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } else {
      setAlertTitle('Error');
      setAlertMessage(result.error);
      setShowAlert(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG_NEW.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Hamburger Menu Button */}
      <TouchableOpacity 
        style={styles.menuButtonWrapper}
        onPress={onOpenMenu}
      >
        <View style={styles.menuButtonContainer}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Venue Profile</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.avatarImage}
                key={imageRefresh}
              />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="business" size={48} color="#0077B6" />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleImagePicker}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{venueName || 'Venue'}</Text>
          {venueData && (
            <View style={styles.venueTypeContainer}>
              <Ionicons name="bookmark" size={16} color="#FFFFFF" />
              <Text style={styles.venueTypeText}>{venueData.category || 'Venue'}</Text>
            </View>
          )}
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Venue Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                placeholder="Enter venue name"
                placeholderTextColor="#999"
                value={venueName}
                onChangeText={setVenueName}
                autoCapitalize="words"
                editable={isEditing}
              />
              <Ionicons name="business-outline" size={20} color="#999" style={styles.inputIcon} />
            </View>
          </View>

          {/* Email Input (Read-only) */}
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
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                placeholder="Enter phone"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={isEditing}
              />
              <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
            </View>
          </View>

          {/* Edit/Save Button */}
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={() => {
                handleUpdateProfile();
                setIsEditing(false);
              }}
            >
              <Text style={styles.updateButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          {/* Change Password Button */}
          {!showChangePassword && (
            <TouchableOpacity 
              style={styles.changePasswordButton} 
              onPress={() => setShowChangePassword(true)}
            >
              <Text style={styles.changePasswordButtonText}>Change Password</Text>
            </TouchableOpacity>
          )}

          {/* Change Password Section */}
          {showChangePassword && (
            <View style={styles.passwordSection}>
              <Text style={styles.passwordSectionTitle}>Change Password</Text>
              
              {/* New Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password (min 6 characters)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#999"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={styles.inputIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Must match the password above"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={styles.inputIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Buttons */}
              <View style={styles.passwordButtonContainer}>
                <TouchableOpacity 
                  style={styles.savePasswordButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.savePasswordButtonText}>Save Password</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelPasswordButton}
                  onPress={() => {
                    setShowChangePassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  <Text style={styles.cancelPasswordButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Venue Statistics Card */}
        {venueData && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Venue Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="pricetag" size={24} color="#0077B6" />
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Active Deals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={24} color="#0077B6" />
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Upcoming Events</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation - Venue specific */}
      <View style={styles.bottomNav}>
        {/* Profile (Active) */}
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <View style={styles.activeNavButton}>
            <Ionicons name="person" size={20} color="#0077B6" />
            <Text style={styles.activeNavText}>Profile</Text>
          </View>
        </TouchableOpacity>

        {/* New Deals & Events */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('venueManage')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 65,
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
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  venueTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 119, 182, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  venueTypeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
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
  },
  inputDisabled: {
    color: '#999',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  editButton: {
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
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changePasswordButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  passwordSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  passwordSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  passwordButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  savePasswordButton: {
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
  savePasswordButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelPasswordButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelPasswordButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  updateButton: {
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
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077B6',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#0077B6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navButtonActive: {
  },
  activeNavButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  activeNavText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0077B6',
  },
});
