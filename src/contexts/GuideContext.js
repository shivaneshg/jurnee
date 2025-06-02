// src/contexts/GuideContext.js
import React, { createContext, useState, useContext, useCallback } from 'react'; // Import useCallback

const GuideContext = createContext();

export const GuideProvider = ({ children }) => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);

  // Use useCallback to memoize fetchGuides
  const fetchGuides = useCallback(() => {
    const sampleGuides = [
      {
        id: '1',
        name: 'John Smith ',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        bio: 'Experienced local guide with 5 years of experience showing tourists the hidden gems of the city.',
        hourlyRate: 250,
        gender: 'Male',
        age: 35,
        languages: ['English', 'Hindi'],
        workingHours: '9 AM - 5 PM'
      },
      {
        id: '2',
        name: 'Sarah Johnson ',
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.9,
        bio: 'Food and culture expert, specializing in culinary tours and historical sites.',
        hourlyRate: 300,
        gender: 'Female',
        age: 28,
        languages: ['English', 'Spanish'],
        workingHours: '10 AM - 6 PM'
      },
      {
        id: '3',
        name: 'Miguel Rodriguez ',
        profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
        rating: 4.7,
        bio: 'Adventure guide specializing in outdoor activities and natural landmarks.',
        hourlyRate: 280,
        gender: 'Male',
        age: 43,
        languages: ['English', 'Spanish', 'Portuguese'],
        workingHours: '8 AM - 4 PM'
      }
    ];

    setGuides(sampleGuides);
  }, []); // <--- Empty dependency array: fetchGuides will only be created once

  // Use useCallback to memoize selectGuide
  const selectGuide = useCallback((guideData) => {
    setSelectedGuide(guideData);
  }, []); // <--- Empty dependency array: selectGuide will only be created once

  return (
    <GuideContext.Provider
      value={{
        guides,
        selectedGuide,
        fetchGuides,
        selectGuide
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuideContext = () => useContext(GuideContext);