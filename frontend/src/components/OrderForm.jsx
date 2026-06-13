import React, { useState } from 'react';
import { ShoppingCart, User, Package, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';

const OrderForm = ({ onOrderCreated }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    itemName: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.itemName || !formData.amount) {
      setAlert({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      const payload = {
        customerName: formData.customerName,
        itemName: formData.itemName,
        amount: parseFloat(formData.amount),
      };
      await createOrder(payload);
      setAlert({ type: 'success', message: `Order placed for ${formData.customerName}!` });
      setFormData({ customerName: '', itemName: '', amount: '' });
      if (onOrderCreated) onOrderCreated();
      
      // Navigate to payment page
      navigate('/customer/payment');
    } catch (err) {
      console.error('Order submission error:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Is the backend running?';
      setAlert({ type: 'error', message: msg });
      
      // DEMO MODE: Proceed anyway if backend is down so user can test the UI
      setTimeout(() => {
        navigate('/customer/payment');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="section-title mb-4">
        <div className="section-icon" style={{ background: 'rgba(108,99,255,0.15)' }}>
          <ShoppingCart size={16} color="#a5a0ff" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>Place New Order</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Fill in the details below</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label-custom">
            <User size={11} style={{ marginRight: 4 }} />
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="form-input-custom"
            placeholder="e.g. Likhitha"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label-custom">
            <Package size={11} style={{ marginRight: 4 }} />
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="form-input-custom"
            placeholder="e.g. Margherita Pizza"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label-custom">
            <DollarSign size={11} style={{ marginRight: 4 }} />
            Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input-custom"
            placeholder="e.g. 250"
            min="0"
            step="0.01"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="spin-icon" />
              Placing Order...
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Place Order
            </>
          )}
        </button>
      </form>

      {alert && (
        <div className={`alert-custom ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alert.type === 'success'
            ? <CheckCircle size={15} />
            : <AlertCircle size={15} />
          }
          {alert.message}
        </div>
      )}

      <style>{`
        .spin-icon { animation: spinAnim 1s linear infinite; }
        @keyframes spinAnim { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OrderForm;
