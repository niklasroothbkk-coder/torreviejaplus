import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AllDoneScreen({ onNavigate }) {
  const handleContinue = () => {
    // Navigate back to Sign In screen
    onNavigate('signin');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG2.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="thumbs-up" size={64} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Reset Successfully!</Text>
        
        <Text style={styles.message}>
          Your password has been reset successfully.{'\n'}
          You can now log in again.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  continueButton: {
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
  continueButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});