// movie-app/src/screens/DeleteMovieScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { deleteMovie, deleteWatchedMovie } from '../api/api'; // Importa ambas as funções de apagar
import { colors } from '../styles/colors';

export default function DeleteMovieScreen({ route, navigation }) {
  // Recebe o ID do filme e o TIPO da lista ('saved' ou 'watched')
  const { id, listType } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Verifica de qual lista o filme deve ser apagado
      if (listType === 'saved') {
        await deleteMovie(id);
      } else if (listType === 'watched') {
        await deleteWatchedMovie(id);
      } else {
        throw new Error("Tipo de lista desconhecido.");
      }
      // Volta para o ecrã anterior, que irá recarregar a lista automaticamente
      navigation.goBack();

    } catch (error) {
      Alert.alert("Erro", `Não foi possível apagar o filme: ${error.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{marginTop: 50}} size="large" color={colors.danger} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tem certeza?</Text>
      <Text style={styles.subtitle}>
        Esta ação é irreversível e o filme será permanentemente removido da sua lista.
      </Text>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Sim, Apagar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
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
      deleteButton: {
        backgroundColor: colors.danger,
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
