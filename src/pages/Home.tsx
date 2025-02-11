import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // ✅ Import Helmet for SEO
import { BedDouble as Needle, Heart, ShoppingBag, MessageCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Nature Embroidery - Custom Handmade Designs</title>
        <meta
          name="description"
          content="Discover beautifully handcrafted embroidery designs tailored to your needs. Order custom embroidery online with ease!"
        />
        <meta name="keywords" content="embroidery, custom embroidery, handmade designs, custom stitching, embroidery shop" />
        <meta name="author" content="Nature Embroidery" />
        <meta property="og:title" content="Nature Embroidery - Custom Handmade Designs" />
        <meta property="og:description" content="Get the best embroidery patterns and designs online. Order now!" />
        <meta property="og:image" content="/images/embroidery-preview.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/embroidery-bg.jpg")', // ✅ Updated background image
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Custom Embroidery Designs</h1>
          <p className="text-xl mb-8">Transform your ideas into beautiful embroidered creations</p>
          <Link
            to="/designs"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Browse Designs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Needle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">Professional quality embroidery designs tailored to your needs</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Handcrafted Care</h3>
              <p className="text-gray-600">Each design is created with attention to detail and love</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
              <p className="text-gray-600">Simple and secure ordering process with fast delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="mb-8">Contact us today to discuss your embroidery needs</p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-purple-700 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-100 transition duration-300"
          >
            <MessageCircle className="mr-2" />
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;