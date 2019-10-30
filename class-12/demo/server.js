'use strict';

const express = require('express');
require('dotenv').config();
const pg = require('pg');
require('ejs');

const app = express();
const PORT = process.env.PORT || 3001;
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  console.error(err);
})

app.get('/', getTasks);
app.get('/tasks/:task_id', getOneTask);
app.get('/add', showForm);
app.post('/add', addTask);
app.get('*', (request, response) => {
  response.status(404).send('page not found');
})

function getTasks(request, response){
  // go to the database and get all the tasks and display them
  const sql = `SELECT * FROM tasks;`;

  client.query(sql)
    .then(sqlResults => {
      const arrayOfTasks = sqlResults.rows;
      response.render('pages/index', {tasks: arrayOfTasks});
    })
}

function getOneTask(request, response){
  // go to the database, get a specific task using an id and show details of that task
  console.log(request.params.task_id);

  const sql = `SELECT * FROM tasks WHERE id=$1;`;
  const safeValues = [request.params.task_id];

  client.query(sql, safeValues)
    .then(sqlResults => {
      const selectedTask = sqlResults.rows[0];
      response.render('pages/details', {taskInfo:selectedTask})
    })
    .catch(err => {console.error(err)});
}

function showForm(request, response){
  response.render('pages/addTask');
  // display the form to add a task
}

function addTask(request, response){
  // when the form is submited, sends the data to the server
  // adds it to the database
  // redirects back to the home with the new task

  let {title, description, category, contact, status} = request.body;

  let sql = `INSERT INTO tasks (title, description, category, contact, status) VALUES ($1, $2, $3, $4, $5);`;

  let safeValues = [title, description, category, contact, status];

  client.query(sql, safeValues)
    .then(results => {
      response.redirect('/');
    })
}

client.connect()
  .then(() =>{
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  }
  )