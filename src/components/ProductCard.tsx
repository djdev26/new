import React from 'react';
import { ShowroomProduct } from '../types/salespilot';
import { Box, Check, Eye, GitCompare, ShoppingCart, Star, ShieldCheck, Sparkles, Zap, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: ShowroomProduct;
  isSelectedFor3D: boolean;
  isCompared: boolean;
  onViewIn3D: (product: ShowroomProduct) => void;
  onViewDetails: (product: ShowroomProduct) => void;
  onToggleCompare: (product: ShowroomProduct) => void;
  onBuyNow: (product: ShowroomProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelectedFor3D,
  isCompared,
  onViewIn3D,
  onViewDetails,
  onToggleCompare,
  onBuyNow,
}) => {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
        isSelectedFor3D
          ? 'border-indigo-500 bg-white shadow-lg ring-2 ring-indigo-400/50'
          : 'border-slate-200/80 bg-white/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner: 3D MODEL & Badges */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 tracking-wider">
            <Box className="h-3 w-3 animate-spin-slow" />
            [ 3D MODEL ]
          </span>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {product.brand}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
          {product.rating}
        </span>
      </div>

      {/* Product Name & Tagline */}
      <div className="px-4 pb-2">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 font-medium">{product.tagline}</p>
      </div>

      {/* Price */}
      <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-y border-slate-100 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Price: </span>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">{product.priceFormatted}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
          <ShieldCheck className="h-3 w-3" />
          30-Day Guarantee
        </span>
      </div>

      {/* Key Performance Section */}
      <div className="px-4 py-3 space-y-1.5 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-500" />
          Key Performance:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {product.metrics.map((m, idx) => (
            <div key={idx} className="rounded-lg bg-slate-50 border border-slate-150 p-2 text-left">
              <div className="text-[10px] text-slate-500 font-medium truncate">{m.label}</div>
              <div className="text-xs font-bold text-slate-800 truncate">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Technical Specs Summary */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Technical Specs:
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600">
            {product.specs.slice(0, 3).map((spec, i) => (
              <li key={i} className="flex items-start gap-1.5 truncate">
                <span className="text-indigo-500 font-bold">•</span>
                <span className="font-semibold text-slate-700">{spec.label}:</span>
                <span className="text-slate-500 truncate">{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onViewIn3D(product)}
            className={`flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-bold transition-all ${
              isSelectedFor3D
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
            title="Inspect 3D Model with full orbital camera and telematic hotspots"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="truncate">[ VIEW IN 3D ]</span>
          </button>

          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all"
            title="View complete specifications and official documentation"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="truncate">[ DETAILS ]</span>
          </button>

          <button
            onClick={() => onToggleCompare(product)}
            className={`flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              isCompared
                ? 'bg-amber-100 border border-amber-300 text-amber-900 font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Add to side-by-side comparison"
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span className="truncate">{isCompared ? 'COMPARING' : '[ COMPARE ]'}</span>
          </button>
        </div>

        <button
          onClick={() => onBuyNow(product)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm hover:shadow transition-all"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>[ BUY NOW / CONFIGURE ]</span>
        </button>
      </div>
    </div>
  );
};
