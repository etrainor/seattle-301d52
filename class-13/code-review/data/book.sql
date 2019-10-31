DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY, 
  title VARCHAR(255),
  author VARCHAR(255),
  isbn INT,
  image_url VARCHAR(255),
  description VARCHAR 
);

INSERT INTO books (title, author) VALUES ('testing', 'me');