import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      setError('You must be logged in to place an order.');
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Shipping address is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loadRazorpay();

      if (!res) {
        setError('Failed to load Razorpay. Please check your internet connection.');
        return;
      }

      const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay API Key
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Nature Embroidery',
        description: 'Payment for embroidery order',
        handler: async function (response: any) {
          // Payment successful, save order details
          const { data, error } = await supabase
            .from('orders')
            .insert([
              {
                user_id: user.id,
                total_amount: totalAmount,
                shipping_address: shippingAddress,
                status: 'confirmed',
                payment_status: 'paid',
                razorpay_payment_id: response.razorpay_payment_id,
              },
            ])
            .select();

          if (error) throw error;

          const orderId = data[0].id;

          // Insert order items
          const orderItems = cart.map((item) => ({
            order_id: orderId,
            design_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price,
          }));

          const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
          if (itemsError) throw itemsError;

          // Clear Cart & Redirect
          clearCart();
          navigate(`/order-confirmation/${orderId}`);
        },
        prefill: {
          name: user?.full_name || 'Guest',
          email: user?.email || 'guest@example.com',
          contact: user?.phone_number || '', // ✅ Use correct property
        },
        theme: {
          color: '#6D28D9',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Cart Summary */}
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <span>{item.name} (x{item.quantity})</span>
              <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xl font-bold text-right">Total: ₹{totalAmount.toFixed(2)}</div>

        {/* Shipping Address */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">Shipping Address</label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Enter your address..."
            rows={3}
          />
        </div>

        {/* Place Order & Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

