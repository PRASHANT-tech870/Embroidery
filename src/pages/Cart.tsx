import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Trash, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-700">🛒 Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2">Browse our designs and add your favorite ones!</p>
        <Link to="/designs" className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          Browse Designs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Your Shopping Cart</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4">Item</th>
                <th className="text-center p-4">Quantity</th>
                <th className="text-center p-4">Price</th>
                <th className="text-center p-4">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="flex items-center space-x-4 p-4">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="font-semibold">{item.name}</span>
                  </td>
                  <td className="text-center p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50">
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="text-center p-4 font-semibold text-purple-600">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="text-center p-4">
                    <button onClick={() => removeFromCart(item.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-xl font-bold text-gray-700">
            Total: <span className="text-purple-600">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button onClick={clearCart} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
              Clear Cart
            </button>
            <Link to="/checkout" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
