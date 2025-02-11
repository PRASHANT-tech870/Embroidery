import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p>Welcome to Nature Embroidery. By accessing our website, you agree to the following terms and conditions.</p>

      <h2 className="text-xl font-semibold mt-6">1. Use of Website</h2>
      <p>This website is for personal and business use. You may not use our designs for resale without permission.</p>

      <h2 className="text-xl font-semibold mt-6">2. Payments & Orders</h2>
      <p>All payments are processed securely via Razorpay. Orders will be confirmed only after successful payment.</p>

      <h2 className="text-xl font-semibold mt-6">3. Intellectual Property</h2>
      <p>All embroidery designs are the property of Nature Embroidery. Unauthorized use is prohibited.</p>

      <p className="mt-6">For any queries, contact us at <a href="mailto:natureembroideries@gmail.com" className="text-purple-600">natureembroideries@gmail.com</a></p>
    </div>
  );
};

export default Terms;
