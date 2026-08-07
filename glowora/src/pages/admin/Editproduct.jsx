import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);

      const p = res.data.data;

      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        brand: p.brand,
        stock: p.stock,
        image: p.images?.[0] || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        images: [form.image],
      });

      toast.success("Product Updated Successfully");

      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error("Update Failed");
    }
  };

  return (
    <div className="max-w-3xl rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full rounded border p-3"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
        />

        <textarea
          className="w-full rounded border p-3"
          rows="4"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          className="w-full rounded border p-3"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <select
          className="w-full rounded border p-3"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Skincare</option>
          <option>Haircare</option>
          <option>Makeup</option>
          <option>Fragrance</option>
          <option>Salon</option>
          <option>Spa</option>
        </select>

        <input
          className="w-full rounded border p-3"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
        />

        <input
          className="w-full rounded border p-3"
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
        />

        <input
          className="w-full rounded border p-3"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <button
          type="submit"
          className="rounded bg-pink-600 px-6 py-3 text-white"
        >
          Update Product
        </button>

      </form>
    </div>
  );
}