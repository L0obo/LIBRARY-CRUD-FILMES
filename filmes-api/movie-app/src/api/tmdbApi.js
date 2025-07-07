// movie-app/src/api/tmdbApi.js

const API_KEY = '8635a035220d7254334115b63891956b'; 

const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getPopularMovies = async (page = 1) => {
  try {
    const url = `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes populares do TMDB:', error);
    return [];
  }
};

export const searchMovies = async (query, page = 1) => {
    if (!query) return [];
    try {
        const url = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return [];
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const url = `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        return null;
    }
};

// --- NOVA FUNÇÃO PARA BUSCAR A LISTA DE GÊNEROS ---
export const getGenres = async () => {
    try {
        const url = `${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;
        const response = await fetch(url);
        const data = await response.json();
        return data.genres; // Retorna um array de gêneros
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        return [];
    }
};

// --- NOVA FUNÇÃO PARA BUSCAR FILMES POR GÊNERO ---
export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const url = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar filmes por gênero:', error);
        return [];
    }
};
s