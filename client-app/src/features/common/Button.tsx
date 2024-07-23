
type Props = {
	type?: 'submit' | 'reset' | 'button' | undefined;
	color: 'white' | 'red' | 'transparent-grey' | 'transparent-white';
	animated: boolean;
	text: string;
	loading?: boolean;
	onClick?: () => any;
	disabled?: boolean
};

export default function Button({ type, color, animated, text, loading, onClick, disabled }: Props) {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			type={type}
			className={'btn btn--' + color + (animated ? ' animated' : '')}>
			{loading ? (
				<svg className='btn__icon-loading'>
					<use href='img/sprite.svg#icon-spinner' />
				</svg>
			) : (
				text
			)}
		</button>
	);
}
