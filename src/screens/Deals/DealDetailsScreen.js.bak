import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Linking, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabaseClient';
import CustomAlert from '../../components/CustomAlert';

const { width } = Dimensions.get('window');

export default function DealDetailsScreen({ onNavigate, dealId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [dealData, setDealData] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = React.useRef(null);
  
  // CustomAlert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  // Chat states
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchDealData();
  }, [dealId]);

  const fetchDealData = async () => {
    try {
      setLoading(true);
      
      // Fetch deal with venue data
      const { data: dealData, error: dealError } = await supabase
        .from('deals')
        .select(`
          *,
          venues!deals_venue_id_fkey(*)
        `)
        .eq('id', dealId)
        .single();

      if (dealError) throw dealError;
      
      if (dealData) {
        setDealData(dealData);
        setVenueData(dealData.venues);
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0077B6" />
      </View>
    );
  }

  if (!dealData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Deal not found</Text>
      </View>
    );
  }

  const handlePhonePress = () => {
    const phone = dealData.phone || venueData?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleSocialPress = (platform) => {
    if (!venueData) return;
    
    switch(platform) {
      case 'facebook':
        if (venueData.facebook) Linking.openURL(venueData.facebook);
        break;
      case 'instagram':
        if (venueData.instagram) Linking.openURL(venueData.instagram);
        break;
      case 'tiktok':
        if (venueData.tiktok) Linking.openURL(venueData.tiktok);
        break;
      case 'twitter':
        if (venueData['x/twitter']) Linking.openURL(venueData['x/twitter']);
        break;
      case 'line':
        if (venueData.line) Linking.openURL(`https://line.me/R/ti/p/${venueData.line}`);
        break;
      case 'whatsapp':
        const whatsapp = dealData.phone || venueData.whatsapp;
        if (whatsapp) Linking.openURL(`https://wa.me/${whatsapp.replace(/\s+/g, '')}`);
        break;
    }
  };

  const handleShare = (platform) => {
    const shareUrl = `https://huahin.app/deal/${dealId}`;
    const shareText = `Check out ${dealData?.name} on Hua Hin App!`;
    
    switch(platform) {
      case 'facebook':
        Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'instagram':
        setAlertTitle('Share');
        setAlertMessage('Please share via Instagram app');
        setShowAlert(true);
        break;
      case 'tiktok':
        setAlertTitle('Share');
        setAlertMessage('Please share via TikTok app');
        setShowAlert(true);
        break;
      case 'twitter':
        Linking.openURL(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const handleOpenBookingChat = () => {
    if (!isLoggedIn) {
      setAlertTitle('Login Required');
      setAlertMessage('Please login to make a booking.');
      setShowAlert(true);
      return;
    }
    setChatModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      text: chatMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM from HH:MM:SS
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/backgrounds/BG_ALL.png')} style={styles.backgroundImage} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate('testdeals')}>
          <Ionicons name="arrow-back" size={24} color="#0077B6" />
        </TouchableOpacity>

        <View style={styles.headerRightButtons}>
          <View>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => setShowShareMenu(!showShareMenu)}
            >
              <Ionicons name="share-social" size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>SHARE</Text>
            </TouchableOpacity>

            {showShareMenu && (
              <View style={styles.shareDropdown}>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('facebook')}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.shareOptionText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('instagram')}>
                  <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                  <Text style={styles.shareOptionText}>Instagram</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('tiktok')}>
                  <Ionicons name="logo-tiktok" size={20} color="#000000" />
                  <Text style={styles.shareOptionText}>TikTok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption} onPress={() => handleShare('twitter')}>
                  <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                  <Text style={styles.shareOptionText}>X (Twitter)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.headerButtonFavorite}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        {dealData.image_url && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: dealData.image_url }} style={styles.dealImage} resizeMode="cover" />
          </View>
        )}

        <View style={styles.contentCard}>
          <Text style={styles.dealTitle}>{dealData.name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={14} color="#0077B6" />
              <Text style={styles.metaText}>{dealData.category}</Text>
            </View>
            
            {dealData.views > 0 && (
              <View style={styles.metaItem}>
                <Ionicons name="eye" size={14} color="#0077B6" />
                <Text style={styles.metaText}>{dealData.views} views</Text>
              </View>
            )}
          </View>

          {venueData && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={14} color="#0077B6" />
                <Text style={styles.metaText}>{venueData.name}</Text>
              </View>
            </View>
          )}

          {dealData.price && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="cash" size={14} color="#0077B6" />
                <Text style={styles.priceText}>{dealData.price}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this Deal</Text>
            <Text style={styles.description}>{dealData.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deal Schedule</Text>
            <View style={styles.scheduleRow}>
              <Ionicons name="calendar" size={16} color="#0077B6" />
              <Text style={styles.scheduleText}>{formatDate(dealData.deal_date)}</Text>
            </View>
            
            {(dealData.start_time || dealData.end_time) && (
              <View style={styles.scheduleRow}>
                <Ionicons name="time" size={16} color="#0077B6" />
                <Text style={styles.scheduleText}>
                  {dealData.start_time && formatTime(dealData.start_time)}
                  {dealData.start_time && dealData.end_time && ' - '}
                  {dealData.end_time && formatTime(dealData.end_time)}
                </Text>
              </View>
            )}
          </View>

          {venueData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Link to the Venue</Text>
              <TouchableOpacity 
                style={styles.venueLink}
                onPress={() => onNavigate('venuedetails', { venueId: venueData.id })}
              >
                <Text style={styles.venueLinkText}>{venueData.name}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.bookButton} onPress={handleOpenBookingChat}>
          <Text style={styles.bookButtonText}>Book this Deal (Chat)</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={chatModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChatModalOpen(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlayCenter}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.chatModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chat about {dealData?.name}</Text>
              <TouchableOpacity 
                onPress={() => setChatModalOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#414141" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatMessagesContainer}>
              {chatMessages.length === 0 ? (
                <View style={styles.emptyChatContainer}>
                  <Ionicons name="chatbubbles-outline" size={48} color="#999" />
                  <Text style={styles.emptyChatText}>No messages yet.</Text>
                  <Text style={styles.emptyChatSubText}>Start the conversation about this deal!</Text>
                </View>
              ) : (
                chatMessages.map((msg) => (
                  <View key={msg.id} style={styles.chatMessage}>
                    <Text style={styles.chatMessageSender}>{msg.sender}</Text>
                    <Text style={styles.chatMessageText}>{msg.text}</Text>
                    <Text style={styles.chatMessageTime}>{msg.timestamp}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask about this deal..."
                placeholderTextColor="#999"
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  shareDropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    paddingVertical: 8,
    minWidth: 160,
    zIndex: 1000,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  shareOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  headerButtonFavorite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width - 32,
    height: 222,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 20,
    marginBottom: 80,
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
  flexDirection: 'row',
  alignItems: 'center',  // ÄNDRA från 'flex-start' till 'center'
  gap: 4,
  flex: 1,
  maxWidth: '100%',
},
  metaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  section: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  dayText: {
    fontSize: 11,
    color: '#333',
  },
  hoursText: {
    fontSize: 11,
    color: '#666',
  },
  contactTextRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  contactValue: {
    fontSize: 11,
    color: '#0077B6',
    flex: 1,
  },
  contactIconsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  contactIconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contactIconText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  socialMediaSection: {
    marginTop: 25,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 38,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatModal: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    paddingRight: 0,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chatMessagesContainer: {
    flex: 1,
    marginBottom: 15,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  emptyChatSubText: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  chatMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  chatMessageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 5,
  },
  chatMessageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  chatMessageTime: {
    fontSize: 16,
    color: '#999',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#0077B6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueLink: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
  },
  venueLinkText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0077B6',
    textAlign: 'center',
  },
});