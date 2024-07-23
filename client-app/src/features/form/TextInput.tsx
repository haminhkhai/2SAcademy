type Props = {
	name: string;
	icon?: string;
	icon2?: string;
	placeHolder?: string;
	type?: string;
	value?: any;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	error?: string;
	onButtonClick?: any;
	onButtonClick2?: any;
};

export default function TextInput({
	name,
	icon,
	icon2,
	placeHolder,
	type,
	value,
	error,
	onChange,
	onButtonClick,
	onButtonClick2,
}: Props) {
	return (
		<>
			<div className='txt-input__error-wrapper'>
				<div className='txt-input__wrapper'>
					<input
						name={name}
						className={'txt-input' + (icon ? ' txt-input__icon' : '')  + (icon2 ? ' txt-input__icon--double-icon' : '')}
						type={type}
						placeholder={placeHolder}
						value={value}
						onChange={onChange}
					/>
					{icon && (
						<button onClick={onButtonClick} type='button' className='txt-input__button'>
							<svg>
								<use href={`/img/sprite.svg#icon-${icon}`} />
							</svg>
						</button>
					)}
					{icon2 && (
						<button onClick={onButtonClick2} type='button' className='txt-input__button'>
							<svg>
								<use href={`/img/sprite.svg#icon-${icon2}`} />
							</svg>
						</button>
					)}
				</div>
				<span className='txt-input__error-text'>{error}</span>
			</div>
		</>
	);
}
