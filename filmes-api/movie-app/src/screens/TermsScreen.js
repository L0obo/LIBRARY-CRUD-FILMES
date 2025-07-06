// movie-app/src/screens/TermsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../styles/colors';

// Texto de exemplo para os termos. Substitua pelo seu texto real.
const termsText = `
Bem-vindo ao BlueFlix!

Ao utilizar este aplicativo, você concorda com os seguintes termos e condições:

1.  **Uso do Aplicativo:** Este aplicativo destina-se ao uso pessoal e não comercial para descobrir, guardar e gerir listas de filmes.

2.  **Conteúdo:** O conteúdo dos filmes, como sinopses, pósteres e notas, é fornecido pela API do The Movie Database (TMDB) e é da sua respectiva propriedade.

3.  **Dados do Utilizador:** O aplicativo guarda as suas listas de filmes (galeria e assistidos) localmente no seu dispositivo através da API do backend. Nenhum dado pessoal é recolhido ou partilhado.

4.  **Responsabilidade:** O utilizador é responsável por todo o conteúdo que adiciona manualmente. Não é permitido adicionar conteúdo ilegal ou ofensivo.

5.  **Limitação de Responsabilidade:** O aplicativo é fornecido "como está", sem garantias de qualquer tipo. Não nos responsabilizamos por qualquer perda de dados ou falha no serviço.

Ao clicar em "Aceitar e Continuar", você confirma que leu, compreendeu e concorda em ficar vinculado a estes termos.
`;

export default function TermsScreen({ onAccept }) {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Termos e Condições</Text>
        <Text style={styles.subtitle}>Por favor, leia e aceite para continuar.</Text>
        
        <View style={styles.termsBox}>
          <ScrollView nestedScrollEnabled={true}>
            <Text style={styles.termsText}>{termsText}</Text>
          </ScrollView>
        </View>

        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={isAccepted ? colors.accent : '#f4f3f4'}
            onValueChange={setIsAccepted}
            value={isAccepted}
          />
          <Text style={styles.switchLabel}>Li e aceito os termos e condições.</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, !isAccepted && styles.buttonDisabled]} 
          onPress={onAccept}
          disabled={!isAccepted}
        >
          <Text style={styles.buttonText}>Aceitar e Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.accent,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  termsBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  termsText: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  switchLabel: {
    marginLeft: 10,
    color: colors.accent,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
