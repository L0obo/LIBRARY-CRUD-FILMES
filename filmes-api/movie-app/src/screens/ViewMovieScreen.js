// movie-app/src/screens/ViewMovieScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, StatusBar, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMovies, deleteMovie, addWatchedMovie } from '../api/api';
import MovieItem from '../components/MovieItem';
import { colors } from '../styles/colors';
import { IMAGE_BASE_URL } from '../api/tmdbApi';

const ITEM_MARGIN_HORIZONTAL = 12;

export default function ViewMovieScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [recommendedMovie, setRecommendedMovie] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMovingMovie, setIsMovingMovie] = useState(false);

  const fetchSavedMovies = useCallback(async () => {
    setLoading(true);
    try {
      const moviesFromApi = await getMovies();
      setAllMovies(moviesFromApi);
      setFilteredMovies(moviesFromApi);
    } catch (error) {
      console.error("Erro ao buscar filmes salvos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchSavedMovies);
    return unsubscribe;
  }, [navigation, fetchSavedMovies]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredMovies(allMovies);
    } else {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, allMovies]);

  const handleRecommend = () => {
    if (allMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * allMovies.length);
      setRecommendedMovie(allMovies[randomIndex]);
      setIsModalVisible(true);
    }
  };

  const handleWatchRecommendedMovie = async () => {
    if (!recommendedMovie) return;
    setIsMovingMovie(true);
    try {
        await addWatchedMovie(recommendedMovie);
        await deleteMovie(recommendedMovie.id);
        
        setIsModalVisible(false);
        fetchSavedMovies();

    } catch (error) {
        console.error('Erro ao mover o filme:', error.message);
        setIsMovingMovie(false);
    }
  };

  const handleMarkAsWatched = async (movieToWatch) => {
    try {
      setFilteredMovies(prev => prev.filter(m => m.id !== movieToWatch.id));
      await addWatchedMovie(movieToWatch);
      await deleteMovie(movieToWatch.id);
    } catch (error) {
      console.error('Erro ao mover o filme:', error.message);
      fetchSavedMovies();
    }
  };

  if (loading) {
    return (
        <LinearGradient colors={[colors.background, '#0A1828', colors.primary]} style={styles.gradient}>
            <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
        </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, '#0A1828', colors.primary]}
      style={styles.gradient}
    >
        <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Filme para hoje:</Text>
                    {recommendedMovie && (
                        <>
                            <Image source={{ uri: `${IMAGE_BASE_URL}${recommendedMovie.posterURL}` }} style={styles.modalImage} />
                            <Text style={styles.modalMovieTitle}>{recommendedMovie.title}</Text>
                            <Text style={styles.modalMovieYear}>{recommendedMovie.year}</Text>
                        </>
                    )}
                    <TouchableOpacity style={[styles.closeButton, styles.watchButton]} onPress={handleWatchRecommendedMovie} disabled={isMovingMovie}>
                        {isMovingMovie ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.closeButtonText}>Vou assistir esse!</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar na sua galeria..."
            placeholderTextColor={colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
        />

        {allMovies.length > 0 && (
            <TouchableOpacity style={styles.recommendButton} onPress={handleRecommend}>
            <Text style={styles.recommendButtonText}>✨ Me recomende um filme</Text>
            </TouchableOpacity>
        )}

        <FlatList
            data={filteredMovies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
            <View style={styles.centeredEmpty}>
                <Text style={styles.emptyText}>Nenhum filme encontrado.</Text>
                {searchQuery === '' && <Text style={styles.emptySubText}>A sua galeria está vazia.</Text>}
            </View>
            }
            renderItem={({ item }) => (
            <MovieItem
                movie={item}
                isSavedList={true}
                onEdit={() => navigation.navigate('Editar Filme', { movie: item })}
                onDelete={() => navigation.navigate('Apagar Filme', { id: item.id, listType: 'saved' })}
                onMarkAsWatched={() => navigation.navigate('Marcar como Assistido', { movie: item })}
                onPress={() => navigation.navigate('Detalhes do Filme', { movieId: item.tmdbId })}
            />
            )}
        />
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  centeredEmpty: { paddingTop: 50, alignItems: 'center' },
  listContainer: { paddingHorizontal: ITEM_MARGIN_HORIZONTAL, paddingTop: 15 },
  emptyText: { color: colors.accent, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  emptySubText: { color: colors.secondary, fontSize: 14, marginTop: 8, textAlign: 'center' },
  searchInput: { backgroundColor: colors.primary, color: colors.accent, marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, fontSize: 16 },
  recommendButton: { backgroundColor: colors.primary, marginHorizontal: 15, marginTop: 15, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.secondary },
  recommendButtonText: { color: colors.accent, fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { width: '85%', backgroundColor: colors.background, borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.secondary, marginBottom: 20 },
  modalImage: { width: 200, height: 300, borderRadius: 10, marginBottom: 15 },
  modalMovieTitle: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center' },
  modalMovieYear: { fontSize: 16, color: colors.secondary, marginTop: 5, marginBottom: 25 },
  closeButton: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 30, elevation: 2, width: '100%', alignItems: 'center' },
  watchButton: { backgroundColor: '#1E5A2D', marginBottom: 10 },
  closeButtonText: { color: colors.accent, fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});
