import React, { useState, useEffect } from 'react';
import { 
  Tags, Plus, Trash2, Edit2, Layers, Sparkles, X, Check, 
  AlertCircle, RefreshCw, Eye, EyeOff, ArrowUpDown, Image as ImageIcon
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AdminCategories() {
  const [activeTab, setActiveTab] = useState('collections'); // 'collections' | 'categories'
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalType, setModalType] = useState(null); // 'collection' | 'category' | null
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    isActive: true,
    imageUrl: '',
    seoTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [colRes, catRes] = await Promise.all([
        axiosClient.get('/collections?admin=true').catch(() => null),
        axiosClient.get('/categories?admin=true').catch(() => null),
      ]);

      const colData = colRes?.data || colRes || [];
      const catData = catRes?.data || catRes || [];

      setCollections(Array.isArray(colData) ? colData : (colData.collections || []));
      setCategories(Array.isArray(catData) ? catData : (catData.categories || []));
    } catch (err) {
      console.error('Error fetching categories/collections:', err);
      setError('Failed to load collections and categories from server.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setError(null);
    if (item) {
      setFormData({
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        displayOrder: item.displayOrder ?? 0,
        isActive: item.isActive !== false,
        imageUrl: type === 'collection' ? (item.heroImage?.url || '') : (item.image?.url || ''),
        seoTitle: item.seoTitle || '',
        metaDescription: item.metaDescription || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        displayOrder: type === 'collection' ? collections.length + 1 : categories.length + 1,
        isActive: true,
        imageUrl: '',
        seoTitle: '',
        metaDescription: '',
      });
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    if (!editingItem) {
      setFormData(prev => ({
        ...prev,
        name,
        slug: generateSlug(name)
      }));
    } else {
      setFormData(prev => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const isCol = modalType === 'collection';
    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description?.trim() || undefined,
      displayOrder: Number(formData.displayOrder) || 0,
      isActive: formData.isActive,
      seoTitle: formData.seoTitle?.trim() || undefined,
      metaDescription: formData.metaDescription?.trim() || undefined,
    };

    if (isCol && formData.imageUrl) {
      payload.heroImage = { url: formData.imageUrl.trim() };
    } else if (!isCol && formData.imageUrl) {
      payload.image = { url: formData.imageUrl.trim() };
    }

    try {
      if (editingItem) {
        // UPDATE (PATCH)
        const id = editingItem._id || editingItem.id;
        const endpoint = isCol ? `/collections/${id}` : `/categories/${id}`;
        await axiosClient.patch(endpoint, payload);
        setSuccess(`${isCol ? 'Collection' : 'Category'} "${payload.name}" updated successfully.`);
      } else {
        // CREATE (POST)
        const endpoint = isCol ? '/collections' : '/categories';
        await axiosClient.post(endpoint, payload);
        setSuccess(`New ${isCol ? 'Collection' : 'Category'} "${payload.name}" created successfully.`);
      }
      setModalType(null);
      fetchData();
    } catch (err) {
      console.error('Save failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, item) => {
    const isCol = type === 'collection';
    const name = item.name;
    const id = item._id || item.id;
    if (!window.confirm(`Are you sure you want to delete ${isCol ? 'collection' : 'category'} "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const endpoint = isCol ? `/collections/${id}` : `/categories/${id}`;
      await axiosClient.delete(endpoint);
      setSuccess(`${isCol ? 'Collection' : 'Category'} "${name}" deleted.`);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to delete.');
    }
  };

  const handleToggleStatus = async (type, item) => {
    const isCol = type === 'collection';
    const id = item._id || item.id;
    const newStatus = !item.isActive;
    try {
      const endpoint = isCol ? `/collections/${id}` : `/categories/${id}`;
      await axiosClient.patch(endpoint, { isActive: newStatus });
      fetchData();
    } catch (err) {
      console.error('Status update error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5C1A2E]">
            Hierarchy & Taxonomy CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2320] mt-0.5">
            Collections & Categories
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Create, edit, reorder, and activate brand collections and product catalog categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 border border-[#E8E2D9] rounded bg-white text-[#6B7280] hover:text-[#5C1A2E] hover:border-[#5C1A2E] transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {activeTab === 'collections' ? (
            <button
              onClick={() => handleOpenModal('collection')}
              className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add Collection</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenModal('category')}
              className="btn btn-primary-burgundy btn-sm flex items-center gap-1.5 text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D9]">
        <button
          onClick={() => setActiveTab('collections')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'collections'
              ? 'border-[#5C1A2E] text-[#5C1A2E]'
              : 'border-transparent text-[#6B7280] hover:text-[#2B2320]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#B8935A]" />
          <span>Signature Collections ({collections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-[#5C1A2E] text-[#5C1A2E]'
              : 'border-transparent text-[#6B7280] hover:text-[#2B2320]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#5C1A2E]" />
          <span>Product Categories ({categories.length})</span>
        </button>
      </div>

      {/* ── Tab Content: Collections ── */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map((col) => {
              const colId = col._id || col.id;
              return (
                <div
                  key={colId}
                  className="bg-white border border-[#E8E2D9] rounded-sm p-5 space-y-3 shadow-2xs hover:border-[#B8935A]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#5C1A2E] uppercase bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E8E2D9]">
                        Slug: {col.slug}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          Order: #{col.displayOrder ?? 0}
                        </span>
                        <button
                          onClick={() => handleToggleStatus('collection', col)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            col.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-500 border border-stone-200'
                          }`}
                        >
                          {col.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {col.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif text-lg font-semibold text-[#2B2320]">
                      {col.name}
                    </h4>

                    {col.description && (
                      <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                        {col.description}
                      </p>
                    )}

                    {col.heroImage?.url && (
                      <div className="text-[11px] text-[#8C827A] flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-[#B8935A]" />
                        <span className="truncate max-w-xs">{col.heroImage.url}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal('collection', col)}
                      className="px-3 py-1.5 text-xs font-medium text-[#2B2320] hover:text-[#5C1A2E] bg-[#FAF6F0] hover:bg-[#E8E2D9] rounded flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#B8935A]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete('collection', col)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {collections.length === 0 && !loading && (
              <div className="col-span-full p-8 text-center bg-white border border-[#E8E2D9] rounded text-xs text-[#6B7280]">
                No collections found. Click <strong>"Add Collection"</strong> to create the first royal collection.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab Content: Categories ── */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-[#E8E2D9] rounded-sm shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] text-[#6B7280] uppercase tracking-wider text-[10px] bg-[#FAF6F0]">
                <th className="p-3.5">Category Name</th>
                <th className="p-3.5">URL Slug</th>
                <th className="p-3.5">Order</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {categories.map((cat) => {
                const catId = cat._id || cat.id;
                return (
                  <tr key={catId} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="p-3.5">
                      <span className="font-semibold text-[#2B2320] block">{cat.name}</span>
                      {cat.description && (
                        <span className="text-[11px] text-[#6B7280] line-clamp-1">{cat.description}</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-[#5C1A2E]">
                      {cat.slug}
                    </td>
                    <td className="p-3.5 font-mono text-[#6B7280]">
                      #{cat.displayOrder ?? 0}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleStatus('category', cat)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          cat.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        {cat.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {cat.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenModal('category', cat)}
                        className="p-1.5 text-[#6B7280] hover:text-[#5C1A2E] hover:bg-[#FAF6F0] rounded transition-colors inline-flex"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B8935A]" />
                      </button>
                      <button
                        onClick={() => handleDelete('category', cat)}
                        className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-flex"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {categories.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#6B7280]">
                    No categories found. Click <strong>"Add Category"</strong> to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal (Create / Edit) ── */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D9] rounded-sm max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
              <h3 className="font-serif text-lg font-semibold text-[#2B2320]">
                {editingItem ? `Edit ${modalType === 'collection' ? 'Collection' : 'Category'}` : `Create New ${modalType === 'collection' ? 'Collection' : 'Category'}`}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-[#6B7280] hover:text-[#2B2320]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder={modalType === 'collection' ? 'e.g. REET — Bridal Heritage' : 'e.g. Necklaces & Chokers'}
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                  placeholder="e.g. reet or necklaces"
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xs text-xs font-mono focus:outline-none focus:border-[#5C1A2E]"
                />
                <span className="text-[10px] text-[#6B7280] mt-0.5 block">
                  Must be lowercase alphanumeric with hyphens (e.g. bridal-heritage)
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                  Description / Karigari Narrative
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial brand storytelling copy for this collection/category..."
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                  {modalType === 'collection' ? 'Hero Banner Image URL' : 'Thumbnail Image URL'}
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xs text-xs focus:outline-none focus:border-[#5C1A2E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                    Status
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-[#E8E2D9] rounded-xs bg-[#FAF6F0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-[#5C1A2E] focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-[#2B2320]">
                      {formData.isActive ? 'Active & Visible' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-xs text-xs text-[#6B7280] hover:bg-[#FAF6F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#5C1A2E] text-white rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-[#7A2B42] disabled:opacity-50 transition-all shadow-xs"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
