import { useFormik } from 'formik';
import Button from '../../features/common/Button';
import TextInput from '../../features/form/TextInput';
import useUserStore from '../../hooks/userStore';
import { Navigate, useLocation } from 'react-router-dom';
import useCommonStore from '../../hooks/commonStore';
import { useEffect } from 'react';
import LoadingFull from '../../features/common/LoadingFull';

export default function Login() {
	const { getUser, loading, login, isLoggedIn } = useUserStore();
	const location = useLocation();
	const commonStore = useCommonStore();

	useEffect(() => {
		if (commonStore.token) {
			getUser().then(() => {
				commonStore.setAppLoaded();
			});
		} else {
			commonStore.setAppLoaded();
		}
	}, [commonStore.token]);

	const formik = useFormik({
		initialValues: { uname: '', secret: '', error: null },
		onSubmit: (values, { setErrors }) => {
			login(values).catch((error) => {
				setErrors({ error: 'Invalid username or password' });
				console.log(error);
			});
			// setSubmitting(false);
		},
	});

	//this loading is kinda important,
	//without it RequireAuth will run asynchonously and cause user state null
	if (!commonStore.appLoaded) {
		return <LoadingFull />;
	} else {
		if (isLoggedIn()) {
			
				return <Navigate to={location.state?.from.pathname || '/admin/customer'}/>;
			
				
		} else {
			return (
				<section className='section-login'>
					<div className='login__box'>
						<h1 className='heading-secondary login__heading u-align-center u-margin-bottom-small'>
							ADMIN PANEL
						</h1>

						<form className='form' onSubmit={formik.handleSubmit}>
							<div className='login__form'>
								<TextInput
									name='uname'
									value={formik.values.uname}
									onChange={formik.handleChange}
									placeHolder='Username'
								/>
								<TextInput
									name='secret'
									value={formik.values.secret}
									onChange={formik.handleChange}
									placeHolder='Password'
									type='password'
								/>
								<span>{formik.errors.error}</span>
								<Button
									loading={loading}
									type='submit'
									color='red'
									animated={true}
									text='LOGIN'
								/>
							</div>
						</form>
					</div>
				</section>
			);
		}
	}
}
