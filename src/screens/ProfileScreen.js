import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking, Alert, Platform } from 'react-native';

export default function ProfilePage() {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  // Validering av e-post
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validering av telefonnummer
  const validatePhone = (phone) => {
    const re = /^[\d\s\+\-\(\)]{8,}$/;
    return re.test(phone);
  };

  const openMap = () => {
    if (!address.trim() || !city.trim()) {
      Alert.alert('Ingen adress', 'Ange adress och stad för att öppna kartan.');
      return;
    }

    // Skapa fullständig adress med alla delar
    const fullAddress = `${address}${postCode ? ', ' + postCode : ''}, ${city}, Torrevieja, Spain`;
    const searchQuery = encodeURIComponent(fullAddress);
    
    // Välj rätt kartapp baserat på plattform
    const scheme = Platform.select({
      ios: `maps:0,0?q=${searchQuery}`,
      android: `geo:0,0?q=${searchQuery}`
    });

    // Försök öppna native kartapp först
    Linking.canOpenURL(scheme).then(supported => {
      if (supported) {
        Linking.openURL(scheme);
      } else {
        // Fallback till Google Maps i webbläsare
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`);
      }
    }).catch(() => {
      // Om allt annat misslyckas, använd Google Maps webb
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`);
    });
  };

  const handleSave = () => {
    // Validera alla fält
    if (!companyName.trim()) {
      Alert.alert('Fel', 'Företagsnamn/Venue är obligatoriskt');
      return;
    }

    if (!contactPerson.trim()) {
      Alert.alert('Fel', 'Kontaktperson är obligatoriskt');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Fel', 'Gatuadress är obligatoriskt');
      return;
    }

    if (!postCode.trim()) {
      Alert.alert('Fel', 'Postnummer är obligatoriskt');
      return;
    }

    if (!city.trim()) {
      Alert.alert('Fel', 'Stad är obligatoriskt');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Fel', 'E-post är obligatoriskt');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Fel', 'Ange en giltig e-postadress');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Fel', 'Telefonnummer är obligatoriskt');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      Alert.alert('Fel', 'Ange ett giltigt telefonnummer (minst 8 siffror)');
      return;
    }

    // Skapa profildata
    const profileData = {
      companyName,
      contactPerson,
      address,
      postCode,
      city,
      email,
      phoneNumber,
      timestamp: new Date().toISOString(),
    };

    // Logga data (här kan du senare spara till Firebase)
    console.log('=== SPARAR PROFIL ===');
    console.log(JSON.stringify(profileData, null, 2));
    console.log('====================');

    // Visa framgångsmeddelande
    Alert.alert(
      'Framgång! ✅',
      `Profil för "${companyName}" har sparats!\n\nKontakt: ${contactPerson}\nE-post: ${email}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            console.log('Profil sparad och redigeringsläge avstängt');
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>
              {isEditing ? 'Lock' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="or venue name"
              placeholderTextColor="#999"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Person</Text>
            <TextInput
              style={styles.input}
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholder="Who is to contact if anything"
              placeholderTextColor="#999"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Street address"
              placeholderTextColor="#999"
              editable={isEditing}
            />
          </View>

          <View style={styles.rowInputGroup}>
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Post Code</Text>
              <TextInput
                style={styles.input}
                value={postCode}
                onChangeText={setPostCode}
                placeholder="03180"
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>

            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Torrevieja"
                placeholderTextColor="#999"
                editable={isEditing}
              />
            </View>
          </View>

          {(address.trim() || city.trim()) && (
            <TouchableOpacity style={styles.mapButton} onPress={openMap}>
              <Text style={styles.mapButtonText}>OPEN IN MAPS 📍</Text>
            </TouchableOpacity>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email to the contact person"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone number to the contact person"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              editable={isEditing}
            />
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>SAVE PROFILE</Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <View style={styles.savedIndicator}>
              <Text style={styles.savedText}>✅ Profil sparad!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00a8e1',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#00a8e1',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0090c0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#00a8e1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowInputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInputGroup: {
    width: '48%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 13,
    color: '#333',
  },
  mapButton: {
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: '#80deea',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#c61620',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  savedIndicator: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  savedText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});