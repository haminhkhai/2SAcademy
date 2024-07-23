import React, { forwardRef, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';
import usePhotoStore from '../../hooks/photoStore';
import agent from '../../app/api/agent';

Quill.register('modules/imageResize', ImageResize);
// Editor is an uncontrolled React component
const Editor = forwardRef(({ readOnly, defaultValue, onTextChange, onSelectionChange}, ref) => {
	const containerRef = useRef(null);
	const defaultValueRef = useRef(defaultValue);
	const onTextChangeRef = useRef(onTextChange);
	const onSelectionChangeRef = useRef(onSelectionChange);

	const photoStore = usePhotoStore();
	const imageHandler = useCallback(() => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();
		input.onchange = async () => {
			if (input !== null && input.files !== null) {
				const file = input.files[0];
				const photoDto = await agent.Photos.uploadPhoto(file);
				const quill = ref.current;
				photoStore.setProgress(100);
				if (quill) {
					const range = quill.getSelection();
					range && quill.insertEmbed(range.index, 'image', photoDto.url);
				}
				photoStore.setProgress(0);
			}
		};
	}, []);

	useLayoutEffect(() => {
		onTextChangeRef.current = onTextChange;
		onSelectionChangeRef.current = onSelectionChange;
	});

	useEffect(() => {
		ref.current?.enable(!readOnly);
	}, [ref, readOnly]);

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote'],
		['link', 'image', 'video'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }], // remove formatting button
	];

	useEffect(() => {
		const container = containerRef.current;
		const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));
		const quill = new Quill(editorContainer, {
			modules: {
				toolbar: {
					container: toolbarOptions,
					handlers: {
						image: imageHandler,
					},
				},
				imageResize: {
					parchment: Quill.import('parchment'),
					modules: ['Resize', 'DisplaySize'],
				},
			},
			theme: 'snow',
		});

		ref.current = quill;

		if (defaultValueRef.current) {
			quill.setContents(defaultValueRef.current);
		}

		quill.on(Quill.events.TEXT_CHANGE, (...args) => {
			// console.log(quill.getContents());
			onTextChangeRef.current?.(...args);
		});

		quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
			onSelectionChangeRef.current?.(...args);
		});

		return () => {
			ref.current = null;
			container.innerHTML = '';
		};
	}, [ref]);

	return <div ref={containerRef} className="quill-editor dark-mode"></div>;
});

Editor.displayName = 'Editor';

export default Editor;
