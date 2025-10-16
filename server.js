const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'taskly_db'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

app.post('/query', (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: 'Campo "sql" é obrigatório' });
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(400).json({ error: err.message });
    }

    res.json({ results });
  });
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});
