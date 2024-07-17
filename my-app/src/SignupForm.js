import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SignupForm.css';

const SignupForm = () => {
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleFormSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setSubmissionStatus('success');
                login(); // Authenticate the user
                navigate('/login'); // Redirect to LoginPage after successful signup
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            setSubmissionStatus('error');
        }
    };

    const formik = useFormik({
        initialValues: { username: '', email: '', password: '' },
        validationSchema: Yup.object({
            username: Yup.string().min(4, 'Username must be at least 4 characters').required('Username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        }),
        onSubmit: handleFormSubmit,
    });

    return (
        <div className="signup-form-container">
            <h2>Signup Form</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div className="invalid-feedback">{formik.errors.username}</div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback">{formik.errors.email}</div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">{formik.errors.password}</div>
                    )}
                </div>
                <div className="form-group submit-button">
                    <button type="submit" className="btn btn-primary">Signup</button>
<p>*if already signup click login</p>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
                </div>
            </form>
            {submissionStatus === 'success' && (
                <div className="alert alert-success" role="alert">
                    Signup successful! Redirecting to login page...
                </div>
            )}
            {submissionStatus === 'error' && (
                <div className="alert alert-danger" role="alert">
                    There was an error during signup. Please try again.
                </div>
            )}
        </div>
    );
};

export default SignupForm;
