// movie-app/src/screens/ValeAPenaVerDeNovoScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, StatusBar, TouchableOpacity, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getWatchedMovies } from '../api/api';
import MovieItem from '../components/MovieItem';
import { colors } from '../styles/colors';
import { IMAGE_BASE_URL } from '../api/tmdbApi';

const ITEM_MARGIN_HORIZONTAL = 12;

export default function ValeAPenaVerDeNovoScreen({ navigation }) {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedMovie, setRecommendedMovie] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchWatched = useCallback(async () => {
    setLoading(true);
    try {
      const movies = await getWatchedMovies();
      setWatchedMovies(movies);
    } catch (error) {
      console.error("Erro ao buscar filmes assistidos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchWatched);
    return unsubscribe;
  }, [navigation, fetchWatched]);

  const handleRecommend = () => {
    if (watchedMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * watchedMovies.length);
      setRecommendedMovie(watchedMovies[randomIndex]);
      setIsModalVisible(true);
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
                    <Text style={styles.modalTitle}>Que tal rever este clássico?</Text>
                    {recommendedMovie && (
                        <>
                            <Image source={{ uri: `${IMAGE_BASE_URL}${recommendedMovie.posterURL}` }} style={styles.modalImage} />
                            <Text style={styles.modalMovieTitle}>{recommendedMovie.title}</Text>
                            <Text style={styles.modalMovieYear}>{recommendedMovie.year}</Text>
                        </>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        <FlatList
            data={watchedMovies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
            watchedMovies.length > 0 ? (
                <TouchableOpacity style={styles.recommendButton} onPress={handleRecommend}>
                <Text style={styles.recommendButtonText}>✨ Me recomende um filme</Text>
                </TouchableOpacity>
            ) : null
            }
            ListEmptyComponent={
            <View style={styles.centeredEmpty}>
                <Text style={styles.emptyText}>Nenhum filme assistido ainda.</Text>
                <Text style={styles.emptySubText}>Marque um filme como assistido na sua galeria.</Text>
            </View>
            }
            renderItem={({ item }) => (
            <MovieItem
                movie={item}
                isSavedList={true}
                onDelete={() => navigation.navigate('Apagar Filme', { id: item.id, listType: 'watched' })}
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
  recommendButton: { backgroundColor: colors.primary, marginHorizontal: 15, marginBottom: 20, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.secondary, },
  recommendButtonText: { color: colors.accent, fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { width: '85%', backgroundColor: colors.background, borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.secondary, marginBottom: 20 },
  modalImage: { width: 200, height: 300, borderRadius: 10, marginBottom: 15 },
  modalMovieTitle: { fontSize: 22, fontWeight: 'bold', color: colors.accent, textAlign: 'center' },
  modalMovieYear: { fontSize: 16, color: colors.secondary, marginTop: 5, marginBottom: 25 },
  closeButton: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 30, elevation: 2 },
  closeButtonText: { color: colors.accent, fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});