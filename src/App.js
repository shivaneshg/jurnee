// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { useGuideContext, GuideProvider } from './contexts/GuideContext';

// (Keep GuideCard component commented out or remove it if not used)

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
  // === MOVE HOOKS HERE - BEFORE ANY CONDITIONAL RENDERING ===
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  // Now, the conditional return comes AFTER the Hooks are guaranteed to be called.
  if (!selectedGuide) {
    // Optionally, you might want to reset the form state here if the guide changes to null,
    // though the parent component (`App`) already ensures `selectedGuide` is valid
    // before rendering `GuideDetailScreen`.
    return <div>No guide selected</div>;
  }

  const handleBookNowClick = () => {
    setShowBookingForm(true); // Show the booking form
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!fromTime || !toTime) {
      alert('Please enter both "from" and "to" times.');
      return;
    }
    alert(`Booking confirmed for ${selectedGuide.name} from ${fromTime} to ${toTime}.`);
    // Here you would typically send this booking data to a backend
    // Reset form and hide it
    setFromTime('');
    setToTime('');
    setShowBookingForm(false);
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

      {!showBookingForm && (
        <button onClick={handleBookNowClick} className="book-now-button">BOOK NOW</button>
      )}

      {showBookingForm && (
        <form onSubmit={handleSubmitBooking} className="booking-form">
          <h3>Confirm Your Booking Period</h3>
          <div className="form-group">
            <label htmlFor="fromTime">From:</label>
            <input
              type="time" // Use type="time" for time input, or type="text" for freeform
              id="fromTime"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="toTime">To:</label>
            <input
              type="time" // Use type="time" for time input, or type="text" for freeform
              id="toTime"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="confirm-booking-button">Confirm Booking</button>
          <button type="button" onClick={() => setShowBookingForm(false)} className="cancel-booking-button">Cancel</button>
        </form>
      )}
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
    selectGuide(null); // Clear selected guide when going to the list
    setSelectedGuideId(null);
  };

  const handleGuideSelect = (guideData) => {
    selectGuide(guideData);
    setSelectedGuideId(guideData.id);
  };

  const handleBackToGuides = () => {
    selectGuide(null); // Clear selected guide when going back
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