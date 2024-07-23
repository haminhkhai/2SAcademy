import { create } from 'zustand';
import { Blog } from '../app/types/blog';
import agent from '../app/api/agent';
import Utils from '../app/scripts/utils';

type State = {
	loadingInitial: boolean;
	loadingButton: boolean;
	loading: boolean;
	blog: Blog;
	blogs: Blog[];
	latestBlogs: Blog[];
};

type Actions = {
	loadBlog: (id: string) => Promise<Blog>;
	loadBlogs: () => Promise<Blog[]>;
	loadLatestBlogs: (currentBlogId: string) => Promise<void>;
	categoryBlogs: (Category: string) => Blog[];
	addBlog: (blog: Blog, photo?: Blob) => Promise<void>;
	editBlog: (blog: Blog, photo?: Blob) => Promise<void>;
	setBlogContent: (blog: Blog) => void;
	deleteBlog: (id: string) => Promise<void>;
	resetBlog: () => void;
	setLoading: (isLoading: boolean) => void;
};

const useBlogStore = create<State & Actions>((set, get) => ({
	loadingInitial: false,
	loadingButton: false,
	loading: false,
	blog: new Blog(),
	blogs: [],
	latestBlogs: [],
	loadBlog: async (id) => {
		try {
			set({ loading: true });
			const blog = await agent.Blogs.detail(id);
			set({ blog: blog });
			return blog;
		} catch (error) {
			throw error;
		} finally {
			set({ loading: false });
		}
	},
	loadBlogs: async () => {
		try {
			set({ loadingInitial: true });
			const blogs = await agent.Blogs.get();
			if (blogs.length > get().blogs.length) {
				set({ blogs: blogs });
			}
			return blogs;
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	loadLatestBlogs: async (currentBlogId) => {
		try {
			set({ loadingInitial: true });
			const latestBlogs = await agent.Blogs.getTopFive(currentBlogId);
			if (latestBlogs.length > get().latestBlogs.length) {
				set({ latestBlogs: latestBlogs });
			}
			// return latestBlogs;
		} catch (error) {
			throw error;
		} finally {
			set({ loadingInitial: false });
		}
	},
	categoryBlogs: (category) => {
		var blogs = get().blogs.filter(
			(b) => b.category.name.toLowerCase() === category.toLowerCase()
		);
		return blogs;
	},
	addBlog: async (blog, photo) => {
		try {
			set({ loadingButton: true });

			if (photo) {
				const photoDto = await agent.Photos.uploadPhoto(photo);
				blog.thumbPublicId = photoDto.public_id;
				blog.thumbUrl = photoDto.secure_url;
			}

			await agent.Blogs.add(blog);
			set((state) => ({ blogs: [...state.blogs, blog] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	editBlog: async (blog, photo) => {
		try {
			set({ loadingButton: true });

			if (photo) {
				const photoDto = await agent.Photos.uploadPhoto(photo);
				blog.thumbPublicId = photoDto.public_id;
				blog.thumbUrl = photoDto.secure_url;
			}

			await agent.Blogs.edit(blog);
			set((state) => ({ blogs: [...Utils.updateArrayItem(state.blogs, blog)] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	setBlogContent: (blog) => {
		set((state) => ({ blog: { ...blog } }));
	},
	deleteBlog: async (id) => {
		try {
			set({ loadingButton: true });
			await agent.Blogs.delete(id);

			set((state) => ({ blogs: [...state.blogs.filter((b) => b.id !== id)] }));
		} catch (error) {
			throw error;
		} finally {
			set({ loadingButton: false });
		}
	},
	resetBlog: () => {
		set({ blog: new Blog() });
	},
	setLoading: (isLoading) => {
		set({ loadingInitial: isLoading });
	},
}));

export default useBlogStore;
