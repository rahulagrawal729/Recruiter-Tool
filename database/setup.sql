-- Drop the database if it already exists
DROP DATABASE IF EXISTS recruiter_tool;

-- Create a new database
CREATE DATABASE recruiter_tool;

-- Connect to the newly created database
\c recruiter_tool;

-- Create the recruiter_info table
CREATE TABLE recruiter_info (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert dummy recruiter data
INSERT INTO recruiter_info (name, email, password)
VALUES
  ('Rahul Agrawal', 'rahul@gmail.com', 'abcd'),
  ('Avinesh Pratap Singh', 'avinesh@gmail.com', 'zyxw123');

-- Create the candidate_info table
CREATE TABLE candidate_info (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  qualifications VARCHAR(255),
  nodejs_experience NUMERIC,
  reactjs_experience NUMERIC,
  skills TEXT,
  status VARCHAR(50),
  expected_salary NUMERIC
);

-- Insert dummy candidate data
INSERT INTO candidate_info (name, email, phone, skills, qualifications, nodejs_experience, reactjs_experience, status, expected_salary)
VALUES
  ('Sameer Kumar', 'sameer@gmail.com', '1234567890', 'Java, Python', 'B.tech in cse', 1 , 2 , 'Contacted', 75000),
  ('Avishek Jaiswal', 'avi@example.com', '9876543210', 'React, Node.js', 'B.tech in cse', 3 , 2 ,'Interview Scheduled', 90000);
