// filmes-api/server.js
const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');
const watchedRoutes = require('./routes/watchedRoutes'); // <-- ADICIONAR ESTA LINHA

const app = express();
const port = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Rotas existentes
app.use('/movies', movieRoutes);
// Novas rotas para filmes assistidos
app.use('/watched', watchedRoutes); // <-- ADICIONAR ESTA LINHA

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
s