-- 1. Clear existing data to avoid primary key conflicts
-- We delete in reverse order of relationships (child tables first)
DELETE FROM disease_reports;
DELETE FROM patients;

-- 2. Insert Patients
-- We use explicit columns to ensure data integrity
INSERT INTO patients (name, age, gender) VALUES 
('Rahul Sharma', 28, 'Male'),
('Anjali Deshmukh', 34, 'Female'),
('Vikram Singh', 45, 'Male');

-- 3. Insert Disease Reports
-- These reference the IDs created above (1, 2, and 3)
INSERT INTO disease_reports (patient_id, disease_name, severity) VALUES 
(1, 'Influenza', 'Mild'),
(2, 'Hypertension', 'Moderate'),
(3, 'Type 2 Diabetes', 'Severe'),
(1, 'Common Cold', 'Mild');