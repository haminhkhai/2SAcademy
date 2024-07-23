import * as Yup from 'yup';

 const customerValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required'),
    tel: Yup.string().required('Tel is required'),
    courseId: Yup.string().required('Please select a course')
});

export default customerValidationSchema;