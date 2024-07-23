import { useFormik } from 'formik';
import Button from '../../features/common/Button';
import SelectInput from '../../features/form/SelectInput';
import TextArea from '../../features/form/TextArea';
import TextInput from '../../features/form/TextInput';
import useCustomerStore from '../../hooks/customerStore';
import { useModalStore } from '../../hooks/useModalStore';
import { useEffect, useState } from 'react';
import useCourseStore from '../../hooks/courseStore';
import { CourseOptions } from '../../app/types/course';
import { Customer } from '../../app/types/customer';
import customerValidationSchema from '../../app/types/validationSchemas';

type Props = {
	customer: Customer;
};

export default function CustomerForm(props: Props) {
	const courseStore = useCourseStore();
	const modalStore = useModalStore();
	const customerStore = useCustomerStore();
	const [courseOptions, setCourseOptions] = useState<CourseOptions[]>([]);

	const formik = useFormik({
		initialValues: props.customer,
		validationSchema: customerValidationSchema,
		onSubmit: async (values) => {
			await customerStore
				.editCustomer(values)
				.then(() => {
					modalStore.setIsFormDirty(false);
				})
				.catch((error) => console.log(error));
		},
	});

	useEffect(() => {
		if (courseStore.courses.length < 1) {
			courseStore.loadCourses();
			// setCourseOptions([]);
		}

		courseStore.courses.forEach((course) => {
			setCourseOptions((current) => [...current, new CourseOptions(course)]);
		});
	}, [courseStore.courses.length]);

	useEffect(() => {
		modalStore.setIsFormDirty(formik.dirty);
	}, [formik.dirty]);

	return (
		<>
			<h2 className='heading-tertiary heading-tertiary--dark u-align-center'>
				Edit Customer
			</h2>
			<form onSubmit={formik.handleSubmit} className='form'>
				<div className='form__wrapper'>
					<TextInput
						onChange={formik.handleChange}
						value={formik.values.name}
						error={formik.errors.name}
						name='name'
						placeHolder='Name'
					/>
					<TextInput
						onChange={formik.handleChange}
						value={formik.values.email}
						error={formik.errors.email}
						name='email'
						placeHolder='Email'
					/>
					<TextInput
						onChange={formik.handleChange}
						value={formik.values.tel}
						error={formik.errors.tel}
						name='tel'
						placeHolder='Tel'
					/>
					<SelectInput
						name='courseId'
						onChange={formik.handleChange}
						value={formik.values.courseId}
						error={formik.errors.courseId}
						options={courseOptions}
						loading={courseStore.loading}
					/>
					<TextArea
						name='description'
						onChange={formik.handleChange}
						value={formik.values.description}
						rows={3}
						placeHolder='Description'
					/>
					<div className='form__group-half'>
						<Button
							type='submit'
							color='transparent-grey'
							animated={false}
							text='SAVE'
						/>
					</div>
				</div>
			</form>
		</>
	);
}
