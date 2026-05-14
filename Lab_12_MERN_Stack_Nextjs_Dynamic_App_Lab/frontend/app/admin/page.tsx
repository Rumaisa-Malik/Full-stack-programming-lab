"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminCreateBlog,
  adminCreateCategory,
  adminCreateProduct,
  adminDeleteBlog,
  adminDeleteCategory,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateBlog,
  adminUpdateCategory,
  adminUpdateProduct,
  getBlogPosts,
  getCategories,
  getProducts,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { BlogPost, Category, Product } from "@/lib/types";

type Tab = "categories" | "products" | "blogs" | "orders";

const emptyCategoryDraft = {
  id: "",
  name: "",
  description: "",
  image: "",
  cardImage: "",
  isFeatured: false,
};

const emptyProductDraft = {
  id: "",
  title: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  image: "",
  category: "",
  tags: "featured",
  stock: "",
  badge: "",
};

const emptyBlogDraft = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "design",
  author: "Rustik Team",
  isPublished: true,
};

export default function AdminPage() {
  const { token, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<
    {
      _id: string;
      customer: { name: string; email: string };
      total: number;
      status: string;
      createdAt: string;
    }[]
  >([]);
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState(emptyCategoryDraft);
  const [productDraft, setProductDraft] = useState(emptyProductDraft);
  const [blogDraft, setBlogDraft] = useState(emptyBlogDraft);

  const loadData = useCallback(async () => {
    try {
      const [categoryData, productData, blogData] = await Promise.all([
        getCategories(),
        getProducts({ limit: 60 }),
        getBlogPosts({ limit: 60 }),
      ]);
      setCategories(categoryData);
      setProducts(productData.items);
      setBlogs(blogData.items);

      if (token) {
        const orderData = await adminGetOrders(token);
        setOrders(orderData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    }
  }, [token]);

  useEffect(() => {
    if (!token || !isAdmin) return;
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [token, isAdmin, loadData]);

  const withFeedback = async (action: () => Promise<void>, successMessage: string) => {
    try {
      setError(null);
      setNotice(null);
      setIsBusy(true);
      await action();
      setNotice(successMessage);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setIsBusy(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[18px]">Loading...</div>;
  }

  if (!token || !isAdmin) {
    return (
      <div className="mx-auto max-w-[860px] px-4 py-10">
        <div className="rustik-card bg-white p-8 text-center">
          <h1 className="text-[58px] text-[#282828]">Admin Access Required</h1>
          <p className="mt-2 text-[18px] text-[#5b5b5b]">
            Login with admin credentials to manage products and content.
          </p>
          <p className="mt-3 text-[16px] text-[#666]">
            Demo: <strong>admin@rustikplank.com / admin123</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-8 md:px-6">
      <h1 className="mb-5 text-[46px] text-[#252525]">Admin Panel</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["categories", "products", "blogs", "orders"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border px-4 py-2 text-[16px] uppercase ${
              activeTab === tab
                ? "border-[#d97814] bg-[#d97814] text-white"
                : "border-[#cacaca] bg-white text-[#555]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {notice ? <p className="mb-4 text-[16px] text-[#2e6a3a]">{notice}</p> : null}
      {error ? <p className="mb-4 text-[16px] text-[#ad4646]">{error}</p> : null}

      {activeTab === "categories" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form
            className="rustik-card space-y-3 bg-white p-5"
            onSubmit={(event) => {
              event.preventDefault();
              withFeedback(async () => {
                const payload = {
                  name: categoryDraft.name,
                  description: categoryDraft.description,
                  image: categoryDraft.image,
                  cardImage: categoryDraft.cardImage,
                  isFeatured: categoryDraft.isFeatured,
                };
                if (categoryDraft.id) {
                  await adminUpdateCategory(token, categoryDraft.id, payload);
                } else {
                  await adminCreateCategory(token, payload);
                }
                setCategoryDraft(emptyCategoryDraft);
              }, "Category saved.");
            }}
          >
            <h2 className="text-[42px] text-[#2b2b2b]">
              {categoryDraft.id ? "Update Category" : "Create Category"}
            </h2>
            <input
              required
              className="checkout-input"
              placeholder="Category Name"
              value={categoryDraft.name}
              onChange={(event) =>
                setCategoryDraft((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <textarea
              className="checkout-input min-h-20"
              placeholder="Description"
              value={categoryDraft.description}
              onChange={(event) =>
                setCategoryDraft((prev) => ({ ...prev, description: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Image Path (/assets/...)"
              value={categoryDraft.image}
              onChange={(event) =>
                setCategoryDraft((prev) => ({ ...prev, image: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Card Image Path (/assets/...)"
              value={categoryDraft.cardImage}
              onChange={(event) =>
                setCategoryDraft((prev) => ({ ...prev, cardImage: event.target.value }))
              }
            />
            <label className="flex items-center gap-2 text-[16px] text-[#555]">
              <input
                type="checkbox"
                checked={categoryDraft.isFeatured}
                onChange={(event) =>
                  setCategoryDraft((prev) => ({ ...prev, isFeatured: event.target.checked }))
                }
              />
              Featured on homepage
            </label>
            <button disabled={isBusy} className="ticket-button disabled:opacity-60">
              {isBusy ? "Saving..." : "Save Category"}
            </button>
          </form>

          <section className="rustik-card bg-white p-5">
            <h2 className="mb-3 text-[42px] text-[#2b2b2b]">All Categories</h2>
            <div className="space-y-3">
              {categories.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b border-[#ececec] pb-2">
                  <div>
                    <p className="text-[22px] text-[#333]">{item.name}</p>
                    <p className="text-[15px] text-[#777]">{item.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCategoryDraft({
                          id: item._id,
                          name: item.name,
                          description: item.description || "",
                          image: item.image || "",
                          cardImage: item.cardImage || "",
                          isFeatured: Boolean(item.isFeatured),
                        })
                      }
                      className="border border-[#d1d1d1] px-2 py-1 text-[14px]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        withFeedback(async () => {
                          await adminDeleteCategory(token, item._id);
                        }, "Category deleted.")
                      }
                      className="border border-[#d9b1b1] px-2 py-1 text-[14px] text-[#a04b4b]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "products" ? (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <form
            className="rustik-card space-y-3 bg-white p-5"
            onSubmit={(event) => {
              event.preventDefault();
              withFeedback(async () => {
                const payload = {
                  title: productDraft.title,
                  shortDescription: productDraft.shortDescription,
                  description: productDraft.description,
                  price: Number(productDraft.price),
                  compareAtPrice: Number(productDraft.compareAtPrice) || 0,
                  image: productDraft.image,
                  category: productDraft.category,
                  tags: productDraft.tags
                    .split(",")
                    .map((tag) => tag.trim().toLowerCase())
                    .filter(Boolean),
                  stock: Number(productDraft.stock) || 0,
                  badge: productDraft.badge,
                };
                if (productDraft.id) {
                  await adminUpdateProduct(token, productDraft.id, payload);
                } else {
                  await adminCreateProduct(token, payload);
                }
                setProductDraft(emptyProductDraft);
              }, "Product saved.");
            }}
          >
            <h2 className="text-[42px] text-[#2b2b2b]">
              {productDraft.id ? "Update Product" : "Create Product"}
            </h2>
            <input
              className="checkout-input"
              required
              placeholder="Title"
              value={productDraft.title}
              onChange={(event) =>
                setProductDraft((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Short description"
              value={productDraft.shortDescription}
              onChange={(event) =>
                setProductDraft((prev) => ({ ...prev, shortDescription: event.target.value }))
              }
            />
            <textarea
              className="checkout-input min-h-20"
              placeholder="Description"
              value={productDraft.description}
              onChange={(event) =>
                setProductDraft((prev) => ({ ...prev, description: event.target.value }))
              }
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="checkout-input"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="Price"
                value={productDraft.price}
                onChange={(event) =>
                  setProductDraft((prev) => ({ ...prev, price: event.target.value }))
                }
              />
              <input
                className="checkout-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Compare At Price"
                value={productDraft.compareAtPrice}
                onChange={(event) =>
                  setProductDraft((prev) => ({ ...prev, compareAtPrice: event.target.value }))
                }
              />
              <input
                className="checkout-input"
                type="number"
                min="0"
                placeholder="Stock"
                value={productDraft.stock}
                onChange={(event) =>
                  setProductDraft((prev) => ({ ...prev, stock: event.target.value }))
                }
              />
              <select
                required
                className="checkout-input"
                value={productDraft.category}
                onChange={(event) =>
                  setProductDraft((prev) => ({ ...prev, category: event.target.value }))
                }
              >
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item._id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              className="checkout-input"
              placeholder="Image path /assets/..."
              required
              value={productDraft.image}
              onChange={(event) =>
                setProductDraft((prev) => ({ ...prev, image: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Tags (featured,special,popular)"
              value={productDraft.tags}
              onChange={(event) =>
                setProductDraft((prev) => ({ ...prev, tags: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Badge"
              value={productDraft.badge}
              onChange={(event) =>
                setProductDraft((prev) => ({ ...prev, badge: event.target.value }))
              }
            />
            <button disabled={isBusy} className="ticket-button disabled:opacity-60">
              {isBusy ? "Saving..." : "Save Product"}
            </button>
          </form>

          <section className="rustik-card bg-white p-5">
            <h2 className="mb-3 text-[42px] text-[#2b2b2b]">Products</h2>
            <div className="max-h-[740px] space-y-2 overflow-auto pr-2">
              {products.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-2 border-b border-[#ececec] pb-2">
                  <div>
                    <p className="text-[20px] text-[#333]">{item.title}</p>
                    <p className="text-[14px] text-[#777]">
                      £{item.price.toFixed(2)} | {item.category?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setProductDraft({
                          id: item._id,
                          title: item.title,
                          shortDescription: item.shortDescription,
                          description: item.description,
                          price: String(item.price),
                          compareAtPrice: String(item.compareAtPrice || ""),
                          image: item.image,
                          category: item.category?.slug || "",
                          tags: (item.tags || []).join(","),
                          stock: String(item.stock),
                          badge: item.badge || "",
                        })
                      }
                      className="border border-[#d1d1d1] px-2 py-1 text-[14px]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        withFeedback(async () => {
                          await adminDeleteProduct(token, item._id);
                        }, "Product deleted.")
                      }
                      className="border border-[#d9b1b1] px-2 py-1 text-[14px] text-[#a04b4b]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "blogs" ? (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <form
            className="rustik-card space-y-3 bg-white p-5"
            onSubmit={(event) => {
              event.preventDefault();
              withFeedback(async () => {
                const payload = {
                  title: blogDraft.title,
                  excerpt: blogDraft.excerpt,
                  content: blogDraft.content,
                  coverImage: blogDraft.coverImage,
                  tags: blogDraft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                  author: blogDraft.author,
                  isPublished: blogDraft.isPublished,
                };
                if (blogDraft.id) {
                  await adminUpdateBlog(token, blogDraft.id, payload);
                } else {
                  await adminCreateBlog(token, payload);
                }
                setBlogDraft(emptyBlogDraft);
              }, "Blog saved.");
            }}
          >
            <h2 className="text-[42px] text-[#2b2b2b]">
              {blogDraft.id ? "Update Post" : "Create Post"}
            </h2>
            <input
              className="checkout-input"
              required
              placeholder="Title"
              value={blogDraft.title}
              onChange={(event) =>
                setBlogDraft((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <textarea
              className="checkout-input min-h-18"
              placeholder="Excerpt"
              value={blogDraft.excerpt}
              onChange={(event) =>
                setBlogDraft((prev) => ({ ...prev, excerpt: event.target.value }))
              }
            />
            <textarea
              className="checkout-input min-h-24"
              placeholder="Content"
              value={blogDraft.content}
              onChange={(event) =>
                setBlogDraft((prev) => ({ ...prev, content: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Cover image path"
              value={blogDraft.coverImage}
              onChange={(event) =>
                setBlogDraft((prev) => ({ ...prev, coverImage: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Tags (comma separated)"
              value={blogDraft.tags}
              onChange={(event) =>
                setBlogDraft((prev) => ({ ...prev, tags: event.target.value }))
              }
            />
            <input
              className="checkout-input"
              placeholder="Author"
              value={blogDraft.author}
              onChange={(event) =>
                setBlogDraft((prev) => ({ ...prev, author: event.target.value }))
              }
            />
            <label className="flex items-center gap-2 text-[16px] text-[#555]">
              <input
                type="checkbox"
                checked={blogDraft.isPublished}
                onChange={(event) =>
                  setBlogDraft((prev) => ({ ...prev, isPublished: event.target.checked }))
                }
              />
              Published
            </label>
            <button disabled={isBusy} className="ticket-button disabled:opacity-60">
              {isBusy ? "Saving..." : "Save Post"}
            </button>
          </form>

          <section className="rustik-card bg-white p-5">
            <h2 className="mb-3 text-[42px] text-[#2b2b2b]">Blog Posts</h2>
            <div className="max-h-[740px] space-y-2 overflow-auto pr-2">
              {blogs.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-2 border-b border-[#ececec] pb-2">
                  <div>
                    <p className="text-[20px] text-[#333]">{item.title}</p>
                    <p className="text-[14px] text-[#777]">{item.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBlogDraft({
                          id: item._id,
                          title: item.title,
                          excerpt: item.excerpt,
                          content: item.content,
                          coverImage: item.coverImage,
                          tags: item.tags.join(","),
                          author: item.author,
                          isPublished: item.isPublished,
                        })
                      }
                      className="border border-[#d1d1d1] px-2 py-1 text-[14px]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        withFeedback(async () => {
                          await adminDeleteBlog(token, item._id);
                        }, "Blog deleted.")
                      }
                      className="border border-[#d9b1b1] px-2 py-1 text-[14px] text-[#a04b4b]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "orders" ? (
        <section className="rustik-card bg-white p-5">
          <h2 className="mb-4 text-[42px] text-[#2b2b2b]">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-[17px] text-[#666]">No orders yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full min-w-[740px] text-left">
                <thead>
                  <tr className="border-b border-[#dcdcdc] text-[16px] uppercase text-[#555]">
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-[#ededed] text-[15px] text-[#4f4f4f]">
                      <td className="p-2">{order._id.slice(-8)}</td>
                      <td className="p-2">{order.customer.name}</td>
                      <td className="p-2">{order.customer.email}</td>
                      <td className="p-2">£{order.total.toFixed(2)}</td>
                      <td className="p-2">{order.status}</td>
                      <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
