const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const moviesPath = path.join(__dirname, '..', 'movies.json');
const watchedPath = path.join(__dirname, '..', 'watched.json'); // Caminho para a lista de assistidos

// Funções utilitárias para ler os ficheiros JSON
function readMovies() {
  return JSON.parse(fs.readFileSync(moviesPath, 'utf-8'));
}
function readWatchedMovies() {
  return JSON.parse(fs.readFileSync(watchedPath, 'utf-8'));
}

// Função utilitária para salvar filmes
function saveMovies(movies) {
  fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
}

// GET /movies - lista todos os filmes
router.get('/', (req, res) => {
  const movies = readMovies();
  res.json(movies);
});

// GET /movies/:id - busca um filme por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const movies = readMovies();
  const movie = movies.find(m => m.id === id);
  if (!movie) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }
  res.json(movie);
});

// POST /movies - cria um novo filme
router.post('/', (req, res) => {
  const movies = readMovies();
  const watchedMovies = readWatchedMovies(); // Lê também os filmes assistidos
  const allMyMovies = [...movies, ...watchedMovies]; // Combina as duas listas

  const newMovie = req.body;

  // --- LÓGICA DE VERIFICAÇÃO DE DUPLICADOS MELHORADA ---
  let isDuplicate = false;
  if (newMovie.tmdbId) {
    // Se o filme vem da API externa, verifica pelo tmdbId em AMBAS as listas
    isDuplicate = allMyMovies.some(m => m.tmdbId && m.tmdbId === newMovie.tmdbId);
  } else {
    // Se foi adicionado manualmente, verifica pelo título e ano em AMBAS as listas
    isDuplicate = allMyMovies.some(m => m.title.toLowerCase() === newMovie.title.toLowerCase() && m.year === newMovie.year);
  }

  if (isDuplicate) {
    return res.status(409).json({ error: 'Este filme já existe numa das suas listas.' });
  }

  if (!newMovie.title || newMovie.year === undefined) {
    return res.status(400).json({ error: 'Título e ano são obrigatórios' });
  }

  const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
  newMovie.id = newId;

  movies.push(newMovie);
  saveMovies(movies);

  res.status(201).json(newMovie);
});

// PUT /movies/:id - atualiza um filme existente
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movies = readMovies();

  const index = movies.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Filme não encontrado' });

  const updatedMovie = { ...movies[index], ...req.body };

  if (!updatedMovie.title || updatedMovie.year === undefined) {
    return res.status(400).json({ error: 'Título e ano são obrigatórios' });
  }

  movies[index] = updatedMovie;
  saveMovies(movies);

  res.json(updatedMovie);
});

// DELETE /movies/:id - remove um filme
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movies = readMovies();

  const newMovies = movies.filter(m => m.id !== id);
  if (newMovies.length === movies.length) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }

  saveMovies(newMovies);
  res.status(204).send();
});

module.exports = router;
