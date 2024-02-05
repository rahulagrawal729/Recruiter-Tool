const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Use cors middleware to handle CORS
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = 'SELECT * FROM recruiter_info WHERE email = $1 AND password = $2';
    const values = [email, password];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      // No user found with the provided credentials
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new candidate
app.post('/candidates', async (req, res) => {
  try {
    const { name, email,phone, qualifications, nodeJsExperience, reactJsExperience, skills, status, expectedSalary } = req.body;
    const query = `
      INSERT INTO candidate_info (name, email, phone, qualifications, nodejs_experience, reactjs_experience, skills, status, expected_salary)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
      RETURNING *`;
    const values = [name, email, phone, qualifications, nodeJsExperience, reactJsExperience, skills, status, expectedSalary];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all candidates
app.get('/candidates', async (req, res) => {
  try {
    const query = 'SELECT * FROM candidate_info';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update candidate status
app.put('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE candidate_info SET status = $1 WHERE id = $2 RETURNING *';
    const values = [status, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a candidate
app.delete('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM candidate_info WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
