import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VenueTermsScreen({ onNavigate }) {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
            <Text style={styles.sectionText}>
              By accessing or using TorreviejaPlus, you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, you may not access the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Use of Service</Text>
            <Text style={styles.sectionText}>
              TorreviejaPlus provides a platform for venues to showcase their business and for visitors 
              to discover local venues, deals, and events in Torrevieja, Spain.
            </Text>
            <Text style={styles.sectionText}>
              As a venue owner, you agree to:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Provide accurate and up-to-date information about your venue</Text>
              <Text style={styles.bulletItem}>• Maintain the confidentiality of your account credentials</Text>
              <Text style={styles.bulletItem}>• Not use the service for any illegal or unauthorized purpose</Text>
              <Text style={styles.bulletItem}>• Not violate any laws in your jurisdiction</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Subscription Packages</Text>
            <Text style={styles.sectionText}>
              TorreviejaPlus offers three subscription packages: Bronze (€99/year), Silver (€199/year), 
              and Gold (€499/year). Each package provides different features and benefits as described 
              in the app.
            </Text>
            <Text style={styles.sectionText}>
              Subscriptions are billed annually and do not automatically renew. You will be notified 
              before your subscription expires.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Content Ownership</Text>
            <Text style={styles.sectionText}>
              You retain ownership of all content you submit to TorreviejaPlus, including photos, 
              descriptions, and business information. By submitting content, you grant us a 
              non-exclusive license to use, display, and distribute your content within the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
            <Text style={styles.sectionText}>
              You may not:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Upload false or misleading information</Text>
              <Text style={styles.bulletItem}>• Impersonate another person or entity</Text>
              <Text style={styles.bulletItem}>• Attempt to gain unauthorized access to the service</Text>
              <Text style={styles.bulletItem}>• Use the service to send spam or unsolicited messages</Text>
              <Text style={styles.bulletItem}>• Upload content that infringes on intellectual property rights</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Termination</Text>
            <Text style={styles.sectionText}>
              We may terminate or suspend your account immediately, without prior notice, for conduct 
              that we believe violates these Terms of Service or is harmful to other users, us, or 
              third parties.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              TorreviejaPlus and its affiliates shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. We will notify users of any 
              changes by updating the "Last updated" date. Continued use of the service after changes 
              constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms of Service, please contact us at:
            </Text>
            <Text style={styles.contactEmail}>support@torreviejaplus.com</Text>
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
  },
  bulletItem: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  contactEmail: {
    fontSize: 15,
    color: '#0077B6',
    fontWeight: '600',
    marginTop: 5,
  },
  bottomSpacing: {
    height: 120,
  },
});
