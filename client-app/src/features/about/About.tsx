import { useModalStore } from '../../hooks/useModalStore';
import Register from '../form/Register';

export default function About() {
	const openModal = useModalStore((state) => state.openModal);

	return (
		<>
			<section className='section-about'>
				<div className='container about__text-box-container'>
					<div className='about'>
						<h1 className='about__heading heading-primary u-margin-bottom-small'>
							Welcome To
							<br />
							2S Academy
						</h1>
						<span className='about__excerpt heading-excerpt u-margin-bottom-medium'>
							A high-quality DJ & Producer academy focused on
							<br />
							both online and offline sessions and traineeships.
							<br />
							Launch your career and showcase your talent.
						</span>
						<div className='about__btn-group'>
							<button
								onClick={() => openModal(<Register />, 'medium')}
								className='btn btn--red btn--animated'>
								Đăng ký ngay
							</button>
							<a
								href='/course'
								className='btn btn--transparent-white'>
								Tìm hiểu thêm
								<svg>
									<use href='img/sprite.svg#icon-button-arrow' />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
