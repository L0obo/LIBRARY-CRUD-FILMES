// movie-app/src/screens/MovieDetailsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { getMovieDetails } from '../api/tmdbApi';
import { createMovie, getMovies, getWatchedMovies, deleteMovie } from '../api/api';
import { IMAGE_BASE_URL } from '../api/tmdbApi';
import { colors } from '../styles/colors';

export default function MovieDetailsScreen({ route, navigation }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedStatus, setSavedStatus] = useState('none');
  const [isSaving, setIsSaving] = useState(false);
  const [localMovie, setLocalMovie] = useState(null);

  const checkIfMovieIsSaved = useCallback(async () => {
    try {
      const savedMovies = await getMovies();
      const watchedMovies = await getWatchedMovies();
      
      const watched = watchedMovies.find(m => m.tmdbId === movieId);
      const saved = savedMovies.find(m => m.tmdbId === movieId);

      if (watched) {
        setSavedStatus('watched');
        setLocalMovie(watched);
      } else if (saved) {
        setSavedStatus('saved');
        setLocalMovie(saved);
      } else {
        setSavedStatus('none');
        setLocalMovie(null);
      }
    } catch (error) {
      console.error("Erro ao verificar filmes guardados:", error);
    }
  }, [movieId]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const details = await getMovieDetails(movieId);
      setMovie(details);
      await checkIfMovieIsSaved();
      setLoading(false);
    };
    fetchDetails();
  }, [movieId, checkIfMovieIsSaved]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', checkIfMovieIsSaved);
    return unsubscribe;
  }, [navigation, checkIfMovieIsSaved]);

  // --- FUNÇÃO ATUALIZADA PARA REMOÇÃO DIRETA ---
  const handleToggleSave = async () => {
    // Lógica para Adicionar Filme (permanece a mesma)
    if (savedStatus === 'none') {
      if (!movie) return;
      setIsSaving(true);
      try {
        const newMovie = {
          title: movie.title,
          year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : 0,
          posterURL: movie.poster_path,
          tmdbId: movie.id,
        };
        await createMovie(newMovie);
        await checkIfMovieIsSaved();
      } catch (error) {
        console.error("Erro ao salvar filme:", error.message);
      } finally {
        setIsSaving(false);
      }
    } 
    // Lógica para Remover Filme (agora é direta)
    else if (savedStatus === 'saved') {
      if (!localMovie) return;
      setIsSaving(true);
      try {
        await deleteMovie(localMovie.id);
        await checkIfMovieIsSaved(); // Atualiza o estado do botão para "+ Salvar"
      } catch (error) {
        console.error("Erro ao remover filme:", error.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (!movie) {
    return <View style={styles.centered}><Text style={styles.title}>Filme não encontrado.</Text></View>;
  }

  const getButtonText = () => {
      if (savedStatus === 'watched') return '✓ Filme Assistido';
      if (savedStatus === 'saved') return 'Remover da Minha Lista';
      return '+ Salvar na Minha Lista';
  };

  return (
    <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image 
            source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
            style={styles.poster}
        />
        <View style={styles.detailsContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.tagline}>{movie.tagline}</Text>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>⭐ {movie.vote_average.toFixed(1)}</Text>
                <Text style={styles.infoText}>🗓️ {movie.release_date ? movie.release_date.substring(0, 4) : ''}</Text>
                <Text style={styles.infoText}>🕒 {movie.runtime} min</Text>
            </View>

            <View style={styles.genresContainer}>
                {movie.genres.map(genre => (
                    <View key={genre.id} style={styles.genreBadge}>
                        <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity 
              style={[
                  styles.saveButton, 
                  savedStatus === 'saved' && styles.removeButton,
                  savedStatus === 'watched' && styles.watchedButton
              ]} 
              onPress={handleToggleSave}
              disabled={savedStatus === 'watched' || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {getButtonText()}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.overviewTitle}>Sinopse</Text>
            <Text style={styles.overview}>{movie.overview || "Sinopse não disponível."}</Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    poster: { width: '100%', height: 500, resizeMode: 'cover' },
    detailsContainer: { padding: 20, marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.background, minHeight: 400 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.accent, marginBottom: 5 },
    tagline: { fontSize: 16, fontStyle: 'italic', color: colors.secondary, marginBottom: 20 },
    infoRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 15 },
    infoText: { color: colors.accent, fontSize: 16, marginRight: 20 },
    genresContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 25 },
    genreBadge: { backgroundColor: colors.primary, borderRadius: 15, paddingVertical: 5, paddingHorizontal: 12, marginRight: 10, marginBottom: 10 },
    genreText: { color: colors.accent, fontSize: 12 },
    saveButton: { backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center', marginBottom: 25, flexDirection: 'row', justifyContent: 'center' },
    removeButton: { backgroundColor: colors.danger },
    watchedButton: { backgroundColor: '#0D3B66' },
    saveButtonText: { color: colors.accent, fontSize: 16, fontWeight: 'bold' },
    overviewTitle: { fontSize: 20, fontWeight: 'bold', color: colors.accent, marginBottom: 10 },
    overview: { fontSize: 16, color: colors.secondary, lineHeight: 24 },
});
s