import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ShareAirportTaxiPage({ onNavigate, onOpenMenu, rides: ridesFromApp }) {
  const [activeChatRide, setActiveChatRide] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});

  const rides = ridesFromApp && ridesFromApp.length > 0 ? ridesFromApp : [
    {
      id: 1,
      date: '2026-01-10',
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
      date: '2026-01-11',
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
      date: '2026-01-12',
      time: '18:45',
      destination: 'Playa Flamenca',
      availableSeats: 1,
      totalSeats: 4,
      name: 'Lars Andersson',
      phone: '+46 76 555 1234',
      isFull: false,
      isOwner: false
    }
  ];

  const handleJoinRide = (ride) => {
    if (ride.isFull) {
      return;
    }
    // Toggle chat - if already open, close it, otherwise open it
    setActiveChatRide(activeChatRide === ride.id ? null : ride.id);
  };

  const handleSendMessage = (rideId) => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: chatMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [rideId]: [...(prev[rideId] || []), newMessage]
    }));

    setChatMessage('');
  };

  const handleAddRide = () => {
    onNavigate && onNavigate('addride');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Image 
        source={require('../../assets/backgrounds/BG_ALL.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.headerImageContainer}>
        <Image 
          source={require('../../assets/backgrounds/Header Image Container.png')} 
          style={styles.headerImage}
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

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Share Airport Taxi</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#0077B6" />
          <Text style={styles.infoText}>
            Share a taxi to or from Alicante Airport and save money while helping the environment.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.addRideButton}
          onPress={handleAddRide}
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.addRideButtonText}>Add New Ride</Text>
        </TouchableOpacity>

        <View style={styles.ridesSection}>
          <Text style={styles.sectionTitle}>Available Rides</Text>
          
          {rides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.dateRow}>
                    <Ionicons name="calendar" size={16} color="#0077B6" />
                    <Text style={styles.dateText}>{ride.date}</Text>
                  </View>
                  <View style={styles.timeRow}>
                    <Ionicons name="time" size={16} color="#0077B6" />
                    <Text style={styles.timeText}>{ride.time}</Text>
                  </View>
                </View>
                
                {ride.isFull && (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullBadgeText}>FULL</Text>
                  </View>
                )}
              </View>

              <View style={styles.destinationRow}>
                <Ionicons name="location" size={20} color="#d12028" />
                <Text style={styles.destinationText}>{ride.destination}</Text>
              </View>

              <View style={styles.seatsRow}>
                <Ionicons name="people" size={18} color="#666" />
                <Text style={styles.seatsText}>
                  {ride.availableSeats} / {ride.totalSeats} seats available
                </Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="person" size={16} color="#666" />
                <Text style={styles.contactText}>{ride.name}</Text>
              </View>

              {!ride.isFull && (
                <TouchableOpacity 
                  style={[styles.joinButton, activeChatRide === ride.id && styles.joinButtonActive]}
                  onPress={() => handleJoinRide(ride)}
                >
                  <Ionicons 
                    name={activeChatRide === ride.id ? "chatbubble" : "chatbubble-outline"} 
                    size={20} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.joinButtonText}>
                    {activeChatRide === ride.id ? 'Close Chat' : 'Join Ride'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Chat Section */}
              {activeChatRide === ride.id && (
                <View style={styles.chatSection}>
                  <View style={styles.chatHeader}>
                    <Ionicons name="chatbubbles" size={20} color="#0077B6" />
                    <Text style={styles.chatHeaderText}>Chat with {ride.name}</Text>
                  </View>

                  <View style={styles.chatMessages}>
                    {chatMessages[ride.id] && chatMessages[ride.id].length > 0 ? (
                      chatMessages[ride.id].map((msg) => (
                        <View key={msg.id} style={styles.messageRow}>
                          <View style={styles.messageBubble}>
                            <Text style={styles.messageSender}>{msg.sender}</Text>
                            <Text style={styles.messageText}>{msg.text}</Text>
                            <Text style={styles.messageTime}>{msg.timestamp}</Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyChat}>
                        <Ionicons name="chatbubble-outline" size={32} color="#CCC" />
                        <Text style={styles.emptyChatText}>Start the conversation!</Text>
                      </View>
                    )}
                  </View>

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
                      onPress={() => handleSendMessage(ride.id)}
                    >
                      <Ionicons name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
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
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#0077B6',
    lineHeight: 20,
  },
  addRideButton: {
    backgroundColor: '#0077B6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addRideButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  ridesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  fullBadge: {
    backgroundColor: '#d12028',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fullBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  destinationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d12028',
    marginLeft: 8,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  seatsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  joinButtonActive: {
    backgroundColor: '#666',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  chatHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077B6',
  },
  chatMessages: {
    minHeight: 150,
    maxHeight: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  messageRow: {
    marginBottom: 12,
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#0077B6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
