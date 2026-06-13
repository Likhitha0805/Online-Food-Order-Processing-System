import React, { useState, useEffect } from 'react';
import { ChefHat, Truck, MapPin, Phone, Ban, CheckCircle } from 'lucide-react';
import './CustomerFlow.css';

const CustomerTracking = () => {
  // Statuses: 'preparing', 'picked_up', 'delivered', 'cancelled'
  const [status, setStatus] = useState('preparing');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  // Simulation for demo purposes
  useEffect(() => {
    if (status === 'preparing') {
      const timer = setTimeout(() => setStatus('picked_up'), 5000); // 5s demo
      return () => clearTimeout(timer);
    } else if (status === 'picked_up') {
      const timer = setTimeout(() => setStatus('delivered'), 8000); // 8s demo
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleCancel = (e) => {
    e.preventDefault();
    if (cancelReason.trim()) {
      setStatus('cancelled');
      setShowCancelModal(false);
    }
  };

  if (status === 'delivered') {
    return (
      <div className="flow-container">
        <div className="final-delivery-animation">
          <CheckCircle size={80} className="success-icon" />
          <h1 className="animation-slide-up">Items delivered!</h1>
          <p className="animation-fade-in">Thank you for purchasing - <strong>FoodOrder Pro</strong></p>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flow-container">
        <div className="flow-card text-center">
          <Ban size={64} color="#ff6b6b" style={{ margin: '0 auto 1rem' }} />
          <h2>Order Cancelled</h2>
          <p>Your order was cancelled successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-container">
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content animation-slide-up">
            <h3>Cancel Order</h3>
            <p>Please tell us why you are cancelling.</p>
            <form onSubmit={handleCancel}>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows="4"
                required
              />
              <div className="modal-actions">
                <button type="button" className="text-btn" onClick={() => setShowCancelModal(false)}>Back</button>
                <button type="submit" className="danger-btn">Confirm Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flow-card" style={{ maxWidth: 800 }}>
        <h2>Order Tracking</h2>
        
        {/* Status Timeline */}
        <div className="status-timeline">
          <div className={`timeline-step ${status === 'preparing' || status === 'picked_up' ? 'active' : ''}`}>
            <div className="step-icon"><ChefHat size={20} /></div>
            <span>Kitchen Prep</span>
            <small>Items packed & ready</small>
          </div>
          <div className={`timeline-step ${status === 'picked_up' ? 'active' : ''}`}>
            <div className="step-icon"><Truck size={20} /></div>
            <span>Picked Up</span>
            <small>Agent on the way</small>
          </div>
        </div>

        {/* Order Details */}
        <div className="tracking-details">
          <div className="info-box">
            <h4>Order Items</h4>
            <p>1x Margherita Pizza - ₹250.00</p>
            <p>Kitchen Status: {status === 'preparing' ? 'Preparing...' : 'Picked Up'}</p>
          </div>

          {status === 'picked_up' && (
            <div className="info-box agent-info animation-fade-in">
              <h4>Delivery Agent</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="agent-avatar"><Truck size={24} /></div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Ramesh Kumar</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#a0a0b0' }}><Phone size={12}/> +91 98765 43210</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Mockup */}
        <div className="map-mockup">
          <MapPin size={32} color="#ff6584" className="map-marker-delivery" />
          {status === 'picked_up' && <Truck size={32} color="#6c63ff" className="map-marker-agent animation-move" />}
          <div className="map-label">Live Map Tracking Simulation</div>
        </div>

        <div className="tracking-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="danger-btn" onClick={() => setShowCancelModal(true)}>
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTracking;
