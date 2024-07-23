import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

type Props = {
	imagePreview: string;
	setCropper: (cropper: Cropper) => void;
	aspectRatio?: number;
};

export default function PhotoWidgetCropper({ imagePreview, setCropper, aspectRatio }: Props) {
	return (
		<Cropper
			src={imagePreview}
			style={{ height: 200, width: '100%' }}
			initialAspectRatio={1}
			aspectRatio={aspectRatio}
			preview='.img-preview'
			guides={true}
			viewMode={1}
			autoCropArea={1}
			background={false}
			onInitialized={(cropper) => setCropper(cropper)}
			// crop={onChange()}
		/>
	);
}
