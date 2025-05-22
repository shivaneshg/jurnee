import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import './GuideCard.css'; // Make sure this CSS is still relevant
import { GuideContext, GuideProvider, useGuideContext } from './contexts/GuideContext';

// Reusing your existing GuideCard component (if you want to adapt it)
const GuideCard = ({ guide, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    onSelect(guide.id);
  };

  return (
    <div className="guide-card" onClick={handleClick}>
      <img src={guide.profileImage} alt={guide.name} className="guide-image" />
      <h3 className="guide-name">{guide.name}</h3>
      <div className="guide-rating">Rating: {guide.rating}/5</div>
      {expanded && (
        <div className="guide-details">
          <p>{guide.bio}</p>
          <span className="guide-price">${guide.hourlyRate}/hour</span>
        </div>
      )}
    </div>
  );
};

function AvailableGuidesScreen({ onGuideSelect }) {
  const { guides } = useGuideContext();

  return (
    <div className="available-guides-screen">
      <h2>Available Local Guides</h2>
      <div className="guides-list">
        {guides.map(guide => (
          <div key={guide.id} className="guide-card-list" onClick={() => onGuideSelect(guide.id)}>
            {/* Placeholder for profile icon - you might want to add an image source */}
            <div className="guide-icon-placeholder"></div>
            <p>Name: {guide.name}</p>
            {guide.gender && <p>Gender: {guide.gender}</p>} {/* Assuming gender is in your data */}
            <p>Rating: {guide.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuideDetailScreen({ selectedGuide, onBack }) {
  if (!selectedGuide) {
    return <div>No guide selected</div>;
  }

  const handleBookNowClick = () => {
    alert(`Booking initiated for ${selectedGuide.name}`);
    // Implement booking logic later
  };

  return (
    <div className="guide-detail-screen">
      <button onClick={onBack}>Back to Guides</button>
      {/* Placeholder for profile icon */}
      <div className="guide-icon-placeholder-large"></div>
      <h3>{selectedGuide.rating}</h3>
      <h2>{selectedGuide.name}</h2>
      {selectedGuide.age && <p>Age: {selectedGuide.age}</p>}
      {selectedGuide.languages && <p>Languages: {selectedGuide.languages.join(', ')}</p>}
      {selectedGuide.hourlyRate && <p>Price per hour: {selectedGuide.hourlyRate}Rs</p>}
      {selectedGuide.workingHours && <p>Working hours: {selectedGuide.workingHours}</p>}
      <p>Description: {selectedGuide.bio}</p>
      <button onClick={handleBookNowClick}>BOOK NOW</button>
    </div>
  );
}

function App() {
  const [showGuides, setShowGuides] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const { guides, fetchGuides, selectGuide, selectedGuide } = useGuideContext();

  useEffect(() => {
    fetchGuides(); // Load guides when the app mounts
  }, [fetchGuides]);

  const handleGuideFeatureClick = () => {
    setShowGuides(true);
  };

  const handleGuideSelect = (id) => {
    const chosenGuide = guides.find(g => g.id === id);
    selectGuide(chosenGuide);
    setSelectedGuideId(id);
  };

  const handleBackToGuides = () => {
    setSelectedGuideId(null);
  };

  return (
    <div className="App">
      <h1>Travel Guide Booking</h1>
      {!showGuides && (
        <button onClick={handleGuideFeatureClick}>Find a Guide</button>
      )}

      {showGuides && !selectedGuideId && (
        <AvailableGuidesScreen onGuideSelect={handleGuideSelect} />
      )}

      {selectedGuideId && (
        <GuideDetailScreen selectedGuide={selectedGuide} onBack={handleBackToGuides} />
      )}
    </div>
  );
}

const AppWithProvider = () => (
  <GuideProvider>
    <App />
  </GuideProvider>
);

export default AppWithProvider;