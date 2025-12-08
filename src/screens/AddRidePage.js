import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

export default function AddRidePage({ onNavigate, onAddRide }) {
  // Form states
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalHour, setArrivalHour] = useState('12');
  const [arrivalMinute, setArrivalMinute] = useState('00');
  const [fromLocation, setFromLocation] = useState('Alicante Airport');
  const [destination, setDestination] = useState('Torrevieja');
  const [carType, setCarType] = useState('Taxi Sharing');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  // Picker states
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showHourDropdown, setShowHourDropdown] = useState(false);
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);
  
  // Dropdown options
  const fromLocations = ['Alicante Airport', 'Torrevieja', 'Alicante City', 'Elche', 'La Zenia'];
  const destinations = ['Torrevieja', 'Alicante City', 'Elche', 'La Zenia'];
  const carTypes = ['Own Car', 'Taxi Sharing'];
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '10', '20', '30', '40', '50'];

  const handleSubmit = () => {
    const arrivalTime = `${arrivalHour}:${arrivalMinute}`;
    
    if (!arrivalDate || !userName || !userPhone) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const newRide = {
      id: Date.now(),
      date: arrivalDate,
      time: arrivalTime,
      from: fromLocation,
      destination: destination,
      carType: carType,
      availableSeats: carType === 'Taxi Sharing' ? 3 : 4,
      totalSeats: carType === 'Taxi Sharing' ? 3 : 4,
      name: userName,
      phone: userPhone,
      isFull: false,
      isOwner: true
    };

    onAddRide(newRide);
    
    Alert.alert('Success', 'Your ride has been added!', [
      { text: 'OK', onPress: () => onNavigate('shareairporttaxi') }
    ]);
  };

  // Calendar component
  const CalendarView = ({ onSelectDate, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };
    
    const formatDate = (date) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    const days = getDaysInMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            onPress={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(currentMonth.getMonth() - 1);
              setCurrentMonth(newMonth);
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#21bad9" />
          </TouchableOpacity>
          <Text style={styles.calendarMonthText}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(currentMonth.getMonth() + 1);
              setCurrentMonth(newMonth);
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="#21bad9" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarDaysHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.calendarDayHeaderText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {days.map((date, index) => {
            if (!date) {
              return <View key={`empty-${index}`} style={styles.calendarDay} />;
            }
            
            const dateString = formatDate(date);
            const isSelected = dateString === selectedDate;
            const isPast = date < today;
            const isToday = date.getTime() === today.getTime();
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  isSelected && styles.calendarDaySelected,
                  isToday && !isSelected && styles.calendarDayToday,
                  isPast && styles.calendarDayPast
                ]}
                onPress={() => !isPast && onSelectDate(dateString)}
                disabled={isPast}
              >
                <Text style={[
                  styles.calendarDayText,
                  isSelected && styles.calendarDayTextSelected,
                  isPast && styles.calendarDayTextPast,
                  isToday && !isSelected && styles.calendarDayTextToday
                ]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../assets/backgrounds/SplashBG.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => onNavigate('taxi')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your Ride</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Date of Arrival</Text>
          <TouchableOpacity 
            style={styles.formInput}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={arrivalDate ? styles.dateText : styles.datePlaceholder}>
              {arrivalDate || 'Select date'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>Time of Arrival</Text>
          <View style={styles.timePickerRow}>
            <View style={styles.timePickerContainer}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => {
                  setShowHourDropdown(!showHourDropdown);
                  setShowMinuteDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{arrivalHour}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {showHourDropdown && (
                <View style={styles.dropdownMenuTimeAbsolute}>
                  <ScrollView style={styles.timeScrollView} nestedScrollEnabled={true}>
                    {hours.map((hour, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setArrivalHour(hour);
                          setShowHourDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          arrivalHour === hour && styles.dropdownItemTextActive
                        ]}>
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.timeColon}>:</Text>

            <View style={styles.timePickerContainer}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => {
                  setShowMinuteDropdown(!showMinuteDropdown);
                  setShowHourDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{arrivalMinute}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {showMinuteDropdown && (
                <View style={styles.dropdownMenuTimeAbsolute}>
                  <ScrollView style={styles.timeScrollView} nestedScrollEnabled={true}>
                    {minutes.map((minute, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setArrivalMinute(minute);
                          setShowMinuteDropdown(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          arrivalMinute === minute && styles.dropdownItemTextActive
                        ]}>
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.formLabel}>From</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowFromDropdown(!showFromDropdown)}
          >
            <Text style={styles.dropdownText}>{fromLocation}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showFromDropdown && (
            <View style={styles.dropdownMenu}>
              {fromLocations.map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFromLocation(loc);
                    setShowFromDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    fromLocation === loc && styles.dropdownItemTextActive
                  ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.formLabel}>Destination</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowDestinationDropdown(!showDestinationDropdown)}
          >
            <Text style={styles.dropdownText}>{destination}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showDestinationDropdown && (
            <View style={styles.dropdownMenu}>
              {destinations.map((dest, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setDestination(dest);
                    setShowDestinationDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    destination === dest && styles.dropdownItemTextActive
                  ]}>
                    {dest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="John Doe"
            placeholderTextColor="#999"
            value={userName}
            onChangeText={setUserName}
          />

          <Text style={styles.formLabel}>Phone no</Text>
          <TextInput
            style={styles.formInput}
            placeholder="+34 612 345 678"
            placeholderTextColor="#999"
            value={userPhone}
            onChangeText={setUserPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={28} color="#414141" />
              </TouchableOpacity>
            </View>
            <CalendarView 
              onSelectDate={(date) => {
                setArrivalDate(date);
                setShowCalendar(false);
              }}
              selectedDate={arrivalDate}
            />
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#000',
  },
  datePlaceholder: {
    fontSize: 12,
    color: '#999',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timePickerContainer: {
    flex: 1,
    zIndex: 10,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timeColon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 12,
    color: '#000',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#666',
  },
  dropdownItemTextActive: {
    color: '#21bad9',
    fontWeight: '600',
  },
  dropdownMenuTime: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  dropdownMenuTimeAbsolute: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
    zIndex: 1000,
  },
  timeScrollView: {
    maxHeight: 200,
  },
  submitButton: {
    backgroundColor: '#21bad9',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  timeListModalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
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
    fontSize: 14,
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
    fontSize: 11,
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
    fontSize: 12,
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
});
