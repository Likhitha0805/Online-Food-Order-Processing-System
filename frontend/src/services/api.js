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
        partnerPhone: '9876543210',
        partnerName: 'Partner (9876543210)',
        storeLocation: 'Central Kitchen - Downtown'
      },
      {
        id: 102,
        customerName: 'Ananya Iyer',
        itemName: 'Chicken Biryani',
        amount: 280.00,
        status: 'KITCHEN_READY',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        partnerPhone: null,
        partnerName: null,
        storeLocation: null
      },
      {
        id: 103,
        customerName: 'Rahul Verma',
        itemName: 'Margherita Pizza',
        amount: 250.00,
        status: 'PLACED',
        createdAt: new Date().toISOString(),
        partnerPhone: null,
        partnerName: null,
        storeLocation: null
      }
    ];
    localStorage.setItem('demo_orders', JSON.stringify(initialOrders));
  }
};

// Check for available partner and assign order
export const findAndAssignPartner = (order) => {
  const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  
  // Find online partners
  const onlinePartners = partners.filter(p => p.isOnline);
  if (onlinePartners.length === 0) return null;
  
  // Find which of these online partners are busy
  const busyPartnerPhones = new Set(
    orders
      .filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && o.partnerPhone)
      .map(o => o.partnerPhone)
  );
  
  // Choose first online partner who is not busy
  const availablePartner = onlinePartners.find(p => !busyPartnerPhones.has(p.phone));
  if (availablePartner) {
    order.partnerPhone = availablePartner.phone;
    order.partnerName = `Partner (${availablePartner.phone})`;
    order.storeLocation = availablePartner.store;
    return availablePartner;
  }
  return null;
};

// Assign pending orders to a partner when they go online or finish a delivery
export const assignPendingOrderToPartner = (partnerPhone) => {
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const partners = JSON.parse(localStorage.getItem('delivery_partners') || '[]');
  const partner = partners.find(p => p.phone === partnerPhone);
  if (!partner || !partner.isOnline) return null;
  
  // Check if partner already has an active order
  const hasActive = orders.some(o => o.partnerPhone === partnerPhone && o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  if (hasActive) return null;
  
  // Find first unassigned order
  const unassignedOrder = orders.find(o => !o.partnerPhone && o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  if (unassignedOrder) {
    unassignedOrder.partnerPhone = partner.phone;
    unassignedOrder.partnerName = `Partner (${partner.phone})`;
    unassignedOrder.storeLocation = partner.store;
    localStorage.setItem('demo_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('demo_orders_updated'));
    return unassignedOrder;
  }
  return null;
};

// Update order status in simulation
export const updateDemoOrderStatus = (orderId, newStatus) => {
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === parseInt(orderId));
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    localStorage.setItem('demo_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('demo_orders_updated'));
    return orders[orderIndex];
  }
  return null;
};

// Simulation runner for demo orders status updates (simulating backend orchestration)
const runDemoSimulation = () => {
  if (!isDemoMode()) return;
  try {
    const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    let modified = false;
    const updatedOrders = orders.map(order => {
      // If there is an assigned partner, only let backend simulate preparation
      // the partner will manually click "Picked Up" -> "Arrived" -> "Delivered"
      if (order.partnerPhone) {
        if (order.status === 'PLACED') {
          modified = true;
          return { ...order, status: 'PAYMENT_SUCCESS' };
        }
        if (order.status === 'PAYMENT_SUCCESS') {
          modified = true;
          return { ...order, status: 'KITCHEN_READY' };
        }
        // Wait at KITCHEN_READY for partner to pick up
        return order;
      }
      
      // If NO partner is assigned, simulate the entire flow automatically
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
      partnerPhone: null,
      partnerName: null,
      storeLocation: null
    };
    
    // Try to assign a partner immediately
    findAndAssignPartner(newOrder);
    
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

