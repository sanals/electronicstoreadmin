import { Category } from './category.types';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  specifications: string; // JSON string
  images: string[]; // URLs
  status: "ACTIVE" | "INACTIVE";
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  specifications: string;
  status: "ACTIVE" | "INACTIVE";
  stock: number;
}

export interface ProductFilter {
  name?: string;
  categoryId?: number;
  status?: "ACTIVE" | "INACTIVE";
  minPrice?: number;
  maxPrice?: number;
  page: number;
  size: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  productsByCategory: {
    categoryName: string;
    count: number;
  }[];
} 