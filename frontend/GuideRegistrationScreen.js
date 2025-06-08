// GuideRegistrationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { API_BASE } from '@env';

const API_BASE_URL = API_BASE;


export default function GuideRegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    location: '',
    experienceYears: '',
    hourlyRate: '',
    languages: '',
    specialties: '',
    description: '',
    profileImage: null
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        profileImage: result.assets[0].uri
      }));
    }
  };

  const validateForm = () => {
    const required = ['name', 'age', 'phone', 'email', 'location', 'experienceYears', 'hourlyRate'];
    for (let field of required) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in the ${field} field`);
        return false;
      }
    }

    if (isNaN(formData.age) || parseInt(formData.age) < 18) {
      Alert.alert('Error', 'Age must be 18 or above');
      return false;
    }

    if (isNaN(formData.hourlyRate) || parseFloat(formData.hourlyRate) <= 0) {
      Alert.alert('Error', 'Please enter a valid hourly rate');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const guideData = {
        ...formData,
        age: parseInt(formData.age),
        experienceYears: parseInt(formData.experienceYears),
        hourlyRate: parseFloat(formData.hourlyRate),
        isAvailable: true,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(`${API_BASE_URL}/guides/register`, guideData);
      
      // Save user type and data
      await AsyncStorage.setItem('userType', 'guide');
      await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));

      Alert.alert(
        'Success!',
        'Your guide profile has been created successfully. You can now receive booking requests from travelers.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register as guide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2842CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become a Guide</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Share your local knowledge and help travelers explore your city
          </Text>

          {/* Profile Photo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {formData.profileImage ? (
                <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="add-a-photo" size={40} color="#CCCCCC" />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder="Enter your age"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location/City *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Which city do you guide in?"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Years of Experience *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.experienceYears}
                onChangeText={(value) => handleInputChange('experienceYears', value)}
                placeholder="How many years have you been guiding?"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hourly Rate (USD) *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.hourlyRate}
                onChangeText={(value) => handleInputChange('hourlyRate', value)}
                placeholder="Your hourly rate in USD"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Languages Spoken</Text>
              <TextInput
                style={styles.textInput}
                value={formData.languages}
                onChangeText={(value) => handleInputChange('languages', value)}
                placeholder="e.g., English, Spanish, French"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Specialties</Text>
              <TextInput
                style={styles.textInput}
                value={formData.specialties}
                onChangeText={(value) => handleInputChange('specialties', value)}
                placeholder="e.g., Historical tours, Food tours, Adventure"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>About You</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Tell travelers about yourself, your experience, and why they should choose you as their guide..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Register as Guide</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By registering, you agree to our terms of service and privacy policy.
            Your profile will be reviewed before being made available to travelers.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2842CC',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  imagePickerButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2842CC',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});