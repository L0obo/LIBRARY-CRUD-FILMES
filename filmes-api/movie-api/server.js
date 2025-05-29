const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const port = 3000;

// ✅ CORS liberado para todas as origens (uso em desenvolvimento)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Middleware para JSON
app.use(express.json());

// ✅ Rotas da API
app.use('/movies', movieRoutes);

// ✅ Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
