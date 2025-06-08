import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const baseWidth = 430;
const widthScale = width / baseWidth;

const TripsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const trips = [
    {
      id: 1,
      destination: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=400&fit=crop&crop=center",
      startDate: "2024-05-15",
      endDate: "2024-05-22",
      duration: "7 days",
      rating: 5,
      type: "International",
      travelers: 2,
      highlights: ["Sunset at Oia", "Wine Tasting", "Blue Dome Churches"],
      status: "completed"
    },
    {
      id: 2,
      destination: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=400&fit=crop&crop=center",
      startDate: "2024-03-10",
      endDate: "2024-03-17",
      duration: "8 days",
      rating: 5,
      type: "International",
      travelers: 1,
      highlights: ["Bamboo Forest", "Temple Visits", "Cherry Blossoms"],
      status: "completed"
    },
    {
      id: 3,
      destination: "Goa, India",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=400&fit=crop&crop=center",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      duration: "5 days",
      rating: 4,
      type: "Domestic",
      travelers: 4,
      highlights: ["Beach Parties", "Water Sports", "Local Cuisine"],
      status: "completed"
    },
    {
      id: 4,
      destination: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop&crop=center",
      startDate: "2023-12-28",
      endDate: "2024-01-02",
      duration: "6 days",
      rating: 4,
      type: "International",
      travelers: 3,
      highlights: ["Burj Khalifa", "Desert Safari", "Shopping"],
      status: "completed"
    },
    {
      id: 5,
      destination: "Manali, India",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=400&fit=crop&crop=center",
      startDate: "2023-10-15",
      endDate: "2023-10-20",
      duration: "5 days",
      rating: 5,
      type: "Domestic",
      travelers: 2,
      highlights: ["Mountain Views", "Adventure Sports", "Local Culture"],
      status: "completed"
    },
    {
      id: 6,
      destination: "Maldives",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center",
      startDate: "2025-07-10",
      endDate: "2025-07-17",
      duration: "7 days",
      rating: 0,
      type: "International",
      travelers: 2,
      highlights: ["Overwater Villa", "Snorkeling", "Spa Treatment"],
      status: "upcoming"
    }
  ];

  const filters = [
    { key: 'all', label: 'All', count: trips.length },
    { key: 'completed', label: 'Done', count: trips.filter(t => t.status === 'completed').length },
    { key: 'upcoming', label: 'Soon', count: trips.filter(t => t.status === 'upcoming').length },
    { key: 'domestic', label: 'India', count: trips.filter(t => t.type === 'Domestic').length },
    { key: 'international', label: 'World', count: trips.filter(t => t.type === 'International').length }
  ];

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return trip.status === 'completed';
    if (activeFilter === 'upcoming') return trip.status === 'upcoming';
    if (activeFilter === 'domestic') return trip.type === 'Domestic';
    if (activeFilter === 'international') return trip.type === 'International';
    return true;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14 * widthScale}
        color={i < rating ? '#FFD700' : '#ccc'}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>My</Text>
          <Text style={styles.nameText}>Journeys</Text>
        </View>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="camera" size={24 * widthScale} color="#2842CC" />
            <Text style={styles.tripCountText}>{trips.filter(t => t.status === 'completed').length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24 * widthScale} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterButton,
                activeFilter === filter.key && styles.activeFilterButton
              ]}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText
              ]} numberOfLines={1} ellipsizeMode="tail">
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trips List */}
      <ScrollView style={styles.tripsContainer} showsVerticalScrollIndicator={false}>
        {filteredTrips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripImageContainer}>
              <Image source={{ uri: trip.image }} style={styles.tripImage} />
              {trip.status === 'upcoming' && (
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingText}>Soon</Text>
                </View>
              )}
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.tripHeader}>
                <Text style={styles.destinationText}>{trip.destination}</Text>
                <View style={styles.tripTypeContainer}>
                  <MaterialIcons
                    name={trip.type === 'International' ? 'flight' : 'directions-car'}
                    size={16 * widthScale}
                    color={trip.type === 'International' ? '#FF6B6B' : '#4ECDC4'}
                  />
                  <Text style={styles.tripTypeText}>{trip.type}</Text>
                </View>
              </View>

              <View style={styles.tripMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14 * widthScale} color="#666" />
                  <Text style={styles.metaText}>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14 * widthScale} color="#666" />
                  <Text style={styles.metaText}>{trip.duration}</Text>
                </View>
              </View>

              <View style={styles.tripMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14 * widthScale} color="#666" />
                  <Text style={styles.metaText}>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</Text>
                </View>
                {trip.status === 'completed' && (
                  <View style={styles.ratingContainer}>
                    {renderStars(trip.rating)}
                    <Text style={styles.ratingText}>({trip.rating}/5)</Text>
                  </View>
                )}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsContainer}>
                {trip.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightTag}>
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16 * widthScale} color="#2842CC" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingBottom: 10 * widthScale,
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
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12 * widthScale,
    paddingVertical: 8 * widthScale,
    borderRadius: 20 * widthScale,
    marginRight: 10 * widthScale,
  },
  tripCountText: {
    marginLeft: 5 * widthScale,
    fontSize: 14 * widthScale,
    fontWeight: '600',
    color: '#2842CC',
  },
  menuButton: {
    padding: 5 * widthScale,
  },
  filterWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#2842CC',
  },
  filterText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  activeFilterText: {
    color: '#fff',
  },
  tripsContainer: {
    flex: 1,
    paddingHorizontal: 20 * widthScale,
    paddingBottom: 20 * widthScale,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20 * widthScale,
    padding: 15 * widthScale,
    marginBottom: 15 * widthScale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripImageContainer: {
    position: 'relative',
    marginRight: 15 * widthScale,
  },
  tripImage: {
    width: 80 * widthScale,
    height: 80 * widthScale,
    borderRadius: 40 * widthScale,
  },
  upcomingBadge: {
    position: 'absolute',
    top: -5 * widthScale,
    right: -5 * widthScale,
    backgroundColor: '#4ECDC4',
    borderRadius: 10 * widthScale,
    paddingHorizontal: 6 * widthScale,
    paddingVertical: 2 * widthScale,
  },
  upcomingText: {
    color: '#fff',
    fontSize: 10 * widthScale,
    fontWeight: '600',
  },
  tripDetails: {
    flex: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8 * widthScale,
  },
  destinationText: {
    fontSize: 18 * widthScale,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8 * widthScale,
    paddingVertical: 4 * widthScale,
    borderRadius: 12 * widthScale,
  },
  tripTypeText: {
    fontSize: 12 * widthScale,
    fontWeight: '500',
    marginLeft: 4 * widthScale,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * widthScale,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12 * widthScale,
    color: '#666',
    marginLeft: 4 * widthScale,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12 * widthScale,
    color: '#666',
    marginLeft: 4 * widthScale,
  },
  highlightsContainer: {
    marginVertical: 8 * widthScale,
  },
  highlightTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8 * widthScale,
    paddingVertical: 4 * widthScale,
    borderRadius: 12 * widthScale,
    marginRight: 6 * widthScale,
  },
  highlightText: {
    fontSize: 11 * widthScale,
    color: '#2842CC',
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5 * widthScale,
  },
  viewDetailsText: {
    fontSize: 14 * widthScale,
    color: '#2842CC',
    fontWeight: '500',
    marginRight: 4 * widthScale,
  },
});

export default TripsScreen;
