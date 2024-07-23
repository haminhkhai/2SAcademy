import { useEffect, useRef, useState } from 'react';

import { Review } from '../../app/types/review';
import ReviewCard from '../review/ReviewCard';
//ignore typescript because splidejs does not have typescripts definition file
// @ts-ignore
import Splide from '@splidejs/splide';
import { getAttribute } from '@splidejs/splide/src/js/utils';
import { Blog } from '../../app/types/blog';
import { useNavigate } from 'react-router-dom';

type Props = {
	className: string;
	photos?: any[];
	reviews?: Review[];
	setIndex?: any;
	setLightboxOpen?: any;
	id: string;
	blogs?: Blog[];
};

export default function SplideSlider({
	className,
	photos,
	reviews,
	setIndex,
	setLightboxOpen,
	id,
	blogs,
}: Props) {
	const splideRef = useRef<any>(null);
	const [loadedCount, setLoadedCount] = useState(0);
	const navigate = useNavigate();

	let splideOptionsOverflow: any = {
		type: 'loop',
		drag: true,
		clones: undefined,
		pagination: false,
		flickPower: 400,
		autoWidth: true,
		gap: '3rem',
		focus: 0,
	};

	let splideOptions: any = {
		type: 'slide',
		drag: true,
		snap: true,
		clones: 0,
		arrows: false,
		autoWidth: true,
		gap: '3rem',
	};

	const handleSlideClicked = (index: number) => {
		// Find the slide index from closest slide element
		// var index = e.target.offsetParent.getAttribute('aria-label').split(' of')[0];
		setIndex(index);
		setLightboxOpen(true);
	};

	const handleImageLoad = () => {
		console.log('onload');
		setLoadedCount((prev) => prev + 1);
	};

	const createSplideInstance = () => {
		const splideInstance = new Splide(splideRef.current, splideOptions);
		if (splideInstance) {
			splideInstance.on('overflow', (isOverflow: boolean) => {
				if (isOverflow) splideInstance.options = splideOptionsOverflow;
				else splideInstance.options = splideOptions;
			});

			splideInstance.on('ready', () => {
				document.querySelectorAll('.splide__list').forEach(function (slide: any) {
					slide.style.transform = 'none';
				});
			});

			splideInstance.mount();
			if (photos) {
				splideInstance.Components.Slides.forEach((slide) => {
					slide.slide.onclick = () => {
						const index = getAttribute(slide.slide, 'aria-label')?.split(' of')[0];
						handleSlideClicked(parseInt(index!) - 1);
					};
				});
			}
		}
		return splideInstance;
	};

	useEffect(() => {
		let gallerySplide: Splide | undefined;
		if (
			(photos && photos.length !== 0 && loadedCount === photos.length) ||
			(reviews && reviews.length !== 0) ||
			(blogs && blogs.length !== 0 && loadedCount === blogs.length)
		) {
			gallerySplide = createSplideInstance();
		}

		return () => {
			if (gallerySplide) {
				gallerySplide.destroy();
			}
		};
	}, [photos?.length, loadedCount, reviews?.length]);

	// useEffect(() => {
	// 	let gallerySplide: Splide | undefined;
	// 	if (photos && photos.length !== 0) {
	// 		if (loadedCount === photos?.length) {
	// 			gallerySplide = createSplideInstance();
	// 		}
	// 	}

	// 	return () => {
	// 		if (gallerySplide) {
	// 			gallerySplide.destroy();
	// 		}
	// 	}
	// }, [photos?.length, loadedCount]);

	// useEffect(() => {
	// 	if (reviews && reviews.length !== 0) {
	// 		createSplideInstance();
	// 	}
	// }, [reviews?.length]);

	return (
		<>
			<div ref={splideRef} id={id} className={'splide ' + className}>
				<div className='splide__track'>
					<ul className='splide__list'>
						{photos?.map((photo, index) => (
							<li key={index} className='splide__slide'>
								<img src={photo.url} onLoad={handleImageLoad} />
							</li>
						))}
						{reviews?.map((review) => (
							<li className='splide__slide' key={review.id}>
								<ReviewCard review={review} />
							</li>
						))}
						{blogs?.map((blog, index) => (
							<li
								key={index}
								className='splide__slide'
								onClick={() => {
									navigate(`/blog/${blog.category.name}/${blog.id}`);
								}}>
								<img src={blog.thumbUrl} onLoad={handleImageLoad} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
