type Props = {
	type?: 'submit' | 'reset' | 'button' | undefined;
	color?: 'red' | 'blue';
	text: string;
	loading?: boolean;
	onClick?: any;
	name?: string;
	disabled?: boolean;
};

export default function SimpleButton(props: Props) {
	return (
		<button
			disabled={props.disabled ? props.disabled : props.loading}
			name={props.name}
			type={props.type}
			className={'simple-btn' + (props.color ? ' simple-btn--' + props.color : '')}
			onClick={props.onClick}>
			{props.loading ? (
				<svg className='simple-btn__icon-loading'>
					<use href='/img/sprite.svg#icon-spinner' />
				</svg>
			) : (
				props.text
			)}
		</button>
	);
}
