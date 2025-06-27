"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

export default function ProdukPage() {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Untuk popup
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/konten/produk")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Gagal fetch produk:", err));
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="Produk" className="py-24 bg-[var(--background)] relative">
      <div className="max-w-6xl mx-auto px-4 md:px-2">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h1 className="text-base md:text-lg font-bold text-gray-600 flex items-center gap-4 text-center md:text-left">
            Produk
            <span className="w-24 border-b-2 border-[var(--secondary)]" />
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary)] mt-2 text-left">
            Bukan Sekadar Inovasi
          </h2>
        </motion.div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[300px]"
        >
          {currentItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              onClick={() => setSelectedProduct(item)} // ✅ Klik seluruh card
              className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={item.foto}
                alt={`Gambar ${item.nama}`}
                className="w-full h-55 object-cover rounded-xl mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">{item.nama}</h3>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 items-center min-h-[40px] space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium">
            {currentPage}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Modal Popup Detail */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative shadow-lg">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Gambar kiri */}
              <div>
                <img
                  src={selectedProduct.foto}
                  alt={`Detail ${selectedProduct.nama}`}
                  className="w-full h-55 object-cover rounded-xl mb-4"
                />
                {selectedProduct.pembuat && (
                  <p className="text-sm text-gray-500">
                    Dibuat oleh: {selectedProduct.pembuat}
                  </p>
                )}
              </div>

              {/* Detail kanan */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {selectedProduct.nama}
                </h3>
                <p className="text-gray-700 mb-2">
                  {selectedProduct.deskripsi}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
