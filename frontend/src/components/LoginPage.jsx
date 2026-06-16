import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Truck, Phone, KeyRound, ArrowRight } from 'lucide-react';
import './LoginPage.css'; // We will create this

const LoginPage = () => {
  const [role, setRole] = useState(null); // 'customer' or 'partner'
  const [step, setStep] = useState(1); // 1: Select Role, 2: Phone Number, 3: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep(3);
      // Simulate AI OTP send
      console.log(`Sending AI OTP to ${phone}`);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      // Mock successful login
      if (role === 'customer') {
        localStorage.setItem('customer_logged_in', 'true');
        navigate('/customer');
      } else {
        localStorage.setItem('partner_phone', phone);
        localStorage.setItem('partner_logged_in', 'true');
        
        // Initialize partner profile in localStorage if not exists
        const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
        let partner = partners.find(p => p.phone === phone);
        if (!partner) {
          partner = {
            phone: phone,
            isOnline: false,
            balance: 0,
            bankDetails: { account: '', ifsc: '' },
            store: 'Central Kitchen - Downtown'
          };
          partners.push(partner);
          localStorage.setItem('delivery_partners', JSON.stringify(partners));
        }
        navigate('/partner');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to FoodOrder Pro</h1>
        <p className="login-subtitle">Please select how you want to continue</p>

        {step === 1 && (
          <div className="role-selection">
            <button className="role-btn customer-btn" onClick={() => handleRoleSelect('customer')}>
              <User size={32} />
              <span>Login as Customer</span>
              <small>Order delicious food</small>
            </button>
            <button className="role-btn partner-btn" onClick={() => handleRoleSelect('partner')}>
              <Truck size={32} />
              <span>Login as Delivery Partner</span>
              <small>Deliver smiles, earn money</small>
            </button>
          </div>
        )}

        {step === 2 && (
          <form className="phone-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Enter Mobile Number</label>
              <div className="input-with-icon">
                <Phone size={20} className="input-icon" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <button type="submit" className="primary-btn">
              Send OTP <ArrowRight size={18} />
            </button>
            <button type="button" className="text-btn" onClick={() => setStep(1)}>
              Back
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="otp-form" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter 4-digit OTP</label>
              <p className="otp-sent-text">OTP sent to {phone}</p>
              <div className="input-with-icon">
                <KeyRound size={20} className="input-icon" />
                <input
                  type="number"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <button type="submit" className="primary-btn">
              Verify & Login
            </button>
            <button type="button" className="text-btn" onClick={() => setStep(2)}>
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
