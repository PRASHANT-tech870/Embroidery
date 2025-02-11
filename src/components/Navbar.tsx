import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 hover:text-white transition">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-cover rounded-full" />
              <span className="font-bold text-xl">Nature Embroidery</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/designs" className="text-white/80 hover:text-white transition">Designs</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition">Contact</Link>

            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-white hover:text-gray-300 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="text-white/80 hover:text-white transition">
                  My Orders
                </Link>
                <Link to="/profile" className="text-white/80 hover:text-white transition">
                  <User size={20} />
                </Link>
                <button onClick={handleSignOut} className="text-white/80 hover:text-white transition">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white transition">Login</Link>
                <Link to="/signup" className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-white hover:text-purple-800 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


