import { useEffect, useRef, useState } from 'react';
import useUserStore from '../../hooks/userStore';
import { NavLink } from 'react-router-dom';

export default function Header() {
	const userStore = useUserStore();
	const checkRef = useRef<HTMLInputElement>(null);
	const blurRef = useRef<HTMLDivElement>(null);

	const [scroll, setScroll] = useState(false);

	const handleCheck = () => {
		if (checkRef.current) {
			if (checkRef.current.checked) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'visible';
			}
		}
	};

	const handleBlurClick = () => {
		if (blurRef.current && checkRef.current) {
			checkRef.current.checked = !checkRef.current.checked;
			document.body.style.overflow = checkRef.current.checked ? 'hidden' : 'visible';
		}
	};

	const handleScroll = () => {
		if (window.scrollY > 5) {
			setScroll(true);
		} else {
			setScroll(false);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			<header className={scroll ? 'header header--scroll' : 'header'} id='header'>
				<div className='container'>
					<div className='header-two-column'>
						<div className='header-two-column__left'>
							<NavLink className='logo-wrapper logo-wrapper--main' to='/'>
								<img src='/img/logo.svg' alt='logo' className='logo' />
								<img src='/img/logo-text.svg' alt='logo' className='logo-text' />
							</NavLink>
							<nav className='nav-main nav-main--left'>
								<ul className='nav nav--left-side'>
									<li className='nav__item'>
										<NavLink className='nav__link' to='/course'>
											Course
										</NavLink>
									</li>
									<li className='nav__item'>
										<NavLink className='nav__link' to='/artist'>
											Artists
										</NavLink>
									</li>
									<li className='nav__item'>
										<NavLink className='nav__link' to='/gallery'>
											Gallery
										</NavLink>
									</li>
									<li className='nav__item'>
										<NavLink className='nav__link' to='/blog'>
											Blog
										</NavLink>
									</li>
								</ul>
							</nav>
						</div>
						<div className='header-two-column__right flex'>
							<nav className='nav-main nav-main--right'>
								<ul className='nav nav--right-side'>
									{/* <li className='nav__item'>
										<svg
											onClick={() => openModal(<Search />)}
											id='searchBtn'
											className='icon-search'>
											<use href='img/sprite.svg#icon-search'></use>
										</svg>
									</li> */}
									{userStore.isLoggedIn() && (
										<>
											<li className='nav__item'>
												<div className='nav__item-wrapper'>
													<NavLink
														className='nav__link'
														to='/admin/customer'>
														Admin Panel
													</NavLink>

													{/* <span>Admin Panel</span> */}
													{/* <svg className='icon-arrow-down'>
												<use href='img/sprite.svg#icon-arrow-down'></use>
											</svg> */}
												</div>
											</li>
											<li className='nav__item'>
												<div className='nav__item-wrapper'>
													<NavLink
														className='nav__link'
														onClick={userStore.logOut}
														to='#'>
														Log Out
													</NavLink>
												</div>
											</li>
										</>
									)}
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</header>
			<input
				onChange={handleCheck}
				ref={checkRef}
				type='checkbox'
				className='navigation__checkbox'
				id='navi-toggle'
			/>
			<label htmlFor='navi-toggle' className='navigation__button'>
				<span className='navigation__icon'>&nbsp;</span>
			</label>
			<div ref={blurRef} onClick={handleBlurClick} className='navigation__blur-screen'></div>
			<div className='navigation__background'>
				<nav className='navigation__nav'>
					<ul className='navigation__list'>
						<li className='navigation__item'>
							<NavLink className='logo-wrapper logo-wrapper--sub' to='/'>
								<img src='/img/logo.svg' alt='logo' className='logo' />
								<img src='/img/logo-text.svg' alt='logo' className='logo-text' />
							</NavLink>
						</li>
						<li className='navigation__item'>
							<NavLink className='navigation__link' to='/course'>
								Course
							</NavLink>
							{/* <a
								className='navigation__link navigation__link--active'
								href='index.html'>
								Home
							</a> */}
						</li>
						<li className='navigation__item'>
							<NavLink className='navigation__link' to='/artist'>
								Artist
							</NavLink>
						</li>
						<li className='navigation__item'>
							<NavLink className='navigation__link' to='/gallery'>
								Gallery
							</NavLink>
						</li>
						<li className='navigation__item'>
							<NavLink className='navigation__link' to='/blog'>
								Blog
							</NavLink>
						</li>
						{userStore.isLoggedIn() && (
							<>
								<li className='navigation__item'>
									<NavLink className='navigation__link' to='/admin/customer'>
										Admin Panel
									</NavLink>
								</li>
								<li className='navigation__item'>
									<NavLink
										className='navigation__link'
										onClick={userStore.logOut}
										to='#'>
										Log Out
									</NavLink>
								</li>
							</>
						)}
					</ul>
				</nav>
			</div>
		</>
	);
}
