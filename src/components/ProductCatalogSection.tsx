import React, { useState, useMemo } from 'react';
import { ShowroomItem, ShowroomProduct } from '../types/salespilot';
import { ProductCard } from './ProductCard';
import { Search, Sparkles, Filter, GitCompare, Box } from 'lucide-react';

interface ProductCatalogSectionProps {
  showroom: ShowroomItem;
  selectedProductId: string;
  comparedProducts: ShowroomProduct[];
  onSelectProductFor3D: (product: ShowroomProduct) => void;
  onViewProductDetails: (product: ShowroomProduct) => void;
  onToggleCompareProduct: (product: ShowroomProduct) => void;
  onOpenCompareModal: () => void;
  onBuyProduct: (product: ShowroomProduct) => void;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  showroom,
  selectedProductId,
  comparedProducts,
  onSelectProductFor3D,
  onViewProductDetails,
  onToggleCompareProduct,
  onOpenCompareModal,
  onBuyProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const products = showroom.products || [];

  // Available brands in current showroom
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.metrics.some((m) => m.value.toLowerCase().includes(q)) ||
        p.specs.some((s) => s.value.toLowerCase().includes(q));

      return matchesBrand && matchesSearch;
    });
  }, [products, selectedBrand, searchQuery]);

  return (
    <div className="space-y-4 rounded-3xl border border-white bg-white/70 backdrop-blur-md p-6 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Box className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{showroom.name} Catalog</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                {products.length} Models
              </span>
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">{showroom.tagline}</p>
        </div>

        {/* Search Bar & Active Compare Trigger */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search specs, models, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/90 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {comparedProducts.length > 0 && (
            <button
              onClick={onOpenCompareModal}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Compare ({comparedProducts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Brand Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`rounded-xl px-3 py-1 text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              selectedBrand === b
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {b === 'all' ? 'All Brands' : b}
          </button>
        ))}
      </div>

      {/* Product Cards Grid - 10 Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isSelectedFor3D={selectedProductId === p.id}
            isCompared={comparedProducts.some((cp) => cp.id === p.id)}
            onViewIn3D={onSelectProductFor3D}
            onViewDetails={onViewProductDetails}
            onToggleCompare={onToggleCompareProduct}
            onBuyNow={onBuyProduct}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center text-xs text-slate-400">
          No products matched your search. Try clearing filters or search query.
        </div>
      )}
    </div>
  );
};
