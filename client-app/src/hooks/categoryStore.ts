import { create } from 'zustand';
import { Category, CategoryWithBlogCount } from '../app/types/category';
import agent from '../app/api/agent';
import Utils from '../app/scripts/utils';

type State = {
	loading: boolean;
	loadingInitial: boolean;
	loadingButton: boolean;
	categories: Category[];
	category: Category;
	categoryWithBlogCount: CategoryWithBlogCount[];
};

type Actions = {
	loadCategories: () => Promise<void>;
	loadCategory: (id: string) => Promise<void>;
	loadCategoryByName: (name: string) => Promise<Category>;
	loadCategoryWithBlogCount: () => Promise<void>;
	addCategory: (category: Category) => Promise<void>;
	editCategory: (category: Category) => Promise<void>;
	deleteCategory: (id: string) => Promise<void>;
	resetCategory: () => void;
};

const useCategoryStore = create<State & Actions>((set, get) => ({
	loading: false,
	loadingInitial: false,
	loadingButton: false,
	categories: [],
	category: new Category(),
	categoryWithBlogCount: [],
	loadCategories: async () => {
		try {
			set({ loadingInitial: true });
			const categories = await agent.Categories.get();
			if (categories.length > get().categories.length) {
				set({ categories: categories });
			}
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	loadCategory: async (id) => {
		try {
			set({ loading: true });
			const category = await agent.Categories.detail(id);
			set({ category: category });
		} catch (error) {
			throw error;
		} finally {
			set({ loading: false });
		}
	},
	loadCategoryByName: async (name) => {
		try {
			set({ loading: true });
			const category = await agent.Categories.getByName(name);
			set({ category: category });
			return category
		} catch (error) {
			throw error;
		} finally {
			set({ loading: false });
		}
	},
	loadCategoryWithBlogCount: async () => {
		try {
			set({ loadingInitial: true });
			const categoryWithBlogCount = await agent.Categories.getWithBlogCount();
			set({ categoryWithBlogCount: categoryWithBlogCount });
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	addCategory: async (category) => {
		try {
			set({ loadingButton: true });
			await agent.Categories.add(category);
			set((state) => ({ categories: [...state.categories, category] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	editCategory: async (category) => {
		try {
			set({ loadingButton: true });
			await agent.Categories.edit(category);
			set((state) => ({
				categories: [...Utils.updateArrayItem(state.categories, category)],
			}));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	deleteCategory: async (id) => {
		try {
			set({ loadingButton: true });
			await agent.Categories.delete(id);
			set((state) => ({ categories: [...state.categories.filter((c) => c.id !== id)] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	resetCategory: () => {
		set({ category: new Category() });
	},
}));

export default useCategoryStore;
