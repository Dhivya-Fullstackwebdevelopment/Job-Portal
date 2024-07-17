import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './JobsGrid.css';
import Footer from './Footer'; // Import Footer component

const JobsGrid = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobTitleTerm, setJobTitleTerm] = useState(''); // New state for job title search
    const [companyNameTerm, setCompanyNameTerm] = useState(''); // New state for company name search
    const [locationTerm, setLocationTerm] = useState(''); // New state for job location search
    const [jobCount, setJobCount] = useState(0); // New state for job count

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/jobs?jobTitle=${encodeURIComponent(jobTitleTerm)}&companyName=${encodeURIComponent(companyNameTerm)}&location=${encodeURIComponent(locationTerm)}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setJobs(data);
                setJobCount(data.length); // Update job count
            } catch (error) {
                setError(`Error fetching jobs: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [jobTitleTerm, companyNameTerm, locationTerm]);

    const handleJobTitleChange = (e) => {
        setJobTitleTerm(e.target.value);
    };

    const handleCompanyNameChange = (e) => {
        setCompanyNameTerm(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocationTerm(e.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="jobs-grid">
            <h1 className="jobs-title">Job Listings ({jobCount})</h1>
            <div className="search-bar">
                <input
                    type="text"
                    value={jobTitleTerm}
                    onChange={handleJobTitleChange}
                    placeholder="Search by job title..."
                />
                <input
                    type="text"
                    value={companyNameTerm}
                    onChange={handleCompanyNameChange}
                    placeholder="Search by company name..."
                />
                <input
                    type="text"
                    value={locationTerm}
                    onChange={handleLocationChange}
                    placeholder="Search by job location..."
                />
            </div>
            <div className="jobs-container">
                {jobs.length === 0 ? (
                    <p>No jobs found.</p>
                ) : (
                    jobs.map(job => (
                        <Link key={job.id} to={`/jobs/${job.id}`} className="job-card-link">
                            <div className="job-card">
                                <div className="logo-box">
                                    <img
                                        src={job.companyLogo}
                                        alt={`${job.companyName} logo`}
                                        className="job-logo"
                                    />
                                </div>
                                <div className="job-details">
                                    <h2>{job.companyName}</h2>
                                    <p><strong>Job Title:</strong> {job.jobTitle}</p>
                                    <p><strong>Category:</strong> {job.jobCategory}</p>
                                    <p><strong>Salary Range:</strong> {job.salaryRange}</p>
                                    <p><strong>Job Location:</strong> {job.jobLocation}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Footer section */}
            <Footer />
        </div>
    );
};

export default JobsGrid;
