import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import { signUpWithEmail } from '../services/authService';

export default function SignUpScreen({ onNavigate }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('TH');
  const [callingCode, setCallingCode] = useState('66');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Add +callingCode prefix to phone number
    const fullPhoneNumber = '+' + callingCode + phoneNumber;

    // Call Supabase Sign Up
    const result = await signUpWithEmail(email, password, firstName, lastName, fullPhoneNumber);
    
    if (result.success) {
      Alert.alert('Success', 'Account created successfully! Please sign in.', [
        { text: 'OK', onPress: () => onNavigate('signin') }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleFacebookSignUp = () => {
    Alert.alert('Coming Soon', 'Facebook sign up will be available soon!');
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Coming Soon', 'Google sign up will be available soon!');
  };

  const handleAppleSignUp = () => {
    Alert.alert('Coming Soon', 'Apple sign up will be available soon!');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG2.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('signin')}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Sign up</Text>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone number</Text>
            <View style={styles.phoneInputContainer}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                withEmoji
                onSelect={(country) => {
                  setCountryCode(country.cca2);
                  setCallingCode(country.callingCode[0]);
                }}
                containerButtonStyle={styles.countryPickerButton}
              />
              <Text style={styles.phonePrefix}>+{callingCode}</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder=""
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="........"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
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
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="........"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
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
            style={styles.checkboxContainer}
            onPress={() => setRememberPassword(!rememberPassword)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberPassword && styles.checkboxChecked]}>
              {rememberPassword && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Remember Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleSignUp}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or Continue With</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
            <Ionicons name="logo-google" size={28} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignUp}>
            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignUp}>
            <Ionicons name="logo-apple" size={28} color="#000000" />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  card: {
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
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 12,
    color: '#000',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 12,
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  countryPickerButton: {
    marginRight: 8,
  },
  phonePrefix: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0077B6',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 12,
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#0077B6',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#999',
  },
  dividerText: {
    fontSize: 11,
    color: '#666',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
