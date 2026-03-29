import { createContext, useContext, useState, useEffect } from 'react';

// 1️⃣ Create context
const OrdersContext = createContext();

// 2️⃣ Provider component
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // Example: load some dummy data on mount
  useEffect(() => {
    const dummyOrders = [
      { id: 1, customerName: 'Uchenna', status: 'pending', date: '2026-03-25' },
      { id: 2, customerName: 'Amaka', status: 'completed', date: '2026-03-20' },
      { id: 3, customerName: 'Emeka', status: 'overdue', date: '2026-03-10' },
      { id: 4, customerName: 'Chidinma', status: 'pending', date: '2026-03-27' },
      { id: 5, customerName: 'Tosin', status: 'completed', date: '2026-03-22' },
      { id: 6, customerName: 'Uche', status: 'pending', date: '2026-03-28' },
      { id: 7, customerName: 'Ngozi', status: 'overdue', date: '2026-03-12' },
    ];
    setOrders(dummyOrders);
  }, []);

  // Optional: function to add new orders
  const addOrder = (order) => {
    setOrders(prev => [...prev, { id: prev.length + 1, ...order }]);
  };

  // Optional: function to update order status
  const updateOrderStatus = (id, status) => {
    setOrders(prev =>
      prev.map(order => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

// 3️⃣ Hook to use the context
export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}