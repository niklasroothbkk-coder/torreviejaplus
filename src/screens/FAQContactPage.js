import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Linking, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FAQContactPage({ onNavigate, onOpenMenu }) {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageText, setMessageText] = useState('');

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const faqData = [
    {
      id: 2,
      question: 'Is the app free to use?',
      answer: 'Yes! The Torrevieja Events app is completely free for users to browse events and deals.'
    },
    {
      id: 5,
      question: 'How often is the app updated?',
      answer: 'Events and deals are updated daily by our connected partners. We encourage event organizers to keep their listings current and remove expired events.'
    },
    {
      id: 4,
      question: 'Can I share deals & events?',
      answer: 'Absolutely! Every event and deal has a "SHARE" button that allows you to share via social media, email, or messaging apps.'
    },
    {
      id: 3,
      question: 'How do I list my event or venue?',
      answer: 'Contact us through this form or email info@torreviejaevents.com. We\'ll help you create your listing and explain our partnership options.'
    },
    {
      id: 1,
      question: 'What is this app about?',
      answer: 'Torrevieja Events helps locals and visitors discover what\'s happening in Torrevieja - from concerts and markets to restaurant deals and local services.'
    }
  ];

  const handleSendMessage = () => {
    if (!messageTitle.trim() || !messageText.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and message fields.');
      return;
    }

    const email = 'info@torreviejaevents.com';
    const subject = encodeURIComponent(messageTitle);
    const body = encodeURIComponent(messageText);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Could not open email client. Please email us directly at info@torreviejaevents.com');
    });

    setMessageTitle('');
    setMessageText('');
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.titleText}>Frequently Asked Questions</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          {faqData.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleFAQ(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqQuestion}>
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons 
                  name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#0077B6" 
                />
              </View>
              
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={24} color="#0077B6" />
              <Text style={styles.contactText}>info@torreviejaevents.com</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="call" size={24} color="#0077B6" />
              <Text style={styles.contactText}>+34 XXX XXX XXX</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="location" size={24} color="#0077B6" />
              <Text style={styles.contactText}>Torrevieja, Alicante, Spain</Text>
            </View>
          </View>

          <View style={styles.messageForm}>
            <Text style={styles.formTitle}>Send us a message</Text>
            
            <TextInput
              style={styles.titleInput}
              placeholder="Message Title"
              value={messageTitle}
              onChangeText={setMessageTitle}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.messageInput}
              placeholder="Your Message"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    paddingRight: 12,
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  messageForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  titleInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
