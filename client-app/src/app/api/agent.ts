import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { router } from '../../Router/Routes';
import { User, UserFormValues } from '../types/account';
import useCommonStore from '../../hooks/commonStore';
import { Course } from '../types/course';
import { Customer } from '../types/customer';
import { Artist } from '../types/artist';
import { PhotoDto, PhotoSignature } from '../types/photo';
import usePhotoStore from '../../hooks/photoStore';
import { Gallery } from '../types/gallery';
import { Category, CategoryWithBlogCount } from '../types/category';
import { Blog } from '../types/blog';
import { Review } from '../types/review';

export const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
	const token = useCommonStore.getState().token;
	if (token && config.headers && !config.url?.includes('cloudinary'))
		config.headers.Authorization = `Bearer ${token}`;
	return config;
});

axios.interceptors.response.use(
	async (response) => {
		if (import.meta.env.DEV) await sleep(0);
		return response;
	},
	(error: AxiosError) => {
		const { data, status, config } = error.response as AxiosResponse;
		switch (status) {
			case 400:
				if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
					router.navigate('/not-found');
				}
				if (data.errors) {
					const modalStateErrors = [];
					for (const key in data.errors) {
						if (data.errors[key]) {
							modalStateErrors.push(data.errors[key]);
						}
					}
					throw modalStateErrors.flat();
				} else {
					toast.error(data);
				}
				break;
			case 401:
				toast.error('unauthorised');
				break;
			case 403:
				toast.error('forbidden');
				break;
			case 404:
				router.navigate('/not-found');
				break;
			case 500:
				// store.commonStore.setServerError(data);
				router.navigate('/server-error');
				break;
		}
		//pass the error back to the component that was calling the method
		return Promise.reject(error);
	}
);

const request = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody),
	post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
	put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
	delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Accounts = {
	current: () => request.get<User>('/account'),
	login: (user: UserFormValues) => request.post<User>('/account/login', user),
};

const Courses = {
	list: () => request.get<Course[]>('/course'),
	detail: (id: string) => request.get<Course>(`/course/${id}`),
	add: (course: Course) => request.post('/course', course),
	edit: (course: Course) => request.put('/course', course),
	delete: (id: string) => request.delete(`/course/${id}`)
};

const Customers = {
	get: () => request.get<Customer[]>('/customer'),
	add: (customer: Customer) => request.post('/customer', customer),
	edit: (customer: Customer) => request.put<Customer>('/customer', customer),
	delete: (id: string) => request.delete(`/customer/${id}`),
};

const Artists = {
	get: () => request.get<Artist[]>('/artist'),
	add: (artist: Artist) => request.post('/artist', artist),
	detail: (id: string) => request.get<Artist>(`/artist/${id}`),
	edit: (artist: Artist) => request.put('/artist', artist),
	delete: (id: string) => request.delete(`/artist/${id}`),
};

const Signature = {
	getSignature: async (preset: string) =>
		request.get<PhotoSignature>(`/photo/getsignature/${preset}`),
};

const Galleries = {
	get: () => request.get<Gallery[]>('/gallery'),
	add: (gallery: Gallery) => request.post('/gallery', gallery),
	detail: (id: string) => request.get<Gallery>(`/gallery/${id}`),
	edit: (gallery: Gallery) => request.put('/gallery', gallery),
	delete: (id: string) => request.delete(`/gallery/${id}`),
};

const Categories = {
	get: () => request.get<Category[]>('/category'),
	getByName: (name: string) => request.get<Category>(`/category/name/${name}`),
	detail: (id: string) => request.get<Category>(`/category/${id}`),
	add: (category: Category) => request.post('/category', category),
	edit: (category: Category) => request.put('/category', category),
	delete: (id: string) => request.delete(`/category/${id}`),
	getWithBlogCount: () => request.get<CategoryWithBlogCount[]>('/category/CategoryWithBlogCount')
};

const Blogs = {
	get: () => request.get<Blog[]>('/blog'),
	getTopFive: (id: string) => request.get<Blog[]>(`/blog/${id}/topfive`),
	detail: (id: string) => request.get<Blog>(`/blog/${id}`),
	add: (blog: Blog) => request.post('/blog', blog),
	edit: (blog: Blog) => request.put('/blog', blog),
	delete: (id: string) => request.delete(`/blog/${id}`),
};

const Reviews = {
	get: () => request.get<Review[]>('/review')
}

const Photos = {
	uploadPhoto: async (file: Blob) => {
		const signature = await Signature.getSignature('2smusic');
		let formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', '466595765355674');
		formData.append('timestamp', signature.timestamp);
		formData.append('signature', signature.signature);
		formData.append('upload_preset', '2smusic');

		const config = {
			onUploadProgress: (e: any) => {
				const { loaded, total } = e;
				usePhotoStore.getState().setProgress((loaded / total) * 100 - 10);
			},
		};

		const response = await axios.post<PhotoDto>(
			'https://api.cloudinary.com/v1_1/de04qqilt/image/upload',
			formData,
			config
		);
		return responseBody(response);
	},
	deletePhoto: (publicId: string) => request.delete(`/photo/${publicId.replace('/', '%2F')}`),
};

const agent = {
	Accounts,
	Courses,
	Customers,
	Artists,
	Photos,
	Galleries,
	Categories,
	Blogs,
	Reviews
};

export default agent;
