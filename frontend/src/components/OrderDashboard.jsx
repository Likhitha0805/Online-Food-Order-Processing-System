import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Wifi, WifiOff, RefreshCw, Clock,
  ChefHat, CreditCard, Truck, XCircle, ShoppingBag
} from 'lucide-react';
import { getOrders, isDemoMode, setDemoMode } from '../services/api';

const STATUS_CONFIG = {
  PLACED: {
    label: 'Placed',
    cls: 'status-PLACED',
    dotColor: '#a5a0ff',
    accent: 'linear-gradient(90deg, #6c63ff, #a5a0ff)',
    Icon: ShoppingBag,
    description: 'Order received, awaiting processing',
  },
  PAYMENT_SUCCESS: {
    label: 'Payment Success',
    cls: 'status-PAYMENT_SUCCESS',
    dotColor: '#c084fc',
    accent: 'linear-gradient(90deg, #a855f7, #c084fc)',
    Icon: CreditCard,
    description: 'Payment confirmed',
  },
  KITCHEN_READY: {
    label: 'Kitchen Ready',
    cls: 'status-KITCHEN_READY',
    dotColor: '#fb923c',
    accent: 'linear-gradient(90deg, #f97316, #fb923c)',
    Icon: ChefHat,
    description: 'Order prepared and ready',
  },
  DELIVERED: {
    label: 'Delivered',
    cls: 'status-DELIVERED',
    dotColor: '#4ade80',
    accent: 'linear-gradient(90deg, #22c55e, #4ade80)',
    Icon: Truck,
    description: 'Order delivered successfully',
  },
  CANCELLED: {
    label: 'Cancelled',
    cls: 'status-CANCELLED',
    dotColor: '#f87171',
    accent: 'linear-gradient(90deg, #ef4444, #f87171)',
    Icon: XCircle,
    description: 'Order was cancelled',
  },
};

const getConfig = (status) =>
  STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    cls: 'status-DEFAULT',
    dotColor: '#9ca3af',
    accent: 'rgba(156,163,175,0.3)',
    Icon: Clock,
    description: '',
  };

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const OrderCard = ({ order }) => {
  const config = getConfig(order.status);
  const StatusIcon = config.Icon;
  const pulse = order.status === 'PLACED' || order.status === 'PAYMENT_SUCCESS' || order.status === 'KITCHEN_READY';

  return (
    <div
      className="order-card"
      style={{ '--card-accent': config.accent }}
    >
      <div className="order-card-header">
        <div>
          <div className="order-id">Order #{order.id}</div>
          <div className="order-customer">{order.customerName}</div>
          <div className="order-item">
            <ChefHat size={13} style={{ color: 'var(--text-muted)' }} />
            {order.itemName}
          </div>
        </div>
        <span className={`status-badge ${config.cls}`}>
          <span
            className="pulse-dot"
            style={{
              background: config.dotColor,
              animation: pulse ? undefined : 'none',
              opacity: pulse ? undefined : 1,
            }}
          />
          {config.label}
        </span>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 10,
          padding: '0.6rem 0.8rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        <StatusIcon size={13} style={{ color: config.dotColor }} />
        {config.description}
      </div>

      <div className="order-footer">
        <div className="order-amount">₹{Number(order.amount).toFixed(2)}</div>
        <div style={{ textAlign: 'right' }}>
          <div className="order-time">{formatDate(order.createdAt)}</div>
          <div className="order-time">{formatTime(order.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

const StatChip = ({ label, count, color }) => (
  <div className="stat-chip">
    <span className="stat-num" style={{ color }}>{count}</span>
    {label}
  </div>
);

const OrderDashboard = ({ refreshTrigger }) => {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [error, setError] = useState(null);
  const [demoActive, setDemoActive] = useState(isDemoMode());

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await getOrders();
      setOrders(data.sort((a, b) => b.id - a.id));
      setConnected(true);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      if (isDemoMode()) {
        setConnected(true);
        setError(null);
        return;
      }
      setConnected(false);
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/orders';
      const isLocalhost = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
      const msg = isLocalhost
        ? `Backend not reachable at ${apiUrl}. Start the order-service (java -jar order-service.jar) on your machine.`
        : `Cannot connect to backend at ${apiUrl}. Check that the backend service is running.`;
      setError(msg);
    }
  }, []);

  // Initial fetch and polling - polls less frequently if backend is offline to avoid console flood
  useEffect(() => {
    fetchOrders();
    const pollInterval = demoActive ? 3000 : 8000;
    const interval = setInterval(fetchOrders, pollInterval);
    return () => clearInterval(interval);
  }, [fetchOrders, demoActive]);

  // Listen for demo mode updates from other components
  useEffect(() => {
    const handleDemoUpdate = () => {
      fetchOrders();
    };
    window.addEventListener('demo_orders_updated', handleDemoUpdate);
    return () => window.removeEventListener('demo_orders_updated', handleDemoUpdate);
  }, [fetchOrders]);

  // Fetch when a new order is created externally
  useEffect(() => {
    if (refreshTrigger > 0) fetchOrders();
  }, [refreshTrigger, fetchOrders]);

  const handleEnableDemoMode = () => {
    setDemoMode(true);
    setDemoActive(true);
    setError(null);
    setConnected(true);
    fetchOrders();
    // Refresh page or broadcast event
    window.dispatchEvent(new Event('demo_mode_changed'));
  };

  // Build stats
  const stats = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    label: cfg.label,
    count: orders.filter((o) => o.status === key).length,
    color: cfg.dotColor,
  }));

  return (
    <div>
      {/* Dashboard Header */}
      <div className="glass-card p-4 mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div className="section-title">
            <div className="section-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
              <LayoutDashboard size={16} color="#4ade80" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Live Order Dashboard</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                {demoActive ? 'Simulation active (updates every 8s)' : 'Polling every 8 seconds'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {demoActive && (
              <span style={{ 
                background: 'rgba(16,185,129,0.15)', 
                color: '#34d399', 
                padding: '0.2rem 0.6rem', 
                borderRadius: 20, 
                fontSize: '0.7rem', 
                fontWeight: 600 
              }}>
                Demo Simulation Active
              </span>
            )}
            {lastRefresh && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {formatTime(lastRefresh.toISOString())}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600 }}>
              {connected ? (
                <>
                  <div className="polling-dot" />
                  <span style={{ color: '#4ade80' }}>Live</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} color="#f87171" />
                  <span style={{ color: '#f87171' }}>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat-chip">
            <span className="stat-num" style={{ color: 'var(--text-primary)' }}>{orders.length}</span>
            Total Orders
          </div>
          {stats.map((s) => (
            s.count > 0 && (
              <StatChip key={s.label} label={s.label} count={s.count} color={s.color} />
            )
          ))}
        </div>

        {error && (
          <div className="alert-custom alert-error" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <WifiOff size={15} />
              Backend Offline
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.85, lineHeight: 1.5 }}>
              {error}
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem', width: '100%' }}>
              <button 
                onClick={handleEnableDemoMode}
                className="btn-submit"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.75rem',
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  border: 'none',
                  margin: 0,
                  width: 'auto',
                  cursor: 'pointer'
                }}
              >
                Enable Demo Mode (Mock Backend)
              </button>
            </div>

            {(import.meta.env.VITE_API_BASE_URL || '').includes('localhost') || !import.meta.env.VITE_API_BASE_URL ? (
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                💡 Or start the backend locally to connect automatically.
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Order Grid */}
      {orders.length === 0 && !error ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <div className="empty-state-title">No orders yet</div>
            <div style={{ fontSize: '0.8rem' }}>Use the form to place your first order</div>
          </div>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;
