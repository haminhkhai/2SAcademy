//@ts-ignore
import Editor from '../../app/scripts/editor';
import TextEditor from './TextEditor';

type Props = {
	quillRef: any;
};

export default function TextEditorWidget(props: Props) {
	return (
		<div>
			<Editor ref={props.quillRef} />
		</div>
		// <TextEditor ref={props.quillRef}/>
	);
}
