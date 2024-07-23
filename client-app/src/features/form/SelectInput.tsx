import { ChangeEventHandler } from 'react';

type Option = {
	text: string;
	value: string;
};

type Props = {
	options: Option[];
	name?: string;
	loading: boolean;
	value?: any;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
	onBlur?: React.FocusEventHandler<HTMLSelectElement>;
	error?: string;
	selectedId?: string;
};

export default function SelectInput({
	name,
	options,
	value,
	loading,
	onChange,
	onBlur,
	error,
	selectedId,
}: Props) {
	return (
		<div className='select-input__error-wrapper'>
			<div className='select-input__wrapper'>
				{loading && (
					<svg className='icon-loading select-input__icon-loading'>
						<use href='/img/sprite.svg#icon-spinner' />
					</svg>
				)}
				<select
					name={name}
					value={selectedId}
					onBlur={onBlur}
					onChange={onChange}
					disabled={loading}
					className='select-input'>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.text}
						</option>
					))}
				</select>
			</div>
			<span className='select-input__error-text'>{error}</span>
		</div>
	);
}
