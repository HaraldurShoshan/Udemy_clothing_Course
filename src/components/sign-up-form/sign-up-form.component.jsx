import { useState } from 'react';
import {
	createUserWithEmailAndPasswordFn,
	createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button-component';

// Styles
import './sign-up-form.styles.scss';

const defaultFormField = {
	displayName: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const SignUpForm = () => {
	const [formFields, setFormFields] = useState(defaultFormField);
	const { displayName, email, password, confirmPassword } = formFields;

	const resetformFields = () => {
		setFormFields(defaultFormField);
	};

	const handlesubmit = async (event) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			return;
		}

		try {
			const { user } = await createUserWithEmailAndPasswordFn(email, password);

			await createUserDocumentFromAuth(user, { displayName });
			resetformFields();
		} catch (error) {
			if (error.code === 'auth/email-already-in-use') {
				alert('Email already in use');
			}
			console.log('Error creating user', error.message);
		}
	};

	const handleChange = async (event) => {
		const { name, value } = event.target;

		setFormFields({ ...formFields, [name]: value });
	};

	return (
		<div className="sign-up-container">
			<h2>Don't have an account?</h2>
			<span>Sign up with your email and password</span>
			<form onSubmit={handlesubmit}>
				<FormInput
					label={'Display name'}
					type="text"
					required
					onChange={handleChange}
					name="displayName"
					value={displayName}
				/>
				<FormInput
					label={'Email'}
					type="email"
					required
					onChange={handleChange}
					name="email"
					value={email}
				/>
				<FormInput
					label={'Password'}
					type="password"
					required
					onChange={handleChange}
					name="password"
					value={password}
				/>
				<FormInput
					label={'ConfirmPassword'}
					type="password"
					required
					onChange={handleChange}
					name="confirmPassword"
					value={confirmPassword}
				/>

				<Button type="submit">Sign Up</Button>
			</form>
		</div>
	);
};

export default SignUpForm;
