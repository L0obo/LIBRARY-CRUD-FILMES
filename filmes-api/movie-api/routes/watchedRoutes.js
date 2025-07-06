const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const watchedPath = path.join(__dirname, '..', 'watched.json');

function readWatchedMovies() {
  return JSON.parse(fs.readFileSync(watchedPath, 'utf-8'));
}

function saveWatchedMovies(movies) {
  fs.writeFileSync(watchedPath, JSON.stringify(movies, null, 2));
}

// GET /watched - lista todos os filmes assistidos
router.get('/', (req, res) => {
  const movies = readWatchedMovies();
  res.json(movies);
});

// POST /watched - adiciona um novo filme assistido
router.post('/', (req, res) => {
  const movies = readWatchedMovies();
  const newMovie = req.body;

  // --- LÓGICA DE VERIFICAÇÃO DE DUPLICADOS MELHORADA ---
  let isDuplicate = false;
  if (newMovie.tmdbId) {
    // Se o filme vem da API externa, verifica pelo tmdbId
    isDuplicate = movies.some(m => m.tmdbId && m.tmdbId === newMovie.tmdbId);
  } else {
    // Se foi adicionado manualmente, verifica pelo título e ano
    isDuplicate = movies.some(m => m.title.toLowerCase() === newMovie.title.toLowerCase() && m.year === newMovie.year);
  }

  if (isDuplicate) {
    return res.status(409).json({ error: 'Este filme já existe na lista de assistidos.' });
  }
  
  // A lógica de ID permanece a mesma de antes, pois o filme movido
  // já vem com o seu ID original da galeria.
  if (!newMovie.id) {
      const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
      newMovie.id = newId;
  }
  
  movies.push(newMovie);
  saveWatchedMovies(movies);
  res.status(201).json(newMovie);
});

// DELETE /watched/:id - remove um filme assistido
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movies = readWatchedMovies();
  const newMovies = movies.filter(m => m.id !== id);

  if (newMovies.length === movies.length) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }

  saveWatchedMovies(newMovies);
  res.status(204).send();
});

module.exports = router;