// movie-app/src/api/api.js
const API_BASE_URL = 'https://potential-space-cod-q7774jq4j4rg345v9-3000.app.github.dev'; 

// --- Funções para a galeria particular (/movies) ---
export const getMovies = async () => {
  const res = await fetch(`${API_BASE_URL}/movies`);
  if (!res.ok) throw new Error('Falha ao buscar filmes salvos');
  return await res.json();
};

export const createMovie = async (movie) => {
  const res = await fetch(`${API_BASE_URL}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  // --- LÓGICA DE ERRO MELHORADA ---
  if (!res.ok) {
    // Tenta ler a mensagem de erro específica do corpo da resposta
    const errorData = await res.json();
    // Lança um erro com a mensagem do backend
    throw new Error(errorData.error || 'Falha ao salvar o filme');
  }
  return await res.json();
};

export const updateMovie = async (id, updatedMovie) => {
    const res = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie),
    });
    if (!res.ok) throw new Error('Falha ao atualizar o filme');
    return await res.json();
};

export const deleteMovie = async (id) => {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Falha ao deletar o filme');
};

// --- Funções para a lista de assistidos (/watched) ---
export const getWatchedMovies = async () => {
    const res = await fetch(`${API_BASE_URL}/watched`);
    if (!res.ok) throw new Error('Falha ao buscar filmes assistidos');
    return await res.json();
};

export const addWatchedMovie = async (movie) => {
    const res = await fetch(`${API_BASE_URL}/watched`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao adicionar à lista de assistidos');
    }
    return await res.json();
};

export const deleteWatchedMovie = async (id) => {
    const res = await fetch(`${API_BASE_URL}/watched/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Falha ao remover da lista de assistidos');
};
