import React, { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { Badge } from "../../components/ui/Primitives.jsx";

export default function AdminProducts() {
  const navigate = useNavigate();

const [products, setProducts] = useState([]);
const [q, setQ] = useState("");

const fetchProducts = async () => {
  try {
    const res = await api.get("/products");

    setProducts(res.data.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchProducts();
}, []);

const rows = products.filter((p) =>
  p.name.toLowerCase().includes(q.toLowerCase())
);

const deleteProduct = async (id) => {
  if (!window.confirm("Delete this product?")) return;

  try {
    await api.delete(`/products/${id}`);

    fetchProducts();

    toast.success("Product Deleted");
  } catch (err) {
    console.log(err);
  }
};
  

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Products</h2>
          <p className="mt-1 text-sm text-ink/50">
  {products.length} SKUs across 7 departments
</p>
        </div>
        <button
  onClick={() => navigate("/admin/products/add")}
  className="btn-primary !py-2.5"
>
  <Plus size={15} />
  Add Product
</button>
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5">
        <Search size={15} className="text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="w-full text-sm outline-none" />
      </div>

      <div className="overflow-x-auto rounded-xl2 border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink/40">
              <th className="p-4 font-normal">Product</th>
              <th className="p-4 font-normal">SKU</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Price</th>
              <th className="p-4 font-normal">Stock</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-line/70 last:border-0 hover:bg-sand-light/50">
                <td className="flex items-center gap-3 p-4">
                  <img
  src={p.images?.[0] || "https://via.placeholder.com/60"}
  alt={p.name}
  className="h-10 w-10 rounded-lg object-cover"
  loading="lazy"
  decoding="async"
/>
                  <span className="font-medium text-ink">{p.name}</span>
                </td>
                <td className="p-4 font-mono text-xs text-ink/55">
  {p._id.slice(-6).toUpperCase()}
</td>
                <td className="p-4 text-ink/60">{p.category}</td>
                <td className="p-4 font-mono text-ink">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="p-4">
  {p.stock > 0 ? (
    <Badge tone="sand">In Stock</Badge>
  ) : (
    <Badge tone="clay">Out of Stock</Badge>
  )}
</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2 text-ink/40">
                    <button
  onClick={() => navigate(`/admin/products/edit/${p._id}`)}
  className="hover:text-gold-dark"
>
  <Pencil size={14} />
</button>
                    <button
  onClick={() => deleteProduct(p._id)}
  className="hover:text-clay"
>
  <Trash2 size={14} />
</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
