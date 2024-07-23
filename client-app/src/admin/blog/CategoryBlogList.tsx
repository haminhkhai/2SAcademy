import SimpleButton from '../../features/common/SimpleButton';
import { useModalStore } from '../../hooks/useModalStore';
import CategoryForm from './CategoryForm';
import useCategoryStore from '../../hooks/categoryStore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingFull from '../../features/common/LoadingFull';
import BlogForm from './BlogForm';
import useBlogStore from '../../hooks/blogStore';
import { format } from 'date-fns';

export default function CategoryBlogList() {
	const modalStore = useModalStore();
	const categoryStore = useCategoryStore();
	const blogStore = useBlogStore();
	const [buttonTarget, setButtonTarget] = useState<string>('');

	const handleDelete = (id: string) => {
		setButtonTarget(id);
		categoryStore.deleteCategory(id).then(() => {
			toast.info('Deleted');
		});
	};

	const handleBlogDelete = (id: string) => {
		setButtonTarget(id);
		blogStore.deleteBlog(id).then(() => {
			toast.info('Deleted');
		});
	};

	useEffect(() => {
		if (categoryStore.categories.length <= 1) categoryStore.loadCategories();
		if (blogStore.blogs.length <= 1) blogStore.loadBlogs();
	}, []);

	if (categoryStore.loadingInitial) return <LoadingFull />;

	return (
		<>
			<div className='admin__segment'>
				<div className='admin__segment-header'>
					<h3 className='admin__heading'>Category</h3>
					<SimpleButton
						color='blue'
						text='ADD CATEGORY'
						onClick={() => modalStore.openModal(<CategoryForm />, 'medium')}
					/>
				</div>
				<div className='category__wrapper'>
					{categoryStore.categories.map((category) => (
						<div className='category' key={category.id}>
							<h4 className='heading-small'>{category.name}</h4>
							<div className='category__footer'>
								<SimpleButton
									text='Delete'
									color='red'
									loading={
										categoryStore.loadingButton && buttonTarget == category.id
									}
									onClick={() => handleDelete(category.id)}
								/>
								<SimpleButton
									text='Edit'
									color='blue'
									onClick={() =>
										modalStore.openModal(
											<CategoryForm categoryId={category.id} />,
											'medium'
										)
									}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='admin__segment'>
				<div className='admin__segment-header'>
					<h3 className='admin__heading'>Blog</h3>
					<SimpleButton
						color='blue'
						text='ADD BLOG'
						onClick={() => modalStore.openModal(<BlogForm />, 'large')}
					/>
				</div>
				<div className='blog-card__wrapper'>
					{blogStore.blogs.map((blog) => (
						<div key={blog.id} className='blog-card blog-card--light'>
							<div className='blog-card__thumb-wrapper'>
								<img
									src={blog.thumbUrl}
									alt={blog.title}
									className='blog-card__thumb'
								/>
							</div>
							<div className='blog-card__detail'>
								<span className='blog-card__date'>
									<svg className='blog-card__date-icon'>
										<use href='/img/sprite.svg#icon-calendar' />
									</svg>
									{format(blog.createdDate, 'd MMM yyyy hh:mm')}
								</span>

								<h2 className='blog-card__heading'>{blog.title}</h2>
								<p className='blog-card__excerpt'>{blog.description}</p>
							</div>
							<div className='blog-card__meta'>
								<div className='simple-btn__group u-align-center'>
									<SimpleButton
										onClick={() => handleBlogDelete(blog.id)}
										loading={blogStore.loadingButton && buttonTarget === blog.id}
										color='red'
										text={'Delete'}
									/>
									<SimpleButton
										color='blue'
										text={'Edit'}
										onClick={() => {
											modalStore.openModal(
												<BlogForm blogId={blog.id} />,
												'large'
											);
										}}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
