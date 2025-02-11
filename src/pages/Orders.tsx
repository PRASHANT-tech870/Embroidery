import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  design_id: string;
  quantity: number;
  price_at_time: number;
  design: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            design:designs (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <Package className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center py-4">
                      <img
                        src={item.design.image_url || 'https://images.unsplash.com/photo-1528255671579-01b9e182ed1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80'}
                        alt={item.design.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium">{item.design.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ${item.price_at_time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold">${order.total_amount}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-medium">Payment Status:</span>
                    <span className={`capitalize ${
                      order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;