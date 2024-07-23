import { useEffect, useRef, useState } from 'react';
import LoadingFull from '../../features/common/LoadingFull';
import PhotoUploadWidget from '../../features/common/Photo/PhotoUploadWidget';
import SelectInput from '../../features/form/SelectInput';
import TextArea from '../../features/form/TextArea';
import TextInput from '../../features/form/TextInput';
import useBlogStore from '../../hooks/blogStore';
import TextEditorWidget from '../../features/common/TextEditorWidget';
import SimpleButton from '../../features/common/SimpleButton';
import { useFormik } from 'formik';
import { Blog } from '../../app/types/blog';
import usePhotoStore from '../../hooks/photoStore';
import { sleep } from '../../app/api/agent';
import { v4 as uuidv4 } from 'uuid';
import useCategoryStore from '../../hooks/categoryStore';
import { CategoryOptions } from '../../app/types/category';
import { toast } from 'react-toastify';
import { useModalStore } from '../../hooks/useModalStore';
import { PhotoDto } from '../../app/types/photo';
import * as Yup from 'yup';
import Quill from 'quill';
import ReactQuillWidget from '../../features/common/ReactQuillWidget';
import ReactQuill from 'react-quill';

type Props = {
	blogId?: string;
};

export default function BlogForm(props: Props) {
	const modalStore = useModalStore();
	const blogStore = useBlogStore();
	const categoryStore = useCategoryStore();
	const photoStore = usePhotoStore();

	// const quillRef = useRef<Quill>();
	const [value, setValue] = useState("");
	const reactQuillRef = useRef<ReactQuill>(null);

	const [categoryOptions, setCategoryOptions] = useState<CategoryOptions[]>([
		new CategoryOptions(undefined, 'Choose a category', '0'),
	]);
	const [error, setError] = useState('');

	const handleSubmit = async (blog: Blog) => {
		// if (quillRef.current) {
		// 	blog.content = JSON.stringify(quillRef.current.getContents());
		// }
		blog.content = value;
		if (
			photoStore.files.length > 0 &&
			photoStore.files[0].publicId !== blogStore.blog.thumbPublicId
		) {
			const photo = await new Promise<Blob | null>((resolve) => {
				photoStore.cropper?.getCroppedCanvas().toBlob((blob) => {
					resolve(blob);
				}, 'image/jpeg');
			});

			if (!props.blogId) {
				await blogStore.addBlog({ ...blog, id: uuidv4() }, photo!);
			} else {
				await blogStore.editBlog(blog, photo!);
			}
		} else {
			if (!props.blogId) {
				setError('Thumbnail is required');
				throw '';
			} else {
				await blogStore.editBlog(blog);
			}
		}
	};

	const validationSchema = Yup.object({
		title: Yup.string().required('Title is required').min(10, "Title can't be too short"),
		category: Yup.object().shape({
			id: Yup.string().min(3, 'Category is required').required('Category is required'),
		}),
	});

	const formik = useFormik({
		validationSchema: validationSchema,
		validateOnChange: false,
		initialValues: blogStore.blog,
		enableReinitialize: true,
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
		if (categoryStore.categories.length <= 1) {
			categoryStore.loadCategories();
		}

		categoryStore.categories.forEach((category) => {
			setCategoryOptions((current) => [...current, new CategoryOptions(category)]);
		});
	}, []);

	useEffect(() => {
		if (props.blogId) {
			blogStore.loadBlog(props.blogId).then((blog) => {
				if (blog) {
					setValue(blog.content);
				}
			});
		}

		return () => {
			blogStore.resetBlog();
		};
	}, [props.blogId]);

	// useEffect(() => {
	// 	if (props.blogId && quillRef.current && blogStore.blog.content) {
	// 		const delta = JSON.parse(blogStore.blog.content);
	// 		quillRef.current.setContents(delta);
	// 	}
	// }, [blogStore.blog.content]);

	useEffect(() => {
		modalStore.setIsFormDirty(formik.dirty);
	}, [formik.dirty]);

	return (
		<>
			{blogStore.loading && <LoadingFull isModal />}

			<h2 className='heading-tertiary heading-tertiary--dark u-align-center'>
				{props.blogId ? 'Edit Blog' : 'Add Blog'}
			</h2>
			<form className='form' onSubmit={formik.handleSubmit}>
				<div className='form__wrapper'>
					<TextInput
						value={formik.values.title}
						onChange={formik.handleChange}
						name='title'
						placeHolder='Title'
						error={formik.errors.title}
					/>
					<TextArea
						value={formik.values.description}
						onChange={formik.handleChange}
						name='description'
						placeHolder='Description'
						rows={3}
					/>
					<SelectInput
						name='category.id'
						value={formik.values.category.id}
						onChange={formik.handleChange}
						options={categoryOptions}
						loading={categoryStore.loadingInitial}
						error={formik.errors.category?.id}
					/>

					<PhotoUploadWidget
						loadedPhoto={
							new PhotoDto({
								public_id: blogStore.blog.thumbPublicId,
								url: blogStore.blog.thumbUrl,
								secure_url: blogStore.blog.thumbUrl
							})
						}
						title='Add Blog thumbnail'
						loading={false}
						setError={setError}
					/>
					<span style={{ color: 'red', fontSize: '1.6rem' }}>{error}</span>
					{/* <TextEditorWidget quillRef={quillRef} /> */}
			
					{/* <TextEditor quillRef={quillRef} /> */}

					<ReactQuillWidget
                                reactQuillRef={reactQuillRef}
                                value={value}
                                setValue={setValue}
                                setProgress={photoStore.setProgress}
                            />

					<div className='simple-btn__group'>
						<SimpleButton
							loading={blogStore.loadingButton}
							color='blue'
							type='submit'
							text={'Submit'}
							onClick={formik.handleSubmit}
						/>
					</div>
				</div>
			</form>
		</>
	);
}
