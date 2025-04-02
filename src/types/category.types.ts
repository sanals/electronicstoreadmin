export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentCategory?: Category;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  parentCategoryId?: number;
  imageUrl?: string;
  status: "ACTIVE" | "INACTIVE";
  image?: File | null;
} 