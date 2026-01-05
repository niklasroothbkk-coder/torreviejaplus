import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActionSheetIOS, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUser } from '../services/authService';
import { supabase } from '../config/supabaseClient';
import CustomAlert from '../components/CustomAlert';

export default function VenueProfileScreen({ onNavigate, onOpenMenu }) {
  const [venueName, setVenueName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageRefresh, setImageRefresh] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [venueData, setVenueData] = useState(null);

  useEffect(() => {
    loadVenueProfile();
  }, []);

  const loadVenueProfile = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
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
          const venueImage = (venueInfo.images && venueInfo.images.length > 0) 
            ? venueInfo.images[0] 
            : venueInfo.image_url;
          setProfileImage(venueImage || null);
        }
      } else {
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
      
      const fileName = `venue_${venueData.id}_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('venue-images')
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

      const { data: urlData } = supabase.storage
        .from('venue-images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      const currentImages = venueData.images || [];
      const updatedImages = [imageUrl, ...currentImages].slice(0, 6);

      const { error: updateError } = await supabase
        .from('venues')
        .update({ images: updatedImages })
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
        {/* Header utan titel */}
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={24} color="#0077B6" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Venue Name</Text>
              <Text style={styles.infoValue}>{venueName || 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#0077B6" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email || 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={24} color="#0077B6" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{phone || 'Not set'}</Text>
            </View>
          </View>
        </View>

        {venueData && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Venue Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={24} color="#0077B6" />
                <Text style={styles.statNumber}>12,898</Text>
                <Text style={styles.statLabel}>Venue Views</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="star" size={24} color="#0077B6" />
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        )}
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
    paddingHorizontal: 24,
    paddingBottom: 150,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
});
