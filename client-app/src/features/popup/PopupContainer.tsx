import { useEffect } from 'react';
import { useModalStore } from '../../hooks/useModalStore';

export default function PopupContainer() {
	const { closeModal, isOpen, body, size } = useModalStore();

	//close modal when hit escape
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	//handle when click outside of the modal
	function handleOutsideClick() {
		closeModal();
	}
	//handle when click inside of the modal prevent the event from parent to fire
	function handleInsideClick(event: React.MouseEvent<HTMLDivElement>) {
		event.stopPropagation();
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		//prevent user from scrolling background outside the modal
		if (isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = 'visible';
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div onClick={() => handleOutsideClick()} className='popup popup' id='popup'>
			<div
				onClick={(event) => handleInsideClick(event)}
				className={'popup__content ' + (size ? 'popup__content--' + size : '')}>
				{/* X button */}
				<span className='popup__btn-close' onClick={closeModal}>
					&times;
				</span>
				<div className='popup__content-wrapper'>
					{body}
				</div>
			</div>
		</div>
	);
}
