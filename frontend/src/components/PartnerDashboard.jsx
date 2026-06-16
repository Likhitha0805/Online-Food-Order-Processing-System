import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, MapPin, Package, ArrowRight, Loader2, Wifi, WifiOff } from 'lucide-react';
import { assignPendingOrderToPartner } from '../services/api';
import './PartnerFlow.css';

const PartnerDashboard = () => {
  const [partnerPhone] = useState(localStorage.getItem('partner_phone') || '9876543210');
  const [store, setStore] = useState('Central Kitchen - Downtown');
  const [isOnline, setIsOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const navigate = useNavigate();

  // Load partner profile on mount
  useEffect(() => {
    const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
    let partner = partners.find(p => p.phone === partnerPhone);
    if (partner) {
      setStore(partner.store || 'Central Kitchen - Downtown');
      setIsOnline(partner.isOnline || false);
    }
  }, [partnerPhone]);

  const handleToggleOnline = (e) => {
    const checked = e.target.checked;
    setIsOnline(checked);
    const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
    let partner = partners.find(p => p.phone === partnerPhone);
    if (partner) {
      partner.isOnline = checked;
      partner.store = store;
      localStorage.setItem('delivery_partners', JSON.stringify(partners));
    }
    
    if (checked) {
      // Try to assign a pending order right away
      const assigned = assignPendingOrderToPartner(partnerPhone);
      if (assigned) {
        setActiveOrder(assigned);
      }
    }
    window.dispatchEvent(new Event('partners_updated'));
  };

  const handleStoreChange = (e) => {
    const val = e.target.value;
    setStore(val);
    const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
    let partner = partners.find(p => p.phone === partnerPhone);
    if (partner) {
      partner.store = val;
      localStorage.setItem('delivery_partners', JSON.stringify(partners));
    }
    window.dispatchEvent(new Event('partners_updated'));
  };

  // Check for active or pending unassigned orders
  const checkAssignedOrder = useCallback(() => {
    if (!isOnline) {
      setActiveOrder(null);
      return;
    }
    
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    // Find active order for this partner
    const order = orders.find(o => o.partnerPhone === partnerPhone && o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    if (order) {
      setActiveOrder(order);
    } else {
      setActiveOrder(null);
      // Try to assign if online and idle
      const assigned = assignPendingOrderToPartner(partnerPhone);
      if (assigned) {
        setActiveOrder(assigned);
      }
    }
  }, [isOnline, partnerPhone]);

  useEffect(() => {
    checkAssignedOrder();
    
    // Listen for order updates
    window.addEventListener('demo_orders_updated', checkAssignedOrder);
    // Poll every 3 seconds as a fallback
    const interval = setInterval(checkAssignedOrder, 3000);
    
    return () => {
      window.removeEventListener('demo_orders_updated', checkAssignedOrder);
      clearInterval(interval);
    };
  }, [checkAssignedOrder]);

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
          <select value={store} onChange={handleStoreChange} disabled={isOnline}>
            <option>Central Kitchen - Downtown</option>
            <option>Express Hub - Northside</option>
            <option>Quick Eats - West End</option>
          </select>
        </div>

        <div className="status-toggle-container">
          <div className={`toggle-label ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? <Wifi size={20} color="#34d399" /> : <WifiOff size={20} color="#9ca3af" />}
            {isOnline ? 'You are ONLINE' : 'You are OFFLINE'}
          </div>
          <label className="switch">
            <input type="checkbox" checked={isOnline} onChange={handleToggleOnline} />
            <span className="slider"></span>
          </label>
        </div>

        {!isOnline && (
          <div className="offline-placeholder" style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Power size={32} style={{ color: '#f87171', marginBottom: '0.75rem', opacity: 0.7 }} />
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>Toggle the switch above to go online and receive orders.</p>
          </div>
        )}

        {isOnline && !activeOrder && (
          <div className="waiting-container animation-fade-in">
            <Loader2 size={48} className="spin-icon" style={{ color: '#34d399', margin: '0 auto 1rem' }} />
            <h3>Waiting for your order...</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Stay active. Orders will appear here.</p>
          </div>
        )}

        {isOnline && activeOrder && (
          <div className="order-assigned-card">
            <h3>New Order Assigned!</h3>
            <p>From: <strong>{activeOrder.storeLocation || store}</strong></p>
            
            <div className="order-items-list">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Package size={16} color="#60a5fa" />
                <span style={{ fontWeight: 600 }}>{activeOrder.itemName}</span>
              </div>
              <p style={{ margin: '0.25rem 0', color: '#9ca3af', fontSize: '0.9rem' }}>To: {activeOrder.customerName} (Customer)</p>
              <p style={{ margin: '0.25rem 0', color: '#34d399', fontSize: '0.9rem', fontWeight: 600 }}>Amount: ₹{Number(activeOrder.amount).toFixed(2)}</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#f59e0b', fontSize: '0.85rem' }}>Status: {activeOrder.status}</p>
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
