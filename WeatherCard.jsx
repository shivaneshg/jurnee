import React, { useEffect, useState } from 'react';
import { Text, View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const apiKey = 'fc4652156d3448368cf42907252805';

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Get weather data
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location.coords.latitude},${location.coords.longitude}&aqi=no`
        );
        setWeather(res.data);
      } catch (err) {
        setError('Failed to fetch weather data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.center} />;
  if (error) return <Text style={[styles.center, { color: 'red' }]}>{error}</Text>;
  if (!weather) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{weather.location.name}</Text>
          <Text style={styles.subtitle}>{weather.location.region}</Text>
          <Text style={styles.subtitle}>{formatTime(currentTime)}</Text>
        </View>
        <Image
          source={{ uri: `https:${weather.current.condition.icon}` }}
          style={{ width: 64, height: 64 }}
        />
      </View>
      
      <View style={styles.row}>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherValue}>{Math.round(weather.current.temp_c)}°C</Text>
          <Text style={styles.weatherLabel}>Temp</Text>
        </View>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherValue}>{weather.current.wind_kph} km/h</Text>
          <Text style={styles.weatherLabel}>Wind</Text>
        </View>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherValue}>{weather.current.humidity}%</Text>
          <Text style={styles.weatherLabel}>Humidity</Text>
        </View>
      </View>
      
      <Text style={[styles.text, { fontStyle: 'italic', textAlign: 'center' }]}>
        {weather.current.condition.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  card: {
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  weatherItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    minWidth: 90,
  },
  weatherValue: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 5,
  },
  text: {
    color: '#f1f5f9',
    fontSize: 16,
  },
});