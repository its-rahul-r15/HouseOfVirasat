import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, ChevronDown, Sparkles, SlidersHorizontal, RotateCcw, Loader2 } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productApi } from '../api/product.api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const metalParam = searchParams.get('metal') || 'ALL';
  const collectionParam = searchParams.get('collection') || 'ALL';
  const categoryParam = searchParams.get('category') || 'ALL';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const [priceBucket, setPriceBucket] = useState('ALL');
  const [stockStatus, setStockStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('in_stock_first');

  // Load collections and categories dynamically for filter tabs
  useEffect(() => {
    productApi.getCollections()
      .then((res) => {
        const data = res?.data || res || [];
        setCollections(Array.isArray(data) ? data : (data.collections || []));
      })
      .catch(() => {});

    productApi.getCategories()
      .then((res) => {
        const data = res?.data || res || [];
        setCategories(Array.isArray(data) ? data : (data.categories || []));
      })
      .catch(() => {});
  }, []);

  // Fetch products from backend API
  useEffect(() => {
    setLoading(true);
    const params = {
      metalType: metalParam !== 'ALL' ? metalParam : undefined,
      collection: collectionParam !== 'ALL' ? collectionParam : undefined,
      category: categoryParam !== 'ALL' ? categoryParam : undefined,
      q: searchParam || undefined,
    };

    productApi.getProducts(params)
      .then((res) => {
        const data = res?.data?.products || res?.products || (Array.isArray(res?.data) ? res.data : []);
        setProducts(data);
      })
      .catch((err) => {
        console.error('Failed to load products from database:', err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [metalParam, collectionParam, categoryParam, searchParam]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Collection filter
      if (collectionParam !== 'ALL') {
        const pCol = Array.isArray(p.collection)
          ? p.collection.map((c) => (typeof c === 'object' ? (c.slug || c.name || '') : String(c))).join(' ').toUpperCase()
          : (typeof p.collection === 'object' ? (p.collection?.slug || p.collection?.name || '') : String(p.collection || '')).toUpperCase();
        if (!pCol.includes(collectionParam.toUpperCase())) return false;
      }

      // Category filter
      if (categoryParam !== 'ALL') {
        const catClean = categoryParam.toLowerCase().trim();
        const catSingular = catClean.endsWith('s') ? catClean.slice(0, -1) : catClean;
        const pCatSlug = (typeof p.category === 'object' ? (p.category?.slug || p.category?.name || '') : String(p.category || '')).toLowerCase();
        const pCatName = (typeof p.category === 'object' ? (p.category?.name || '') : '').toLowerCase();
        const pTags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : String(p.tags || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pSub = (p.subcategory || '').toLowerCase();

        const matchesCat = pCatSlug.includes(catClean) || pCatSlug.includes(catSingular) ||
                           pCatName.includes(catClean) || pCatName.includes(catSingular) ||
                           pTags.includes(catClean) || pTags.includes(catSingular) ||
                           pName.includes(catClean) || pName.includes(catSingular) ||
                           pSub.includes(catClean) || pSub.includes(catSingular);

        if (!matchesCat) return false;
      }

      // Search
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(query);
        const matchesPurity = (p.purity || '').toLowerCase().includes(query);
        const catName = typeof p.category === 'object' ? (p.category?.name || p.category?.slug || '') : String(p.category || '');
        const matchesCat = catName.toLowerCase().includes(query);
        if (!matchesName && !matchesPurity && !matchesCat) return false;
      }

      // Price Bucket
      const price = p.sellingPrice || p.mrp || 0;
      if (priceBucket === 'UNDER_20K' && price > 20000) return false;
      if (priceBucket === '20K_40K' && (price < 20000 || price > 40000)) return false;
      if (priceBucket === 'ABOVE_40K' && price < 40000) return false;

      // Stock
      if (stockStatus === 'IN_STOCK' && p.availabilityStatus !== 'IN_STOCK') return false;
      if (stockStatus === 'MTO' && p.availabilityStatus !== 'MADE_TO_ORDER') return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.sellingPrice || a.mrp || 0;
      const priceB = b.sellingPrice || b.mrp || 0;
      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      if (sortBy === 'in_stock_first') {
        const aStock = a.availabilityStatus === 'IN_STOCK' ? 0 : 1;
        const bStock = b.availabilityStatus === 'IN_STOCK' ? 0 : 1;
        return aStock - bStock;
      }
      return 0;
    });
  }, [products, metalParam, collectionParam, categoryParam, searchParam, priceBucket, stockStatus, sortBy]);

  // Close mobile filter on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileFiltersOpen) {
        setMobileFiltersOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileFiltersOpen]);

  const handleMetalChange = (metal) => {
    const newParams = new URLSearchParams(searchParams);
    if (metal === 'ALL') newParams.delete('metal');
    else newParams.set('metal', metal);
    setSearchParams(newParams);
  };

  const handleCollectionChange = (coll) => {
    const newParams = new URLSearchParams(searchParams);
    if (coll === 'ALL') newParams.delete('collection');
    else newParams.set('collection', coll);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'ALL') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceBucket('ALL');
    setStockStatus('ALL');
    setSortBy('featured');
  };

  return (
    <div className="bg-white min-h-screen pt-14 lg:pt-[112px]">
      
      {/* Page Header & Breadcrumb */}
      <div className="bg-[#F9F8F5] border-b border-[#E5E2DA] py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B7280] uppercase tracking-wider mb-2 flex-wrap">
            <Link to="/" className="hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768]">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/shop" className="hover:text-[#1A1A1A]">Catalogue</Link>
            {categoryParam !== 'ALL' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#B89768] font-semibold capitalize">{categoryParam}</span>
              </>
            )}
            {metalParam !== 'ALL' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#B89768] font-semibold">{metalParam}</span>
              </>
            )}
            {collectionParam !== 'ALL' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#B89768] font-semibold">{collectionParam} Collection</span>
              </>
            )}
          </nav>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1A1A] capitalize">
            {categoryParam !== 'ALL'
              ? `${categoryParam} Collection`
              : collectionParam !== 'ALL'
              ? `${collectionParam} Collection`
              : metalParam === 'GOLD'
              ? 'Fine Gold & Diamonds'
              : metalParam === 'SILVER'
              ? '925 Sterling Silver & Polki'
              : 'The Heirloom Catalogue'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2 max-w-[600px] font-light">
            Every piece is certified with BIS hallmarking, handcrafted with authentic Jaipur karigari, and shipped with 100% transit insurance.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10">
        
        {/* Top Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E2DA]">
          
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            aria-expanded={mobileFiltersOpen}
            aria-controls="mobile-filter-drawer"
            className="md:hidden flex items-center gap-2 py-2.5 px-4 border border-[#E5E2DA] rounded-xs text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89768] active:scale-[0.98] min-h-[44px]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B89768]" aria-hidden="true" />
            <span>Filters</span>
          </button>

          {/* Result Count & Active Filter Chips */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-[#6B7280] font-medium">
              Showing <strong className="text-[#1A1A1A] tabular-nums">{filteredProducts.length}</strong> Heirlooms
            </span>

            {/* Active Category Chip */}
            {categoryParam !== 'ALL' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6F0] border border-[#B8935A] text-[#845E35] text-xs rounded-full font-medium">
                Category: <strong className="capitalize">{categoryParam}</strong>
                <button
                  type="button"
                  onClick={() => handleCategoryChange('ALL')}
                  className="hover:text-red-700 ml-0.5"
                  title="Remove Category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active Metal Chip */}
            {metalParam !== 'ALL' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6F0] border border-[#B8935A] text-[#845E35] text-xs rounded-full font-medium">
                Metal: <strong>{metalParam}</strong>
                <button
                  type="button"
                  onClick={() => handleMetalChange('ALL')}
                  className="hover:text-red-700 ml-0.5"
                  title="Remove Metal filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active Collection Chip */}
            {collectionParam !== 'ALL' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6F0] border border-[#B8935A] text-[#845E35] text-xs rounded-full font-medium">
                Collection: <strong>{collectionParam}</strong>
                <button
                  type="button"
                  onClick={() => handleCollectionChange('ALL')}
                  className="hover:text-red-700 ml-0.5"
                  title="Remove Collection filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="shop-sort" className="text-xs text-[#6B7280] hidden sm:inline">Sort By:</label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 bg-white border border-[#E5E2DA] rounded-xs text-xs text-[#1A1A1A] font-medium select-luxury cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#B89768]"
            >
              <option value="in_stock_first">In Stock First</option>
              <option value="featured">Featured Artisanal</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
          
          {/* Left Desktop Sidebar Filters */}
          <aside className="hidden md:block md:col-span-3 space-y-8 pr-4 border-r border-[#E5E2DA]" aria-label="Filters">
            
            {/* Header / Clear */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA]">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1A1A1A]">
                Refine Selection
              </span>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-[#6B7280] hover:text-[#B89768] flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B89768] rounded-xs transition-colors"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Jewellery Category
              </legend>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'All Categories', value: 'ALL' },
                  ...(categories.length > 0
                    ? categories.map((cat) => ({
                        label: cat.name,
                        value: cat.slug || cat.name,
                      }))
                    : [
                        { label: 'Rings', value: 'rings' },
                        { label: 'Earrings & Jhumkas', value: 'earrings' },
                        { label: 'Necklaces & Sets', value: 'necklaces' },
                        { label: 'Bangles & Kadas', value: 'bangles' },
                        { label: 'Pendants', value: 'pendants' },
                        { label: 'Bridal Suites', value: 'bridal' },
                      ]),
                ].map((cat) => {
                  const isChecked = categoryParam.toLowerCase() === cat.value.toLowerCase();
                  return (
                    <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={isChecked}
                        onChange={() => handleCategoryChange(cat.value)}
                        className="accent-[#B89768] focus-visible:ring-2 focus-visible:ring-[#B89768]"
                      />
                      <span className={`group-hover:text-[#1A1A1A] transition-colors ${isChecked ? 'text-[#845E35] font-semibold' : 'text-[#4A5568]'}`}>
                        {cat.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Metal Filter */}
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Precious Metal
              </legend>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'All Metals', value: 'ALL' },
                  { label: '925 Sterling Silver', value: 'SILVER' },
                  { label: '18K / 22K Solid Gold', value: 'GOLD' },
                ].map((m) => (
                  <label key={m.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="metal"
                      checked={metalParam === m.value}
                      onChange={() => handleMetalChange(m.value)}
                      className="accent-[#B89768] focus-visible:ring-2 focus-visible:ring-[#B89768]"
                    />
                    <span className="text-[#4A5568] group-hover:text-[#1A1A1A] transition-colors">
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Collection Filter */}
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Heirloom Collection
              </legend>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'All Collections', value: 'ALL' },
                  ...(collections.length > 0
                    ? collections.map((col) => ({
                        label: `${col.name.split('—')[0].trim()} Collection`,
                        value: (col.slug || col.name).toUpperCase(),
                      }))
                    : [
                        { label: 'REET Collection', value: 'REET' },
                        { label: 'RAJSI Collection', value: 'RAJSI' },
                        { label: 'NITYA Collection', value: 'NITYA' },
                        { label: 'NOOR Collection', value: 'NOOR' },
                      ]),
                ].map((c) => (
                  <label key={c.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="collection"
                      checked={collectionParam === c.value}
                      onChange={() => handleCollectionChange(c.value)}
                      className="accent-[#B89768] focus-visible:ring-2 focus-visible:ring-[#B89768]"
                    />
                    <span className="text-[#4A5568] group-hover:text-[#1A1A1A] transition-colors">
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Price Filter */}
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Price Range
              </legend>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'All Prices', value: 'ALL' },
                  { label: 'Under ₹ 20,000', value: 'UNDER_20K' },
                  { label: '₹ 20,000 – ₹ 40,000', value: '20K_40K' },
                  { label: 'Above ₹ 40,000', value: 'ABOVE_40K' },
                ].map((p) => (
                  <label key={p.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceBucket === p.value}
                      onChange={() => setPriceBucket(p.value)}
                      className="accent-[#B89768] focus-visible:ring-2 focus-visible:ring-[#B89768]"
                    />
                    <span className="text-[#4A5568] group-hover:text-[#1A1A1A] transition-colors">
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Stock / Availability */}
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A]">
                Availability
              </legend>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'All Pieces', value: 'ALL' },
                  { label: 'Ready to Ship (In Stock)', value: 'IN_STOCK' },
                  { label: 'Made to Order Karigari', value: 'MTO' },
                ].map((s) => (
                  <label key={s.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockStatus === s.value}
                      onChange={() => setStockStatus(s.value)}
                      className="accent-[#B89768] focus-visible:ring-2 focus-visible:ring-[#B89768]"
                    />
                    <span className="text-[#4A5568] group-hover:text-[#1A1A1A] transition-colors">
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

          </aside>

          {/* Right Product Grid */}
          <main className="md:col-span-9" id="shop-results" aria-live="polite">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="bg-[#FAF6F0] rounded-sm p-4 space-y-4 animate-pulse">
                    <div className="w-full aspect-[4/5] bg-[#E8E2D9] rounded-sm" />
                    <div className="space-y-2">
                      <div className="h-4 bg-[#E8E2D9] rounded w-3/4" />
                      <div className="h-3 bg-[#E8E2D9] rounded w-1/2" />
                      <div className="h-5 bg-[#E8E2D9] rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#F9F8F5] border border-[#E5E2DA] p-8">
                <Sparkles className="w-8 h-8 text-[#B89768]" aria-hidden="true" />
                <h3 className="font-serif text-2xl text-[#1A1A1A]">No jewellery matched your filters</h3>
                <p className="text-xs text-[#6B7280] max-w-md leading-relaxed">
                  Try adjusting or resetting your metal and collection selections, or contact our bespoke atelier for custom craftsmanship.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="btn btn-primary-gold btn-sm mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div
          id="mobile-filter-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Refine Selection Filters"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DA]">
                <span className="font-serif text-lg font-medium text-[#1A1A1A]">Filters</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-[#6B7280] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8935A] rounded-xs"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Category Filter */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#1A1A1A] mb-2">Jewellery Category</h4>
                <div className="flex flex-col gap-2 text-xs">
                  {[
                    { label: 'All Categories', value: 'ALL' },
                    ...(categories.length > 0
                      ? categories.map((c) => ({ label: c.name, value: c.slug || c.name }))
                      : [
                          { label: 'Rings', value: 'rings' },
                          { label: 'Earrings', value: 'earrings' },
                          { label: 'Necklaces', value: 'necklaces' },
                          { label: 'Bangles', value: 'bangles' },
                        ]),
                  ].map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mob_cat"
                        checked={categoryParam.toLowerCase() === cat.value.toLowerCase()}
                        onChange={() => {
                          handleCategoryChange(cat.value);
                          setMobileFiltersOpen(false);
                        }}
                        className="accent-[#B89768]"
                      />
                      <span className={categoryParam.toLowerCase() === cat.value.toLowerCase() ? 'text-[#845E35] font-semibold' : ''}>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Metal Filter */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#1A1A1A] mb-2">Precious Metal</h4>
                <div className="flex flex-col gap-2 text-xs">
                  {['ALL', 'SILVER', 'GOLD'].map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mob_metal"
                        checked={metalParam === m}
                        onChange={() => {
                          handleMetalChange(m);
                          setMobileFiltersOpen(false);
                        }}
                        className="accent-[#B89768]"
                      />
                      <span>{m === 'ALL' ? 'All Metals' : m === 'SILVER' ? '925 Silver' : 'Solid Gold'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Collection Filter */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-[#1A1A1A] mb-2">Collection</h4>
                <div className="flex flex-col gap-2 text-xs">
                  {['ALL', 'REET', 'RAJSI', 'NITYA', 'ROOP'].map((c) => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mob_coll"
                        checked={collectionParam === c}
                        onChange={() => {
                          handleCollectionChange(c);
                          setMobileFiltersOpen(false);
                        }}
                        className="accent-[#B89768]"
                      />
                      <span>{c === 'ALL' ? 'All Collections' : `${c} Collection`}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full btn btn-primary-gold btn-sm mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
