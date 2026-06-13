import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, CheckCircle, Store, Repeat } from 'lucide-react';
import './PartnerFlow.css';

const ActiveDelivery = () => {
  const [step, setStep] = useState('pickup'); // 'pickup' -> 'enroute' -> 'arrived' -> 'delivered'
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handlePickup = () => {
    setStep('enroute');
  };

  const handleArrived = () => {
    setStep('arrived');
  };

  const handleDelivered = () => {
    setStep('delivered');
    setShowSuccessPopup(true);
  };

  const handleNextOrder = () => {
    navigate('/partner');
  };

  return (
    <div className="partner-content">
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <CheckCircle size={64} className="success-icon" />
            <h2>Items delivered successful</h2>
            <p>Return to the store or wait for next order.</p>
            <button className="primary-btn mt-4" style={{ margin: '0 auto' }} onClick={handleNextOrder}>
              <Repeat size={18} /> Ready for next order
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-card" style={{ maxWidth: 700 }}>
        <h2>Active Delivery</h2>

        {/* Order Info */}
        <div className="order-items-list" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#f87171' }}>Order #10294</p>
              <p style={{ margin: 0 }}>1x Margherita Pizza</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#9ca3af' }}>Customer</p>
              <p style={{ margin: 0, fontWeight: 600 }}>Likhitha</p>
            </div>
          </div>
        </div>

        {/* Map Simulation */}
        <div className="partner-map">
          {step === 'pickup' && (
            <>
              <Store size={32} color="#f59e0b" className="map-marker-delivery" />
              <div className="map-label">Navigate to Store</div>
            </>
          )}
          {(step === 'enroute' || step === 'arrived') && (
            <>
              <MapPin size={32} color="#f87171" className="map-marker-delivery" />
              <Navigation size={32} color="#34d399" className="map-marker-agent animation-move" />
              <div className="map-label">Live Location: Route to Customer</div>
            </>
          )}
        </div>

        {/* Actions based on Step */}
        <div style={{ marginTop: '2rem' }}>
          {step === 'pickup' && (
            <button className="action-btn btn-pickup" onClick={handlePickup}>
              Picked Up Items
            </button>
          )}

          {step === 'enroute' && (
            <button className="action-btn btn-arrived" onClick={handleArrived}>
              Mark as Arrived
            </button>
          )}

          {step === 'arrived' && (
            <button className="action-btn btn-delivered animation-fade-in" onClick={handleDelivered}>
              Confirm Delivered
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ActiveDelivery;
