import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is requried'),
  password: yup
    .string()
    .min('Password must be at least 2 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['tester', 'owner'], 'Invalid role')
    .required('Role is required'),

  company_name: yup.string().when('role', {
    is: 'owner',
    then: yup.string().required('Company name ia required for software owner'),
    otherwise: yup.string().nullable(),
  }),
});
