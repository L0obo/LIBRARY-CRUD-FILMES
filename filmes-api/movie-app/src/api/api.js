const API_URL = 'https://potential-acorn-g444rjqrjp9q39996-3000.app.github.dev/movies';

export const getMovies = async () => {
  const res = await fetch(API_URL);
  console.log('Response status:', res); // Log do status da resposta
  return await res.json();
};

export const getMovieById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Filme não encontrado');
  return await res.json();
};

export const createMovie = async (movie) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  return await res.json();
};

export const updateMovie = async (id, updatedMovie) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedMovie),
  });
  return await res.json();
};

export const deleteMovie = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};
