import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Gem,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { productApi } from '../../api/product.api';

export default function AdminProductEdit() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    designCode: '',
    urlHandle: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    collection: ['reet'],
    tags: '',

    // Commercial
    priceMode: 'FIXED',
    mrp: '',
    sellingPrice: '',
    compareAtPrice: '',
    stockQuantity: 1,
    availabilityStatus: 'IN_STOCK',
    madeToOrderAllowed: true,
    leadTimeDays: 14,

    // Metal
    metalType: 'SILVER',
    purity: '925',
    grossWeight: '',
    netWeight: '',
    finish: '24K Gold Foil Jadau Dip',

    // Stones Array
    stones: [
      {
        type: 'POLKI',
        weight: '4.5 cts',
        count: 12,
        colour: 'Natural Uncut',
        clarity: 'Fine Heirloom Grade',
        certification: 'In-House Gemological Audit',
      },
    ],

    // Media
    heroImage: {
      url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      altText: '',
    },
    galleryUrls: '',

    // SEO
    seoTitle: '',
    metaDescription: '',

    // Internal Admin
    costPrice: '',
    supplierRef: '',
    batchRef: '',
  });

  // Load master categories & collections
  useEffect(() => {
    productApi.getCategories()
      .then((res) => {
        const catList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCategories(catList);
        if (catList.length > 0) {
          setFormData((prev) => ({ ...prev, category: prev.category || catList[0]._id }));
        }
      })
      .catch((err) => console.warn('Could not load categories:', err));

    productApi.getCollections()
      .then((res) => {
        const colList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCollections(colList);
      })
      .catch((err) => console.warn('Could not load collections:', err));
  }, []);

  useEffect(() => {
    if (isEdit) {
      axiosClient
        .get(`/products/${id}`)
        .then((res) => {
          const p = res?.data?.product || res?.data || res?.product || res;
          if (p) {
            setFormData({
              ...p,
              category: typeof p.category === 'object' && p.category !== null ? p.category._id : (p.category || ''),
              mrp: p.mrp || '',
              sellingPrice: p.sellingPrice || '',
              compareAtPrice: p.compareAtPrice || '',
              grossWeight: p.grossWeight || '',
              netWeight: p.netWeight || '',
              costPrice: p.costPrice || '',
              supplierRef: p.supplierRef || '',
              batchRef: p.batchRef || '',
              tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
              galleryUrls: Array.isArray(p.gallery) ? p.gallery.map(g => g.url).join('\n') : '',
              collection: Array.isArray(p.collection)
                ? p.collection.map(c => typeof c === 'object' && c !== null ? (c._id || c.slug) : c)
                : [p.collection || 'reet'],
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching product for edit:', err);
        });
    }
  }, [id, isEdit]);

  const handleAddStone = () => {
    setFormData((prev) => ({
      ...prev,
      stones: [
        ...prev.stones,
        {
          type: 'POLKI',
          weight: '',
          count: 1,
          colour: '',
          clarity: '',
          certification: '',
        },
      ],
    }));
  };

  const handleRemoveStone = (idx) => {
    setFormData((prev) => ({
      ...prev,
      stones: prev.stones.filter((_, i) => i !== idx),
    }));
  };

  const handleStoneChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.stones];
      updated[idx][field] = value;
      return { ...prev, stones: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const heroImgUrl = typeof formData.heroImage === 'object' && formData.heroImage !== null
        ? (formData.heroImage.url || '')
        : (formData.heroImage || '');

      const cleanedStones = (formData.stones || []).map((s) => ({
        type: s.type || 'POLKI',
        weight: s.weight ? parseFloat(String(s.weight).replace(/[^0-9.-]/g, '')) || undefined : undefined,
        count: s.count ? parseInt(String(s.count).replace(/[^0-9-]/g, ''), 10) || undefined : undefined,
        colour: s.colour || undefined,
        clarity: s.clarity || undefined,
        certification: s.certification || undefined,
      })).filter((s) => s.type || s.weight || s.count);

      const payload = {
        ...formData,
        heroImage: heroImgUrl || undefined,
        stones: cleanedStones,
        mrp: formData.mrp ? Number(formData.mrp) : (formData.sellingPrice ? Number(formData.sellingPrice) : undefined),
        sellingPrice: formData.sellingPrice ? Number(formData.sellingPrice) : 0,
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        grossWeight: formData.grossWeight ? parseFloat(String(formData.grossWeight).replace(/[^0-9.-]/g, '')) || undefined : undefined,
        netWeight: formData.netWeight ? parseFloat(String(formData.netWeight).replace(/[^0-9.-]/g, '')) || undefined : undefined,
        costPrice: formData.costPrice ? parseFloat(String(formData.costPrice).replace(/[^0-9.-]/g, '')) || undefined : undefined,
        stockQuantity: Number(formData.stockQuantity) || 0,
        leadTimeDays: Number(formData.leadTimeDays) || 14,
        collection: Array.isArray(formData.collection) ? formData.collection.filter(Boolean) : (formData.collection ? [formData.collection] : []),
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : (formData.tags || []),
        gallery: formData.galleryUrls
          ? formData.galleryUrls.split('\n').map(u => ({ url: u.trim() })).filter(g => g.url)
          : (Array.isArray(formData.gallery) ? formData.gallery : []),
      };

      if (!payload.category && categories.length > 0) {
        payload.category = categories[0]._id || categories[0].slug;
      }
      if (!payload.metalType) delete payload.metalType;
      if (!payload.purity) delete payload.purity;
      if (!payload.availabilityStatus) payload.availabilityStatus = 'IN_STOCK';
      if (!payload.priceMode) payload.priceMode = 'FIXED';
      if (!payload.urlHandle && payload.name) {
        payload.urlHandle = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      delete payload.galleryUrls;

      if (isEdit) {
        await axiosClient.put(`/products/${id}`, payload);
        setSuccessMsg('Heirloom specifications updated successfully.');
      } else {
        await axiosClient.post('/products', payload);
        setSuccessMsg('Product created successfully in master catalogue.');
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg(err.message || err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xs border border-[#E8E2D9] bg-white hover:bg-[#FAF6F0] text-[#2B2320]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
              {isEdit ? 'Modify Product Specifications' : 'New Catalogue Addition'}
            </span>
            <h1 className="font-serif text-2xl font-medium text-[#2B2320]">
              {isEdit ? `Edit: ${formData.name || 'Heirloom'}` : 'Create New Heirloom Piece'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Specs…' : isEdit ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2 animate-[fadeIn_0.15s_ease]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs animate-[fadeIn_0.15s_ease]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* ── 1. General & Classification ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <h3 className="font-serif text-base font-semibold text-[#2B2320] pb-2 border-b border-[#E8E2D9]">
            1. Core Nomenclature & Classification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#2B2320] mb-1">
                Heirloom Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. The Royal Mewar Polki Suite"
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Stock Keeping Unit (SKU) *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. HOV-PLK-001"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Design / Hallmark Code (Optional)
              </label>
              <input
                type="text"
                value={formData.designCode}
                onChange={(e) => setFormData({ ...formData, designCode: e.target.value })}
                placeholder="e.g. JODH-2024-X"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Jewellery Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
              >
                <option value="">Select Jewellery Category</option>
                {categories.map((c) => (
                  <option key={c._id || c.slug} value={c._id || c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Primary Collection
              </label>
              <select
                value={formData.collection?.[0] || ''}
                onChange={(e) => setFormData({ ...formData, collection: [e.target.value] })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
              >
                <option value="">Select Heritage Collection (Optional)</option>
                {collections.map((col) => (
                  <option key={col._id || col.slug} value={col._id || col.slug}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="bridal, jadau, polki, gold foil, jaipur"
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2B2320] mb-1">
              Short Summary Description
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief 1-line heritage narrative for listing cards..."
              className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2B2320] mb-1">
              Full Karigari & Material Story
            </label>
            <textarea
              rows={4}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              placeholder="Comprehensive product storytelling, craftsmanship details, Jadau techniques, stone purity..."
              className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
            />
          </div>
        </div>

        {/* ── 2. Commercial Pricing & Status State Machine (§6) ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <h3 className="font-serif text-base font-semibold text-[#2B2320] pb-2 border-b border-[#E8E2D9]">
            2. Commercial Pricing & Inventory State Machine (Spec §6)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Price Display Mode *
              </label>
              <select
                value={formData.priceMode}
                onChange={(e) => setFormData({ ...formData, priceMode: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
              >
                <option value="FIXED">FIXED (Standard instant checkout)</option>
                <option value="STARTING_FROM">STARTING_FROM (Requires variant selection)</option>
                <option value="ESTIMATED">ESTIMATED (Subject to confirmation deposit)</option>
                <option value="ON_REQUEST">ON_REQUEST (WhatsApp / Concierge only)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="34500"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Compare At Price / MRP (₹)
              </label>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="38000"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Current Inventory Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                placeholder="4"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Availability Status *
              </label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
              >
                <option value="IN_STOCK">IN_STOCK (Ready to ship)</option>
                <option value="MADE_TO_ORDER">MADE_TO_ORDER (Johari Crafting)</option>
                <option value="SOLD_OUT">SOLD_OUT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Lead Time (Crafting Days)
              </label>
              <input
                type="number"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: e.target.value })}
                placeholder="14"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.madeToOrderAllowed}
                onChange={(e) => setFormData({ ...formData, madeToOrderAllowed: e.target.checked })}
                className="w-4 h-4 text-[#5C1A2E] border-[#D1CCC4] rounded"
              />
              <span className="text-xs text-[#2B2320] font-medium">
                <strong>Auto-Fallback to Made-to-Order:</strong> Automatically switch product status to MADE_TO_ORDER when stock hits 0 instead of marking SOLD_OUT.
              </span>
            </label>
          </div>
        </div>

        {/* ── 3. Metal & Gemstone Specifications ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <h3 className="font-serif text-base font-semibold text-[#2B2320] pb-2 border-b border-[#E8E2D9]">
            3. Precious Metal & Gemstone Purity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Base Metal Type
              </label>
              <select
                value={formData.metalType}
                onChange={(e) => setFormData({ ...formData, metalType: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
              >
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Karat / Purity Grade
              </label>
              <select
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] bg-white"
              >
                <option value="925">925 Sterling Silver</option>
                <option value="14K">14K Gold (585)</option>
                <option value="18K">18K Fine Gold (750)</option>
                <option value="22K">22K Royal Gold (916)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Gross Weight (grams)
              </label>
              <input
                type="text"
                value={formData.grossWeight}
                onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                placeholder="42.5g"
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Finish & Foil Setting
              </label>
              <input
                type="text"
                value={formData.finish}
                onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                placeholder="24K Gold Foil Jadau Dip"
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>

          {/* Dynamic Stone Rows */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#2B2320]">
                Gemstones, Polki & Diamonds Configuration
              </span>
              <button
                type="button"
                onClick={handleAddStone}
                className="btn btn-outline btn-xs flex items-center gap-1 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>Add Gemstone Row</span>
              </button>
            </div>

            {formData.stones.map((stone, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#FAF6F0] border border-[#E8E2D9] rounded-xs grid grid-cols-1 sm:grid-cols-6 gap-3 items-center"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-0.5">Type</label>
                  <select
                    value={stone.type}
                    onChange={(e) => handleStoneChange(idx, 'type', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#D1CCC4] rounded-xs bg-white text-xs"
                  >
                    <option value="POLKI">Uncut Polki</option>
                    <option value="KUNDAN">Glass Kundan</option>
                    <option value="DIAMOND_NATURAL">Natural Diamond</option>
                    <option value="PEARL">Basra / Cultured Pearl</option>
                    <option value="SEMI_PRECIOUS">Emerald / Ruby / Semi-Precious</option>
                    <option value="CZ">Cubic Zirconia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-0.5">Weight</label>
                  <input
                    type="text"
                    value={stone.weight}
                    onChange={(e) => handleStoneChange(idx, 'weight', e.target.value)}
                    placeholder="4.5 cts"
                    className="w-full px-2 py-1.5 border border-[#D1CCC4] rounded-xs bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-0.5">Count</label>
                  <input
                    type="number"
                    value={stone.count}
                    onChange={(e) => handleStoneChange(idx, 'count', e.target.value)}
                    placeholder="12"
                    className="w-full px-2 py-1.5 border border-[#D1CCC4] rounded-xs bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-0.5">Clarity / Grade</label>
                  <input
                    type="text"
                    value={stone.clarity}
                    onChange={(e) => handleStoneChange(idx, 'clarity', e.target.value)}
                    placeholder="Fine Royal Cut"
                    className="w-full px-2 py-1.5 border border-[#D1CCC4] rounded-xs bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#6B7280] mb-0.5">Certification</label>
                  <input
                    type="text"
                    value={stone.certification}
                    onChange={(e) => handleStoneChange(idx, 'certification', e.target.value)}
                    placeholder="BIS Assay Lab"
                    className="w-full px-2 py-1.5 border border-[#D1CCC4] rounded-xs bg-white text-xs"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveStone(idx)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-xs"
                    title="Remove Stone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Media & Gallery ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <h3 className="font-serif text-base font-semibold text-[#2B2320] pb-2 border-b border-[#E8E2D9]">
            4. Media, Photography & Gallery
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Hero Image URL (Primary Display) *
              </label>
              <input
                type="text"
                required
                value={formData.heroImage?.url || ''}
                onChange={(e) => setFormData({ ...formData, heroImage: { ...formData.heroImage, url: e.target.value } })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
              {formData.heroImage?.url && (
                <img
                  src={formData.heroImage.url}
                  alt="Hero Preview"
                  className="w-24 h-24 object-cover rounded-xs border border-[#E8E2D9] mt-2"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Additional Gallery Image URLs (1 per line)
              </label>
              <textarea
                rows={4}
                value={formData.galleryUrls}
                onChange={(e) => setFormData({ ...formData, galleryUrls: e.target.value })}
                placeholder="https://image1.jpg&#10;https://image2.jpg"
                className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* ── 5. SEO & Internal Admin Info ── */}
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-4 shadow-2xs">
          <h3 className="font-serif text-base font-semibold text-[#2B2320] pb-2 border-b border-[#E8E2D9]">
            5. SEO Meta & Internal Audit Fields
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Custom URL Handle (Slug)
              </label>
              <input
                type="text"
                value={formData.urlHandle}
                onChange={(e) => setFormData({ ...formData, urlHandle: e.target.value })}
                placeholder="the-royal-mewar-polki-suite"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Cost Price (₹ - Admin Only)
              </label>
              <input
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="21000"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2B2320] mb-1">
                Supplier / Karigar Batch Ref
              </label>
              <input
                type="text"
                value={formData.supplierRef}
                onChange={(e) => setFormData({ ...formData, supplierRef: e.target.value })}
                placeholder="Johari-Bazaar-K04"
                className="w-full px-3 py-2 font-mono border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D9]">
          <Link to="/admin/products" className="btn btn-outline btn-sm text-xs">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
