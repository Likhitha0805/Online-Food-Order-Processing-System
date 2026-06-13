import React, { useState } from 'react';
import { IndianRupee, Landmark, History, CheckCircle } from 'lucide-react';
import './PartnerFlow.css';

const PartnerWallet = () => {
  const [bankDetails, setBankDetails] = useState({ account: '', ifsc: '' });
  const [saved, setSaved] = useState(false);

  // Mock balance (e.g. 5 orders * 20)
  const balance = 100;

  const handleSaveBank = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="partner-content">
      <div className="dashboard-card">
        <h2>Earnings & Wallet</h2>
        
        <div className="wallet-balance-card">
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Available Balance</p>
          <div className="balance-amount">
            ₹{balance}.00
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.9rem' }}>
            Earned ₹20.00 per order
          </p>
        </div>

        <div className="wallet-info">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
            <History size={18} color="#60a5fa" />
            Payout Schedule
          </h4>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>
            Every Monday the amount will be credited to your linked bank account. Minimum payout is ₹500.
          </p>
        </div>

        <h3>Bank Details</h3>
        <form onSubmit={handleSaveBank}>
          <div className="partner-form-group">
            <label>Account Number</label>
            <input 
              type="password" 
              placeholder="Enter Account Number" 
              value={bankDetails.account}
              onChange={(e) => setBankDetails({...bankDetails, account: e.target.value})}
              required
            />
          </div>
          <div className="partner-form-group">
            <label>IFSC Code</label>
            <input 
              type="text" 
              placeholder="e.g. HDFC0001234" 
              value={bankDetails.ifsc}
              onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="action-btn" style={{ background: '#4f46e5', color: 'white' }}>
            {saved ? <><CheckCircle size={20} /> Details Saved</> : <><Landmark size={20} /> Save Bank Details</>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default PartnerWallet;
