export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  cardImage?: string;
  isFeatured?: boolean;
  productCount?: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  gallery?: string[];
  category: Category;
  stock: number;
  tags?: string[];
  badge?: string;
  rating?: number;
  reviewCount?: number;
  specifications?: ProductSpecification[];
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ProductListResponse {
  items: Product[];
  pagination: Pagination;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt?: string;
}

export interface BlogListResponse {
  items: BlogPost[];
  pagination: Pagination;
}

export interface HomeHero {
  title: string;
  description: string;
  cta: string;
  image: string;
  highlightPrice: number;
}

export interface HomeDeal {
  title: string;
  subtitle: string;
  image: string;
  discount: string;
}

export interface HomeData {
  hero: HomeHero;
  categories: Category[];
  spotlight: {
    featured: Product[];
    special: Product[];
    popular: Product[];
  };
  hotDeals: HomeDeal[];
  buyStripImage: string;
  partnerStripImage: string;
  latestPosts: BlogPost[];
}

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}
