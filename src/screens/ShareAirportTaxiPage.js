import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Dimensions, Image, TextInput, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const { width } = Dimensions.get('window');

export default function ShareAirportTaxiPage({ onNavigate, rides: ridesFromApp }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.75));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  
  // Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Use rides from App.js or default mock data
  const rides = ridesFromApp && ridesFromApp.length > 0 ? ridesFromApp : [
    {
      id: 1,
      date: '2025-12-01',
      time: '14:30',
      destination: 'Torrevieja Center',
      availableSeats: 2,
      totalSeats: 3,
      name: 'Anna Svensson',
      phone: '+46 70 123 4567',
      isFull: false,
      isOwner: false
    },
    {
      id: 2,
      date: '2025-12-02',
      time: '10:15',
      destination: 'La Mata Beach',
      availableSeats: 0,
      totalSeats: 3,
      name: 'Erik Johansson',
      phone: '+46 73 987 6543',
      isFull: true,
      isOwner: false
    },
    {
      id: 3,
      date: '2025-12-03',
      time: '18:45',
      destination: 'Playa Flamenca',
      availableSeats: 3,
      totalSeats: 3,
      name: 'Maria Lopez',
      phone: '+34 612 345 678',
      isFull: false,
      isOwner: true
    }
  ];

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const handleOpenChat = (ride) => {
    if (ride.isFull) {
      Alert.alert('Ride Full', 'This ride is already full. No more passengers can join.');
      return;
    }
    setSelectedRide(ride);
    setChatModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      text: chatMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../assets/backgrounds/SplashBG.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Hamburger Menu Button */}
      <TouchableOpacity 
        style={styles.menuButtonWrapper}
        onPress={openMenu}
      >
        <View style={styles.menuButtonContainer}>
          <Ionicons name="menu" size={32} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>Share Airport Taxi</Text>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={32} color="#21bad9" />
          <Text style={styles.infoText}>
            Share a taxi from Alicante Airport to Torrevieja or any other destination and save money! Post your arrival time or join an existing ride.
          </Text>
        </View>

        {/* Add Ride Button */}
        <TouchableOpacity 
          style={styles.addRideButton}
          onPress={() => onNavigate('addride')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addRideButtonText}>Add new ride</Text>
        </TouchableOpacity>

        {/* Available Rides Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rides</Text>
          
          {rides.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="car-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No rides available yet.</Text>
              <Text style={styles.emptySubText}>Be the first to add one!</Text>
            </View>
          ) : (
            rides.map((ride) => (
              <View key={ride.id} style={[styles.rideCard, ride.isFull && styles.rideCardFull]}>
                <View style={styles.rideHeader}>
                  <View style={styles.dateTimeContainer}>
                    <Ionicons name="calendar" size={18} color="#21bad9" />
                    <Text style={styles.rideDate}>{ride.date}</Text>
                    <Ionicons name="time" size={18} color="#21bad9" style={{ marginLeft: 15 }} />
                    <Text style={styles.rideTime}>{ride.time}</Text>
                  </View>
                  {ride.isFull && (
                    <View style={styles.fullBadge}>
                      <Text style={styles.fullBadgeText}>FULL</Text>
                    </View>
                  )}
                </View>

                <View style={styles.destinationContainer}>
                  <Ionicons name="location" size={20} color="#666" />
                  <Text style={styles.destinationLabel}>From: </Text>
                  <Text style={styles.destinationText}>{ride.from || 'Alicante Airport'}</Text>
                </View>

                <View style={styles.destinationContainer}>
                  <Ionicons name="location" size={20} color="#414141" />
                  <Text style={styles.destinationLabel}>To: </Text>
                  <Text style={styles.destinationText}>{ride.destination}</Text>
                </View>

                <View style={styles.seatsContainer}>
                  <Ionicons name="people" size={20} color={ride.isFull ? '#999' : '#21bad9'} />
                  <Text style={[styles.seatsText, ride.isFull && styles.seatsTextFull]}>
                    {ride.availableSeats} of {ride.totalSeats} seats available
                  </Text>
                </View>

                <View style={styles.contactContainer}>
                  <View style={styles.contactRow}>
                    <Ionicons name="person" size={16} color="#666" />
                    <Text style={styles.contactText}>{ride.name}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Ionicons name="call" size={16} color="#666" />
                    <Text style={styles.contactText}>{ride.phone}</Text>
                  </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                  {!ride.isOwner && (
                    <TouchableOpacity 
                      style={[styles.chatButton, ride.isFull && styles.chatButtonDisabled]}
                      onPress={() => handleOpenChat(ride)}
                      disabled={ride.isFull}
                    >
                      <Ionicons name="chatbubbles" size={18} color="#fff" />
                      <Text style={styles.buttonText}>Chat with driver</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Chat Modal */}
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
              <Text style={styles.modalTitle}>Chat with {selectedRide?.name}</Text>
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
                  <Text style={styles.emptyChatSubText}>Start the conversation!</Text>
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
                placeholder="Type your message..."
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

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.menuModalOverlay}>
          <Animated.View 
            style={[
              styles.menuPanel,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={closeMenu} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('splash'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('venues'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Venues & Services</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('events'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Events & Happenings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('testdeals'), 300);
                }}
              >
                <Text style={styles.menuItemText}>Deals & Promotions</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('faq'), 300);
                }}
              >
                <Text style={styles.menuItemText}>FAQ & Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.activeMenuItem]}
                onPress={closeMenu}
              >
                <View style={styles.menuItemRow}>
                  <Text style={[styles.menuItemText, styles.activeMenuItemText]}>Share Airport Taxi</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {isLoggedIn ? (
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => {
                  setIsLoggedIn(false);
                  closeMenu();
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => {
                  closeMenu();
                  setTimeout(() => onNavigate && onNavigate('signin'), 300);
                }}
              >
                <Text style={styles.logoutText}>Sign In / Sign Up</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.bottomLogoSection}
              onPress={() => {
                closeMenu();
                setTimeout(() => onNavigate && onNavigate('walkthrough'), 300);
              }}
            >
              <Image
                source={require('../../assets/icons/logo.png')}
                style={styles.bottomLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeMenu}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d3f4bff',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingTop: 110,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginTop: 10,
  },
  menuButtonWrapper: {
    position: 'absolute',
    top: 50,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#21bad9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  addRideButton: {
    backgroundColor: '#21bad9',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addRideButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#21bad9',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#21bad9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideCardFull: {
    opacity: 0.6,
    borderColor: '#999',
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rideDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  rideTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  fullBadge: {
    backgroundColor: '#d12028',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  fullBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  destinationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  destinationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  seatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#21bad9',
  },
  seatsTextFull: {
    color: '#999',
  },
  contactContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#21bad9',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  chatButtonDisabled: {
    backgroundColor: '#999',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#414141',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRideModal: {
    width: '90%',
    maxHeight: '85%',
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
    fontSize: 12,
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
  formContainer: {
    maxHeight: 500,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  datePlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timePicker: {
    flex: 1,
  },
  timeColon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  timeSelectButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timeListModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  timeListModalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  timeListModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  timeListModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timeListScroll: {
    maxHeight: 400,
  },
  timeListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  timeListItemSelected: {
    backgroundColor: '#E8F8FC',
  },
  timeListItemText: {
    fontSize: 18,
    color: '#333',
  },
  timeListItemTextSelected: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#21bad9',
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  calendarModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarContainer: {
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calendarDayHeaderText: {
    width: `${100/7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: `${100/7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  calendarDaySelected: {
    backgroundColor: '#21bad9',
    borderRadius: 20,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: '#21bad9',
    borderRadius: 20,
  },
  calendarDayPast: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  calendarDayTextPast: {
    color: '#999',
  },
  calendarDayTextToday: {
    color: '#21bad9',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#21bad9',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chatModal: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  chatMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  chatMessageSender: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#21bad9',
    marginBottom: 5,
  },
  chatMessageText: {
    fontSize: 11,
    color: '#333',
    marginBottom: 5,
  },
  chatMessageTime: {
    fontSize: 7,
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
    fontSize: 12,
    color: '#000',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#21bad9',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  menuPanel: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  overlayTouchable: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.25,
    height: '100%',
  },
  menuHeader: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 0,
  },
  menuItems: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  newBadge: {
    backgroundColor: '#d12028',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeMenuItem: {
    backgroundColor: '#0077B6',
    borderRadius: 10,
  },
  activeMenuItemText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 40,
    marginLeft: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  bottomLogoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  bottomLogo: {
    width: 480,
    height: 160,
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerModalCancel: {
    fontSize: 16,
    color: '#999',
  },
  pickerModalDone: {
    fontSize: 16,
    color: '#21bad9',
    fontWeight: '600',
  },
  pickerModalPicker: {
    height: 200,
  },
  datePickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#999',
  },
  datePickerDone: {
    fontSize: 16,
    color: '#21bad9',
    fontWeight: '600',
  },
});
