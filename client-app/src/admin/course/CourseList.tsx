import { Col, Container, Row } from 'react-grid-system';
import useCourseStore from '../../hooks/courseStore';
import { useEffect, useState } from 'react';
import SimpleButton from '../../features/common/SimpleButton';
import { useModalStore } from '../../hooks/useModalStore';
import CourseForm from './CourseForm';
import { toast } from 'react-toastify';
import LoadingFull from '../../features/common/LoadingFull';

export default function CourseList() {
	const courseStore = useCourseStore();
	const modalStore = useModalStore();

	const [loadingTarget, setLoadingTarget] = useState('');

	const handleDelete = (id: string) => {
		setLoadingTarget(id);
		courseStore.deleteCourse(id).then(() => {
			toast.info('Deleted');
		});
	};

	useEffect(() => {
		if (courseStore.courses.length <= 1) {
			courseStore.loadCourses();
		}
	}, []);

	if (courseStore.loadingInitial) return <LoadingFull/>

	return (
		<div className='admin__segment'>
			<div className='admin__segment-header'>
				<h3 className='admin__heading'>Courses</h3>
				<SimpleButton
					color='blue'
					text='ADD COURSE'
					onClick={() => modalStore.openModal(<CourseForm />, 'large')}
				/>
			</div>
			<Container fluid className='grid'>
				<Row wrap='nowrap' className='grid__row grid__header' debug>
					<Col className='grid__col' md={3} debug>
						Name
					</Col>
					<Col className='grid__col' md={2} debug>
						Price
					</Col>
					<Col className='grid__col' md={4} debug>
						Description
					</Col>
					<Col className='grid__col' md={2} debug>
						Level
					</Col>
					<Col className='grid__col' md={1} debug>
						Action
					</Col>
				</Row>

				{courseStore.courses.map((course) => (
					<Row key={course.id} wrap='nowrap' className='grid__row' debug>
						<Col className='grid__col' md={3} debug>
							{course.name}
						</Col>
						<Col className='grid__col' md={2} debug>
							{course.price?.toLocaleString()}
						</Col>
						<Col className='grid__col' md={4} debug>
							{course.description}
						</Col>
						<Col className='grid__col' md={2} debug>
							{course.level}
						</Col>
						<Col className='grid__col' md={1} debug>
							<SimpleButton
								color='blue'
								text='Edit'
								onClick={() => {
									modalStore.openModal(
										<CourseForm courseId={course.id} />,
										'large'
									);
								}}
							/>
							<SimpleButton
								loading={courseStore.loadingButton && loadingTarget == course.id}
								onClick={()=>{handleDelete(course.id)}}
								color='red'
								text='Delete'
							/>
						</Col>
					</Row>
				))}
			</Container>
		</div>
	);
}
