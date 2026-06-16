import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import OrderDashboard from './components/OrderDashboard';
import LoginPage from './components/LoginPage';
import PaymentPage from './components/PaymentPage';
import DeliveryDetails from './components/DeliveryDetails';
import CustomerTracking from './components/CustomerTracking';
import { Utensils, Zap } from 'lucide-react';

// The original customer layout wrapper
const CustomerLayout = () => {
  return (
    <>
      <header className="app-header">
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="brand">
            <div className="brand-icon">
              <Utensils size={20} color="#fff" />
            </div>
            <div>
              <div className="brand-title">FoodOrder Pro</div>
              <div className="brand-sub">Customer Portal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 100, padding: '0.35rem 0.9rem' }}>
            <Zap size={12} color="#a5a0ff" />
            Powered by Spring Boot + ActiveMQ
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};

const CustomerHome = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleOrderCreated = () => setRefreshTrigger((prev) => prev + 1);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      <div style={{ position: 'sticky', top: '90px' }}>
        <OrderForm onOrderCreated={handleOrderCreated} />
      </div>
      <OrderDashboard refreshTrigger={refreshTrigger} />
    </div>
  );
};

import PartnerDashboard from './components/PartnerDashboard';
import ActiveDelivery from './components/ActiveDelivery';
import PartnerWallet from './components/PartnerWallet';
import { NavLink } from 'react-router-dom';

const PartnerLayout = () => {
  return (
    <div className="partner-container">
      <header className="partner-header">
        <div className="partner-brand">
          <Utensils size={24} /> Partner App
        </div>
        <nav className="partner-nav">
          <NavLink to="/partner" end className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/partner/wallet" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Wallet</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="delivery-details" element={<DeliveryDetails />} />
          <Route path="tracking" element={<CustomerTracking />} />
        </Route>

        {/* Partner Routes */}
        <Route path="/partner" element={<PartnerLayout />}>
          <Route index element={<PartnerDashboard />} />
          <Route path="active-delivery" element={<ActiveDelivery />} />
          <Route path="wallet" element={<PartnerWallet />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
