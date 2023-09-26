import { useState } from 'react';
import {
	createUserDocumentFromAuth,
	signInWithGooglePopup,
	signInAuthUserWithEmailAndPassword,
} from '../../utils/firebase/firebase.utils';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button-component';

// Styles
import './sign-in-form.styles.scss';

const defaultFormField = {
	email: '',
	password: '',
};

const SignInForm = () => {
	const [formFields, setFormFields] = useState(defaultFormField);
	const { email, password } = formFields;

	const resetformFields = () => {
		setFormFields(defaultFormField);
	};

	const signInWithGoogle = async () => {
		await signInWithGooglePopup();
	};

	const handlesubmit = async (event) => {
		event.preventDefault();

		try {
			const { user } = await signInAuthUserWithEmailAndPassword(
				email,
				password,
			);

			resetformFields();
		} catch (error) {
			switch (error.code) {
				case 'auth/wrong-password':
					alert('Incorrect password for email');
					break;
				case 'auth/user-not-found':
					alert('User not found');
					break;
				default:
					console.log(error);
					break;
			}
		}
	};

	const handleChange = async (event) => {
		const { name, value } = event.target;

		setFormFields({ ...formFields, [name]: value });
	};

	return (
		<div className="sign-up-container">
			<h2>Already have an account?</h2>
			<span>Sign in with your email and password</span>
			<form onSubmit={handlesubmit}>
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

				<div className="buttons-container">
					<Button type="submit">Sign In</Button>
					<Button type="button" buttonType="google" onClick={signInWithGoogle}>
						Google sign in
					</Button>
				</div>
			</form>
		</div>
	);
};

export default SignInForm;
