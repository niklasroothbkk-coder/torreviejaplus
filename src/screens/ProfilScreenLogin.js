import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const ProfilScreenLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('visitor'); // 'visitor' or 'venue'
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleLogin = () => {
    // Login logic will come here later
    console.log('Login:', { username, password, userType, keepLoggedIn });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icons/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'visitor' && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType('visitor')}
          >
            <Text
              style={[
                styles.userTypeText,
                userType === 'visitor' && styles.userTypeTextActive,
              ]}
            >
              Visitor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'venue' && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType('venue')}
          >
            <Text
              style={[
                styles.userTypeText,
                userType === 'venue' && styles.userTypeTextActive,
              ]}
            >
              Venue/Company
            </Text>
          </TouchableOpacity>
        </View>

        {/* Username Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Keep Me Logged In Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setKeepLoggedIn(!keepLoggedIn)}
        >
          <View style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]}>
            {keepLoggedIn && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Keep me logged in</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#d12028',
  },
  userTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 18,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 11,
    color: '#333',
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#d12028',
    borderColor: '#d12028',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 11,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#d12028',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#d12028',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#d12028',
    fontSize: 11,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  signupText: {
    color: '#666',
    fontSize: 11,
  },
  signupLink: {
    color: '#d12028',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ProfilScreenLogin;