import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';

interface Design {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  dimensions: string;
  stitch_count: number;
}

const Designs = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-600">Loading designs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Embroidery Designs</h1>
      
      {designs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No designs available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={design.image_url || 'https://images.unsplash.com/photo-1528255671579-01b9e182ed1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}
                alt={design.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{design.name}</h3>
                <p className="text-gray-600 mb-2">{design.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Dimensions: {design.dimensions}</p>
                    <p className="text-sm text-gray-500">Stitches: {design.stitch_count}</p>
                    <p className="text-lg font-bold text-purple-600">${design.price}</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Designs;