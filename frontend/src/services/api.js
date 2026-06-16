import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/orders';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo mode helper functions
export const isDemoMode = () => {
  return localStorage.getItem('demo_mode_enabled') === 'true';
};

export const setDemoMode = (enabled) => {
  localStorage.setItem('demo_mode_enabled', enabled ? 'true' : 'false');
  if (enabled && !localStorage.getItem('demo_orders')) {
    // Initialize with some realistic mock orders
    const initialOrders = [
      {
        id: 101,
        customerName: 'Aarav Sharma',
        itemName: 'Paneer Butter Masala + Butter Naan',
        amount: 320.00,
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 102,
        customerName: 'Ananya Iyer',
        itemName: 'Chicken Biryani',
        amount: 280.00,
        status: 'KITCHEN_READY',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 103,
        customerName: 'Rahul Verma',
        itemName: 'Margherita Pizza',
        amount: 250.00,
        status: 'PLACED',
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem('demo_orders', JSON.stringify(initialOrders));
  }
};

// Simulation runner for demo orders status updates (simulating backend orchestration)
const runDemoSimulation = () => {
  if (!isDemoMode()) return;
  try {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    let modified = false;
    const updatedOrders = orders.map(order => {
      if (order.status === 'PLACED') {
        modified = true;
        return { ...order, status: 'PAYMENT_SUCCESS' };
      }
      if (order.status === 'PAYMENT_SUCCESS') {
        modified = true;
        return { ...order, status: 'KITCHEN_READY' };
      }
      if (order.status === 'KITCHEN_READY') {
        modified = true;
        return { ...order, status: 'DELIVERED' };
      }
      return order;
    });
    if (modified) {
      localStorage.setItem('demo_orders', JSON.stringify(updatedOrders));
      // Dispatch custom event to notify components that the state updated
      window.dispatchEvent(new Event('demo_orders_updated'));
    }
  } catch (e) {
    console.error('Demo simulation error:', e);
  }
};

// Start simulation interval if browser context exists
if (typeof window !== 'undefined') {
  setInterval(runDemoSimulation, 8000);
}

export const createOrder = async (orderData) => {
  if (isDemoMode()) {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 101;
    const newOrder = {
      id: newId,
      customerName: orderData.customerName,
      itemName: orderData.itemName,
      amount: Number(orderData.amount),
      status: 'PLACED',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    localStorage.setItem('demo_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('demo_orders_updated'));
    return { data: newOrder };
  }
  return api.post('', orderData);
};

export const getOrders = async () => {
  if (isDemoMode()) {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    return { data: orders };
  }
  return api.get('');
};

export const getOrderById = async (id) => {
  if (isDemoMode()) {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    const order = orders.find(o => o.id === parseInt(id));
    if (order) return { data: order };
    throw new Error('Order not found');
  }
  return api.get(`/${id}`);
};

export default api;

