import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TravelApp from './TravelApp';
import ChatScreen from './ChatScreen';
import TranslateScreen from './TranslateScreen';
import GuideScreen from './GuideScreen';
import GuideDetailScreen from './GuideDetailScreen';
import GuideRegistrationScreen from './GuideRegistrationScreen';
import GuideLoginScreen from './GuideLoginScreen';
import TripsScreen from './TripsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={TravelApp} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Translate" component={TranslateScreen} />
        <Stack.Screen name="Guide" component={GuideScreen} />
        <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
        <Stack.Screen name="GuideRegistration" component={GuideRegistrationScreen} />
        <Stack.Screen name="GuideLogin" component={GuideLoginScreen} />
        <Stack.Screen name="Trips" component={TripsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}