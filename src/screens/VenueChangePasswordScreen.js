import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updatePassword } from '../services/authService';
import CustomAlert from '../components/CustomAlert';

export default function VenueChangePasswordScreen({ onNavigate, onOpenMenu }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const result = await updatePassword(newPassword);
    
    setLoading(false);

    if (result.success) {
      setAlertTitle('Success');
      setAlertMessage('Password changed successfully!');
      setShowAlert(true);
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        onNavigate('venuesettings');
      }, 1500);
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
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter New Password</Text>
          <Text style={styles.cardSubtitle}>
            Password must be at least 6 characters long
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password *</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Re-enter new password"
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

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Updating...' : 'Update Password'}
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

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#0077B6" />
          <Text style={styles.infoText}>
            Make sure your password is secure and different from passwords you use on other websites.
          </Text>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
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
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0077B6',
    marginLeft: 12,
    lineHeight: 20,
  },
});
