import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // TODO: Implement Supabase auth
    Alert.alert('Coming Soon', 'Email sign in will be available soon!');
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    Alert.alert('Coming Soon', 'Facebook login will be available soon!');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    Alert.alert('Coming Soon', 'Google login will be available soon!');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    Alert.alert('Coming Soon', 'Apple login will be available soon!');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../assets/backgrounds/BG2.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('splash')}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* White Card Container */}
        <View style={styles.card}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Username)</Text>
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

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} onPress={() => onNavigate('forgotpassword')}>
            <Text style={styles.forgotPasswordText}>Forgot password</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleEmailSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Don't have an account */}
        <View style={styles.signUpSection}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => onNavigate('signup')}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or Continue With</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={28} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Ionicons name="logo-facebook" size={28} color="#1877F2" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '600',
  },
  signInButton: {
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
  signInButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 11,
    color: '#333',
  },
  signUpLink: {
    fontSize: 11,
    color: '#0077B6',
    fontWeight: '700',
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
