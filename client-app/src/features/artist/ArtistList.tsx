export default function ArtistList() {
	return (
		<>
			<div className='cover cover--artist'>
				<div className='cover__heading-box'>
					<h1 className='cover__heading heading-primary'>ARTIST</h1>
					<ul className='nav-breadcrumb'>
						<li className='nav-breadcrumb__item'>Home</li>
						<li className='nav-breadcrumb__item nav-breadcrumb__item--active'>
							Artists
						</li>
					</ul>
				</div>
			</div>
			<div className='artist-list'>
				<div className='artist-list__body'>
					<div className='cover__info'>
						<img className='cover__info-logo' src='img/logo.svg' alt='logo' />
						<h1 className='cover__info-heading heading-primary'>2SMUSIC TOP ARTISTS</h1>
					</div>

					<div className='container'>
						<div className='three-cols-row'>
							<div className='card'>
								<div className='card__picture-wrapper'>
									<img src='/img/artist/feliz.png' />
								</div>
								<div className='card__list'>
									<h2 className='card__heading heading-secondary'>DJ FELIZ</h2>
									<p className='card__description'>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</p>
								</div>
							</div>

							<div className='card'>
								<div className='card__picture-wrapper'>
									<img src='/img/artist/feliz2.jpg' />
								</div>
								<div className='card__list'>
									<h2 className='card__heading heading-secondary'>DJ FELIZ</h2>
									<p className='card__description'>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
