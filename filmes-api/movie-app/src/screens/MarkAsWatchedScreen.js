// movie-app/src/screens/MarkAsWatchedScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { addWatchedMovie, deleteMovie } from '../api/api';
import { colors } from '../styles/colors';

export default function MarkAsWatchedScreen({ route, navigation }) {
  // Recebe o objeto completo do filme
  const { movie } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 1. Adiciona o filme à lista de "assistidos"
      await addWatchedMovie(movie);
      // 2. Remove o filme da galeria particular
      await deleteMovie(movie.id);
      // 3. Volta para o ecrã anterior, que irá recarregar a lista
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao mover o filme:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{marginTop: 50}} size="large" color={colors.primary} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marcar como Assistido</Text>
      <Text style={styles.subtitle}>
        Tem a certeza que quer marcar "{movie.title}" como assistido?
      </Text>

      <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Sim, Marcar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Ainda Não</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.accent,
        textAlign: 'center',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 16,
        color: colors.secondary,
        textAlign: 'center',
        marginBottom: 40,
      },
      button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
      },
      confirmButton: {
        backgroundColor: '#1E5A2D', // Cor verde para confirmar
      },
      cancelButton: {
        backgroundColor: colors.primary,
      },
      buttonText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: 'bold',
      },
});