import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import { useCallback } from 'react';
import agent from '../../app/api/agent';
import ReactQuill, { Quill } from 'react-quill';

Quill.register('modules/imageResize', ImageResize);

interface Props {
	reactQuillRef: React.RefObject<ReactQuill>;
	value: string;
	setValue: any;
	setProgress: (progres: number) => void;
}

export default function ReactQuillWidget({ reactQuillRef, value, setValue, setProgress }: Props) {
	const imageHandler = useCallback(() => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();
		input.onchange = async () => {
			if (input !== null && input.files !== null) {
				const file = input.files[0];
				const photoDto = await agent.Photos.uploadPhoto(file);
				const quill = reactQuillRef.current;
				setProgress(100);
				if (quill) {
					const range = quill.getEditorSelection();
					range && quill.getEditor().insertEmbed(range.index, 'image', photoDto.url);
				}
				setProgress(0);
			}
		};
	}, []);

	return (
		//@ts-ignore
		<ReactQuill
			className="dark-mode"
			ref={reactQuillRef}
			placeholder='Start writing...'
			modules={{
				toolbar: {
					container: [
						[{ header: '1' }, { header: '2' }, { font: [] }],
						[{ size: [] }],
						['bold', 'italic', 'underline', 'strike', 'blockquote'],
						[
							{ list: 'ordered' },
							{ list: 'bullet' },
							{ indent: '-1' },
							{ indent: '+1' },
						],
						['link', 'image', 'video'],
						['code-block'],
						['clean'],
					],
					handlers: {
						image: imageHandler, // <-
					},
				},
				clipboard: {
					matchVisual: false,
				},
				imageResize: {
					parchment: Quill.import('parchment'),
					modules: ['Resize', 'DisplaySize'],
				},
			}}
			formats={[
				'header',
				'font',
				'size',
				'bold',
				'italic',
				'underline',
				'strike',
				'blockquote',
				'list',
				'bullet',
				'indent',
				'link',
				'image',
				'video',
				'code-block',
				'width',
			]}
			value={value}
			onChange={setValue}
		/>
	);
}
