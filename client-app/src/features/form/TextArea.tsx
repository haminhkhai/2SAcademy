import { ChangeEventHandler } from "react";

type Props = {
	name?: string;
	value?: any;
	onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    rows: number;
    placeHolder: string;
}

export default function TextArea({name, value, onChange, rows, placeHolder} : Props) {
	return (
		<textarea
			name={name}
			value={value || ''}
			onChange={onChange}
			rows={rows}
			className='txt-input txt-input--textarea'
			placeholder={placeHolder}></textarea>
	);
}
