const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'ubCPSMdWlELRpwEbfdlykKySibDHByuq',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pool de conexões MySQL pronto.');


app.post('/query', (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: 'Campo "sql" é obrigatório' });
  }

  pool.query(sql, (err, results) => {
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