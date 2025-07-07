// movie-app/src/screens/ListFilmsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, StatusBar, TouchableOpacity, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // <-- IMPORTAÇÃO ADICIONADA
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre } from '../api/tmdbApi';
import { createMovie, getMovies, getWatchedMovies, deleteMovie } from '../api/api';
import MovieItem from '../components/MovieItem';
import { colors } from '../styles/colors';

const ITEM_MARGIN_HORIZONTAL = 12;

export default function ListFilmsScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [error, setError] = useState(null);
  const [savingMovieId, setSavingMovieId] = useState(null);
  const [myMovies, setMyMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchInitialData = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      await Promise.all([
        (async () => {
          const results = await getGenres();
          setGenres([{ id: null, name: 'Populares' }, ...results]);
        })(),
        (async () => {
          const saved = await getMovies();
          const watched = await getWatchedMovies();
          setMyMovies(saved);
          setWatchedMovies(watched);
        })()
      ]);
    } catch (e) {
      console.error("Falha ao carregar dados iniciais:", e);
      setError("Não foi possível carregar os dados. Verifique a sua conexão.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchInitialData);
    fetchInitialData(); // Garante que os dados são carregados na primeira vez
    return unsubscribe;
  }, [navigation, fetchInitialData]);

  const fetchMovies = useCallback(async (query, genreId, pageNum) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      let results = [];
      if (query) {
        results = await searchMovies(query, pageNum);
      } else if (genreId) {
        results = await getMoviesByGenre(genreId, pageNum);
      } else {
        results = await getPopularMovies(pageNum);
      }
      setMovies(prev => pageNum === 1 ? results : [...prev, ...results]);
    } catch (e) {
      console.error("Falha ao buscar filmes: ", e);
      setError("Não foi possível carregar os filmes. Verifique a sua chave de API e conexão.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      setPage(1);
      fetchMovies(debouncedSearchQuery, selectedGenre, 1);
    }
  }, [debouncedSearchQuery, selectedGenre, fetchMovies, initialLoading]);

  const handleLoadMore = () => {
    if (loadingMore || loading || initialLoading) return;
    const newPage = page + 1;
    setPage(newPage);
    fetchMovies(debouncedSearchQuery, selectedGenre, newPage);
  };

  const handleSelectGenre = (genreId) => {
    setSearchQuery('');
    setSelectedGenre(genreId);
  };

  const handleSaveMovie = async (movieToSave) => {
    setSavingMovieId(movieToSave.id);
    try {
      const newMovie = {
        title: movieToSave.title,
        year: movieToSave.release_date ? parseInt(movieToSave.release_date.substring(0, 4)) : 0,
        posterURL: movieToSave.poster_path,
        tmdbId: movieToSave.id,
      };
      const savedMovie = await createMovie(newMovie);
      setMyMovies(prev => [...prev, savedMovie]);
    } catch (error) {
      console.error('Erro ao salvar o filme:', error.message);
    } finally {
      setSavingMovieId(null);
    }
  };
  
  const handleRemoveMovie = async (movieToRemove) => {
    const movieInMyList = myMovies.find(m => m.tmdbId === movieToRemove.id);
    if (!movieInMyList) return;
    setSavingMovieId(movieToRemove.id);
    try {
        await deleteMovie(movieInMyList.id);
        setMyMovies(prev => prev.filter(m => m.id !== movieInMyList.id));
    } catch (error) {
        console.error('Erro ao remover o filme:', error.message);
    } finally {
        setSavingMovieId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchMovies(debouncedSearchQuery, selectedGenre, 1)}>
              <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <FlatList
        data={movies}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore && <ActivityIndicator style={{ margin: 20 }} color={colors.primary} />}
        renderItem={({ item }) => {
          const isWatched = watchedMovies.some(m => m.tmdbId === item.id);
          const isSaved = myMovies.some(m => m.tmdbId === item.id);
          const status = isWatched ? 'watched' : isSaved ? 'saved' : 'none';
          
          return (
            <MovieItem
              movie={item}
              onSave={() => handleSaveMovie(item)}
              onRemove={() => handleRemoveMovie(item)}
              isSavedList={false}
              onPress={() => navigation.navigate('Detalhes do Filme', { movieId: item.id })}
              isSaving={savingMovieId === item.id}
              savedStatus={status}
            />
          );
        }}
      />
    );
  };
  
  const renderGenre = ({ item }) => (
    <TouchableOpacity 
      style={[styles.genreBadge, selectedGenre === item.id && styles.genreBadgeSelected]}
      onPress={() => handleSelectGenre(item.id)}
    >
      <Text style={[styles.genreText, selectedGenre === item.id && styles.genreTextSelected]}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (initialLoading) {
    return (
      <LinearGradient colors={[colors.background, '#0A1828', colors.primary]} style={styles.gradient}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, '#0A1828', colors.primary]} style={styles.gradient}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes na internet..."
          placeholderTextColor={colors.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View>
          <FlatList
            data={genres}
            keyExtractor={(item) => item.id?.toString() || 'populares'}
            renderItem={renderGenre}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genresContainer}
          />
        </View>
        {renderContent()}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Novo Filme')}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  listContainer: { paddingHorizontal: ITEM_MARGIN_HORIZONTAL, paddingTop: 15, paddingBottom: 80 },
  searchInput: { backgroundColor: colors.primary, color: colors.accent, marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, fontSize: 16 },
  genresContainer: { paddingHorizontal: 15, paddingVertical: 10 },
  genreBadge: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginRight: 10 },
  genreBadgeSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  genreText: { color: colors.secondary, fontWeight: '600' },
  genreTextSelected: { color: colors.accent },
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 25, bottom: 25, backgroundColor: colors.primary, borderRadius: 30, elevation: 8 },
  fabIcon: { fontSize: 30, color: colors.accent, lineHeight: 32 },
  errorText: { color: colors.danger, fontSize: 18, textAlign: 'center', marginBottom: 20, paddingHorizontal: 20, },
  retryText: { color: colors.accent, fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline', }
});
