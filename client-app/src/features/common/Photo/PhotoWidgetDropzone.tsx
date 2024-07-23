import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
	setFiles: (files: any) => void;
};

export default function PhotoWidgetDropzone(props: Props) {
	const dzStyles = {
		border: 'dashed 3px #eee',
		borderColor: '#eee',
		borderRadius: '5px',
		paddingTop: '30px',
		textAlign: 'center' as 'center', //to get around warning from typescript
		height: 200,
	};

	const dzActive = {
		borderColor: 'green',
	};

	//useCallBack return a memorized version of the
	//callback that only change if one of the dependencies change
	const onDrop = useCallback(
		(acceptedFiles: any) => {
			props.setFiles(
				acceptedFiles.map((file: any) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					
					})
				)
			);
		},
		[props.setFiles]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
			<input name='files' {...getInputProps()} />
			<svg className='icon-upload'>
                <use href='/img/sprite.svg#icon-upload'/>
            </svg>
			<h4 className='heading-segment heading-segment--teal'>Drop images here or click to select images</h4>
		</div>
	);
}
