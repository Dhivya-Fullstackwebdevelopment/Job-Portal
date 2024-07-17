import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './JobRegistrationForm.css'; // Ensure custom CSS is only imported once

const JobRegistrationForm = () => {
    const [submissionStatus, setSubmissionStatus] = useState(null); // State for submission status

    // Function to handle form submission
    const handleFormSubmit = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });
    
        try {
            const response = await fetch('http://localhost:3000/jobs', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.text();
            console.log('Form submitted successfully', data);
            setSubmissionStatus('success');
            // Optionally call fetchJobs if it's defined and needed
            // fetchJobs(); // Uncomment if fetchJobs is defined and needed
        } catch (error) {
            console.error('There was a problem with the form submission:', error);
            setSubmissionStatus('error');
        }
    };
    
    // Formik setup
    const formik = useFormik({
        initialValues: {
            jobTitle: '',
            companyName: '',
            companyLogo: null,
            recruitingStatus: 'open',
            jobCategory: '',
            jobLocation: '',
            salaryRange: '',
            gmail: '',
            jobDescription: '',
        },
        validationSchema: Yup.object({
            jobTitle: Yup.string().required('Job Title is required'),
            companyName: Yup.string().required('Company Name is required'),
            companyLogo: Yup.mixed().required('Company Logo is required'),
            recruitingStatus: Yup.string().oneOf(['open', 'closed']).required('Recruiting Status is required'),
            jobCategory: Yup.string().required('Job Category is required'),
            jobLocation: Yup.string().required('Job Location is required'),
            salaryRange: Yup.string().required('Salary Range is required'),
            gmail: Yup.string().email('Invalid email format').required('Email is required'),
            jobDescription: Yup.string().required('Job Description is required'),
        }),
        onSubmit: handleFormSubmit,
    });

    return (
        <div className="form-wrapper d-flex justify-content-center align-items-center vh-100">
            <div className="form-content">
                <h1 className="text-center mb-4">Post Job here!</h1>
                <form onSubmit={formik.handleSubmit} className="form-container">
                    {/* Job Title */}
                    <div className="form-group row mb-3">
                        <label htmlFor="jobTitle" className="col-sm-4 col-form-label text-sm-end">Job Title</label>
                        <div className="col-sm-8">
                            <input
                                id="jobTitle"
                                name="jobTitle"
                                type="text"
                                className={`form-control ${formik.touched.jobTitle && formik.errors.jobTitle ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.jobTitle}
                            />
                            {formik.touched.jobTitle && formik.errors.jobTitle ? (
                                <div className="invalid-feedback">{formik.errors.jobTitle}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="form-group row mb-3">
                        <label htmlFor="companyName" className="col-sm-4 col-form-label text-sm-end">Company Name</label>
                        <div className="col-sm-8">
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                className={`form-control ${formik.touched.companyName && formik.errors.companyName ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.companyName}
                            />
                            {formik.touched.companyName && formik.errors.companyName ? (
                                <div className="invalid-feedback">{formik.errors.companyName}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Company Logo */}
                    <div className="form-group row mb-3">
                        <label htmlFor="companyLogo" className="col-sm-4 col-form-label text-sm-end">Company Logo</label>
                        <div className="col-sm-8">
                            <input
                                id="companyLogo"
                                name="companyLogo"
                                type="file"
                                className={`form-control ${formik.touched.companyLogo && formik.errors.companyLogo ? 'is-invalid' : ''}`}
                                onChange={(event) => formik.setFieldValue('companyLogo', event.currentTarget.files[0])}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.companyLogo && formik.errors.companyLogo ? (
                                <div className="invalid-feedback">{formik.errors.companyLogo}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Recruiting Status */}
                    <div className="form-group row mb-3">
                        <label htmlFor="recruitingStatus" className="col-sm-4 col-form-label text-sm-end">Recruiting Status</label>
                        <div className="col-sm-8">
                            <select
                                id="recruitingStatus"
                                name="recruitingStatus"
                                className={`form-control ${formik.touched.recruitingStatus && formik.errors.recruitingStatus ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.recruitingStatus}
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                            {formik.touched.recruitingStatus && formik.errors.recruitingStatus ? (
                                <div className="invalid-feedback">{formik.errors.recruitingStatus}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Job Category */}
                    <div className="form-group row mb-3">
                        <label htmlFor="jobCategory" className="col-sm-4 col-form-label text-sm-end">Job Category</label>
                        <div className="col-sm-8">
                            <select
                                id="jobCategory"
                                name="jobCategory"
                                className={`form-control ${formik.touched.jobCategory && formik.errors.jobCategory ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.jobCategory}
                            >
                                <option value="">--Select Job Category--</option>
                                <option value="Data Engineering">Data Engineering</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="Customer Service">Customer Service</option>
                                <option value="IT Manager">IT Manager</option>
                            </select>
                            {formik.touched.jobCategory && formik.errors.jobCategory ? (
                                <div className="invalid-feedback">{formik.errors.jobCategory}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Job Location */}
                    <div className="form-group row mb-3">
                        <label htmlFor="jobLocation" className="col-sm-4 col-form-label text-sm-end">Job Location</label>
                        <div className="col-sm-8">
                            <input
                                id="jobLocation"
                                name="jobLocation"
                                type="text"
                                className={`form-control ${formik.touched.jobLocation && formik.errors.jobLocation ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.jobLocation}
                            />
                            {formik.touched.jobLocation && formik.errors.jobLocation ? (
                                <div className="invalid-feedback">{formik.errors.jobLocation}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Salary Range */}
                    <div className="form-group row mb-3">
                        <label htmlFor="salaryRange" className="col-sm-4 col-form-label text-sm-end">Salary Range</label>
                        <div className="col-sm-8">
                            <select
                                id="salaryRange"
                                name="salaryRange"
                                className={`form-control ${formik.touched.salaryRange && formik.errors.salaryRange ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.salaryRange}
                            >
                                <option value="">--Select Salary Range--</option>
                                <option value="3LPA-5LPA">3LPA - 5LPA</option>
                                <option value="5LPA-7LPA">5LPA - 7LPA</option>
                                <option value="7LPA-12LPA">7LPA - 12LPA</option>
                                <option value="12LPA-15LPA">12LPA - 15LPA</option>
                                <option value="More than 15 LPA">More than 15 LPA</option>
                            </select>
                            {formik.touched.salaryRange && formik.errors.salaryRange ? (
                                <div className="invalid-feedback">{formik.errors.salaryRange}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group row mb-3">
                        <label htmlFor="gmail" className="col-sm-4 col-form-label text-sm-end">Email</label>
                        <div className="col-sm-8">
                            <input
                                id="gmail"
                                name="gmail"
                                type="email"
                                className={`form-control ${formik.touched.gmail && formik.errors.gmail ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.gmail}
                            />
                            {formik.touched.gmail && formik.errors.gmail ? (
                                <div className="invalid-feedback">{formik.errors.gmail}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="form-group row mb-3">
                        <label htmlFor="jobDescription" className="col-sm-4 col-form-label text-sm-end">Job Description</label>
                        <div className="col-sm-8">
                            <textarea
                                id="jobDescription"
                                name="jobDescription"
                                className={`form-control ${formik.touched.jobDescription && formik.errors.jobDescription ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.jobDescription}
                            />
                            {formik.touched.jobDescription && formik.errors.jobDescription ? (
                                <div className="invalid-feedback">{formik.errors.jobDescription}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-group row mb-3">
                        <div className="col-sm-12 text-center">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </form>

                {/* Display submission status */}
                {submissionStatus === 'success' && (
                    <div className="alert alert-success text-center" role="alert">
                        Form submitted successfully!
                    </div>
                )}
                {submissionStatus === 'error' && (
                    <div className="alert alert-danger text-center" role="alert">
                        There was an error submitting the form.
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRegistrationForm;

