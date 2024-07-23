import React, { forwardRef, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';
import usePhotoStore from '../../hooks/photoStore';
import agent from '../../app/api/agent';

Quill.register('modules/imageResize', ImageResize);

interface EditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
}

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
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
          const quill = ref as React.MutableRefObject<Quill | null>;
          photoStore.setProgress(100);
          if (quill.current) {
            const range = quill.current.getSelection();
            range && quill.current.insertEmbed(range.index, 'image', photoDto.url);
          }
          photoStore.setProgress(0);
        }
      };
    }, [photoStore, ref]);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (ref && 'current' in ref) {
        ref.current?.enable(!readOnly);
      }
    }, [ref, readOnly]);

    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      ['link', 'image', 'video'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
    ];

    useEffect(() => {
      const container = containerRef.current;
      if (container) {
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

        if (ref && 'current' in ref) {
          ref.current = quill;
        }

        if (defaultValueRef.current) {
          quill.setContents(defaultValueRef.current);
        }

        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
          onTextChangeRef.current?.(...args);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
          onSelectionChangeRef.current?.(...args);
        });

        return () => {
          if (ref && 'current' in ref) {
            ref.current = null;
          }
          container.innerHTML = '';
        };
      }
    }, [ref, imageHandler, toolbarOptions]);

    return <div ref={containerRef} className="quill-editor dark-mode"></div>;
  }
);

Editor.displayName = 'Editor';

export default Editor;
