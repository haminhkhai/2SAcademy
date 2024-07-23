import useConfirmModalStore from '../../hooks/confirmModalStore';

export default function ConfirmModal() {
	const { closeModal, isOpen, onConfirm, onCancel } = useConfirmModalStore();

	//close modal when hit escape
	// function handleKeyDown(event: KeyboardEvent) {
	// 	if (event.key === 'Escape') {
	// 		closeModal();
	// 	}
	// }

	// useEffect(() => {
	// 	document.addEventListener('keydown', handleKeyDown);

	// 	return () => {
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 	};
	// }, []);

	// useEffect(() => {
	// 	//prevent user from scrolling background outside the modal
	// 	if (isOpen) document.body.style.overflow = 'hidden';
	// 	else document.body.style.overflow = 'visible';
	// }, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className='popup popup--confirm' id='popup'>
			<div className='popup__content popup__content--confirm'>
				<h1 className='heading-excerpt--dark'>Discard changes ?</h1>
				<div className='wrapper'>
					<button
						onClick={() => {
							onConfirm();
							closeModal();
						}}
						className='btn btn--grey'>
						Yes
					</button>
					<button
						onClick={() => {
							onCancel();
							closeModal();
						}}
						className='btn btn--red'>
						No
					</button>
				</div>
			</div>
		</div>
	);
}
