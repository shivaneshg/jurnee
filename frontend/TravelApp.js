import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Platform,
  Button,
  Alert,
  ActivityIndicator
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';




const { width, height } = Dimensions.get('window');

// Scale factors based on iPhone 14/15 Pro Max dimensions
const baseWidth = 430; // iPhone 14/15 Pro Max width
const widthScale = width / baseWidth;

const Stack = createNativeStackNavigator();

export default function TravelApp() {
  const [sending, setSending] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState('Steve');
  const sendSOS = async () => {
  setSending(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to send SOS.');
      setSending(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const message = `🚨 SOS Alert!\nI need help. My current location is:\nLatitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}\nhttps://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(['+91987654321'], message);
      Alert.alert('SOS Sent!', 'Your emergency message was sent successfully.');
    } else {
      Alert.alert('SMS Not Available', 'This device cannot send SMS messages.');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
  setSending(false);
};
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Hello,</Text>
          <Text style={styles.nameText}>{name || 'User'}</Text>
        </View>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24 * widthScale} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24 * widthScale} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20 * widthScale} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="What's around me?"
          placeholderTextColor="#666"
        />
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionItem}
          onPress={() => navigation.navigate('Guide')}
        >
          <View style={styles.quickActionIconContainer}>
            <Ionicons name="person" size={24 * widthScale} color="#4B4B4B" />
          </View>
          <Text style={styles.quickActionText}>Guide</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionItem}>
          <View style={styles.quickActionIconContainer}>
            <MaterialIcons name="map" size={24 * widthScale} color="#4B4B4B" />
          </View>
          <Text style={styles.quickActionText}>Offline Maps</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionItem}onPress={() => navigation.navigate('Translate')}>
          <View style={styles.quickActionIconContainer}>
            <MaterialIcons name="translate" size={24 * widthScale} color="#4B4B4B" />
          </View>
          <Text style={styles.quickActionText}>Translate</Text>
        </TouchableOpacity>
      </View>
      
      {/* Weather Widget */}
      <View style={styles.weatherContainer}>
        <View style={styles.weatherRow}>
          <View style={styles.weatherCard}>
            <MaterialCommunityIcons name="water" size={30 * widthScale} color="#40A0FF" />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherTemp}>8°</Text>
              <Text style={styles.weatherDay}>Today</Text>
            </View>
          </View>
          
          <View style={styles.weatherCard}>
            <Ionicons name="sunny" size={30 * widthScale} color="#FF9F40" />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherTemp}>39°</Text>
              <Text style={styles.weatherDay}>Thurs</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.weatherRow}>
          <View style={styles.weatherCard}>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={30 * widthScale} color="#A0A0FF" />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherTemp}>-3°</Text>
              <Text style={styles.weatherDay}>Fri</Text>
            </View>
          </View>
          
          <View style={styles.weatherCard}>
            <MaterialCommunityIcons name="weather-windy" size={30 * widthScale} color="#40A0FF" />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherTemp}>12°</Text>
              <Text style={styles.weatherDay}>Sat</Text>
            </View>
          </View>
          
          <View style={styles.weatherCard}>
            <MaterialCommunityIcons name="weather-tornado" size={30 * widthScale} color="#A0A0FF" />
            <View style={styles.weatherDetails}>
              <Text style={styles.weatherTemp}>17°</Text>
              <Text style={styles.weatherDay}>Sun</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24 * widthScale} color="#000" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Trips')}>
          <FontAwesome5 name="walking" size={24 * widthScale} color="#000" />
          <Text style={styles.navText}>My trips</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.sosButton} onPress={sendSOS} disabled={sending}>
          <Text style={styles.sosText}>{sending ? 'Sending...' : 'SOS'}</Text>
        </TouchableOpacity>


        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
          <MaterialCommunityIcons name="message-processing" size={24 * widthScale} color="#000" />
          <Text style={styles.navText}>AI Assistant</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} /* onPress disabled */ >
          <MaterialIcons name="person" size={24 * widthScale} color="#000" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>


      </View>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * widthScale,
    paddingTop: Platform.OS === 'android' ? 10 * widthScale : 0,
  },
  headerText: {
    fontSize: 28 * widthScale,
    fontWeight: '600',
  },
  nameText: {
    fontSize: 35 * widthScale,
    fontWeight: '600',
    color: '#2842CC',
  },
  headerRightIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 10 * widthScale,
  },
  menuButton: {
    marginLeft: 10 * widthScale,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20 * widthScale,
    marginTop: 33 * widthScale,
    borderRadius: 25 * widthScale,
    paddingHorizontal: 15 * widthScale,
    height: 50 * widthScale,
  },
  searchIcon: {
    marginRight: 10 * widthScale,
  },
  searchInput: {
    flex: 1,
    fontSize: 16 * widthScale,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20 * widthScale,
    marginTop: 25 * widthScale,
  },
  quickActionItem: {
    alignItems: 'center',
    width: width / 4,
  },
  quickActionIconContainer: {
    width: 50 * widthScale,
    height: 50 * widthScale,
    backgroundColor: '#fff',
    borderRadius: 15 * widthScale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 15 * widthScale,
    color: '#2842CC',
    fontSize: 14 * widthScale,
    textAlign: 'center',
  },
  weatherContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20 * widthScale,
    margin: 20 * widthScale,
    padding: 25 * widthScale,
    marginTop: 300 * widthScale,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10 * widthScale,
  },
  weatherCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10 * widthScale,
  },
  weatherDetails: {
    marginLeft: 10 * widthScale,
  },
  weatherTemp: {
    color: '#fff',
    fontSize: 22 * widthScale,
    fontWeight: 'bold',
  },
  weatherDay: {
    color: '#888',
    fontSize: 12 * widthScale,
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70 * widthScale,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20 * widthScale,
    borderTopRightRadius: 20 * widthScale,
    paddingHorizontal: 10 * widthScale,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12 * widthScale,
    marginTop: 3 * widthScale,
    color: '#000',
  },
  sosButton: {
    width: 90 * widthScale,
    height: 90 * widthScale,
    backgroundColor: '#FF0000',
    borderRadius: 40 * widthScale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30 * widthScale,
  },
  sosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18 * widthScale,
  },
});

