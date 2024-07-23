import SplideSlider from '../common/SplideSlider';
import useBlogStore from '../../hooks/blogStore';
import { useEffect, useState } from 'react';
import { Photo } from '../../app/types/photo';
import { Link } from 'react-router-dom';
import LoadingFull from '../common/LoadingFull';

export default function BlogSegment() {
	const blogStore = useBlogStore();
	const [images, setImages] = useState<Photo[]>([]);
	const emptyGuid = '{00000000-0000-0000-0000-000000000000}';

	// useEffect(() => {
	// 	if (blogStore.blogs.length <= 1) {
	// 		blogStore.loadBlogs();
	// 	}
	// }, [blogStore.blogs.length]);

	useEffect(() => {
		if (blogStore.latestBlogs.length <= 1) {
			blogStore.loadLatestBlogs(emptyGuid);
		}
	}, [blogStore.latestBlogs.length]);

	return (
		<section className='section-blog'>
			<div className='blog-segment'>
				<div className='blog-segment__header'>
					<h3 className='heading-tertiary'>Blog</h3>
					<Link className='btn btn--transparent-grey' to={`/blog/`}>
						More
						<svg>
							<use href='img/sprite.svg#icon-button-arrow' />
						</svg>
					</Link>
				</div>
				<div className='blog-segment__img-wrapper'>
					<SplideSlider
						id='splide-blog'
						className='splide__blog'
						blogs={blogStore.latestBlogs}
					/>
				</div>
			</div>
		</section>
	);
}
