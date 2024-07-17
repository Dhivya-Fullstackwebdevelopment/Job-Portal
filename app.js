const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(express.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Enter your MySQL password
    database: 'jobss' // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.stack);
        return;
    }
    console.log('MySQL Connected...');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadDir));








// API endpoint to fetch all job listings
// API endpoint to fetch all job listings
app.get('/jobs', (req, res) => {
    const { jobTitle, companyName, location } = req.query;

    let sql = 'SELECT * FROM jobs';
    const params = [];

    if (jobTitle || companyName || location) {
        sql += ' WHERE ';
        const conditions = [];
        if (jobTitle) {
            conditions.push('jobTitle LIKE ?');
            params.push(`%${jobTitle}%`);
        }
        if (companyName) {
            conditions.push('companyName LIKE ?');
            params.push(`%${companyName}%`);
        }
        if (location) {
            conditions.push('jobLocation LIKE ?');
            params.push(`%${location}%`);
        }
        sql += conditions.join(' AND ');
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error fetching jobs');
        } else {
            const jobsWithLogoURL = results.map(job => ({
                ...job,
                companyLogo: `http://localhost:3000/${job.companyLogo}`
            }));
            return res.json(jobsWithLogoURL);
        }
    });
});



// API endpoint to fetch job details by ID
app.get('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const sql = 'SELECT * FROM jobs WHERE id = ?';
    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error fetching job details:', err);
            return res.status(500).send('Error fetching job details');
        }

        if (!result || result.length === 0) {
            return res.status(404).send('Job not found');
        }

        // Ensure companyLogo is served with full URL
        const jobWithLogoURL = {
            ...result[0],
            companyLogo: `http://localhost:3000/${result[0].companyLogo}`
        };
        return res.json(jobWithLogoURL);
    });
});

// API endpoint to handle form submission (create new job)
app.post('/jobs', upload.single('companyLogo'), (req, res) => {
    const { jobTitle, companyName, recruitingStatus, jobCategory, jobLocation, salaryRange, gmail, jobDescription } = req.body;
    const companyLogo = req.file ? `uploads/${req.file.filename}` : null; // Store the relative path

    if (!companyLogo) {
        return res.status(400).send('File upload failed');
    }

    const sql = 'INSERT INTO jobs (jobTitle, companyName, companyLogo, recruitingStatus, jobCategory, jobLocation, salaryRange, gmail, jobDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [jobTitle, companyName, companyLogo, recruitingStatus, jobCategory, jobLocation, salaryRange, gmail, jobDescription], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error submitting form');
        } else {
            return res.status(200).send('Form submitted successfully');
        }
    });
});

// API endpoint to update job details by ID
app.put('/jobs/:id', upload.single('companyLogo'), (req, res) => {
    const jobId = req.params.id;
    const { jobTitle, companyName, recruitingStatus, jobCategory, jobLocation, salaryRange, gmail, jobDescription } = req.body;
    let companyLogo = req.file ? `uploads/${req.file.filename}` : null;

    // Check if companyLogo is not provided in the request; retain the existing value in the database
    if (!companyLogo && req.file === undefined) {
        const sqlLogo = 'SELECT companyLogo FROM jobs WHERE id = ?';
        db.query(sqlLogo, [jobId], (err, result) => {
            if (err) {
                console.error('Error fetching existing logo path:', err);
            } else if (result.length > 0) {
                companyLogo = result[0].companyLogo;
            }
        });
    }

    const sql = `
        UPDATE jobs
        SET jobTitle = ?, companyName = ?, companyLogo = ?, recruitingStatus = ?, jobCategory = ?,
            jobLocation = ?, salaryRange = ?, gmail = ?, jobDescription = ?
        WHERE id = ?
    `;
    db.query(
        sql,
        [
            jobTitle,
            companyName,
            companyLogo,
            recruitingStatus,
            jobCategory,
            jobLocation,
            salaryRange,
            gmail,
            jobDescription,
            jobId
        ],
        (err, result) => {
            if (err) {
                console.error('Error updating job details:', err);
                return res.status(500).send('Error updating job details');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('Job not found');
            }

            return res.status(200).send('Job details updated successfully');
        }
    );
});

// API endpoint to delete job by ID
app.delete('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const sql = 'DELETE FROM jobs WHERE id = ?';

    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error deleting job:', err);
            return res.status(500).send('Error deleting job');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Job not found');
        }

        return res.status(200).send('Job deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});










// API endpoint to fetch jobs from the same company excluding the current job
app.get('/company-jobs/:companyName/:currentJobId', (req, res) => {
    const { companyName, currentJobId } = req.params;
    const sql = 'SELECT * FROM jobs WHERE companyName = ? AND id != ?';
    db.query(sql, [companyName, currentJobId], (err, results) => {
        if (err) {
            console.error('Error fetching company jobs:', err);
            return res.status(500).send('Error fetching company jobs');
        }
        return res.json(results);
    });
});



// API endpoint to fetch all job listings
app.get('/jobs', (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error fetching jobs');
        }
        return res.json(results);
    });
});














// POST /signup endpoint in your Express app
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Insert user into database
    const insertUserQuery = 'INSERT INTO publicusers (username, email, password) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Error inserting user');
        }
        console.log('User inserted:', result);
        return res.status(200).send('User registered successfully');
    });
});






// Assuming you already have MySQL connection and bodyParser middleware set up

// POST /login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query user from database
    const selectUserQuery = 'SELECT * FROM publicusers WHERE username = ? AND password = ?';
    db.query(selectUserQuery, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).send('Error querying user');
        }
        if (result.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        console.log('User logged in:', { username });
        return res.status(200).json({ message: 'Login successful' });
    });
});






// POST /signup endpoint in your Express app




// POST /login endpoint
app.post('/signupp', (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO companyusers (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('An error occurred');
        return;
      }
      res.status(200).send('Admin registered successfully');
    });
  });




// POST /login endpoint
app.post('/loginn', (req, res) => {
    const { username, password } = req.body;

    // Query user from database
    const selectUserQuery = 'SELECT * FROM companyusers WHERE username = ? AND password = ?';
    db.query(selectUserQuery, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).send('Error querying user');
        }
        if (result.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        console.log('User logged in:', { username });
        return res.status(200).json({ message: 'Login successful' });
    });
});









const defaultAdmins = [
    { username: 'admin', password: 'admin123' },
    { username: 'dhivya', password: 'admin123' },
    { username: 'dinesh', password: 'admin123' },
    { username: 'admin3', password: 'admin123' },
    { username: 'admin4', password: 'admin123' },
];

// Insert default admin users
const insertAdminQuery = 'INSERT INTO adminusers (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE username=username';

defaultAdmins.forEach(admin => {
    db.query(insertAdminQuery, [admin.username, admin.password], (err, result) => {
        if (err) {
            console.error('Error inserting admin user:', err);
        } else {
            console.log('Admin user inserted:', admin.username);
        }
    });
});



app.post('/admin', (req, res) => {
    const { username, password } = req.body;

    // Query user from database
    const selectUserQuery = 'SELECT * FROM adminusers WHERE username = ? AND password = ?';
    db.query(selectUserQuery, [username, password], (err, result) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).send('Error querying user');
        }
        if (result.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        console.log('User logged in:', { username });
        return res.status(200).json({ message: 'Login successful' });
    });
});