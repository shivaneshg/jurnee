import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.109.3:5000/api';

export default function GuideDetailScreen({ route, navigation }) {
  const { guide } = route.params;
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');

  const handleBookGuide = async () => {
    if (!userName || !userPhone || !userAddress) {
      Alert.alert('Missing Info', 'Please enter your name, phone, and address.');
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        guideId: guide._id,
        userName,
        userPhone,
        userAddress,
        requestDate: new Date().toISOString(),
        status: 'pending',
      };

      await axios.post(`${API_BASE_URL}/bookings`, bookingData);

      setBookingStatus('requesting');
      Alert.alert(
        'Request Sent!',
        'Your booking request has been sent. The guide will contact you soon.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to send booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCallGuide = () => {
    const phoneNumber = `tel:${guide.phone}`;
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleMessageGuide = () => {
    const message = `Hi ${guide.name}, I'm interested in booking your guide services. Can we discuss the details?`;
    const url = `sms:${guide.phone}?body=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open messaging app');
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#2842CC" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Guide Details</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {guide.profileImage ? (
                  <Image source={{ uri: guide.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.defaultProfileImage}>
                    <FontAwesome5 name="user" size={50} color="#CCCCCC" />
                  </View>
                )}
              </View>
              <Text style={styles.guideName}>{guide.name}</Text>
              <Text style={styles.guideLocation}>{guide.location}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(guide.rating) ? 'star' : 'star-outline'}
                      size={20}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    {guide.rating} ({guide.reviewCount} reviews)
                  </Text>
                </View>
              </View>

              <View style={styles.priceSection}>
                <Text style={styles.priceText}>${guide.hourlyRate}/hour</Text>
                <View
                  style={[
                    styles.availabilityBadge,
                    guide.isAvailable ? styles.available : styles.unavailable,
                  ]}
                >
                  <Text
                    style={[
                      styles.availabilityText,
                      guide.isAvailable ? styles.availableText : styles.unavailableText,
                    ]}
                  >
                    {guide.isAvailable ? 'Available' : 'Busy'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About {guide.name}</Text>
              <Text style={styles.sectionContent}>
                {guide.description ||
                  `Professional local guide with ${guide.experienceYears} years of experience in ${guide.location}.`}
              </Text>
            </View>

            {guide.languages && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.languagesContainer}>
                  {guide.languages.split(',').map((lang, i) => (
                    <View key={i} style={styles.languageTag}>
                      <Text style={styles.languageText}>{lang.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {guide.specialties && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Specialties</Text>
                <View style={styles.specialtiesContainer}>
                  {guide.specialties.split(',').map((spec, i) => (
                    <View key={i} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{spec.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color="#2842CC" />
                <Text style={styles.contactText}>{guide.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color="#2842CC" />
                <Text style={styles.contactText}>{guide.email}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Booking Details</Text>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={userName}
                onChangeText={setUserName}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={userPhone}
                onChangeText={setUserPhone}
              />

              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Enter your address"
                multiline
                value={userAddress}
                onChangeText={setUserAddress}
              />
            </View>
          </ScrollView>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.callButton} onPress={handleCallGuide}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} onPress={handleMessageGuide}>
              <Ionicons name="chatbubble" size={20} color="#2842CC" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bookButton, !guide.isAvailable && styles.bookButtonDisabled]}
              onPress={handleBookGuide}
              disabled={loading || !guide.isAvailable}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome5 name="calendar-plus" size={16} color="#FFFFFF" />
                  <Text style={styles.bookButtonText}>
                    {bookingStatus === 'requesting' ? 'Request Sent' : 'Book Guide'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // existing styles...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2842CC',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideName: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
  },
  guideLocation: {
    fontSize: 14,
    color: '#888',
    marginVertical: 6,
  },
  ratingContainer: {
    marginVertical: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2842CC',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  available: {
    backgroundColor: '#E8F5E8',
  },
  unavailable: {
    backgroundColor: '#FFEBEE',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#2E7D32',
  },
  unavailableText: {
    color: '#C62828',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  languageText: {
    color: '#2842CC',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  specialtyText: {
    color: '#E65100',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  callButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#2842CC',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  messageButtonText: {
    color: '#2842CC',
    marginLeft: 5,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#2842CC',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  bookButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
