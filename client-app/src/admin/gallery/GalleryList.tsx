import Lightbox from 'yet-another-react-lightbox';
import SimpleButton from '../../features/common/SimpleButton';
import { useModalStore } from '../../hooks/useModalStore';
import { useEffect, useState } from 'react';
import { Gallery } from 'react-grid-gallery';
import useGalleryStore from '../../hooks/galleryStore';
import LoadingFull from '../../features/common/LoadingFull';
import GalleryForm from './GalleryForm';
import Utils from '../../app/scripts/utils';
import { Captions, Fullscreen } from 'yet-another-react-lightbox/plugins';
import { toast } from 'react-toastify';

export default function GalleryList() {
	const modalStore = useModalStore();
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

	// const hasSelected = images.some((image: any) => image.isSelected);

	const handleSelect = (index: number) => {
		const nextImages = images.map((image: any, i: number) =>
			i === index ? { ...image, isSelected: !image.isSelected } : image
		);
		setImages(nextImages);
		// console.log(nextImages);
	};

	const handleDelete = async () => {
		//return an array of id in string
		const galleryIds = images
			.filter((i) => i.isSelected)
			.map((image) => {
				return {
					id: image.id,
					publicId: image.publicId,
				};
			});
		console.log(galleryIds);
		await galleryStore.deleteGalleries(galleryIds).then(async () => {
			toast.info('Deleted');
		});
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

	if (galleryStore.loadingInitial) return <LoadingFull />;

	return (
		<div className='admin__segment'>
			<div className='admin__segment-header'>
				<h3 className='admin__heading'>Gallery</h3>
				<div className='simple-btn__group'>
					<SimpleButton
						disabled={images.filter((i) => i.isSelected).length === 0}
						color='red'
						text='DELETE'
						loading={galleryStore.loadingButton}
						onClick={handleDelete}
					/>

					<SimpleButton
						disabled={images.filter((i) => i.isSelected).length !== 1}
						color='blue'
						text='EDIT PHOTO'
						onClick={() =>
							modalStore.openModal(
								<GalleryForm
									galleryId={images.filter((i) => i.isSelected)[0].id}
								/>,
								'large'
							)
						}
					/>

					<SimpleButton
						color='blue'
						text='ADD PHOTO'
						onClick={() => modalStore.openModal(<GalleryForm />, 'large')}
					/>
				</div>
			</div>
			<Gallery
				onSelect={handleSelect}
				onClick={(index: number) => {
					setLightboxOpen(true);
					setIndex(index);
				}}
				enableImageSelection={true}
				images={images}
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
	);
}
