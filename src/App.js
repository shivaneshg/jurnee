// App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // This is the only CSS file we need to import now
import { useGuideContext, GuideProvider } from './contexts/GuideContext';

// NOTE: You can now safely remove the entire GuideCard component definition
// from this App.js file, as it's no longer used in the current UI flow.
// If you want to keep it for future use (e.g., if you reintroduce it), that's fine,
// but it's not needed for the current screens.
/*
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
*/

function AvailableGuidesScreen({ onGuideSelect }) {
  const { guides } = useGuideContext();

  return (
    <div className="available-guides-screen">
      <h2 className="available-guides-header">Available Local Guides</h2>
      <div className="guides-list">
        {guides.map(guide => (
          <div key={guide.id} className="guide-card-list" onClick={() => onGuideSelect(guide)}>
            <div className="guide-card-list-profile">
              {guide.profileImage ? (
                <img src={guide.profileImage} alt={guide.name} className="guide-list-image" />
              ) : (
                <div className="guide-list-image-placeholder"></div>
              )}
            </div>
            <div className="guide-list-info">
              <p className="guide-list-name">Name: {guide.name}</p>
              {guide.gender && <p className="guide-list-gender">Gender: {guide.gender}</p>}
              <p className="guide-list-rating">Rating: {guide.rating}</p>
            </div>
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
    // Implement booking logic later (e.g., show booking form, send data to backend)
  };

  return (
    <div className="guide-detail-screen">
      <button onClick={onBack} className="back-button">Back to Guides</button>
      <div className="guide-detail-header">
        <div className="guide-detail-image-container">
          {selectedGuide.profileImage ? (
            <img src={selectedGuide.profileImage} alt={selectedGuide.name} className="guide-detail-image" />
          ) : (
            <div className="guide-detail-image-placeholder"></div>
          )}
        </div>
        <p className="guide-detail-rating-number">{selectedGuide.rating}</p>
      </div>

      <h2 className="guide-detail-name">{selectedGuide.name}</h2>
      
      <div className="guide-detail-info-grid">
        {selectedGuide.age && <p><span className="info-label">Age:</span> <span className="info-value">{selectedGuide.age}</span></p>}
        {selectedGuide.languages && <p><span className="info-label">Languages:</span> <span className="info-value">{selectedGuide.languages ? selectedGuide.languages.join(', ') : 'N/A'}</span></p>}
        {selectedGuide.hourlyRate && <p><span className="info-label">Price per hour:</span> <span className="info-value">{selectedGuide.hourlyRate}Rs</span></p>}
        {selectedGuide.workingHours && <p><span className="info-label">Working hours:</span> <span className="info-value">{selectedGuide.workingHours}</span></p>}
      </div>

      <p className="guide-detail-description"><span className="info-label">Description:</span> <span className="info-value">{selectedGuide.bio}</span></p>
      
      <button onClick={handleBookNowClick} className="book-now-button">BOOK NOW</button>
    </div>
  );
}

function App() {
  const [showGuides, setShowGuides] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const { guides, fetchGuides, selectGuide, selectedGuide } = useGuideContext();

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleGuideFeatureClick = () => {
    setShowGuides(true);
    selectGuide(null); 
    setSelectedGuideId(null);
  };

  const handleGuideSelect = (guideData) => {
    selectGuide(guideData);
    setSelectedGuideId(guideData.id);
  };

  const handleBackToGuides = () => {
    selectGuide(null);
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

      {showGuides && selectedGuideId && (
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