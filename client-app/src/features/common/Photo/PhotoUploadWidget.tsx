import { useEffect, useState } from 'react';
import { PhotoDto, SUPPORTED_FORMATS } from '../../../app/types/photo';
import { Col, Container, Row } from 'react-grid-system';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';
import SimpleButton from '../SimpleButton';
import usePhotoStore from '../../../hooks/photoStore';

type Props = {
	title?: string;
	loading: boolean;
	uploadPhoto?: (file: Blob) => void;
	loadedPhoto?: PhotoDto;
	aspectRatio?: number;
	setError?: React.Dispatch<React.SetStateAction<string>>;
};

export default function PhotoUploadWidget(props: Props) {
	// const [files, setFiles] = useState<any>([]);
	const [error, setError] = useState('');
	const { setFiles, files, cropper, setCropper } = usePhotoStore();

	function onCrop() {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob((blob) => {
				props.uploadPhoto && props.uploadPhoto(blob!);
			}, 'image/jpeg');
		}
	}

	const fileValidation = (files: any[]) => {
		files.forEach((file) => {
			if (!SUPPORTED_FORMATS.includes(file.type)) {
				setError('Format unsupported');
				return;
			}
			if (file.size > 1024 * 1024 * 5) {
				setError('Images must be smaller than 5MB');
				return;
			}
		});
	};

	useEffect(() => {
		if (props.loadedPhoto && props.loadedPhoto.url && props.loadedPhoto.url !== '') {
			setFiles([
				{
					preview: props.loadedPhoto.url,
					publicId: props.loadedPhoto.public_id,
					type: 'image/jpeg',
				},
			]);
		} else {
			setFiles([]);
		}
		//Objects in JavaScript are compared by reference, not by value.
		//Even if the properties of props.loadedPhoto are the same,
		//each render creates a new object reference.
		//Therefore, props.loadedPhoto will appear to change on every render.
		//so you need to use props.loadedPhoto.url to put in dependency array
	}, [props.loadedPhoto?.url]);

	useEffect(() => {
		if (files.length > 0) {
			fileValidation(files);
			props.setError && props.setError('');
		}

		//dispose file.preview after using
		return () => {
			files.forEach((file: any) => URL.revokeObjectURL(file.preview));
			// setFiles([]);
		};
	}, [files.length]);

	return (
		<>
			<Container style={{ marginTop: '1rem' }} fluid>
				<Row>
					<Col className='grid__col' lg={4} md={4}>
						<h3 className='heading-segment heading-segment--teal u-margin-bottom-small'>
							Step 1 - {props.title || 'Add Photo'}
						</h3>
						<PhotoWidgetDropzone setFiles={setFiles} />
					</Col>

					<Col className='grid__col' lg={4} md={4}>
						<h3 className='heading-segment heading-segment--teal u-margin-bottom-small'>
							Step 2 - Resize image
						</h3>
						{files && files.length > 0 && (
							<PhotoWidgetCropper
								setCropper={setCropper}
								imagePreview={files[0].preview}
								aspectRatio={props.aspectRatio}
							/>
						)}
					</Col>

					<Col className='grid__col' lg={4} md={4}>
						<h3 className='heading-segment heading-segment--teal u-margin-bottom-small'>
							Step 3 - Preview & Upload
						</h3>
						{files && files.length > 0 && (
							<>
								<div
									className='img-preview'
									style={{ minHeight: 200, overflow: 'hidden', margin: '0 auto' }}
								/>

								<span style={{ color: 'red', fontSize: '1.6rem' }}>{error}</span>
								<br />
								<div className='simple-btn__group'>
									{props.uploadPhoto && (
										<>
											<SimpleButton
												disabled={props.loading}
												onClick={() => {
													setError('');
													setFiles([]);
												}}
												color={'blue'}
												text={'Discard'}
											/>
											<SimpleButton
												type='submit'
												disabled={error !== ''}
												loading={props.loading}
												onClick={onCrop}
												color={'red'}
												text={'Upload'}
											/>
										</>
									)}
								</div>
							</>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
}
