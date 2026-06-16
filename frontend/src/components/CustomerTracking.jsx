import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Truck, MapPin, Phone, Ban, CheckCircle, Store } from 'lucide-react';
import { updateDemoOrderStatus } from '../services/api';
import './CustomerFlow.css';

const CustomerTracking = () => {
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadOrder = useCallback(() => {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    const currentId = localStorage.getItem('current_customer_order_id');
    let active = orders.find(o => o.id === parseInt(currentId));
    if (!active && orders.length > 0) {
      // Find the latest order in state that is not completed, or just the absolute latest
      active = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').pop() || orders[orders.length - 1];
    }
    setOrder(active);
  }, []);

  useEffect(() => {
    loadOrder();
    window.addEventListener('demo_orders_updated', loadOrder);
    const interval = setInterval(loadOrder, 3000);
    return () => {
      window.removeEventListener('demo_orders_updated', loadOrder);
      clearInterval(interval);
    };
  }, [loadOrder]);

  const handleCancel = (e) => {
    e.preventDefault();
    if (cancelReason.trim() && order) {
      updateDemoOrderStatus(order.id, 'CANCELLED');
      setShowCancelModal(false);
      loadOrder();
    }
  };

  if (!order) {
    return (
      <div className="flow-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#9ca3af' }}>No active order found to track.</p>
      </div>
    );
  }

  if (order.status === 'DELIVERED') {
    return (
      <div className="flow-container">
        <div className="final-delivery-animation">
          <CheckCircle size={80} className="success-icon" style={{ color: '#10b981', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.4))' }} />
          <h1 className="animation-slide-up">Items delivered!</h1>
          <p className="animation-fade-in">Thank you for purchasing - <strong>FoodOrder Pro</strong></p>
        </div>
      </div>
    );
  }

  if (order.status === 'CANCELLED') {
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

  const orderStatus = order.status;

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
        <div className="status-timeline" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div className={`timeline-step ${['PLACED', 'PAYMENT_SUCCESS', 'KITCHEN_READY', 'PICKED_UP', 'ARRIVED', 'DELIVERED'].includes(orderStatus) ? 'active' : ''}`}>
            <div className="step-icon"><ChefHat size={20} /></div>
            <span>Kitchen Prep</span>
            <small style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>
              {orderStatus === 'PLACED' ? 'Awaiting payment' : orderStatus === 'PAYMENT_SUCCESS' ? 'Preparing order' : 'Ready for pickup'}
            </small>
          </div>
          <div className={`timeline-step ${['PICKED_UP', 'ARRIVED', 'DELIVERED'].includes(orderStatus) ? 'active' : ''} ${orderStatus === 'PICKED_UP' ? 'pulse-timeline' : ''}`}>
            <div className="step-icon"><Truck size={20} /></div>
            <span>Picked Up</span>
            <small style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>
              {['PICKED_UP', 'ARRIVED'].includes(orderStatus) ? 'Agent on the way' : orderStatus === 'DELIVERED' ? 'Agent reached' : 'Awaiting prep'}
            </small>
          </div>
          <div className={`timeline-step ${['ARRIVED', 'DELIVERED'].includes(orderStatus) ? 'active' : ''} ${orderStatus === 'ARRIVED' ? 'pulse-timeline' : ''}`}>
            <div className="step-icon"><MapPin size={20} /></div>
            <span>Arrived</span>
            <small style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>
              {orderStatus === 'ARRIVED' ? 'Agent arrived!' : orderStatus === 'DELIVERED' ? 'Delivered' : 'Awaiting transit'}
            </small>
          </div>
        </div>

        {/* Order Details */}
        <div className="tracking-details">
          <div className="info-box">
            <h4>Order Items</h4>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: '0.5rem 0' }}>{order.itemName}</p>
            <p style={{ color: '#34d399', fontWeight: 700 }}>Amount: ₹{Number(order.amount).toFixed(2)}</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#a0a0b0' }}>
              Kitchen Status: <strong>{
                orderStatus === 'PLACED' ? 'Order Placed' :
                orderStatus === 'PAYMENT_SUCCESS' ? 'Preparing Items' :
                orderStatus === 'KITCHEN_READY' ? 'Order Prepared & Ready' :
                orderStatus === 'PICKED_UP' ? 'On the way' :
                orderStatus === 'ARRIVED' ? 'Arrived at your location' :
                'Delivered'
              }</strong>
            </p>
          </div>

          {order.partnerPhone ? (
            <div className="info-box agent-info animation-fade-in" style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.15)' }}>
              <h4>Delivery Agent</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="agent-avatar" style={{ background: 'rgba(52, 211, 153, 0.1)' }}><Truck size={24} color="#34d399" /></div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#34d399' }}>Partner ({order.partnerPhone})</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#a0a0b0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={12}/> +91 {order.partnerPhone}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="info-box agent-info animation-fade-in" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <h4>Delivery Agent</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="agent-avatar" style={{ background: 'rgba(255,255,255,0.05)' }}><Truck size={24} /></div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#9ca3af' }}>Finding nearby partner...</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Please wait...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Mockup */}
        <div className="map-mockup" style={{ position: 'relative', overflow: 'hidden' }}>
          <Store size={24} color="#f59e0b" style={{ position: 'absolute', left: '10%', top: '45%', filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.3))' }} />
          <MapPin size={32} color="#ff6584" className="map-marker-delivery" style={{ position: 'absolute', right: '10%', top: '45%', filter: 'drop-shadow(0 0 8px rgba(255,101,132,0.4))' }} />
          
          {['PICKED_UP', 'ARRIVED'].includes(orderStatus) && (
            <div 
              className="map-marker-agent animation-scooter-move" 
              style={{ 
                position: 'absolute', 
                left: orderStatus === 'ARRIVED' ? '82%' : '45%', 
                top: '42%',
                transition: 'left 3s ease-in-out'
              }}
            >
              <Truck size={32} color="#34d399" style={{ filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.5))' }} />
            </div>
          )}
          <div className="map-label">Live Map Tracking Simulation</div>
        </div>

        <div className="tracking-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="danger-btn" onClick={() => setShowCancelModal(true)} disabled={['ARRIVED', 'DELIVERED'].includes(orderStatus)}>
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTracking;
