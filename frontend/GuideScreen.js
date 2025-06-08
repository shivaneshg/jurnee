import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE } from '@env';

const API_BASE_URL = API_BASE;

export default function GuideScreen({ navigation }) {
  const [guides, setGuides] = useState([]);
  const [userType, setUserType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      initializeScreen();
    }, [])
  );

  const initializeScreen = async () => {
    try {
      const userTypeData = await AsyncStorage.getItem('userType');
      const userData = await AsyncStorage.getItem('currentUser');

      setUserType(userTypeData);
      setCurrentUser(userData ? JSON.parse(userData) : null);

      if (userTypeData === 'guide') {
        await fetchInterestedUsers();
      } else {
        await fetchGuides();
      }
    } catch (error) {
      console.error('Error initializing screen:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/guides`);
      setGuides(response.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
      Alert.alert('Error', 'Failed to fetch guides');
    }
  };

  const fetchInterestedUsers = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      const user = JSON.parse(currentUser);
      const response = await axios.get(`${API_BASE_URL}/guides/${user.id}/interested-users`);
      setInterestedUsers(response.data);
    } catch (error) {
      console.error('Error fetching interested users:', error);
      Alert.alert('Error', 'Failed to fetch interested users');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userType');
    await AsyncStorage.removeItem('currentUser');
    setUserType(null);
    setCurrentUser(null);
    await fetchGuides(); // fallback to user view
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (userType === 'guide') {
      await fetchInterestedUsers();
    } else {
      await fetchGuides();
    }
    setRefreshing(false);
  };

  const handleGuidePress = (guide) => {
    navigation.navigate('GuideDetail', { guide, userType });
  };

  const handleRegisterAsGuide = () => {
    navigation.navigate('GuideRegistration');
  };

  const confirmUser = async (userId) => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      const user = JSON.parse(currentUser);

      await axios.post(`${API_BASE_URL}/guides/${user.id}/confirm-user`, {
        userId: userId,
      });

      Alert.alert('Success', 'User confirmed successfully!');
      await fetchInterestedUsers();
    } catch (error) {
      console.error('Error confirming user:', error);
      Alert.alert('Error', 'Failed to confirm user');
    }
  };

  const rejectUser = async (userId) => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      const user = JSON.parse(currentUser);

      await axios.delete(`${API_BASE_URL}/guides/${user.id}/reject-user/${userId}`);

      Alert.alert('Success', 'User rejected');
      await fetchInterestedUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      Alert.alert('Error', 'Failed to reject user');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2842CC" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2842CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {userType === 'guide' ? 'Interested Users' : 'Available Guides'}
        </Text>
        {userType !== 'guide' && (
          <TouchableOpacity onPress={handleRegisterAsGuide}>
            <MaterialIcons name="add" size={24} color="#2842CC" />
          </TouchableOpacity>
        )}
      </View>

      {userType === 'guide' && (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: '#FF3B30', textAlign: 'right', marginRight: 20, fontWeight: '600' }}>
            Logout
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {userType === 'guide' ? (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Users Interested in Your Services</Text>
            {interestedUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome5 name="users" size={50} color="#CCCCCC" />
                <Text style={styles.emptyStateText}>No interested users yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Users will appear here when they request your guide services
                </Text>
              </View>
            ) : (
              interestedUsers.map((user, index) => (
                <View key={user.id ?? index} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{user.userName}</Text>
                      <Text style={styles.userContact}>{user.userPhone}</Text>
                      <Text style={styles.userAddress}>{user.userAddress}</Text>

                      <Text style={styles.requestDate}>
                        Requested: {new Date(user.requestDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => confirmUser(user.id)}
                    >
                      <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => rejectUser(user.id)}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Available Local Guides</Text>

            {/* Already a Guide? Login */}
            <TouchableOpacity onPress={() => navigation.navigate('GuideLogin')}>
              <Text
                style={{
                  color: '#2842CC',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginVertical: 10,
                }}
              >
                Already a guide? Login here
              </Text>
            </TouchableOpacity>

            {/* Register as Guide Banner */}
            <TouchableOpacity style={styles.registerBanner} onPress={handleRegisterAsGuide}>
              <View style={styles.registerBannerContent}>
                <FontAwesome5 name="user-plus" size={24} color="#2842CC" />
                <View style={styles.registerBannerText}>
                  <Text style={styles.registerBannerTitle}>Become a Guide</Text>
                  <Text style={styles.registerBannerSubtitle}>
                    Share your local knowledge and earn money
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#2842CC" />
              </View>
            </TouchableOpacity>

            {/* Guides List */}
            {guides.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome5 name="map-signs" size={50} color="#CCCCCC" />
                <Text style={styles.emptyStateText}>No guides available</Text>
                <Text style={styles.emptyStateSubtext}>
                  Check back later or register as a guide yourself!
                </Text>
              </View>
            ) : (
              guides.map((guide, index) => (
                <TouchableOpacity
                  key={guide.id ?? index}
                  style={styles.guideCard}
                  onPress={() => handleGuidePress(guide)}
                >
                  <View style={styles.guideImageContainer}>
                    {guide.profileImage ? (
                      <Image source={{ uri: guide.profileImage }} style={styles.guideImage} />
                    ) : (
                      <View style={styles.defaultGuideImage}>
                        <FontAwesome5 name="user" size={30} color="#CCCCCC" />
                      </View>
                    )}
                  </View>

                  <View style={styles.guideInfo}>
                    <Text style={styles.guideName}>{guide.name}</Text>
                    <Text style={styles.guideAge}>Age: {guide.age}</Text>
                    <Text style={styles.guideLocation}>{guide.location}</Text>
                    <Text style={styles.guideExperience}>
                      {guide.experienceYears} years experience
                    </Text>

                    <View style={styles.guideRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < Math.floor(guide.rating) ? 'star' : 'star-outline'}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                      <Text style={styles.ratingText}>({guide.reviewCount})</Text>
                    </View>

                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>${guide.hourlyRate}/hour</Text>
                      <View style={styles.availabilityBadge}>
                        <Text style={styles.availabilityText}>
                          {guide.isAvailable ? 'Available' : 'Busy'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2842CC',
    marginBottom: 15,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2842CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  userContact: {
    fontSize: 14,
    color: '#555',
  },
  userAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  requestDate: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 8,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  registerBanner: {
    backgroundColor: '#E3E8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  registerBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerBannerText: {
    flex: 1,
    marginHorizontal: 15,
  },
  registerBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2842CC',
  },
  registerBannerSubtitle: {
    fontSize: 14,
    color: '#2842CC',
  },
  guideCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },
  guideImageContainer: {
    marginRight: 15,
  },
  guideImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  defaultGuideImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  guideAge: {
    fontSize: 14,
    color: '#666',
  },
  guideLocation: {
    fontSize: 14,
    color: '#666',
  },
  guideExperience: {
    fontSize: 14,
    color: '#666',
  },
  guideRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#999',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2842CC',
  },
  availabilityBadge: {
    backgroundColor: '#DFF0D8',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  availabilityText: {
    color: '#3C763D',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#999',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
