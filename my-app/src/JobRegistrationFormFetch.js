import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobRegistrationFormFetch.css';

const JobRegistrationFormFetch = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:3000/jobs');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleDelete = async (jobId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Failed to delete the job');
                }
                setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    const handleEdit = (jobId) => {
        navigate(`/jobs/${jobId}/edit`);
        console.log(`Edit job with ID: ${jobId}`);
    };

    const handlePostJob = () => {
        navigate('/JobRegistrationForm');
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="job-listings-container container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
           
            <div className="overflow-x-auto">
                <table className="job-listings-table w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Job Title</th>
                            <th className="border border-gray-300 px-4 py-2">Company Name</th>
                            <th className="border border-gray-300 px-4 py-2">Recruiting Status</th>
                            <th className="border border-gray-300 px-4 py-2">Job Category</th>
                            <th className="border border-gray-300 px-4 py-2">Job Location</th>
                            <th className="border border-gray-300 px-4 py-2">Salary Range</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Job Description</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} className="text-sm">
                                <td className="border border-gray-300 px-4 py-2">{job.jobTitle}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.companyName}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.recruitingStatus}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.jobCategory}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.jobLocation}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.salaryRange}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.gmail}</td>
                                <td className="border border-gray-300 px-4 py-2">{job.jobDescription}</td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded mr-2"
                                        onClick={() => handleEdit(job.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
                onClick={handlePostJob}
            >
                Add Job
            </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobRegistrationFormFetch;
