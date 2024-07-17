import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminSignupForm.css';
import { useAuth1 } from './AuthContext1';

const AdminSignupForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters long'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/signupp', values);
      alert(response.data);
      navigate('/loginn'); // Navigate to the AdminLoginForm page
    } catch (error) {
      console.error('Error submitting the form:', error.response); // Log the error response
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`); // Display the error message to the user
      } else {
        alert('An unknown error occurred. Please try again.'); // Fallback error message
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="signup-form">
      <h2>Company Signup</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>Company SignUp</button>
<p>if already signup click company Login</p>
            {/* Button to navigate to AdminLoginForm */}
            <center><button type="button" onClick={() => navigate('/loginn')}> Company Login</button></center>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminSignupForm;
