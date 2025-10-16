const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'ubCPSMdWlELRpwEbfdlykKySibDHByuq',
  database: 'railway'
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

// Porta
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  const host = server.address().address === '::' ? 'localhost' : server.address().address;
  const port = server.address().port;

  console.log(`API rodando em http://${host}:${port}`);

  console.log('Rotas disponíveis:');
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      console.log(`${methods} ${middleware.route.path}`);
    }
  });
});
