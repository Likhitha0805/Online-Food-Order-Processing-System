import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Wifi, WifiOff, RefreshCw, Clock,
  ChefHat, CreditCard, Truck, XCircle, ShoppingBag
} from 'lucide-react';
import { getOrders } from '../services/api';

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

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await getOrders();
      setOrders(data.sort((a, b) => b.id - a.id));
      setConnected(true);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      setConnected(false);
      const targetBackend = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/orders').replace('/api/orders', '').replace(/^https?:\/\//, '');
      setError(`Cannot connect to backend at ${targetBackend}`);
    }
  }, []);

  // Initial fetch and polling every 2 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Fetch when a new order is created externally
  useEffect(() => {
    if (refreshTrigger > 0) fetchOrders();
  }, [refreshTrigger, fetchOrders]);

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
                Polling every 2 seconds
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          <div className="alert-custom alert-error">
            <WifiOff size={15} />
            {error}
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
