import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // ✅ Import HelmetProvider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Designs from './pages/Designs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <HelmetProvider> {/* ✅ Wrap entire app for Helmet SEO support */}
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/designs" element={<Designs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

