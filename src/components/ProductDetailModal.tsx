import React from 'react';
import { ShowroomProduct } from '../types/salespilot';
import { X, ExternalLink, ShieldCheck, CheckCircle2, Box, Star, Sparkles, ShoppingCart } from 'lucide-react';

interface ProductDetailModalProps {
  product: ShowroomProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onMount3D: (product: ShowroomProduct) => void;
  onBuyNow: (product: ShowroomProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onMount3D,
  onBuyNow,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700">
                [ 3D MODEL AVAILABLE ]
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {product.brand}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                {product.rating}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900">{product.name}</h2>
            <p className="text-xs text-slate-500">{product.tagline}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Price & Guarantee Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200/80 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Official List Price: </span>
            <div className="text-2xl font-black text-slate-900">{product.priceFormatted}</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>30-Day Zero-Risk Guarantee Included</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Overview</h4>
          <p className="text-xs text-slate-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Key Performance Metrics */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Performance</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {product.metrics.map((m, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 border border-slate-150 p-2.5 text-left">
                <div className="text-[10px] text-slate-500 font-medium">{m.label}</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Technical Specs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Specifications</h4>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden text-xs">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between px-4 py-2.5 bg-white odd:bg-slate-50/50">
                <span className="font-semibold text-slate-700">{spec.label}</span>
                <span className="text-slate-600 text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Finishes</h4>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <span className="h-3 w-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                  <span className="font-medium text-slate-700">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warranty */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Manufacturer Warranty:</span>
          <span className="font-bold text-slate-900">{product.warranty}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-150">
          {product.officialSourceUrl ? (
            <a
              href={product.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Official Manufacturer Specs</span>
            </a>
          ) : <div />}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onMount3D(product);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Box className="h-4 w-4 text-indigo-600" />
              <span>[ VIEW IN 3D ]</span>
            </button>

            <button
              onClick={() => {
                onBuyNow(product);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>[ BUY NOW / CONFIGURE ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
