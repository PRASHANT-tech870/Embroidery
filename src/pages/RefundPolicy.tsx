import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Cancellation & Refunds</h1>
      <p>We strive for customer satisfaction and provide a transparent refund policy.</p>

      <h2 className="text-xl font-semibold mt-6">1. Order Cancellations</h2>
      <p>Orders can be canceled within 24 hours of placement.</p>

      <h2 className="text-xl font-semibold mt-6">2. Refund Policy</h2>
      <p>Refunds will be processed within 5-7 business days for eligible cancellations.</p>

      <h2 className="text-xl font-semibold mt-6">3. Damaged or Defective Items</h2>
      <p>If you receive a defective item, contact us within 48 hours for a replacement.</p>

      <p className="mt-6">For refund requests, contact us at <a href="mailto:natureembroideries@gmail.com" className="text-purple-600">natureembroideries@gmail.com</a></p>
    </div>
  );
};

export default RefundPolicy;
