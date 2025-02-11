import React, { useState } from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const Contact = () => {
  const { user } = useAuthStore();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setStatus('error');
      setErrorMessage('Please log in to send a message');
      return;
    }

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            subject,
            message
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          Have questions about our embroidery designs? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
              <span>natureembroideries@gmail.com</span>
            </div>
            <p className="text-gray-600">
              We typically respond within 24 hours during business days.
            </p>

            {/* Business Hours Section */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Business Hours
              </h3>
              <p className="text-gray-600">
                You can place your orders **anytime, 24/7**.  
                The design completion time depends on the complexity of the design.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {errorMessage}
              </div>
            )}
            
            {status === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
