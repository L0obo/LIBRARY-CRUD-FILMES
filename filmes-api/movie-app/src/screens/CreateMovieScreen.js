// movie-app/src/screens/CreateMovieScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, FlatList, SafeAreaView } from 'react-native';
import { createMovie } from '../api/api';
import { colors } from '../styles/colors';

// Gera uma lista de anos dinamicamente, do ano atual até 1920.
const currentYear = new Date().getFullYear();
const years = Array.from(new Array(currentYear - 1919), (val, index) => (currentYear - index).toString());

export default function CreateMovieScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [posterURL, setPosterURL] = useState('');
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);

  const handleSubmit = async () => {
    if (!title || !year) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o título e o ano.');
      return;
    }
    try {
      await createMovie({ title, year: parseInt(year), posterURL, tmdbId: null }); // tmdbId é nulo para filmes manuais
      Alert.alert('Sucesso!', 'Filme adicionado à sua lista.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleSelectYear = (selectedYear) => {
      setYear(selectedYear);
      setIsYearPickerVisible(false);
  }

  return (
    <SafeAreaView style={styles.wrapper}>
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      {/* --- MODAL PARA SELECIONAR O ANO --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isYearPickerVisible}
        onRequestClose={() => setIsYearPickerVisible(false)}
      >
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecione o Ano</Text>
                  <FlatList
                    data={years}
                    keyExtractor={(item) => item}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.yearItem} onPress={() => handleSelectYear(item)}>
                            <Text style={styles.yearText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsYearPickerVisible(false)}>
                      <Text style={styles.buttonText}>Fechar</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      <Text style={styles.label}>Título do Filme</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: O Poderoso Chefão"
        placeholderTextColor={colors.secondary}
      />

      <Text style={styles.label}>Ano de Lançamento</Text>
      {/* --- BOTÃO QUE ABRE O SELETOR DE ANO --- */}
      <TouchableOpacity style={styles.input} onPress={() => setIsYearPickerVisible(true)}>
          <Text style={[styles.inputText, !year && styles.placeholderText]}>
              {year || 'Selecione o ano'}
          </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Caminho do Pôster (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={posterURL}
        onChangeText={setPosterURL}
        placeholder="Ex: /3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
        placeholderTextColor={colors.secondary}
        autoCapitalize="none"
      />
      <Text style={styles.infoText}>
        Para a capa, use o caminho da imagem do site TMDB, começando com "/".
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Adicionar Filme</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    padding: 20,
  },
  label: { fontSize: 16, color: colors.accent, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 14, // Aumentado para parecer um botão
    borderRadius: 8,
    marginBottom: 5,
    justifyContent: 'center',
  },
  inputText: {
    color: colors.accent,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.secondary,
  },
  infoText: { fontSize: 12, color: colors.secondary, marginBottom: 25, paddingHorizontal: 5 },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonText: { color: colors.accent, fontSize: 16, fontWeight: 'bold' },
  // Estilos do Modal e do Seletor de Ano
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: colors.background,
    width: '80%',
    maxHeight: '70%',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 15,
  },
  yearItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  yearText: {
    color: colors.accent,
    textAlign: 'center',
    fontSize: 18,
  },
  modalCloseButton: {
    backgroundColor: colors.danger,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  }
});