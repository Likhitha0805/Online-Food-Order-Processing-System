import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, CheckCircle, ArrowRight } from 'lucide-react';
import './CustomerFlow.css';

const PaymentPage = () => {
  const [method, setMethod] = useState('card');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    setShowPopup(true);
    // Hide popup after 2 seconds and navigate to next page
    setTimeout(() => {
      setShowPopup(false);
      navigate('/customer/delivery-details');
    }, 2000);
  };

  return (
    <div className="flow-container">
      {showPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <CheckCircle size={64} className="success-icon" />
            <h2>Order Placed Successful</h2>
          </div>
        </div>
      )}

      <div className="flow-card">
        <h2>Payment Method</h2>
        <p>Choose how you want to pay for your order</p>

        <form onSubmit={handlePayment} className="payment-form">
          <div className="payment-options">
            <label className={`payment-option ${method === 'card' ? 'selected' : ''}`}>
              <input type="radio" name="payment" checked={method === 'card'} onChange={() => setMethod('card')} />
              <CreditCard size={24} />
              <span>Credit/Debit Card</span>
            </label>
            <label className={`payment-option ${method === 'upi' ? 'selected' : ''}`}>
              <input type="radio" name="payment" checked={method === 'upi'} onChange={() => setMethod('upi')} />
              <Landmark size={24} />
              <span>UPI / NetBanking</span>
            </label>
          </div>

          {method === 'card' && (
            <div className="card-details animation-fade-in">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="password" placeholder="***" required />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="primary-btn mt-4">
            I have pay (Proceed) <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
