// src/contexts/GuideContext.js
import React, { createContext, useState, useContext } from 'react';

const GuideContext = createContext();

export const GuideProvider = ({ children }) => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null); // This is good

  // Sample data to initialize our guides
  const fetchGuides = () => {
    const sampleGuides = [
      {
        id: '1',
        name: 'John Smith',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        bio: 'Experienced local guide with 5 years of experience showing tourists the hidden gems of the city.',
        hourlyRate: 25,
        gender: 'Male', // Make sure you have gender, age, languages, workingHours for the full profile
        age: 35,
        languages: ['English', 'Hindi'],
        workingHours: '9 AM - 5 PM'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.9,
        bio: 'Food and culture expert, specializing in culinary tours and historical sites.',
        hourlyRate: 30,
        gender: 'Female',
        age: 28,
        languages: ['English', 'Spanish'],
        workingHours: '10 AM - 6 PM'
      },
      {
        id: '3',
        name: 'Miguel Rodriguez',
        profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
        rating: 4.7,
        bio: 'Adventure guide specializing in outdoor activities and natural landmarks.',
        hourlyRate: 28,
        gender: 'Male',
        age: 42,
        languages: ['English', 'Spanish', 'Portuguese'],
        workingHours: '8 AM - 4 PM'
      }
    ];

    setGuides(sampleGuides);
  };

  // Function to select a guide
  const selectGuide = (guideData) => { // CHANGED: Pass the whole guide object, not just ID
    setSelectedGuide(guideData); // Directly set the selected guide
  };

  return (
    <GuideContext.Provider
      value={{
        guides,
        selectedGuide, // Ensure selectedGuide is exposed
        fetchGuides,
        selectGuide
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuideContext = () => useContext(GuideContext);