import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

export default function MessagesPage({ onNavigate, onOpenMenu }) {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, text: 'Hi! Is the ride still available?', sender: 'You', timestamp: '10:30', isOwn: true },
      { id: 2, text: 'Yes, still have 2 seats available!', sender: 'Anna Svensson', timestamp: '10:32', isOwn: false },
    ],
    2: [
      { id: 1, text: 'What time are you leaving?', sender: 'You', timestamp: '14:15', isOwn: true },
    ],
  });

  // Sample conversations
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Anna Svensson',
      lastMessage: 'Yes, still have 2 seats available!',
      timestamp: '10:32',
      unread: 2,
      avatar: 'A',
      type: 'Taxi Share',
    },
    {
      id: 2,
      name: 'Erik Johansson',
      lastMessage: 'What time are you leaving?',
      timestamp: '14:15',
      unread: 0,
      avatar: 'E',
      type: 'Taxi Share',
    },
    {
      id: 3,
      name: 'Lars Andersson',
      lastMessage: 'Thanks for the info!',
      timestamp: 'Yesterday',
      unread: 0,
      avatar: 'L',
      type: 'Taxi Share',
    },
  ]);

  const handleOpenChat = (conversationId) => {
    setActiveChatId(activeChatId === conversationId ? null : conversationId);
  };

  const handleDeleteConversation = (conversationId, conversationName) => {
    Alert.alert(
      'Delete Conversation',
      `Are you sure you want to delete your conversation with ${conversationName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Remove from conversations list
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            // Remove chat messages
            setChatMessages(prev => {
              const updated = { ...prev };
              delete updated[conversationId];
              return updated;
            });
            // Close chat if it was open
            if (activeChatId === conversationId) {
              setActiveChatId(null);
            }
          }
        }
      ]
    );
  };

  const renderRightActions = (conversation) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteConversation(conversation.id, conversation.name)}
      >
        <Ionicons name="trash" size={24} color="#FFFFFF" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const handleSendMessage = (conversationId) => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: chatMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    setChatMessage('');
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
          <Text style={styles.titleText}>Messages</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>No Messages Yet</Text>
            <Text style={styles.emptyText}>
              Your conversations will appear here when you connect with others through rides and events.
            </Text>
          </View>
        ) : (
          conversations.map((conversation) => (
            <Swipeable
              key={conversation.id}
              renderRightActions={() => renderRightActions(conversation)}
              overshootRight={false}
            >
              <View style={styles.conversationCard}>
                {/* Conversation Header - Always visible */}
                <TouchableOpacity 
                  style={styles.conversationHeader}
                  onPress={() => handleOpenChat(conversation.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{conversation.avatar}</Text>
                    </View>
                    {conversation.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{conversation.unread}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.conversationInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.conversationName}>{conversation.name}</Text>
                      <Text style={styles.conversationTime}>{conversation.timestamp}</Text>
                    </View>
                    <View style={styles.messagePreviewRow}>
                      <Text style={styles.conversationType}>{conversation.type}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text 
                        style={[
                          styles.lastMessage, 
                          conversation.unread > 0 && styles.lastMessageUnread
                        ]}
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>
                    </View>
                  </View>

                  <Ionicons 
                    name={activeChatId === conversation.id ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="#0077B6" 
                  />
                </TouchableOpacity>

                {/* Expandable Chat Section */}
                {activeChatId === conversation.id && (
                  <View style={styles.chatSection}>
                    <View style={styles.chatMessages}>
                      {chatMessages[conversation.id] && chatMessages[conversation.id].length > 0 ? (
                        chatMessages[conversation.id].map((msg) => (
                          <View 
                            key={msg.id} 
                            style={[
                              styles.messageRow,
                              msg.isOwn && styles.messageRowOwn
                            ]}
                          >
                            <View style={[
                              styles.messageBubble,
                              msg.isOwn && styles.messageBubbleOwn
                            ]}>
                              {!msg.isOwn && (
                                <Text style={styles.messageSender}>{msg.sender}</Text>
                              )}
                              <Text style={[
                                styles.messageText,
                                msg.isOwn && styles.messageTextOwn
                              ]}>
                                {msg.text}
                              </Text>
                              <Text style={[
                                styles.messageTime,
                                msg.isOwn && styles.messageTimeOwn
                              ]}>
                                {msg.timestamp}
                              </Text>
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
                        onPress={() => handleSendMessage(conversation.id)}
                      >
                        <Ionicons name="send" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </Swipeable>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Profile */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('profile')}
        >
          <Ionicons name="person-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Favorites */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('favorites')}
        >
          <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Messages (Active) */}
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonActive]}
        >
          <View style={styles.activeNavButton}>
            <Ionicons name="chatbubble" size={20} color="#0077B6" />
            <Text style={styles.activeNavText}>Messages</Text>
          </View>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => onNavigate('notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#d12028',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  conversationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  messagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conversationType: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: '#CCC',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  lastMessageUnread: {
    fontWeight: '600',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#d12028',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  chatSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  chatMessages: {
    minHeight: 150,
    maxHeight: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginTop: 12,
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
    alignItems: 'flex-start',
  },
  messageRowOwn: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubbleOwn: {
    backgroundColor: '#0077B6',
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
  messageTextOwn: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
  },
  messageTimeOwn: {
    color: '#E0E0E0',
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#0077B6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navButtonActive: {},
  activeNavButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  activeNavText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0077B6',
  },
});
