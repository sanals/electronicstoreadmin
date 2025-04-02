export interface Category {
  id: number;
  name: string;
  description: string;
  parentCategory?: Category;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  parentCategoryId?: number;
  status: "ACTIVE" | "INACTIVE";
} 