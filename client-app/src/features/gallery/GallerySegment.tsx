import { useEffect, useState } from 'react';
import useGalleryStore from '../../hooks/galleryStore';
import SplideSlider from '../common/SplideSlider';
import LoadingFull from '../common/LoadingFull';
import Lightbox from 'yet-another-react-lightbox';
import { Captions, Fullscreen } from 'yet-another-react-lightbox/plugins';
import Utils from '../../app/scripts/utils';
import { Photo } from '../../app/types/photo';

export default function GallerySegment() {
	const galleryStore = useGalleryStore();
	const [index, setIndex] = useState(-1);
	const [lightboxOpen, setLightboxOpen] = useState(false);
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

	// useEffect(()=>{
	// 	if (galleryStore.galleries.length <= 1) {
	// 		galleryStore.loadGalleries();
	// 	}
	// },[])

	useEffect(() => {
		if (galleryStore.galleries.length <= 1) {
			galleryStore.loadGalleries().then((galleries) => {
				setImages(Utils.imageSlides(galleries));
			});
		} else {
			setImages(Utils.imageSlides(galleryStore.galleries));
			console.log(galleryStore.galleries);
		}
	}, [galleryStore.galleries.length]);

	return (
		<section className='section-gallery'>
			<div className='gallery-segment'>
				<div className='gallery-segment__header'>
					<h3 className='heading-tertiary'>Gallery</h3>
					<a href='#' className='btn btn--transparent-grey'>
						More
						<svg>
							<use href='img/sprite.svg#icon-button-arrow' />
						</svg>
					</a>
				</div>
				<div className='gallery-segment__img-wrapper'>
					<SplideSlider
						id={'splide-gallery'}
						setLightboxOpen={setLightboxOpen}
						setIndex={setIndex}
						className='splide__gallery'
						photos={images.map(image => new Photo({id: "", url: image.src, alt: image.description}))}
					/>
					<Lightbox
						portal={{ root: undefined }}
						noScroll={{ disabled: true }}
						plugins={[Captions, Fullscreen]}
						captions={{ showToggle, descriptionTextAlign, descriptionMaxLines }}
						index={index}
						slides={images}
						open={lightboxOpen}
						close={() => setLightboxOpen(false)}
					/>
				</div>
			</div>
		</section>
	);
}
