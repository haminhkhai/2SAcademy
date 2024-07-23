import { useEffect, useState } from 'react';
import useCategoryStore from '../../hooks/categoryStore';
import { Link, useParams } from 'react-router-dom';
import useBlogStore from '../../hooks/blogStore';
import { format } from 'date-fns';
import LoadingFull from '../common/LoadingFull';
import { Blog } from '../../app/types/blog';
import BlogCard from './BlogCard';
import { toast } from 'react-toastify';

export default function BlogDetail() {
	const categoryStore = useCategoryStore();
	const blogStore = useBlogStore();
	const { category } = useParams();
	const { blogId } = useParams();
	const [blog, setBlog] = useState<Blog>();

	useEffect(() => {
		if (categoryStore.categoryWithBlogCount.length <= 1) {
			categoryStore.loadCategoryWithBlogCount();
		}
	}, []);

	useEffect(() => {
		if (category) {
			var categoryBlogs = blogStore.categoryBlogs(category);
			if (categoryBlogs.length === 0) {
				//check valid category
				categoryStore.loadCategoryByName(category).catch((error) => {
					toast.error(error);
				});
			}
		}
	}, []);

	const loadCurrentBlog = async () => {
		if (blogId) {
			let currentBlog = blogStore.blogs.find((b) => b.id === blogId);
			if (!currentBlog) {
				currentBlog = await blogStore.loadBlog(blogId);
			}
			setBlog(currentBlog);
			blogStore.loadLatestBlogs(blogId);
		}
	};

	useEffect(() => {
		loadCurrentBlog();
	}, [blogId]);

	if (blogStore.loadingInitial) return <LoadingFull />;

	return (
		<>
			<div className='cover cover--blog'>
				<div className='cover__heading-box'>
					<h1 className='cover__heading heading-primary'>BLOG</h1>
					<ul className='nav-breadcrumb'>
						<li className='nav-breadcrumb__item'>Home</li>
						<li className='nav-breadcrumb__item'>Blog</li>
						<li className='nav-breadcrumb__item nav-breadcrumb__item--active'>
							{category}
						</li>
					</ul>
				</div>
			</div>
			<div className='blog-list'>
				<div className='container'>
					<div className='two-cols-row'>
						<div className='col-left-65 u-padding-side-small blog-list__wrapper'>
							{blog && <BlogCard key={blog.id} blog={blog} isBlogDetail={true} />}
						</div>
						<div className='col-right-35'>
							{/* <div className='sidebar-widget'>
								<h2 className='sidebar-widget__heading'>SEARCH FEED</h2>
								<div className='form'>
									<form className='form'>
										<TextInput icon='search' name={''} />
									</form>
								</div>
							</div> */}

							<div className='sidebar-widget'>
								<h2 className='sidebar-widget__heading'>CATEGORY</h2>
								<ul className='nav-secondary nav-secondary-sidebar'>
									{categoryStore.categoryWithBlogCount.map((category) => (
										<li
											className='nav-secondary-sidebar__item'
											key={category.id}>
											<Link to={`/blog/${category.name}`}>
												<svg>
													<use href='/img/sprite.svg#icon-chevron-circle-right' />
												</svg>
												{category.name}
												<span>[{category.blogCount}]</span>
											</Link>
										</li>
									))}
								</ul>
							</div>

							<div className='sidebar-widget'>
								<h2 className='sidebar-widget__heading'>LATEST POST</h2>
								{blogStore.latestBlogs.map((blog) => (
									<div className='blog-card-small' key={blog.id}>
										<div className='blog-card-small__thumb-wrapper'>
											<img
												src={blog.thumbUrl}
												className='blog-card-small__thumb'></img>
										</div>
										<div className='blog-card-small__detail'>
											<h2 className='blog-card-small__heading'>
												{blog.title}
											</h2>
											<span className='blog-card-small__time'>
												{format(blog.createdDate, 'd MMM yy')}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
