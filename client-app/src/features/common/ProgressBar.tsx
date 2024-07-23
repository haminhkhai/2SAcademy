type Props = {
	progress: number;
};

export default function ProgressBar(props: Props) {
	if (props.progress > 0)
	return (
		<div className='progress' style={{width: `${props.progress}%`}}>
		</div>
	);
}
