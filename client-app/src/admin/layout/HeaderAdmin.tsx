import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ProgressBar from '../../features/common/ProgressBar';
import usePhotoStore from '../../hooks/photoStore';
import useUserStore from '../../hooks/userStore';

export default function HeaderAdmin() {
	const checkRef = useRef<HTMLInputElement>(null);
	const blurRef = useRef<HTMLDivElement>(null);
	const photoStore = usePhotoStore();
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
			<ProgressBar progress={photoStore.progress} />
			<header className={scroll ? 'header header--scroll' : 'header'} id='header'>
				<div className='container'>
					{/* <div className='header-two-column'> */}
					{/* <div className='header-two-column__left'> */}
					<a className='logo-wrapper logo-wrapper--main'>
						<img src='/img/logo.svg' alt='logo' className='logo' />
						<img src='/img/logo-text.svg' alt='logo' className='logo-texte' />
					</a>
					<nav className='nav-main nav-main--admin'>
						<ul className='nav nav--left-side'>
							<li className='nav__item'>
								<NavLink className='nav__link' to='/admin/customer'>
									Customer
								</NavLink>
							</li>
							<li className='nav__item'>
								<NavLink className='nav__link' to='/admin/course'>
									Course
								</NavLink>
							</li>
							<li className='nav__item'>
								<NavLink className='nav__link' to='/admin/artist'>
									Artists
								</NavLink>
							</li>
							<li className='nav__item'>
								<NavLink className='nav__link' to='/admin/gallery'>
									Gallery
								</NavLink>
							</li>
							<li className='nav__item'>
								<NavLink className='nav__link' to='/admin/blog'>
									Blog
								</NavLink>
							</li>
							<li className='nav__item'>
								<NavLink className='nav__link' to='/'>
									HomePage
								</NavLink>
							</li>
							<li className='nav__item'>
								<NavLink onClick={useUserStore.getState().logOut} className='nav__link' to='#'>
									Log Out
								</NavLink>
							</li>
						</ul>
					</nav>
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
							<a className='logo-wrapper logo-wrapper--sub' href='/'>
								<img src='../img/logo.svg' alt='logo' className='logo' />
								<img src='../img/logo-text.svg' alt='logo' className='logo-texte' />
							</a>
						</li>
						<li className='navigation__item'>
							<a
								className='navigation__link navigation__link--active'
								href='index.html'>
								Home
							</a>
						</li>
						<li className='navigation__item'>
							<a className='navigation__link' href='menu.html'>
								Menu
							</a>
						</li>
						<li className='navigation__item'>
							<a className='navigation__link' href='#'>
								Shopee&reg;
							</a>
						</li>
						<li className='navigation__item'>
							<a className='navigation__link' href='contact.html'>
								Contact
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</>
	);
}
