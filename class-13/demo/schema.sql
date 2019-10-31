DROP DATABASE task_app;
CREATE DATABASE task_app; 

\c task_app;

DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  contact VARCHAR(255),
  status VARCHAR(255),
  category VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, description, contact, status, category) 
VALUES('Get School Supplies', 'need school supplies for the child', 'Taproot School', 'not done', 'education');

INSERT INTO tasks (title, description, contact, status, category) 
VALUES('Make Dinner', 'order the thai food', 'Budha Ruska', 'not done', 'food');