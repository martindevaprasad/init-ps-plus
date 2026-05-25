import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types';

interface CategoryState {
  categories: Category[];
}

const DEMO_CATEGORIES: Category[] = [
  { id: 'c1', _id: 'c1', name: 'Food', parentCategory: null, isActive: true },
  { id: 'c2', _id: 'c2', name: 'Starters', parentCategory: 'c1', isActive: true },
  { id: 'c3', _id: 'c3', name: 'Main Course', parentCategory: 'c1', isActive: true },
  { id: 'c4', _id: 'c4', name: 'Desserts', parentCategory: null, isActive: true },
  { id: 'c5', _id: 'c5', name: 'Bakery', parentCategory: null, isActive: true },
  { id: 'c6', _id: 'c6', name: 'Beverages', parentCategory: null, isActive: true },
];

const initialState: CategoryState = {
  categories: DEMO_CATEGORIES,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) { state.categories.push(action.payload); },
    updateCategory(state, action: PayloadAction<Category>) {
      const idx = state.categories.findIndex(c => c.id === action.payload.id || c._id === action.payload._id);
      if (idx !== -1) state.categories[idx] = action.payload;
    },
    deleteCategory(state, action: PayloadAction<string>) {
      const cat = state.categories.find(c => c.id === action.payload || c._id === action.payload);
      if (cat) cat.isActive = false;
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
