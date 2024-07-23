import { Gallery } from 'react-grid-gallery';
// import { imageSlides } from '../../app/types/seedData2';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import useGalleryStore from '../../hooks/galleryStore';
import Utils from '../../app/scripts/utils';
import { Captions, Fullscreen } from 'yet-another-react-lightbox/plugins';

export default function GalleryDetail() {
	const galleryStore = useGalleryStore();

	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [index, setIndex] = useState(-1);
	const [images, setImages] = useState<any[]>([]);

	//lightbox caption
	//@ts-ignored
	const [showToggle, setShowToggle] = useState(false);
	//@ts-ignored
	const [descriptionMaxLines, setDescriptionMaxLines] = useState(3);
	//@ts-ignored
	const [descriptionTextAlign, setDescriptionTextAlign] = useState<'start' | 'end' | 'center'>(
		'center'
	);

	const handleSelect = (index: number) => {
		const nextImages = images.map((image: any, i: number) =>
			i === index ? { ...image, isSelected: !image.isSelected } : image
		);
		setImages(nextImages);
		// console.log(nextImages);
	};

	useEffect(() => {
		if (galleryStore.galleries.length <= 1) {
			galleryStore.loadGalleries().then((galleries) => {
				setImages(Utils.imageSlides(galleries));
			});
		} else {
			setImages(Utils.imageSlides(galleryStore.galleries));
			console.log(galleryStore.galleries);
		}
	}, [galleryStore.galleries]);

	// if (galleryStore.loadingInitial) return <LoadingFull />;

	return (
		<>
			<div className='cover cover--gallery'>
				<div className='cover__heading-box'>
					<h1 className='cover__heading heading-primary'>GALLERY</h1>
					<ul className='nav-breadcrumb'>
						<li className='nav-breadcrumb__item'>Home</li>
						<li className='nav-breadcrumb__item nav-breadcrumb__item--active'>
							Gallery
						</li>
					</ul>
				</div>
			</div>
			<div className='gallery-detail'>
				<div className='gallery-detail__body'>
					<div className='gallery-detail__info'>
						<img className='gallery-detail__info-logo' src='img/logo.svg' alt='logo' />
						<h1 className='gallery-detail__info-heading heading-primary'>
							OUR GALLERY
						</h1>
						<p className='gallery-detail__info-excerpt'>
							Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem
							quis bibendum auctor, nisi elit consequat.
						</p>
						{/* <ul className='type-switch'>
							<li className='type-switch__item type-switch__item--active'>
								<button>ALL</button>
							</li>
							<li className='type-switch__item'>
								<button>IMAGES</button>
							</li>
							<li className='type-switch__item'>
								<button>VIDEOS</button>
							</li>
						</ul> */}
					</div>
					<div className='container'>
						<Gallery
							onSelect={handleSelect}
							onClick={(index: number) => {
								setLightboxOpen(true);
								setIndex(index);
							}}
							enableImageSelection={false}
							images={images}
						/>
						<Lightbox
							noScroll={{disabled: true}}
							plugins={[Captions, Fullscreen]}
							captions={{ showToggle, descriptionTextAlign, descriptionMaxLines }}
							index={index}
							slides={images}
							open={lightboxOpen}
							close={() => setLightboxOpen(false)}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
