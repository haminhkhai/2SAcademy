import PhotoUploadWidget from '../../features/common/Photo/PhotoUploadWidget';
import TextInput from '../../features/form/TextInput';
import { useModalStore } from '../../hooks/useModalStore';
import useArtistStore from '../../hooks/artistStore';
import { useFormik } from 'formik';
import { Artist } from '../../app/types/artist';
import SimpleButton from '../../features/common/SimpleButton';
import usePhotoStore from '../../hooks/photoStore';
import TextArea from '../../features/form/TextArea';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { sleep } from '../../app/api/agent';
import { useEffect, useState } from 'react';
import LoadingFull from '../../features/common/LoadingFull';
import { PhotoDto } from '../../app/types/photo';
import * as Yup from 'yup';

type Props = {
	artistId?: string;
};

export default function ArtistForm(props: Props) {
	const photoStore = usePhotoStore();
	const artistStore = useArtistStore();
	const modalStore = useModalStore();

	const [error, setError] = useState('');

	const handleReset = () => {
		photoStore.setFiles([]);
		artistStore.resetArtist();
		formik.resetForm();
	};

	const handleSubmit = async (artist: Artist) => {
		//if there is new image or we need to update the image for the artist
		// if (photoStore.files[0].publicId !== artistStore.artist.thumbPublicId) {
		// 	//getCroppedCanvas().toBlob uses a callback to return the Blob object.
		// 	//To await this operation, wrap it in a Promise and resolve the blob in the callback.
		// 	const photo = await new Promise<Blob | null>((resolve) => {
		// 		photoStore.cropper?.getCroppedCanvas().toBlob((blob) => {
		// 			resolve(blob);
		// 		});
		// 	});

		// 	if (photo) {
		// 		if (!props.artistId) {
		// 			// Create new artist
		// 			await artistStore.addArtist({ ...values, id: uuidv4() }, photo);
		// 		} else {
		// 			// Edit current artist
		// 			await artistStore.editArtist(values, photo);
		// 		}
		// 	}
		// } else {
		// 	await artistStore.editArtist(values);
		// }

		if (
			photoStore.files.length > 0 &&
			photoStore.files[0].publicId !== artistStore.artist.thumbPublicId
		) {
			const photo = await new Promise<Blob | null>((resolve) => {
				photoStore.cropper?.getCroppedCanvas().toBlob((blob) => {
					resolve(blob);
				}, 'image/jpeg');
			});

			if (!props.artistId) {
				await artistStore.addArtist({ ...artist, id: uuidv4() }, photo!);
			} else {
				await artistStore.editArtist(artist, photo!);
			}
		} else {
			if (!props.artistId) {
				setError('Thumbnail is required');
				throw '';
			} else {
				await artistStore.editArtist(artist);
			}
		}
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Name is required").min(5, "Name can't be too short")
	})

	const formik = useFormik({
		initialValues: artistStore.artist,
		validationSchema: validationSchema,
		validateOnChange: false,
		enableReinitialize: true,
		onSubmit: (values) => {
			handleSubmit(values)
				.then(async () => {
					toast.info('Saved');
					photoStore.setProgress(100);
					await sleep(1000);
					modalStore.closeModal();
					photoStore.setProgress(0);
				})
				.catch(() => {});
		},
	});

	useEffect(() => {
		if (props.artistId) artistStore.loadArtist(props.artistId);

		//clear form on dismount
		return () => {
			handleReset();
		};
	}, []);

	return (
		<>
			{artistStore.loading && <LoadingFull isModal={true} />}
			<h2 className='heading-tertiary heading-tertiary--dark u-align-center'>
				{props.artistId ? 'Edit Artist' : 'Add Artist'}
			</h2>
			<form onSubmit={formik.handleSubmit} className='form'>
				<div className='form__wrapper'>
					<TextInput
						value={formik.values.name}
						onChange={formik.handleChange}
						error={formik.errors.name}
						name='name'
						placeHolder='Name'
					/>
					<TextArea
						value={formik.values.description}
						onChange={formik.handleChange}
						name='description'
						placeHolder='Description'
						rows={3}
					/>
				</div>
			</form>
			<PhotoUploadWidget
				loadedPhoto={
					new PhotoDto({
						url: artistStore.artist.thumbUrl,
						public_id: artistStore.artist.thumbPublicId,
						secure_url: artistStore.artist.thumbUrl
					})
				}
				loading={false}
			/>
			<span style={{ color: 'red', fontSize: '1.6rem', marginLeft: '1.5rem'}}>{error}</span>
			<div className='simple-btn__group'>
				<SimpleButton text='RESET' color='red' onClick={handleReset} />
				<SimpleButton
					type='submit'
					loading={artistStore.loadingButton}
					text='SAVE'
					color='blue'
					onClick={formik.handleSubmit}
				/>
			</div>
		</>
	);
}
