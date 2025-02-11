import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore"; // Import cart store

interface Design {
  id: string;
  name: string;
  pdf_url: string;
  price_range: string; // Example: "500-2000"
}

const Designs = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const { addToCart } = useCartStore(); // Access cart functions

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase.from("designs").select("*");
      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error("Error fetching designs:", error);
    }
  };

  const handlePageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= 52) {
      setSelectedPage(page);
      setCalculatedPrice(500 + Math.floor(Math.random() * 1500)); // Set random price between 500-2000
    } else {
      setSelectedPage(null);
      setCalculatedPrice(null);
    }
  };

  const handleAddToCart = (design: Design) => {
    if (!selectedPage || !calculatedPrice) return;

    addToCart({
      id: `${design.id}-${selectedPage}`,
      name: `${design.name} (Page ${selectedPage})`,
      price: calculatedPrice,
      quantity: 1,
      image_url: "", // No image, only PDF reference
    });

    alert(`Added Design (Page ${selectedPage}) to Cart!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Embroidery Designs</h1>

      {designs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No designs available yet.</p>
        </div>
      ) : (
        <div className="border p-6 bg-white rounded-lg shadow-md">
          {designs.map((design) => (
            <div key={design.id}>
              <h3 className="text-2xl font-semibold">{design.name}</h3>
              <p className="text-gray-600">Price Range: ₹{design.price_range}</p>
              <a
                href={design.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
              >
                View Designs (PDF)
              </a>

              {/* Design Selection */}
              <div className="mt-4">
                <label className="block font-semibold">Enter Design Page (1-54)</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={selectedPage || ""}
                  onChange={handlePageSelection}
                  className="border rounded-lg p-2 w-full mt-2"
                />
              </div>

              {/* Show Calculated Price */}
              {calculatedPrice && (
                <div className="mt-2 text-lg font-bold text-green-600">
                  Price: ₹{calculatedPrice}
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(design)}
                disabled={!selectedPage || !calculatedPrice}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Designs;
