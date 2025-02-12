import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";

interface Design {
  id: string;
  name: string;
  pdf_url: string;
  max_pages: number;
  price_range: string;
}

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
  const { addToCart } = useCartStore();
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
      image_url: "",
    });

    alert(`Added Design (Page ${selectedPage}) to Cart!`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Embroidery Designs</h1>

      {designs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No designs available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {designs.map((design) => (
            <div
              key={design.id}
              className="border p-4 md:p-6 bg-white rounded-lg shadow-md flex flex-col"
            >
              <h3 className="text-lg md:text-xl font-semibold">{design.name}</h3>
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
                <label className="block font-semibold text-sm md:text-base">
                  Enter Design Page (1-{design.max_pages})
                </label>
                <input
                  type="number"
                  min="1"
                  max={design.max_pages}
                  value={selectedPages[design.id] || ""}
                  onChange={(e) => handlePageSelection(design.id, parseInt(e.target.value), design.max_pages)}
                  className="border rounded-lg p-2 w-full mt-2 text-sm md:text-base"
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
                className="mt-4 bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 justify-center hover:bg-purple-700 disabled:opacity-50 text-sm md:text-base"
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
