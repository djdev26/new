import React from 'react';
import { ShowroomProduct } from '../types/salespilot';
import { X, GitCompare, Box, ShoppingCart, Check, ShieldCheck } from 'lucide-react';

interface ProductCompareModalProps {
  products: ShowroomProduct[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
  onMount3D: (product: ShowroomProduct) => void;
  onBuyNow: (product: ShowroomProduct) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
  onMount3D,
  onBuyNow,
}) => {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <GitCompare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Side-by-Side Product Comparison</h2>
              <p className="text-xs text-slate-500">Comparing {products.length} models across key performance & technical benchmarks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-[600px]">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 relative">
                <button
                  onClick={() => onRemoveProduct(p.id)}
                  className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                  title="Remove from comparison"
                >
                  <X className="h-4 w-4" />
                </button>

                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{p.brand}</span>
                <h3 className="text-base font-black text-slate-900 pr-6 mt-0.5 line-clamp-1">{p.name}</h3>
                <div className="text-lg font-extrabold text-slate-900 my-2">{p.priceFormatted}</div>

                {/* Key Metrics */}
                <div className="space-y-1.5 border-y border-slate-200 py-3 my-2 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Metrics:</div>
                  {p.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-150 last:border-b-0">
                      <span className="text-slate-500">{m.label}:</span>
                      <span className="font-bold text-slate-800">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Top Specs */}
                <div className="space-y-1 my-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Specs:</div>
                  {p.specs.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="text-xs text-slate-600 truncate">
                      <strong className="text-slate-700">{s.label}: </strong>
                      <span>{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <button
                    onClick={() => {
                      onMount3D(p);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-100"
                  >
                    <Box className="h-3.5 w-3.5 text-indigo-600" />
                    <span>[ VIEW IN 3D ]</span>
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow(p);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>[ BUY NOW ]</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
