import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, MapPin, Package, ArrowRight, Loader2 } from 'lucide-react';
import './PartnerFlow.css';

const PartnerDashboard = () => {
  const [store, setStore] = useState('Central Kitchen - Downtown');
  const [isOnline, setIsOnline] = useState(false);
  const [orderAssigned, setOrderAssigned] = useState(false);
  const navigate = useNavigate();

  // Simulate receiving an order after going online
  useEffect(() => {
    let timer;
    if (isOnline && !orderAssigned) {
      timer = setTimeout(() => {
        setOrderAssigned(true);
      }, 4000); // 4 seconds mock wait
    }
    return () => clearTimeout(timer);
  }, [isOnline, orderAssigned]);

  const handleAcceptOrder = () => {
    navigate('/partner/active-delivery');
  };

  return (
    <div className="partner-content">
      <div className="dashboard-card">
        <h2>Delivery Partner Dashboard</h2>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Manage your availability and incoming orders.</p>

        <div className="partner-form-group">
          <label><MapPin size={16} style={{ display: 'inline', marginRight: 8 }}/> Select Store Location</label>
          <select value={store} onChange={(e) => setStore(e.target.value)} disabled={isOnline}>
            <option>Central Kitchen - Downtown</option>
            <option>Express Hub - Northside</option>
            <option>Quick Eats - West End</option>
          </select>
        </div>

        <div className="status-toggle-container">
          <div className={`toggle-label ${isOnline ? 'online' : 'offline'}`}>
            <Power size={20} />
            {isOnline ? 'You are ONLINE' : 'You are OFFLINE'}
          </div>
          <label className="switch">
            <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        {isOnline && !orderAssigned && (
          <div className="waiting-container animation-fade-in">
            <Loader2 size={48} className="spin-icon" style={{ color: '#34d399', margin: '0 auto 1rem' }} />
            <h3>Waiting for your order...</h3>
            <p style={{ color: '#9ca3af' }}>Stay active. Orders will appear here.</p>
          </div>
        )}

        {isOnline && orderAssigned && (
          <div className="order-assigned-card">
            <h3>New Order Assigned!</h3>
            <p>From: <strong>{store}</strong></p>
            
            <div className="order-items-list">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Package size={16} color="#60a5fa" />
                <span>1x Margherita Pizza</span>
              </div>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>To: Likhitha (Customer)</p>
            </div>

            <button className="action-btn btn-pickup" onClick={handleAcceptOrder}>
              Accept & View Route <ArrowRight size={20} />
            </button>
          </div>
        )}

      </div>
      <style>{`
        .spin-icon { animation: spinAnim 1.5s linear infinite; }
        @keyframes spinAnim { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PartnerDashboard;
