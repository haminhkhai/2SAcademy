import { useEffect, useState } from 'react';
import useCourseStore from '../../hooks/courseStore';
import Button from '../common/Button';
import SelectInput from './SelectInput';
import TextArea from './TextArea';
import TextInput from './TextInput';
import { CourseOptions } from '../../app/types/course';
import { useFormik } from 'formik';
import useCustomerStore from '../../hooks/customerStore';
import { useModalStore } from '../../hooks/useModalStore';
import * as Yup from 'yup';
import { Customer } from '../../app/types/customer';
import { v4 as uuid } from 'uuid';

type Props = {
	courseId?: string;
};

export default function Register({ courseId }: Props) {
	const courseStore = useCourseStore();
	const customerStore = useCustomerStore();
	const { closeModal, setIsFormDirty } = useModalStore();
	const [courseOptions, setCourseOptions] = useState<CourseOptions[]>([
		new CourseOptions(undefined, 'Khóa học bạn dự định tham gia', '0'),
	]);

	useEffect(() => {
		if (courseStore.courses.length === 0) {
			//get all courses from db and set it to courses state
			courseStore.loadCourses();
		}

		courseStore.courses.forEach((course) => {
			setCourseOptions((current) => [...current, new CourseOptions(course)]);
		});
	}, [courseStore.courses]);

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		email: Yup.string().required('Email is required'),
		tel: Yup.string().required('Tel is required'),
		courseId: Yup.string().required('Please select a course'),
	});

	const formik = useFormik({
		initialValues: { ...new Customer(), id: uuid() },
		validationSchema: validationSchema,
		validateOnChange: false,
		onSubmit: async (values) => {
			await customerStore
				.addCustomer(values)
				.then(() => {
					setIsFormDirty(false);
					closeModal();
				})
				.catch((error) => console.log(error));
		},
	});

	useEffect(() => {
		setIsFormDirty(formik.dirty);
	}, [formik.dirty]);

	return (
		<>
			<h2 className='heading-secondary heading-secondary--dark u-align-center u-margin-bottom-small'>
				Register
			</h2>
			<p className='heading-excerpt heading-excerpt--dark'>
				Type in your name and choose your country, as well as the email address you will use
				to receive your login details. Choose a strong password to log in to the platform.
			</p>
			<form className='form' onSubmit={formik.handleSubmit}>
				<div className='form__wrapper'>
					<TextInput
						onChange={formik.handleChange}
						value={formik.values.name}
						name='name'
						placeHolder='Họ và tên (*)'
						error={formik.errors.name}
					/>

					<div className='form__group-half'>
						<TextInput
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.errors.email}
							name='email'
							type='email'
							placeHolder='Email (*)'
						/>
						<TextInput
							value={formik.values.tel}
							onChange={formik.handleChange}
							error={formik.errors.tel}
							name='tel'
							type='text'
							placeHolder='Số điện thoại (*)'
						/>
					</div>
					<SelectInput
						name='courseId'
						value={formik.values.courseId}
						onChange={formik.handleChange}
						error={formik.errors.courseId}
						// onBlur={formik.handleBlur}
						loading={courseStore.loading}
						options={courseOptions}
						selectedId={courseId}
					/>
					<TextArea
						name='description'
						value={formik.values.description}
						onChange={formik.handleChange}
						rows={3}
						placeHolder='Ghi chú'
					/>
					<Button
						color='red'
						loading={customerStore.loading}
						animated={false}
						text='Đăng ký ngay'
						type='submit'
					/>
				</div>
			</form>
		</>
	);
}
