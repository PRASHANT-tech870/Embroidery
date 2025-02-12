import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";

interface Design {
  id: string;
  name: string;
  pdf_url: string;
  max_pages: number; // Number of pages for this PDF
  price_range: string;
}

// Designs Data with Different Page Limits
const designs: Design[] = [
  {
    id: "1",
    name: "Embroidery Design Set 1",
    pdf_url:
      "https://wnciekjnpsyqterxwhlv.supabase.co/storage/v1/object/public/design_pdfs/D%20Bp3600.pdf",
    max_pages: 52,
    price_range: "500-2000",
  },
  {
    id: "2",
    name: "Embroidery Design Set 2",
    pdf_url:
      "https://wnciekjnpsyqterxwhlv.supabase.co/storage/v1/object/public/design_pdfs/G%20Bp3600.pdf",
    max_pages: 52,
    price_range: "500-2000",
  },
  {
    id: "3",
    name: "Embroidery Design Set 3",
    pdf_url:
      "https://wnciekjnpsyqterxwhlv.supabase.co/storage/v1/object/public/design_pdfs/I%20Bp3600.pdf",
    max_pages: 54,
    price_range: "500-2000",
  },
  {
    id: "4",
    name: "Embroidery Design Set 4",
    pdf_url:
      "https://wnciekjnpsyqterxwhlv.supabase.co/storage/v1/object/public/design_pdfs/L%20Bp3600.pdf",
    max_pages: 50,
    price_range: "500-2000",
  },
  {
    id: "5",
    name: "Embroidery Design Set 5",
    pdf_url:
      "https://wnciekjnpsyqterxwhlv.supabase.co/storage/v1/object/public/design_pdfs/E%20Bp3600.pdf",
    max_pages: 48,
    price_range: "500-2000",
  },
];

const Designs = () => {
  const { addToCart } = useCartStore(); // Access cart functions
  const [selectedPages, setSelectedPages] = useState<{ [key: string]: number | null }>({});
  const [calculatedPrices, setCalculatedPrices] = useState<{ [key: string]: number | null }>({});

  const handlePageSelection = (designId: string, page: number, maxPages: number) => {
    if (page >= 1 && page <= maxPages) {
      setSelectedPages((prev) => ({ ...prev, [designId]: page }));
      setCalculatedPrices((prev) => ({ ...prev, [designId]: 500 + Math.floor(Math.random() * 1500) }));
    } else {
      setSelectedPages((prev) => ({ ...prev, [designId]: null }));
      setCalculatedPrices((prev) => ({ ...prev, [designId]: null }));
    }
  };

  const handleAddToCart = (design: Design) => {
    const selectedPage = selectedPages[design.id];
    const calculatedPrice = calculatedPrices[design.id];

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
            <div key={design.id} className="mb-6">
              <h3 className="text-2xl font-semibold">{design.name}</h3>
              <p className="text-gray-600">Price Range: ₹{design.price_range}</p>

              {/* PDF Link */}
              <div className="mt-2">
                <a
                  href={design.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline mt-1"
                >
                  View Design (PDF)
                </a>
              </div>

              {/* Page Selection */}
              <div className="mt-4">
                <label className="block font-semibold">
                  Enter Design Page (1-{design.max_pages})
                </label>
                <input
                  type="number"
                  min="1"
                  max={design.max_pages}
                  value={selectedPages[design.id] || ""}
                  onChange={(e) => handlePageSelection(design.id, parseInt(e.target.value), design.max_pages)}
                  className="border rounded-lg p-2 w-full mt-2"
                />
              </div>

              {/* Show Calculated Price */}
              {calculatedPrices[design.id] && (
                <div className="mt-2 text-lg font-bold text-green-600">
                  Price: ₹{calculatedPrices[design.id]}
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={() => handleAddToCart(design)}
                disabled={!selectedPages[design.id] || !calculatedPrices[design.id]}
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
