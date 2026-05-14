import type {
  AuthResponse,
  BlogListResponse,
  BlogPost,
  Category,
  HomeData,
  OrderCustomer,
  Product,
  ProductListResponse,
  UserProfile,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryText = query.toString();
  return queryText ? `?${queryText}` : "";
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload as T;
};

export const getHomeData = () => apiRequest<HomeData>("/home");

export const getCategories = (withCounts = false) =>
  apiRequest<Category[]>(`/categories${withCounts ? "?withCounts=1" : ""}`);

export const getCategoryBySlug = (slug: string) =>
  apiRequest<Category>(`/categories/${slug}`);

export const getProducts = (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tag?: string;
  sort?: string;
}) => apiRequest<ProductListResponse>(`/products${buildQuery(params)}`);

export const getProductBySlug = (slug: string) =>
  apiRequest<Product>(`/products/slug/${slug}`);

export const getRelatedProducts = (slug: string) =>
  apiRequest<Product[]>(`/products/slug/${slug}/related`);

export const getBlogPosts = (params: { page?: number; limit?: number; search?: string }) =>
  apiRequest<BlogListResponse>(`/blogs${buildQuery(params)}`);

export const getBlogBySlug = (slug: string) => apiRequest<BlogPost>(`/blogs/${slug}`);

export const registerUser = (payload: { name: string; email: string; password: string }) =>
  apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: { email: string; password: string }) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProfile = (token: string) =>
  apiRequest<{ user: UserProfile }>("/auth/me", {
    token,
  });

export const createOrder = (payload: {
  customer: OrderCustomer;
  paymentMethod: string;
  shippingFee: number;
  items: { productId: string; quantity: number }[];
}) =>
  apiRequest<{
    _id: string;
    status: string;
    total: number;
    createdAt: string;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminCreateCategory = (token: string, payload: Partial<Category>) =>
  apiRequest<Category>("/categories", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const adminUpdateCategory = (
  token: string,
  id: string,
  payload: Partial<Category>
) =>
  apiRequest<Category>(`/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

export const adminDeleteCategory = (token: string, id: string) =>
  apiRequest<{ message: string }>(`/categories/${id}`, {
    method: "DELETE",
    token,
  });

export const adminCreateProduct = (token: string, payload: Record<string, unknown>) =>
  apiRequest<Product>("/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const adminUpdateProduct = (
  token: string,
  id: string,
  payload: Record<string, unknown>
) =>
  apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

export const adminDeleteProduct = (token: string, id: string) =>
  apiRequest<{ message: string }>(`/products/${id}`, {
    method: "DELETE",
    token,
  });

export const adminCreateBlog = (token: string, payload: Record<string, unknown>) =>
  apiRequest<BlogPost>("/blogs", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

export const adminUpdateBlog = (token: string, id: string, payload: Record<string, unknown>) =>
  apiRequest<BlogPost>(`/blogs/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });

export const adminDeleteBlog = (token: string, id: string) =>
  apiRequest<{ message: string }>(`/blogs/${id}`, {
    method: "DELETE",
    token,
  });

export const adminGetOrders = (token: string) =>
  apiRequest<
    {
      _id: string;
      customer: { name: string; email: string };
      total: number;
      status: string;
      createdAt: string;
    }[]
  >("/orders", {
    token,
  });
