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
  Upload,
  Loader2,
  CheckCircle2,
  X,
  Star,
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

  // Quick Category & Collection Modals
  const [showQuickCatModal, setShowQuickCatModal] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatDesc, setQuickCatDesc] = useState('');
  const [creatingQuickCat, setCreatingQuickCat] = useState(false);

  const [showQuickColModal, setShowQuickColModal] = useState(false);
  const [quickColName, setQuickColName] = useState('');
  const [quickColDesc, setQuickColDesc] = useState('');
  const [creatingQuickCol, setCreatingQuickCol] = useState(false);

  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

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

  const loadCategoriesAndCollections = () => {
    productApi.getCategories()
      .then((res) => {
        const catList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCategories(catList);
        if (catList.length > 0) {
          setFormData((prev) => ({ ...prev, category: prev.category || catList[0]._id || catList[0].slug }));
        }
      })
      .catch((err) => console.warn('Could not load categories:', err));

    productApi.getCollections()
      .then((res) => {
        const colList = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCollections(colList);
      })
      .catch((err) => console.warn('Could not load collections:', err));
  };

  // Load master categories & collections
  useEffect(() => {
    loadCategoriesAndCollections();
  }, []);

  const handleCreateQuickCategory = async (e) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;
    setCreatingQuickCat(true);
    try {
      const slug = quickCatName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await axiosClient.post('/categories', {
        name: quickCatName.trim(),
        slug,
        description: quickCatDesc.trim() || undefined,
        isActive: true,
      });
      const newCat = res?.data || res;
      const catId = newCat._id || newCat.slug || slug;
      setQuickCatName('');
      setQuickCatDesc('');
      setShowQuickCatModal(false);
      loadCategoriesAndCollections();
      setFormData((prev) => ({ ...prev, category: catId }));
      setSuccessMsg(`Category "${quickCatName}" created and selected!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to create quick category:', err);
      setErrorMsg(err?.message || 'Failed to create category');
    } finally {
      setCreatingQuickCat(false);
    }
  };

  const handleCreateQuickCollection = async (e) => {
    e.preventDefault();
    if (!quickColName.trim()) return;
    setCreatingQuickCol(true);
    try {
      const slug = quickColName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await axiosClient.post('/collections', {
        name: quickColName.trim(),
        slug,
        description: quickColDesc.trim() || undefined,
        isActive: true,
      });
      const newCol = res?.data || res;
      const colId = newCol._id || newCol.slug || slug;
      setQuickColName('');
      setQuickColDesc('');
      setShowQuickColModal(false);
      loadCategoriesAndCollections();
      setFormData((prev) => ({ ...prev, collection: [colId] }));
      setSuccessMsg(`Collection "${quickColName}" created and selected!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to create quick collection:', err);
      setErrorMsg(err?.message || 'Failed to create collection');
    } finally {
      setCreatingQuickCol(false);
    }
  };

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

  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('images', file);

    setUploadingHero(true);
    setErrorMsg('');
    try {
      const res = await productApi.uploadImages(data);
      const uploadedUrl =
        res?.data?.url ||
        res?.data?.urls?.[0] ||
        res?.url ||
        res?.urls?.[0] ||
        (Array.isArray(res?.data?.files) ? res.data.files[0]?.url : null);

      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          heroImage: { ...prev.heroImage, url: uploadedUrl },
        }));
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to upload hero thumbnail');
    } finally {
      setUploadingHero(false);
      e.target.value = '';
    }
  };

  const handleGalleryFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    setUploadingGallery(true);
    setErrorMsg('');
    try {
      const res = await productApi.uploadImages(data);
      const newUrls =
        res?.data?.urls ||
        res?.urls ||
        (Array.isArray(res?.data?.files) ? res.data.files.map((f) => f.url) : []) ||
        (res?.data?.url ? [res.data.url] : []);

      if (newUrls.length > 0) {
        setFormData((prev) => {
          const currentUrls = prev.galleryUrls
            ? prev.galleryUrls.split('\n').map((u) => u.trim()).filter(Boolean)
            : [];
          const updated = [...currentUrls, ...newUrls].join('\n');
          return { ...prev, galleryUrls: updated };
        });
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryUrl = (indexToRemove) => {
    setFormData((prev) => {
      const currentUrls = prev.galleryUrls
        ? prev.galleryUrls.split('\n').map((u) => u.trim()).filter(Boolean)
        : [];
      const updated = currentUrls.filter((_, idx) => idx !== indexToRemove).join('\n');
      return { ...prev, galleryUrls: updated };
    });
  };

  const handleSetGalleryAsHero = (urlToSet) => {
    setFormData((prev) => {
      const currentHero = typeof prev.heroImage === 'object' ? prev.heroImage?.url : prev.heroImage;
      const currentUrls = prev.galleryUrls
        ? prev.galleryUrls.split('\n').map((u) => u.trim()).filter(Boolean)
        : [];
      
      const filteredGallery = currentUrls.filter((u) => u !== urlToSet);
      if (currentHero && currentHero !== urlToSet) {
        filteredGallery.push(currentHero);
      }

      return {
        ...prev,
        heroImage: { ...prev.heroImage, url: urlToSet },
        galleryUrls: filteredGallery.join('\n'),
      };
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
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-[#2B2320]">
                  Jewellery Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowQuickCatModal(true)}
                  className="text-[11px] font-semibold text-[#5C1A2E] hover:text-[#B8935A] flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Category</span>
                </button>
              </div>
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
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-[#2B2320]">
                  Primary Collection
                </label>
                <button
                  type="button"
                  onClick={() => setShowQuickColModal(true)}
                  className="text-[11px] font-semibold text-[#5C1A2E] hover:text-[#B8935A] flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Collection</span>
                </button>
              </div>
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
        <div className="bg-white border border-[#E8E2D9] rounded-sm p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#2B2320]">
                4. Media, Photography &amp; Product Images
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5 font-light">
                Upload primary hero thumbnail and multi-angle gallery images directly from your computer or enter image URLs.
              </p>
            </div>
            <span className="text-[11px] font-medium text-[#B8935A] bg-[#FAF6F0] px-2.5 py-1 rounded-xs border border-[#E8E2D9]">
              WebP Auto-Optimized (1200×1200 max)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── Primary Hero Thumbnail (5 cols) ── */}
            <div className="lg:col-span-5 bg-[#FAF6F0] p-4 rounded-sm border border-[#E8E2D9] space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-[#2B2320] text-sm">
                  Hero Thumbnail (Primary Card Image) *
                </label>
                {formData.heroImage?.url && (
                  <span className="text-[10px] text-green-700 bg-green-100 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Hero
                  </span>
                )}
              </div>

              {/* Upload Dropzone / Preview */}
              <div className="relative border-2 border-dashed border-[#D1CCC4] hover:border-[#5C1A2E] rounded-sm p-4 bg-white text-center transition-colors">
                <input
                  id="hero-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleHeroFileUpload}
                  className="hidden"
                />

                {uploadingHero ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-[#5C1A2E]">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <p className="text-xs font-medium">Uploading &amp; optimizing image...</p>
                  </div>
                ) : formData.heroImage?.url ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[4/5] max-w-[200px] mx-auto overflow-hidden rounded-xs border border-[#E8E2D9] bg-[#F9F8F5] shadow-xs group">
                      <img
                        src={formData.heroImage.url}
                        alt="Hero Preview"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label
                          htmlFor="hero-file-input"
                          className="p-2 bg-white text-[#2B2320] hover:text-[#5C1A2E] rounded-full cursor-pointer shadow-md transition-transform active:scale-95"
                          title="Change / Re-upload Image"
                        >
                          <Upload className="w-4 h-4" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: { ...formData.heroImage, url: '' } })}
                          className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-full shadow-md transition-transform active:scale-95"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <label
                        htmlFor="hero-file-input"
                        className="btn btn-outline btn-xs inline-flex items-center gap-1.5 cursor-pointer text-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Image</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: { ...formData.heroImage, url: '' } })}
                        className="text-xs text-red-600 hover:underline px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="hero-file-input"
                    className="py-6 flex flex-col items-center justify-center gap-2 cursor-pointer select-none group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FAF6F0] group-hover:bg-[#F3EDE2] text-[#B8935A] flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#5C1A2E] hover:underline block">
                        Click to Upload Thumbnail Image
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        JPEG, PNG, WebP or AVIF (Max 10MB)
                      </span>
                    </div>
                  </label>
                )}
              </div>

              {/* Direct URL Fallback */}
              <div>
                <label className="block text-[11px] font-medium text-[#6B7280] mb-1">
                  Or Paste Direct Image URL:
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroImage?.url || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heroImage: { ...formData.heroImage, url: e.target.value },
                    })
                  }
                  placeholder="https://images.unsplash.com/... or /catagories/img1.jpeg"
                  className="w-full px-3 py-1.5 border border-[#D1CCC4] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E] bg-white font-mono"
                />
              </div>
            </div>

            {/* ── Additional Gallery Images (7 cols) ── */}
            <div className="lg:col-span-7 bg-white p-4 rounded-sm border border-[#E8E2D9] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-semibold text-[#2B2320] text-sm">
                    Additional Gallery Images &amp; Angles
                  </label>
                  <p className="text-[11px] text-[#6B7280]">
                    Upload multiple side angles, model shots, or certificate close-ups.
                  </p>
                </div>

                <label
                  htmlFor="gallery-files-input"
                  className="btn btn-primary-gold btn-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload Images</span>
                </label>
                <input
                  id="gallery-files-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleGalleryFilesUpload}
                  className="hidden"
                />
              </div>

              {/* Uploading indicator */}
              {uploadingGallery && (
                <div className="p-3 bg-[#FAF6F0] rounded-xs border border-[#E8E2D9] flex items-center justify-center gap-2 text-[#5C1A2E]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">Uploading gallery images...</span>
                </div>
              )}

              {/* Gallery Image Grid */}
              {formData.galleryUrls ? (
                (() => {
                  const urls = formData.galleryUrls
                    .split('\n')
                    .map((u) => u.trim())
                    .filter(Boolean);

                  if (urls.length === 0) {
                    return (
                      <div className="p-6 text-center border border-dashed border-[#E8E2D9] rounded-xs text-[#9CA3AF] text-xs">
                        No additional gallery images yet. Click "+ Upload Images" above or add URLs below.
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {urls.map((imgUrl, idx) => (
                        <div
                          key={imgUrl + idx}
                          className="group relative aspect-square bg-[#F9F8F5] rounded-xs border border-[#E8E2D9] overflow-hidden shadow-2xs"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={() => handleSetGalleryAsHero(imgUrl)}
                              className="p-1.5 bg-white text-[#B8935A] hover:text-[#5C1A2E] rounded-full shadow-xs transition-transform active:scale-90"
                              title="Set as Hero Thumbnail"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#B8935A]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryUrl(idx)}
                              className="p-1.5 bg-white text-red-600 hover:bg-red-50 rounded-full shadow-xs transition-transform active:scale-90"
                              title="Remove Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-xs">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                <div className="p-6 text-center border border-dashed border-[#E8E2D9] rounded-xs text-[#9CA3AF] text-xs">
                  No additional gallery images yet. Click "+ Upload Images" above or add URLs below.
                </div>
              )}

              {/* Gallery URLs Textarea editor */}
              <div className="pt-2 border-t border-[#F0EBE3]">
                <label className="block font-medium text-[#2B2320] text-xs mb-1">
                  Manual Image URLs (1 URL per line):
                </label>
                <textarea
                  rows={3}
                  value={formData.galleryUrls}
                  onChange={(e) => setFormData({ ...formData, galleryUrls: e.target.value })}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E] font-mono text-[11px] bg-[#FAF6F0]"
                />
              </div>
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
      {/* ── Quick Category Modal ── */}
      {showQuickCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D9] rounded-sm max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
              <h3 className="font-serif text-base font-semibold text-[#2B2320]">
                Create New Jewellery Category
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickCatModal(false)}
                className="text-[#6B7280] hover:text-[#2B2320] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickCategory} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#2B2320] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={quickCatName}
                  onChange={(e) => setQuickCatName(e.target.value)}
                  placeholder="e.g. Polki Necklaces, Royal Bangles"
                  className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2B2320] mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={quickCatDesc}
                  onChange={(e) => setQuickCatDesc(e.target.value)}
                  placeholder="Brief description for category taxonomy..."
                  className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowQuickCatModal(false)}
                  className="btn btn-outline btn-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingQuickCat}
                  className="btn btn-primary-burgundy btn-xs"
                >
                  {creatingQuickCat ? 'Creating…' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Quick Collection Modal ── */}
      {showQuickColModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D9] rounded-sm max-w-md w-full p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
              <h3 className="font-serif text-base font-semibold text-[#2B2320]">
                Create Heritage Collection
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickColModal(false)}
                className="text-[#6B7280] hover:text-[#2B2320] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickCollection} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#2B2320] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={quickColName}
                  onChange={(e) => setQuickColName(e.target.value)}
                  placeholder="e.g. Noor-e-Kashmir, Royal Rajputana"
                  className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2B2320] mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={quickColDesc}
                  onChange={(e) => setQuickColDesc(e.target.value)}
                  placeholder="Heritage collection narrative..."
                  className="w-full px-3 py-2 border border-[#D1CCC4] rounded-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowQuickColModal(false)}
                  className="btn btn-outline btn-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingQuickCol}
                  className="btn btn-primary-burgundy btn-xs"
                >
                  {creatingQuickCol ? 'Creating…' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
