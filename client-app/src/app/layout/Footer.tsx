export default function Footer() {
	return (
		<div className='container'>
			<footer className='footer'>
				<a className='logo-wrapper' href='index.html'>
					<img src='/img/logo.svg' alt='logo' className='logo' />
					<img src='/img/logo-text.svg' alt='logo' className='logo-text' />
				</a>
				<ul className='address'>
					<li className='address__item'>
						215/6 Huỳnh Văn Bánh, Phường 12, Phú Nhuận,
						<br />
						Thành phố Hồ Chí Minh, Phú Nhuận, Vietnam
					</li>
					<li className='address__item'>091 153 35 22</li>
					<li className='address__item'>academy@2smusic.com</li>
				</ul>
				{/* <ul className='terms'>
					<li className='terms__item'>Hỗ trợ khách hàng</li>
					<li className='terms__item'>Chính sách bảo hành</li>
					<li className='terms__item'>Chính sách bảo mật thông tin cá nhân</li>
					<li className='terms__item'>Chính sách đổi trả, hoàn tiền</li>
					<li className='terms__item'>Chính sách bảo hành</li>
					<li className='terms__item'>Điều khoản, quy chế hoạt động website</li>
				</ul> */}
				<div className='social'>
					<div className='social__item'>
						<svg className='social__item__icon'>
							<use href='/img/sprite.svg#icon-insta'></use>
						</svg>
					</div>
					<div className='social__item'>
						<svg className='social__item__icon'>
							<use href='/img/sprite.svg#icon-facebook'></use>
						</svg>
					</div>
					<div className='social__item'>
						<svg className='social-item__icon'>
							<use href='/img/sprite.svg#icon-twitter'></use>
						</svg>
					</div>
					<div className='social__item'>
						<svg className='social__item__icon'>
							<use href='/img/sprite.svg#icon-youtube'></use>
						</svg>
					</div>
				</div>
			</footer>
		</div>
	);
}
