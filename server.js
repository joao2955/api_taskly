const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'mysql.railway.internal', // Usar variáveis de ambiente é melhor
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'ubCPSMdWlELRpwEbfdlykKySibDHByuq',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306
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

app.use((req, res, next) => {
  console.log(`ROTA NÃO ENCONTRADA (404): Método=${req.method}, URL=${req.originalUrl}`);
  res.status(404).json({ error: 'Rota não encontrada' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});