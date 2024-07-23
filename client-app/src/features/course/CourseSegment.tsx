import { useEffect } from 'react';
import useCourseStore from '../../hooks/courseStore';
import SimpleButton from '../common/SimpleButton';
import { Link } from 'react-router-dom';

export default function CourseSegment() {
	const courseStore = useCourseStore();

	useEffect(() => {
		if (courseStore.courses.length <= 1) {
			courseStore.loadCourses();
		}
	}, []);

	return (
		<section className='section-courses'>
			<h2 className='heading-secondary u-align-center u-margin-bottom-medium'>
				What’s Included In <br />A Subscription?
			</h2>
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
				<a
					href='#'
					className='btn btn--red btn--animated u-align-center u-margin-top-small'>
					Đăng ký ngay
				</a>
			</div>
		</section>
	);
}
