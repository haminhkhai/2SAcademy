import { CourseProgram } from '../../app/types/courseProgram';
import { useModalStore } from '../../hooks/useModalStore';
import Register from '../form/Register';

type Props = {
	coursePrograms: CourseProgram[];
};

export default function CourseProgramList({ coursePrograms }: Props) {
	const modalStore = useModalStore();
	return (
		<section className='section-course-program'>
			<div className='container'>
				<h1 className='heading-primary u-align-center u-margin-bottom-small'>
					Lộ trình khoá học
				</h1>
				{coursePrograms?.map((courseProgram) => (
					<div key={courseProgram.id}>
						<div className='course-program__title-box'>
							<h4 className='course-program__title'>{courseProgram.name}</h4>
						</div>
						<ul className='course-program__list'>
							{courseProgram.programDetails.map((detail) => (
								<li key={detail.id}>{detail.name}</li>
							))}
						</ul>
					</div>
				))}

				{/* <div className='course-program__title-box'>
					<h4 className='course-program__title'>
						Buổi 02. The History of Typography- Lịch sử hình thành typo.
					</h4>
				</div>
				<div className='course-program__title-box'>
					<h4 className='course-program__title'>Buổi 03 & 04. Type Classifications</h4>
				</div>
				<ul className='course-program__list'>
					<li>
						Tìm hiểu về hệ thống phân loại chữ trong thiết kế: Blackletter, Serif, Sans Serif,
						Script
					</li>
					<li>Type Talks</li>
					<li>Looking at Type</li>
				</ul>
				<div className='course-program__title-box'>
					<h4 className='course-program__title'>Buổi 5. How To Pick The Right Font</h4>
				</div>
				<ul className='course-program__list'>
					<li>Các nguyên tắc trong thiết kế Typography</li>
					<li>Typography trong thiết kế web</li>
					<li>Spacing và Aligment</li>
					<li>Balance</li>
					<li>Contrast</li>
					<li>White Space</li>
				</ul>
				<div className='course-program__title-box'>
					<h4 className='course-program__title'>Buổi 06. Nhận xét đánh giá bài tập</h4>
				</div> */}
				{/* <a href='#' className='btn btn--red btn--animated u-align-center'>
					Đăng ký ngay
				</a> */}
				
			</div>
		</section>
	);
}
