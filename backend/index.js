import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

const app = express()

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'timetables',
})

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json('Hi this is backend!')
})

app.get('/info', (req, res) => {
  const q = "SELECT s.subject_id, s.name_of_subject, s.number_of_lectures_per_week, t.teacher_id, t.first_name, t.last_name FROM subjects s JOIN junctions j ON s.subject_id = j.s_id JOIN teachers t ON j.t_id = t.teacher_id;"
  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.post('/insertinfo', (req, res) => {
  var { subject_id, name_of_subject, number_of_lectures_per_week, teacher_id, first_name, last_name } = req.body;
  
  subject_id = parseInt(subject_id)
  number_of_lectures_per_week = parseInt(number_of_lectures_per_week)
  teacher_id = parseInt(teacher_id)
  
  // Define queries for each insert statement
  const query1 = "INSERT INTO subjects (subject_id, name_of_subject, number_of_lectures_per_week) VALUES (?, ?, ?)";
  const query2 = "INSERT INTO teachers (teacher_id, first_name, last_name) VALUES (?, ?, ?)";
  const query3 = "INSERT INTO junctions (s_id, t_id) VALUES (?, ?)";
  
  // Execute each query separately with its corresponding values
  db.query(query1, [subject_id, name_of_subject, number_of_lectures_per_week], (err1, result1) => {
    if (err1) return res.json(err1);
    
    db.query(query2, [teacher_id, first_name, last_name], (err2, result2) => {
      if (err2) return res.json(err2);
      
      db.query(query3, [subject_id, teacher_id], (err3, result3) => {
        if (err3) return res.json(err3);
        
        return res.json('Data is inserted');
      });
    });
  });
});

app.post('/deletion',(req,res)=> {
  var { subject_id } = req.body;
  
  subject_id = parseInt(subject_id)

  const q1 = "SET @t_id = (SELECT t_id FROM junctions WHERE s_id = ?);"
  const q2 = "DELETE FROM junctions WHERE s_id = ?;"
  const q3 = "DELETE FROM teachers WHERE teacher_id = @t_id;"
  const q4 = "DELETE FROM subjects WHERE subject_id = ?;"
  db.query(q1, [subject_id], (err1, result1) => {
    if (err1) return res.json(err1);
    
    db.query(q2, [subject_id], (err2, result2) => {
      if (err2) return res.json(err2);
      
      db.query(q3, (err3, result3) => {
        if (err3) return res.json(err3);
        
        db.query(q4, [subject_id], (err4, result4) => {
          if (err4) return res.json(err4);
          
          return res.json('Data is Deleted');
        });
      });
    });
  });
});

app.get('/timeintake', (req, res) => {
  const q = "SELECT name_of_subject, number_of_lectures_per_week from subjects;"
  db.query(q, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})


app.listen(8800, () => {
  console.log('Connected to backend!')
})