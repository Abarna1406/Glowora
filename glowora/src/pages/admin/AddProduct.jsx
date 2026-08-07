import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Video, Package, Tag, DollarSign, List, Save, ArrowLeft, Loader2, PlaySquare } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Need categories and brands from backend to populate select
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Fetch categories and brands for the dropdowns
    const fetchSelectData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands')
        ]);
        setCategories(catsRes.data.data || []);
        setBrands(brandsRes.data.data || []);
      } catch (err) {
        console.error("Failed to load categories/brands", err);
      }
    };
    fetchSelectData();
  }, []);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    price: "",
    mrp: "",
    stock: "",
    image: "",
    videoUrl: "",
    isAnimated: false,
    isFeatured: false,
    description: "",
  });

  const discountPercentage = form.mrp > 0 && form.price > 0 
    ? Math.round(((form.mrp - form.price) / form.mrp) * 100)
    : 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/products", {
        name: form.name,
        sku: form.sku,
        description: form.description,
        price: Number(form.price),
        mrp: Number(form.mrp),
        category: form.category,
        brand: form.brand,
        img: form.image,
        images: [form.image],
        stock: Number(form.stock),
        videoUrl: form.videoUrl,
        isAnimated: form.isAnimated,
        rating: 0,
        totalReviews: 0,
        isFeatured: form.isFeatured,
        isActive: true,
      });

      toast.success("✅ Product Added Successfully");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light/30 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-sm font-medium text-ink/60 hover:text-ink transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </button>
            <h1 className="font-display text-3xl text-ink">Add New Product</h1>
            <p className="mt-1 text-sm text-ink/60">Create a premium product listing for your store.</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-medium text-white shadow-lg shadow-gold/20 hover:bg-gold-dark transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main Info Column */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Basic Details Section */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg text-ink">
                <Package className="h-5 w-5 text-gold" /> Basic Details
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Product Name</label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. 24K Gold Facial Kit"
                    className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink/80">SKU</label>
                    <input
                      required
                      name="sku"
                      value={form.sku}
                      onChange={handleChange}
                      placeholder="GLW-001"
                      className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink/80">Stock Quantity</label>
                    <input
                      required
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Description</label>
                  <textarea
                    required
                    rows="4"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product..."
                    className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Media & Video Section */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg text-ink">
                <Video className="h-5 w-5 text-gold" /> Media & Animation
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Image URL</label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-line bg-sand-light/50 p-3 pl-10 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Video URL (Optional)</label>
                  <div className="relative">
                    <PlaySquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                    <input
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      placeholder="YouTube, Vimeo, or MP4 link..."
                      className="w-full rounded-xl border border-line bg-sand-light/50 p-3 pl-10 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink/50">Add a stunning video showcase for the product page.</p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-sand-light/30 p-4 hover:bg-sand-light/50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isAnimated"
                      checked={form.isAnimated}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gold peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20"></div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-ink">Enable Animated Showcase</span>
                    <span className="block text-xs text-ink/50">Makes the product card and details page dynamic.</span>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-sand-light/30 p-4 hover:bg-sand-light/50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gold peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20"></div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-ink">Feature Product</span>
                    <span className="block text-xs text-ink/50">Showcase this product on the home page.</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Pricing Section */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg text-ink">
                <DollarSign className="h-5 w-5 text-gold" /> Pricing
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Selling Price (₹)</label>
                  <input
                    required
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">MRP (₹)</label>
                  <input
                    required
                    type="number"
                    name="mrp"
                    value={form.mrp}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
                {discountPercentage > 0 && (
                  <div className="mt-2 text-sm font-medium text-moss">
                    Customer saves {discountPercentage}%!
                  </div>
                )}
              </div>
            </div>

            {/* Organization Section */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg text-ink">
                <Tag className="h-5 w-5 text-gold" /> Organization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Category</label>
                  <select
                    required
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink/80">Brand</label>
                  <select
                    required
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-line bg-sand-light/50 p-3 text-sm text-ink focus:border-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}