import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Adjust the path as needed
import './JobDetailPage.css';

const JobDetailPage = () => {
    const { id } = useParams();
    const { isAdmin } = useAuth();  // Get isAdmin status from AuthContext
    const [job, setJob] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobAndCompanyJobs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/jobs/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jobData = await response.json();
                setJob(jobData);

                const companyJobsResponse = await fetch(`http://localhost:3000/company-jobs/${encodeURIComponent(jobData.companyName)}/${id}`);
                if (!companyJobsResponse.ok) {
                    throw new Error(`HTTP error! status: ${companyJobsResponse.status}`);
                }
                const companyJobsData = await companyJobsResponse.json();
                setCompanyJobs(companyJobsData);
            } catch (error) {
                setError(`Error fetching job details: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndCompanyJobs();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:3000/jobs/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                alert('Job deleted successfully');
                navigate('/jobs');
            } catch (error) {
                alert(`Error deleting job: ${error.message}`);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/jobs/${id}/edit`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!job) return <p>Job not found.</p>;

    const statusColor = job.recruitingStatus === 'open' ? 'green' : 'red';

    return (
        <div className="job-container">
            <div className="job-card">
                <div className="logo-box">
                    <img
                        src={job.companyLogo}
                        alt={`${job.companyName} logo`}
                        className="company-logo"
                    />
                </div>
                <div className="content-wrapper">
                    <div className="job-details">
                        <div className="job-title-container">
                            <h1 className="job-title">{job.companyName}</h1>
                        </div>
                        <p className="job-detail-item"><strong>Job Title:</strong> {job.jobTitle}</p>
                        <p className="job-detail-item">
                            <span style={{ backgroundColor: statusColor, padding: '3px 8px', borderRadius: '3px', color: 'white', textTransform: 'uppercase' }}>
                                {job.recruitingStatus}
                            </span>
                        </p>
                        <p className="job-detail-item"><strong>Salary Range:</strong> {job.salaryRange}</p>
                        <p className="job-detail-item"><strong>Contact Email:</strong> {job.gmail}</p>
                        <p className="job-detail-item"><strong>Job Description:</strong> {job.jobDescription}</p>
                    </div>
                    {isAdmin && (
                        <div className="job-actions">
                            <button className="edit-button" onClick={handleEdit}>Edit Job</button>
                            <button className="delete-button" onClick={handleDelete}>Delete Job</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="company-jobs-container">
                <div className="company-jobs">
                    <h2>Other Jobs at {job.companyName}</h2>
                    {companyJobs.length > 0 ? (
                        <ul>
                            {companyJobs.map(companyJob => (
                                <li key={companyJob.id} className="company-job-item">
                                    <Link to={`/jobs/${companyJob.id}`} className="company-job-link">
                                        {companyJob.jobTitle}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No other jobs available at this company.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;
