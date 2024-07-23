import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCourseStore from '../../hooks/courseStore';
import CourseProgram from './CourseProgramList';
import { useModalStore } from '../../hooks/useModalStore';
import Register from '../form/Register';

export default function CourseDetail() {
	const { courseId } = useParams();
	const courseStore = useCourseStore();
	const modalStore = useModalStore();

	useEffect(() => {
		if (courseId) {
			courseStore.loadCourse(courseId);
		}
	}, []);

	return (
		<>
			<section className='section-course-detail'>
				<div className='container'>
					<div className='course-detail'>
						<div className='course-detail__img-wrapper'>
							<img
								src={courseStore.course.thumbUrl || '/img/courses/course1.png'}
								alt={courseStore.course.name}
								className='course-detail__img'
							/>
						</div>
						<h1 className='course-detail__heading heading-primary'>
							{courseStore.course.name}
						</h1>
						<h2 className='course-detail__price heading-secondary'>
							{courseStore.course.price?.toLocaleString() + " VNĐ"}
						</h2>
						{/* <div className='course-detail__btn-wrapper'>
						<a href='#popup' className='btn btn--red btn--animated'>
							Đăng ký ngay
						</a>
						<a href='#' className='btn btn--transparent-grey'>
							Tìm hiểu thêm khóa học khác
							<svg>
								<use href='img/sprite.svg#icon-button-arrow' />
							</svg>
						</a>
					</div> */}
						<p className='course-detail__excerpt'>{courseStore.course.description}</p>

						<table className='course-detail__info'>
							<tbody>
								<tr>
									<td className='course-detail__info--title'>Số buổi học:</td>
									<td className='course-detail__info--detail'>
										{courseStore.course.lecture}
									</td>
								</tr>
								<tr>
									<td className='course-detail__info--title'>Trình độ:</td>
									<td className='course-detail__info--detail'>
										{courseStore.course.level}
									</td>
								</tr>
								<tr>
									<td className='course-detail__info--title'>Giảng viên:</td>
									<td className='course-detail__info--detail'>
										{courseStore.course.teacherName}
									</td>
								</tr>
								<tr>
									<td className='course-detail__info--title'>Lịch học:</td>
									<td className='course-detail__info--detail'>
										{courseStore.course.scheduleDate}
									</td>
								</tr>
								<tr>
									<td className='course-detail__info--title'>Giờ học:</td>
									<td className='course-detail__info--detail'>
										{courseStore.course.scheduleTime}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>
			<CourseProgram coursePrograms={courseStore.course.coursePrograms} />
			<div className='container'>
				<button
					onClick={() =>
						modalStore.openModal(
							<Register courseId={courseStore.course.id} />,
							'medium'
						)
					}
					className='btn btn--red btn--animated u-align-center u-margin-bottom-medium'>
					Đăng ký ngay
				</button>
			</div>
		</>
	);
}
