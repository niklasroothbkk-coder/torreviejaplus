import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabaseClient';
import { getCurrentUser } from '../services/authService';

export default function VenueSettingsScreen({ onNavigate, onOpenMenu }) {
  const [venueData, setVenueData] = useState(null);
  const [notifications, setNotifications] = useState({
    reviews: true,
    messages: true,
    appUpdates: true,
    torreviejaMessages: true,
  });
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [packageBenefits, setPackageBenefits] = useState([]);

  useEffect(() => {
    loadVenueData();
  }, []);

  // Load package benefits when venue data changes
  useEffect(() => {
    if (venueData?.package) {
      loadPackageBenefits(venueData.package);
    }
  }, [venueData?.package]);

  const loadPackageBenefits = async (packageName) => {
    try {
      const { data, error } = await supabase
        .from('package_benefits')
        .select('benefits')
        .eq('package_name', packageName)
        .single();
      
      if (data && data.benefits) {
        setPackageBenefits(data.benefits);
      } else {
        // Fallback to default benefits if not found in database
        setPackageBenefits(getDefaultBenefits(packageName));
      }
    } catch (error) {
      console.log('Using default benefits');
      setPackageBenefits(getDefaultBenefits(packageName));
    }
  };

  // Default benefits fallback
  const getDefaultBenefits = (packageName) => {
    if (packageName === 'Free') {
      return [
        'Public venue listing',
        'Basic information display',
        'Location on map',
        'Opening hours display'
      ];
    }
    if (packageName === 'Bronze') {
      return [
        'Basic venue listing',
        'Up to 3 photos',
        'Contact information display',
        'Opening hours display'
      ];
    }
    if (packageName === 'Silver') {
      return [
        'Enhanced venue listing',
        'Up to 6 photos',
        'Contact information display',
        'Opening hours display',
        'Create deals & promotions',
        '50 credits per month'
      ];
    }
    return [
      'Premium venue listing',
      'Unlimited photos',
      'Featured listing placement',
      'Contact information display',
      'Opening hours display',
      'Create deals & promotions',
      'Create events',
      '100 credits per month',
      'Priority support'
    ];
  };

  const loadVenueData = async () => {
    const result = await getCurrentUser();
    if (result.success && result.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('venue_id')
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
        }
      }
    }
  };

  const handleToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    console.log('Logout pressed');
  };

  // Helper function to get package price
  const getPackagePrice = () => {
    const pkg = venueData?.package || 'Free';
    if (pkg === 'Free') return 0;
    if (pkg === 'Bronze') return 99;
    if (pkg === 'Silver') return 199;
    return 499;
  };

  // Helper function to format payment date
  const formatPaymentDate = () => {
    const pkg = venueData?.package || 'Free';
    if (pkg === 'Free') return ''; // No payment info for free packages
    if (venueData?.payment_date) {
      return `(Paid ${venueData.payment_date})`;
    }
    return '(Not paid)';
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('venueeditprofile')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('venuechangepassword')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Package Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.settingText}>{venueData?.package || 'Free'} Package</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="cash-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>
                {getPackagePrice() === 0 ? 'Free' : `${getPackagePrice()} Euro`} {formatPaymentDate()}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowPackageModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="list-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Package Include</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowContactModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="swap-horizontal" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Change Package</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="star-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>New Reviews</Text>
            </View>
            <Switch
              value={notifications.reviews}
              onValueChange={() => handleToggle('reviews')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.reviews ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Messages from Visitors</Text>
            </View>
            <Switch
              value={notifications.messages}
              onValueChange={() => handleToggle('messages')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.messages ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>New App Updates</Text>
            </View>
            <Switch
              value={notifications.appUpdates}
              onValueChange={() => handleToggle('appUpdates')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.appUpdates ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Offers from TorreviejaPlus</Text>
            </View>
            <Switch
              value={notifications.torreviejaMessages}
              onValueChange={() => handleToggle('torreviejaMessages')}
              trackColor={{ false: '#ddd', true: '#0077B6' }}
              thumbColor={notifications.torreviejaMessages ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('faq', { fromVenue: true })}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Help & FAQ</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowContactModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('venueterms')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate('venueprivacy')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color="#0077B6" />
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Package Include Modal */}
      <Modal
        visible={showPackageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPackageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{venueData?.package || 'Free'} Package</Text>
            <Text style={styles.modalSubtitle}>Your package includes:</Text>

            <View style={styles.benefitsList}>
              {packageBenefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#0077B6" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowPackageModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Contact Support Modal */}
      <Modal
        visible={showContactModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Contact Support</Text>
            <Text style={styles.modalSubtitle}>We're here to help!</Text>

            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={24} color="#0077B6" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>support@torreviejaplus.com</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Ionicons name="call" size={24} color="#0077B6" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>+34 123 456 789</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <Ionicons name="time" size={24} color="#0077B6" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Hours</Text>
                  <Text style={styles.contactValue}>Mon-Fri: 9:00 - 18:00</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowContactModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to logout?</Text>

            <TouchableOpacity 
              style={[styles.modalButton, styles.logoutConfirmButton]}
              onPress={confirmLogout}
            >
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  menuButtonWrapper: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 10,
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d12028',
    borderRadius: 15,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 100,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  benefitText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactTextContainer: {
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 12,
    color: '#999',
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalButton: {
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
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCancelButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  logoutConfirmButton: {
    backgroundColor: '#d12028',
  },
});
