import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Archive,
  ArrowUpDown,
  ExternalLink,
  Gem,
  Package,
  RefreshCw,
  Eye,
  Star,
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { productApi } from '../../api/product.api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriceMode, setSelectedPriceMode] = useState('');
  const [selectedFeatured, setSelectedFeatured] = useState('');
  const navigate = useNavigate();

  // Load categories for filter dropdown
  useEffect(() => {
    productApi.getCategories()
      .then((res) => {
        const catList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCategories(catList);
      })
      .catch((err) => console.warn('Could not load categories:', err));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.availabilityStatus = selectedStatus;
      if (selectedPriceMode) params.priceMode = selectedPriceMode;
      if (selectedFeatured !== '') params.isFeatured = selectedFeatured === 'true';

      const res = await axiosClient.get('/products', { params });
      const data = Array.isArray(res?.data)
        ? res.data
        : (res?.data?.products || res?.products || (Array.isArray(res) ? res : []));
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, selectedStatus, selectedPriceMode, selectedFeatured]);

  const handleToggleFeatured = async (p) => {
    try {
      const newStatus = !p.isFeatured;
      await axiosClient.put(`/products/${p._id}`, { ...p, isFeatured: newStatus });
      setProducts((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, isFeatured: newStatus } : item))
      );
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
      alert('Failed to update featured status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to archive / delete product "${name || id}"?`)) {
      try {
        await axiosClient.patch(`/products/${id}/archive`, { redirectTo: '/shop' });
        fetchProducts();
      } catch (err) {
        console.error('Error archiving product:', err);
        // Fallback local removal
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Catalogue Master
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#2B2320] mt-0.5">
            Products & Inventory Management
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage live boutique jewellery catalogue, inventory levels, pricing modes, and specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 border border-[#D1CCC4] rounded-xs hover:bg-[#FAF6F0] text-[#2B2320] transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5C1A2E]' : ''}`} />
          </button>
          <Link
            to="/admin/products/new"
            className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* ── Filters & Search Row ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by SKU, title, handle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.slug} value={cat._id || cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
        >
          <option value="">All Availability Statuses</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="MADE_TO_ORDER">Made to Order (MTO)</option>
          <option value="SOLD_OUT">Sold Out</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Price Mode Filter */}
        <select
          value={selectedPriceMode}
          onChange={(e) => setSelectedPriceMode(e.target.value)}
          className="px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
        >
          <option value="">All Pricing Modes</option>
          <option value="FIXED">FIXED Price</option>
          <option value="STARTING_FROM">STARTING FROM</option>
          <option value="ESTIMATED">ESTIMATED</option>
          <option value="ON_REQUEST">ON REQUEST</option>
        </select>

        {/* Featured Filter */}
        <select
          value={selectedFeatured}
          onChange={(e) => setSelectedFeatured(e.target.value)}
          className="px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
        >
          <option value="">All Showcase Types</option>
          <option value="true">⭐ Featured Products Only</option>
          <option value="false">Standard Products</option>
        </select>
      </div>

      {/* ── Summary bar ── */}
      <div className="flex items-center justify-between text-xs text-[#6B7280] px-1">
        <span>Showing <strong>{products.length}</strong> products</span>
        {(search || selectedCategory || selectedStatus || selectedPriceMode || selectedFeatured) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedStatus('');
              setSelectedPriceMode('');
              setSelectedFeatured('');
            }}
            className="text-[#5C1A2E] underline hover:opacity-80 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Products Table ── */}
      <div className="bg-white border border-[#E8E2D9] rounded-sm shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] text-[#6B7280] uppercase tracking-wider text-[10px] bg-[#FAF6F0]">
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Metal & Purity</th>
                <th className="p-3.5">Price Mode</th>
                <th className="p-3.5">Price (₹)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#6B7280]">
                    <div className="inline-flex items-center gap-2 text-xs">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#5C1A2E]" />
                      <span>Loading products catalogue…</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#6B7280]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Package className="w-8 h-8 text-[#9CA3AF] mx-auto stroke-1" />
                      <p className="font-serif text-base text-[#2B2320]">No products found</p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        Try adjusting your search query or filters, or add a new jewellery piece to the catalogue.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const imgUrl =
                    (typeof p.heroImage === 'string' ? p.heroImage : p.heroImage?.url) ||
                    p.gallery?.[0]?.url ||
                    p.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80';

                  const categoryName =
                    typeof p.category === 'object' && p.category !== null
                      ? p.category.name
                      : (categories.find((c) => c._id === p.category || c.slug === p.category)?.name || '—');

                  return (
                    <tr key={p._id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      {/* Image & Title */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xs border border-[#E8E2D9] overflow-hidden shrink-0 bg-[#FAF6F0]">
                            <img
                              src={imgUrl}
                              alt={p.name}
                              className="w-full h-full object-cover object-center"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-[#2B2320] truncate max-w-xs text-xs">
                              {p.name}
                            </h4>
                            <span className="text-[10px] text-[#5C1A2E] font-mono block mt-0.5">
                              SKU: {p.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="text-[#2B2320] font-medium">{categoryName}</span>
                      </td>

                      {/* Metal / Purity */}
                      <td className="p-3.5">
                        <span className="font-medium text-[#2B2320] block">
                          {p.metalType || 'SILVER'}
                        </span>
                        <span className="text-[10.5px] text-[#6B7280] font-mono">
                          {p.purity || '925'}
                        </span>
                      </td>

                      {/* Price Mode */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-[#FAF6F0] text-[#5C1A2E] border border-[#E8E2D9]">
                          {p.priceMode || 'FIXED'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-3.5 font-semibold text-[#2B2320]">
                        ₹{(p.sellingPrice || 0).toLocaleString('en-IN')}
                        {p.compareAtPrice && p.compareAtPrice > p.sellingPrice && (
                          <span className="block text-[10px] text-[#9CA3AF] line-through font-normal">
                            ₹{p.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-3.5">
                        <span
                          className={`font-mono font-bold ${
                            p.stockQuantity === 0
                              ? 'text-red-600'
                              : p.stockQuantity < 3
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {p.stockQuantity ?? 0} units
                        </span>
                      </td>

                      {/* Status Pill */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[10.5px] font-semibold ${
                            p.availabilityStatus === 'IN_STOCK'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.availabilityStatus === 'MADE_TO_ORDER'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {p.availabilityStatus || 'IN_STOCK'}
                        </span>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-full transition-all ${
                            p.isFeatured
                              ? 'text-[#C9A84C] bg-[#FAF4EB] hover:bg-[#F3E5C8]'
                              : 'text-[#D1CCC4] hover:text-[#C9A84C] hover:bg-[#FAF6F0]'
                          }`}
                          title={p.isFeatured ? 'Featured Product (Click to unfeature)' : 'Mark as Featured (Show on Home Page)'}
                        >
                          <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-[#C9A84C]' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${p.urlHandle || p._id}`}
                            target="_blank"
                            className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded-xs transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/admin/products/${p._id}`}
                            className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded-xs transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors"
                            title="Archive / Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
