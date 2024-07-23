import { useEffect, useState } from 'react';
import SelectInput from '../../features/form/SelectInput';
import TextArea from '../../features/form/TextArea';
import TextInput from '../../features/form/TextInput';
import useArtistStore from '../../hooks/artistStore';
import useCourseStore from '../../hooks/courseStore';
import { ArtistOptions } from '../../app/types/artist';
import SimpleButton from '../../features/common/SimpleButton';
import { useFormik } from 'formik';
import { Course } from '../../app/types/course';
import { toast } from 'react-toastify';
import usePhotoStore from '../../hooks/photoStore';
import { useModalStore } from '../../hooks/useModalStore';
import { sleep } from '../../app/api/agent';
import { v4 as uuidv4 } from 'uuid';
import { CourseProgram } from '../../app/types/courseProgram';
import { ProgramDetail } from '../../app/types/programDetail';
import Utils from '../../app/scripts/utils';
import LoadingFull from '../../features/common/LoadingFull';
import PhotoUploadWidget from '../../features/common/Photo/PhotoUploadWidget';
import { PhotoDto } from '../../app/types/photo';
import * as Yup from 'yup';

type Props = {
	courseId?: string;
};

export default function CourseForm(props: Props) {
	const courseStore = useCourseStore();
	const artistStore = useArtistStore();
	const photoStore = usePhotoStore();
	const modalStore = useModalStore();
	//@ts-ignored
	const [error, setError] = useState('');
	const [artistOptions, setArtistOptions] = useState<ArtistOptions[]>([
		new ArtistOptions(undefined, 'Choose teacher', '0'),
	]);

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		price: Yup.number().typeError('Must be a number').required('Price is required'),
		lecture: Yup.number()
			.typeError('Must be a number')
			.required('Number of lectures is required'),
		level: Yup.string().required('Level is required'),
		teacherId: Yup.string().required('Teacher is required')
	});

	const handleSubmit = async (course: Course) => {
		if (
			photoStore.files.length > 0 &&
			photoStore.files[0].publicId !== artistStore.artist.thumbPublicId
		) {
			const photo = await new Promise<Blob | null>((resolve) => {
				photoStore.cropper?.getCroppedCanvas().toBlob((blob) => {
					resolve(blob);
				}, 'image/jpeg');
			});

			if (!props.courseId) {
				await courseStore.addCourse(course, photo!);
				// await artistStore.addArtist({ ...artist, id: uuidv4() }, photo!);
			} else {
				await courseStore.editCourse(course, photo!);
				// await artistStore.editArtist(artist, photo!);
			}
		} else {
			if (!props.courseId) {
				setError('Thumbnail is required');
				throw '';
			} else {
				await courseStore.editCourse(course);
			}
		}

		// if (!props.courseId) {
		// 	await courseStore.addCourse(course);
		// } else {
		// 	await courseStore.editCourse(course);
		// }
	};

	const removeCourseProgram = (programIndex: number) => {
		const updatedCoursePrograms = [...formik.values.coursePrograms];
		updatedCoursePrograms.splice(programIndex, 1);
		formik.setValues({ ...formik.values, coursePrograms: updatedCoursePrograms });
	};

	const removeProgramDetail = (programIndex: number, detailIndex: number) => {
		const updatedCoursePrograms = [...formik.values.coursePrograms];
		updatedCoursePrograms[programIndex].programDetails.splice(detailIndex, 1);
		formik.setValues({ ...formik.values, coursePrograms: updatedCoursePrograms });
	};

	const formik = useFormik({
		initialValues: courseStore.course,
		validationSchema: validationSchema,
		enableReinitialize: true,
		validateOnChange: false,
		onSubmit: (values) => {
			handleSubmit(values).then(async () => {
				toast.info('Saved');
				photoStore.setProgress(100);
				await sleep(1000);
				modalStore.setIsFormDirty(false);
				modalStore.closeModal();
				photoStore.setProgress(0);
			});
		},
	});

	useEffect(() => {
		if (artistStore.artists.length <= 1) {
			artistStore.loadArtists();
		}

		if (artistOptions.length < artistStore.artists.length) {
			artistStore.artists.forEach((artist) =>
				setArtistOptions((current) => [...current, new ArtistOptions(artist)])
			);
		}

		return () => {
			setArtistOptions([]);
		};
	}, [artistStore.artists.length]);

	useEffect(() => {
		modalStore.setIsFormDirty(formik.dirty);
	}, [formik.dirty]);

	useEffect(() => {
		if (!props.courseId) {
			courseStore.setCourseId(uuidv4());
		} else {
			courseStore.loadCourse(props.courseId);
		}

		return () => {
			courseStore.setCourse(new Course());
		};
	}, []);

	return (
		<>
			{courseStore.loading && <LoadingFull isModal />}
			<div className='heading-tertiary heading-tertiary--dark u-align-center'>
				{props.courseId ? 'Edit course' : 'Add Course'}
			</div>
			<PhotoUploadWidget
				loadedPhoto={
					new PhotoDto({
						url: courseStore.course.thumbUrl,
						public_id: courseStore.course.thumbPublicId,
						secure_url: courseStore.course.thumbUrl
					})
				}
				loading={false}
			/>
			<form className='form' onSubmit={formik.handleSubmit}>
				<div className='form__wrapper'>
					<TextInput
						value={formik.values.name}
						onChange={formik.handleChange}
						error={formik.errors.name}
						name={'name'}
						placeHolder='Name'
					/>
					<TextInput
						value={formik.values.price}
						onChange={formik.handleChange}
						error={formik.errors.price}
						name={'price'}
						placeHolder='Price'
					/>
					<TextArea
						value={formik.values.description}
						onChange={formik.handleChange}
						name='description'
						rows={3}
						placeHolder={'Description'}
					/>
					<TextInput
						value={formik.values.lecture}
						onChange={formik.handleChange}
						error={formik.errors.lecture}
						name={'lecture'}
						placeHolder='Number of lectures'
					/>
					<TextInput
						value={formik.values.level}
						onChange={formik.handleChange}
						name={'level'}
						placeHolder='Level'
					/>
					<TextInput
						value={formik.values.scheduleDate}
						onChange={formik.handleChange}
						name={'scheduleDate'}
						placeHolder='Schedule Date'
					/>
					<TextInput
						value={formik.values.scheduleTime}
						onChange={formik.handleChange}
						name={'scheduleTime'}
						placeHolder='Schedule Time'
					/>
					<SelectInput
						value={formik.values.teacherId}
						onChange={formik.handleChange}
						name={'teacherId'}
						error={formik.errors.teacherId}
						options={artistOptions}
						loading={artistStore.loadingInitial}
					/>
					<div className='btn-simple__group'>
						<SimpleButton
							type='button'
							text='Add course program'
							onClick={() => {
								const updatedCourse = {
									...formik.values,
									coursePrograms: [
										...formik.values.coursePrograms,
										new CourseProgram({
											id: uuidv4(),
											courseId: courseStore.course.id,
											name: '',
											programDetails: [],
										}),
									],
								};
								// courseStore.setCourse(updatedCourse);
								formik.setValues(updatedCourse);
							}}
						/>
					</div>

					{formik.values.coursePrograms.map((courseProgram, i) => (
						<div key={courseProgram.id}>
							<TextInput
								icon='plus'
								icon2='minus'
								name={`coursePrograms.${i}.name`}
								value={formik.values.coursePrograms[i].name}
								onChange={formik.handleChange}
								placeHolder='Course program'
								onButtonClick={() => {
									const updatedCourseProgram = courseProgram.programDetails.push(
										new ProgramDetail({
											id: uuidv4(),
											name: '',
											courseProgramId: courseProgram.id,
										})
									);

									const updatedCourse = {
										...formik.values,
										coursePrograms: Utils.updateArrayItem(
											formik.values.coursePrograms,
											updatedCourseProgram
										),
									};
									// courseStore.setCourse(updatedCourse);
									formik.setValues(updatedCourse);
								}}
								onButtonClick2={() => {
									removeCourseProgram(i);
								}}
							/>
							<div className='program-detail-wrapper'>
								{courseProgram.programDetails.map((programDetail, ix) => (
									<TextInput
										key={programDetail.id}
										placeHolder='Program detail'
										name={`coursePrograms.${i}.programDetails.${ix}.name`}
										value={
											formik.values.coursePrograms[i].programDetails[ix].name
										}
										onChange={formik.handleChange}
										icon='minus'
										onButtonClick={() => {
											removeProgramDetail(i, ix);
										}}
									/>
								))}
							</div>
						</div>
					))}

					<div className='simple-btn__group'>
						<SimpleButton
							onClick={() => {
								formik.resetForm();
								photoStore.setFiles([]);
							}}
							text='Reset'
							type='reset'
							color='red'
						/>
						<SimpleButton
							loading={courseStore.loadingButton}
							text='Submit'
							type='submit'
							color='blue'
						/>
					</div>
				</div>
			</form>
		</>
	);
}
