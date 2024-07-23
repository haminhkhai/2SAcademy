import { useFormik } from 'formik';
import TextInput from '../../features/form/TextInput';
import useCategoryStore from '../../hooks/categoryStore';
import { Category } from '../../app/types/category';
import SimpleButton from '../../features/common/SimpleButton';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useModalStore } from '../../hooks/useModalStore';
import { useEffect } from 'react';
import LoadingFull from '../../features/common/LoadingFull';

type Props = {
	categoryId?: string;
};
export default function CategoryForm(props: Props) {
	const categoryStore = useCategoryStore();
	const modalStore = useModalStore();

	const handleSubmit = async (category: Category) => {
		if (!props.categoryId) {
			await categoryStore.addCategory({ ...category, id: uuidv4() });
		} else {
			await categoryStore.editCategory(category);
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: categoryStore.category,
		onSubmit: (values) => {
			handleSubmit(values).then(() => {
				modalStore.closeModal();
				toast.info('Saved');
			});
		},
	});

	useEffect(() => {
		if (props.categoryId) {
			categoryStore.loadCategory(props.categoryId);
		}
        //reset at unmount
		return () => {
            categoryStore.resetCategory();
        };
	}, []);

	return (
		<>
            {categoryStore.loading && <LoadingFull isModal />}
			<h2 className='heading-tertiary heading-tertiary--dark u-align-center'>
				{props.categoryId ? 'Edit Category' : 'Add Category'}
			</h2>
			<form className='form' onSubmit={formik.handleSubmit}>
				<div className='form__wrapper'>
					<TextInput
						placeHolder='Category name'
						name='name'
						value={formik.values.name}
						onChange={formik.handleChange}
					/>
				</div>
			</form>
			<div className='simple-btn__group'>
				<SimpleButton text='RESET' color='red' onClick={() => formik.resetForm()} />
				<SimpleButton
					type='submit'
					loading={categoryStore.loadingButton}
					text='SAVE'
					color='blue'
					onClick={formik.handleSubmit}
				/>
			</div>
		</>
	);
}
