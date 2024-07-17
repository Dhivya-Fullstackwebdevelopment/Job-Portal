

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// import { useAuth1 } from './AuthContext1';

// const AdminLoginForm = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const { login } = useAuth1();
//     const { adminLogin } = useAuth1();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:3000/loginn', { username, password });

//             if (response.status === 200) {
//                 localStorage.setItem('token', response.data.token);
//                 if (response.data.isAdmin) {
//                     localStorage.setItem('isAdmin', 'true');
//                     adminLogin();
//                 } else {
//                     login();
//                 }
//                 navigate('/JobRegistrationForm'); // Navigate to the JobRegistrationForm page
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 setError('Invalid username or password');
//             } else {
//                 setError('An error occurred. Please try again later.');
//             }
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Username:</label>
//                 <input
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                 />
//             </div>
//             <div>
//                 <label>Password:</label>
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//             </div>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default AdminLoginForm;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth1 } from './AuthContext1';
import './AdminLoginForm.css';

const AdminLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login, adminLogin } = useAuth1();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform validation
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/loginn', { username, password });
        // Assuming response.data is { token: '...', isAdmin: true/false }
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          if (response.data.isAdmin) {
            localStorage.setItem('isAdmin', 'true');
            adminLogin();
          } else {
            login();
          }
          setSuccessMessage('Login successful');
          navigate('/JobRegistrationFormFetch');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Invalid username or password.');
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <div className="login-form">
      <h2>Company Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
        <div className="form-control">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <button type="submit">Login</button>
        {successMessage && <div className="success">{successMessage}</div>}
      </form>
    </div>
  );
};

export default AdminLoginForm;
