import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VenuePrivacyScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/backgrounds/BG_NEW.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButtonWrapper}
        onPress={() => onNavigate('venuesettings')}
      >
        <View style={styles.backButtonContainer}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.sectionText}>
              TorreviejaPlus ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our mobile application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information that you provide directly to us:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Account information (email, password, business name)</Text>
              <Text style={styles.bulletItem}>• Venue details (address, phone, description, photos)</Text>
              <Text style={styles.bulletItem}>• Payment information for subscriptions</Text>
              <Text style={styles.bulletItem}>• Communications with our support team</Text>
            </View>
            <Text style={styles.sectionText}>
              We automatically collect certain information:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Device information (type, operating system)</Text>
              <Text style={styles.bulletItem}>• Usage data (features used, time spent)</Text>
              <Text style={styles.bulletItem}>• Log data (IP address, access times)</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              We use the information we collect to:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Provide and maintain our service</Text>
              <Text style={styles.bulletItem}>• Process your subscription payments</Text>
              <Text style={styles.bulletItem}>• Display your venue to app users</Text>
              <Text style={styles.bulletItem}>• Send you important updates and notifications</Text>
              <Text style={styles.bulletItem}>• Respond to your comments and questions</Text>
              <Text style={styles.bulletItem}>• Improve and optimize our app</Text>
              <Text style={styles.bulletItem}>• Detect and prevent fraud</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Information Sharing</Text>
            <Text style={styles.sectionText}>
              We share your venue information publicly within the app so visitors can discover 
              your business. This includes your venue name, address, photos, description, 
              opening hours, and contact information.
            </Text>
            <Text style={styles.sectionText}>
              We do not sell your personal information. We may share information with:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Service providers who assist our operations</Text>
              <Text style={styles.bulletItem}>• Law enforcement when required by law</Text>
              <Text style={styles.bulletItem}>• Other parties with your consent</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or 
              destruction. However, no method of transmission over the Internet is 100% secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Retention</Text>
            <Text style={styles.sectionText}>
              We retain your information for as long as your account is active or as needed to 
              provide you services. If you close your account, we will delete your information 
              within 30 days, except where we are required to retain it for legal purposes.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Your Rights</Text>
            <Text style={styles.sectionText}>
              Under GDPR and Spanish data protection law, you have the right to:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Access your personal data</Text>
              <Text style={styles.bulletItem}>• Correct inaccurate data</Text>
              <Text style={styles.bulletItem}>• Delete your data ("right to be forgotten")</Text>
              <Text style={styles.bulletItem}>• Restrict processing of your data</Text>
              <Text style={styles.bulletItem}>• Data portability</Text>
              <Text style={styles.bulletItem}>• Object to processing</Text>
            </View>
            <Text style={styles.sectionText}>
              To exercise these rights, contact us at privacy@torreviejaplus.com
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Cookies and Tracking</Text>
            <Text style={styles.sectionText}>
              Our mobile app may use local storage and similar technologies to enhance your 
              experience. You can control these through your device settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
            <Text style={styles.sectionText}>
              Our service is not directed to children under 16. We do not knowingly collect 
              personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
            <Text style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by updating the "Last updated" date. We encourage you to review this 
              policy periodically.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have questions about this Privacy Policy, please contact us:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>📧 privacy@torreviejaplus.com</Text>
              <Text style={styles.contactItem}>📞 +34 123 456 789</Text>
              <Text style={styles.contactItem}>📍 Torrevieja, Alicante, Spain</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 10,
  },
  backButtonContainer: {
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
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
  lastUpdated: {
    fontSize: 13,
    color: '#999',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletList: {
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  bulletItem: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  contactInfo: {
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  contactItem: {
    fontSize: 15,
    color: '#333',
    lineHeight: 28,
  },
  bottomSpacing: {
    height: 120,
  },
});
