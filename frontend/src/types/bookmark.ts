export interface Category {
  id: number;
  name: string;
}

export interface Bookmark {
  id: number;
  title: string;
  content: string;
  category: Category;
}