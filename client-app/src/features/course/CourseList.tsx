import { useEffect } from 'react';
import useCourseStore from '../../hooks/courseStore';
import SimpleButton from '../common/SimpleButton';
import { Link, useNavigate } from 'react-router-dom';

export default function CourseList() {
	const courseStore = useCourseStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (courseStore.courses.length <= 1) {
			courseStore.loadCourses();
		}
	}, []);

	return (
		<>
			<div className='cover cover--course'>
				<div className='cover__heading-box'>
					<h1 className='cover__heading heading-primary'>COURSE</h1>
					<ul className='nav-breadcrumb'>
						<li className='nav-breadcrumb__item'>Home</li>
						<li className='nav-breadcrumb__item nav-breadcrumb__item--active'>
							Course
						</li>
					</ul>
				</div>
			</div>
			<div className='course-list'>
				<div className='cover__info'>
					<img className='cover__info-logo' src='img/logo.svg' alt='logo' />
					<h1 className='cover__info-heading heading-primary'>2SMUSIC COURSE</h1>
				</div>
				<div className='container'>
					<div className='three-cols-row'>
						{courseStore.courses.map((course) => (
							<div key={course.id} className='card'>
								<div className='card__picture-wrapper'>
									<Link to={`/course/${course.id}`}>
										<img src={course.thumbUrl || '/img/courses/course1.png'} />
									</Link>
								</div>
								<div className='card__detail'>
									<h2 className='card__heading card__heading--course heading-secondary'>
										<Link to={`/course/${course.id}`}>{course.name}</Link>
									</h2>

									<p className='card__description'>{course.description}</p>
									<div className='card__footer'>
										<h3 className='card__price'>
											{course.price?.toLocaleString() + ' VNĐ'}
										</h3>
										<SimpleButton color='blue' text={'Detail'} />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
