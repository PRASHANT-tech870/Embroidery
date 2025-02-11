import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Shipping Policy</h1>
      <p>We ensure that your orders are shipped on time with the best possible service.</p>

      <h2 className="text-xl font-semibold mt-6">1. Processing Time</h2>
      <p>Orders are processed within 3-5 business days.</p>

      <h2 className="text-xl font-semibold mt-6">2. Shipping Methods</h2>
      <p>We provide standard and express shipping options.</p>

      <h2 className="text-xl font-semibold mt-6">3. Tracking Orders</h2>
      <p>Tracking details will be shared once your order is dispatched.</p>

      <p className="mt-6">For any shipping concerns, contact us at <a href="mailto:natureembroideries@gmail.com" className="text-purple-600">natureembroideries@gmail.com</a></p>
    </div>
  );
};

export default ShippingPolicy;
