import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, CheckCircle, Store, Repeat, Package, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react';
import { updateDemoOrderStatus } from '../services/api';
import './PartnerFlow.css';

const ActiveDelivery = () => {
  const [partnerPhone] = useState(localStorage.getItem('partner_phone') || '9876543210');
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState('pickup'); // 'pickup' -> 'enroute' -> 'arrived' -> 'delivered'
  const [tripProgress, setTripProgress] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [swipeVal, setSwipeVal] = useState(0);
  const navigate = useNavigate();

  // Load active order for this partner
  const loadActiveOrder = useCallback(() => {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    const active = orders.find(o => o.partnerPhone === partnerPhone && o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    if (active) {
      setOrder(active);
      // Map existing order status to UI step
      if (active.status === 'PICKED_UP') {
        setStep('enroute');
      } else if (active.status === 'ARRIVED') {
        setStep('enroute');
        setTripProgress(100);
      } else {
        setStep('pickup');
      }
    } else {
      // If no active order, go back to dashboard
      navigate('/partner');
    }
  }, [partnerPhone, navigate]);

  useEffect(() => {
    loadActiveOrder();
    window.addEventListener('demo_orders_updated', loadActiveOrder);
    return () => window.removeEventListener('demo_orders_updated', loadActiveOrder);
  }, [loadActiveOrder]);

  // Simulate scooter traveling when en route
  useEffect(() => {
    let interval;
    if (step === 'enroute' && tripProgress < 100) {
      interval = setInterval(() => {
        setTripProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4; // increment progress by 4% every 200ms (~5 seconds total trip)
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [step, tripProgress]);

  const handlePickup = () => {
    if (!order) return;
    const updated = updateDemoOrderStatus(order.id, 'PICKED_UP');
    if (updated) {
      setStep('enroute');
      setTripProgress(0);
    }
  };

  const handleArrived = () => {
    if (!order) return;
    const updated = updateDemoOrderStatus(order.id, 'ARRIVED');
    if (updated) {
      setStep('arrived');
    }
  };

  const handleDelivered = () => {
    if (!order) return;
    
    // 1. Update status
    updateDemoOrderStatus(order.id, 'DELIVERED');
    
    // 2. Credit partner wallet with 20 Rs
    const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
    const partnerIdx = partners.findIndex(p => p.phone === partnerPhone);
    if (partnerIdx !== -1) {
      partners[partnerIdx].balance = (partners[partnerIdx].balance || 0) + 20;
      localStorage.setItem('delivery_partners', JSON.stringify(partners));
    }
    
    setStep('delivered');
    setShowSuccessPopup(true);
    window.dispatchEvent(new Event('partners_updated'));
  };

  const handleSwipeChange = (e) => {
    const val = parseInt(e.target.value);
    setSwipeVal(val);
    if (val >= 95) {
      // Trigger Next Order sequence
      setShowSuccessPopup(false);
      navigate('/partner');
    }
  };

  const handleSwipeRelease = () => {
    if (swipeVal < 95) {
      setSwipeVal(0);
    }
  };

  if (!order) {
    return (
      <div className="partner-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#9ca3af' }}>Loading active delivery details...</p>
      </div>
    );
  }

  return (
    <div className="partner-content">
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup animation-scale-up">
            <CheckCircle size={64} className="success-icon" />
            <h2 style={{ color: '#10b981', margin: '1rem 0 0.5rem 0' }}>Items delivered successful</h2>
            <p style={{ color: '#d1d5db', margin: '0 0 2rem 0' }}>Return to the store.</p>
            
            <div className="swipe-button-container">
              <span className="swipe-text" style={{ opacity: 1 - swipeVal / 100 }}>
                Swipe to Ready for Next Order
              </span>
              <div className="swipe-slider-fill" style={{ width: `${swipeVal}%` }} />
              <div className="swipe-handle" style={{ left: `calc(${swipeVal}% - ${swipeVal * 0.52}px + 4px)` }}>
                <ChevronRight size={24} color="#065f46" />
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={swipeVal} 
                onChange={handleSwipeChange}
                onMouseUp={handleSwipeRelease}
                onTouchEnd={handleSwipeRelease}
                className="swipe-input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-card" style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Active Delivery</h2>
          <span className="active-order-badge">
            <ShoppingBag size={14} /> Order #{order.id}
          </span>
        </div>

        {/* Order Info */}
        <div className="order-items-list" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>Customer Name</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{order.customerName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 0.25rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>Pickup Store</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#f59e0b' }}>{order.storeLocation || 'Downtown Store'}</p>
            </div>
          </div>
          <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.75rem 0' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <Package size={16} color="#60a5fa" style={{ marginTop: '0.2rem' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{order.itemName}</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#34d399', fontWeight: 700 }}>₹{Number(order.amount).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* User Delivery Location Address (Displayed when picked up) */}
        {step !== 'pickup' && (
          <div className="delivery-address-box animation-fade-in" style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.9rem' }}>
              <MapPin size={16} /> Delivery Address
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#e5e7eb' }}>
              123 Mock Live Street, GPS Coordinates: 12.9716° N, 77.5946° E
            </p>
          </div>
        )}

        {/* Map Simulation */}
        <div className="partner-map">
          {step === 'pickup' && (
            <div className="map-inner-center animation-pulse">
              <Store size={48} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' }} />
              <div className="map-label">Navigate to Store & Pick Up Items</div>
            </div>
          )}
          
          {(step === 'enroute' || step === 'arrived') && (
            <>
              {/* Route line */}
              <div className="map-route-line" />
              
              <Store size={28} color="#f59e0b" style={{ position: 'absolute', left: '10%', top: '45%' }} />
              <MapPin size={32} color="#f87171" style={{ position: 'absolute', right: '10%', top: '45%', filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.5))' }} />
              
              <div className="map-marker-agent animation-scooter-move" style={{ left: `calc(10% + ${tripProgress * 0.72}%)`, top: '45%' }}>
                <Navigation size={28} color="#34d399" style={{ transform: 'rotate(90deg)', filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))' }} />
              </div>
              
              <div className="map-label">
                {tripProgress < 100 
                  ? `Live Location: Traveling to Customer (${tripProgress}%)` 
                  : 'Reaching the customer location!'
                }
              </div>
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

          {step === 'enroute' && tripProgress === 100 && (
            <button className="action-btn btn-arrived animation-scale-up" onClick={handleArrived}>
              <Navigation size={18} /> Mark as Arrived
            </button>
          )}

          {step === 'enroute' && tripProgress < 100 && (
            <button className="action-btn" style={{ background: '#374151', color: '#9ca3af', cursor: 'not-allowed' }} disabled>
              Traveling... {tripProgress}%
            </button>
          )}

          {step === 'arrived' && (
            <button className="action-btn btn-delivered animation-pulse" onClick={handleDelivered}>
              <ShieldCheck size={20} /> Confirm Delivered
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ActiveDelivery;
