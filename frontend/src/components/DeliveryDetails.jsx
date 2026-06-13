import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import './CustomerFlow.css';

const DeliveryDetails = () => {
  const [address, setAddress] = useState('');
  const [isLiveLocation, setIsLiveLocation] = useState(false);
  const navigate = useNavigate();

  const handleFetchLiveLocation = () => {
    setIsLiveLocation(true);
    setAddress('123 Mock Live Street, GPS Coordinates: 12.9716° N, 77.5946° E');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address) {
      navigate('/customer/tracking');
    }
  };

  return (
    <div className="flow-container">
      <div className="flow-card">
        <h2>Delivery Details</h2>
        <p>Where should we deliver your food?</p>

        <form onSubmit={handleSubmit} className="delivery-form">
          <div className="location-actions">
            <button type="button" className="secondary-btn" onClick={handleFetchLiveLocation}>
              <Navigation size={18} /> Use Live Location
            </button>
          </div>

          <div className="form-group mt-4">
            <label>Complete Address</label>
            <div className="input-with-icon">
              <MapPin size={20} className="input-icon" />
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your home or current address..."
                rows="3"
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'vertical' }}
              />
            </div>
          </div>

          <button type="submit" className="primary-btn mt-4">
            Confirm Location & View Status <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryDetails;
