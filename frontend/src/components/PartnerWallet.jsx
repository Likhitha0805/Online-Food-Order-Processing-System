import React, { useState, useEffect, useCallback } from 'react';
import { IndianRupee, Landmark, History, CheckCircle } from 'lucide-react';
import './PartnerFlow.css';

const PartnerWallet = () => {
  const [partnerPhone] = useState(localStorage.getItem('partner_phone') || '9876543210');
  const [bankDetails, setBankDetails] = useState({ account: '', ifsc: '' });
  const [saved, setSaved] = useState(false);
  const [balance, setBalance] = useState(0);

  const loadPartnerWallet = useCallback(() => {
    const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
    let partner = partners.find(p => p.phone === partnerPhone);
    if (partner) {
      setBalance(partner.balance || 0);
      setBankDetails(partner.bankDetails || { account: '', ifsc: '' });
    }
  }, [partnerPhone]);

  useEffect(() => {
    loadPartnerWallet();
    window.addEventListener('partners_updated', loadPartnerWallet);
    return () => window.removeEventListener('partners_updated', loadPartnerWallet);
  }, [loadPartnerWallet]);

  const handleSaveBank = (e) => {
    e.preventDefault();
    const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
    const partnerIdx = partners.findIndex(p => p.phone === partnerPhone);
    if (partnerIdx !== -1) {
      partners[partnerIdx].bankDetails = bankDetails;
      localStorage.setItem('delivery_partners', JSON.stringify(partners));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    window.dispatchEvent(new Event('partners_updated'));
  };

  return (
    <div className="partner-content">
      <div className="dashboard-card">
        <h2>Earnings & Wallet</h2>
        
        <div className="wallet-balance-card">
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Available Balance</p>
          <div className="balance-amount">
            ₹{balance.toFixed(2)}
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
            Every Monday the amount will credits to the delivery partner account.
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
