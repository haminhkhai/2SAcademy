import { useFormik } from 'formik';
import PhotoUploadWidget from '../../features/common/Photo/PhotoUploadWidget';
import TextInput from '../../features/form/TextInput';
import { Gallery } from '../../app/types/gallery';
import { useModalStore } from '../../hooks/useModalStore';
import usePhotoStore from '../../hooks/photoStore';
import useGalleryStore from '../../hooks/galleryStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { sleep } from '../../app/api/agent';
import SimpleButton from '../../features/common/SimpleButton';
import LoadingFull from '../../features/common/LoadingFull';
import { useEffect } from 'react';
import { PhotoDto } from '../../app/types/photo';

type Props = {
	galleryId?: string;
};

export default function (props: Props) {
	const modalStore = useModalStore();
	const photoStore = usePhotoStore();
	const galleryStore = useGalleryStore();

	const handleReset = () => {
		photoStore.setFiles([]);
		galleryStore.resetGallery();
		formik.resetForm();
	};

	const handleSubmit = async (gallery: Gallery) => {
		//photoStore.files[0] when edit form loaded, a photo object will be passed as props
		//check to see if loaded id is not the same as old id so we can confirm that 
		//there is new photo or not
		if (photoStore.files[0].publicId !== galleryStore.gallery.publicId) {
			const blob = await new Promise<Blob | null>((resolve) => {
				photoStore.cropper?.getCroppedCanvas().toBlob((blob) => {
					resolve(blob);
				}, 'image/jpeg');
			});
			if (blob) {
				gallery.width = photoStore.cropper?.getCroppedCanvas().width!;
				gallery.height = photoStore.cropper?.getCroppedCanvas().height!;

				if (!props.galleryId) {
					//create new gallery
					await galleryStore.addGallery({ ...gallery, id: uuidv4() }, blob);
				} else {
					//edit
					await galleryStore.editGallery(gallery, blob);
				}
			}
		} else {
			await galleryStore.editGallery(gallery)
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: galleryStore.gallery,
		onSubmit: (values) =>
			handleSubmit(values).then(async () => {
				toast.info('Saved');
				photoStore.setProgress(100);
				await sleep(1000);
				modalStore.closeModal();
				photoStore.setProgress(0);
			}),
	});

	useEffect(() => {
		if (props.galleryId) {
			galleryStore.loadGallery(props.galleryId);
		}

		return () => {
			handleReset();
		};
	}, []);

	return (
		<>
			{galleryStore.loading && <LoadingFull isModal={true} />}
			<h2 className='heading-tertiary heading-tertiary--dark u-align-center'>
				{props.galleryId ? 'Edit Photo' : 'Add Photo'}
			</h2>
			<form className='form' onSubmit={formik.handleSubmit}>
				<div className='form__wrapper'>
					<TextInput
						onChange={formik.handleChange}
						name='caption'
						value={formik.values.caption}
						placeHolder='Caption'
					/>
				</div>
			</form>
			<PhotoUploadWidget
				loading={false}
				loadedPhoto={
					new PhotoDto({
						public_id: galleryStore.gallery.publicId,
						url: galleryStore.gallery.url,
						secure_url: galleryStore.gallery.url
					})
				}
			/>
			<div className='simple-btn__group'>
				<SimpleButton text='RESET' color='red' onClick={handleReset} />
				<SimpleButton
					type='submit'
					loading={galleryStore.loadingButton}
					// type='submit'
					text='SAVE'
					color='blue'
					onClick={formik.handleSubmit}
				/>
			</div>
		</>
	);
}
