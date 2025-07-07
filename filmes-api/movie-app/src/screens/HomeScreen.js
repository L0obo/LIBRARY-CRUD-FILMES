// movie-app/src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';

export default function HomeScreen({ navigation }) {
  return (
    // O gradiente estático agora é o componente principal
    <LinearGradient
      colors={[colors.background, '#0A1828', colors.primary]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>BlueFlix</Text>
        <Text style={styles.subtitle}>Sua galeria de filmes</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Descobrir Filmes')}
        >
          <Text style={styles.buttonText}>Descobrir Filmes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Meus Filmes Salvos')}
        >
          <Text style={styles.buttonText}>Minha Galeria Particular</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Vale a pena ver de novo')}
        >
          <Text style={styles.buttonText}>Vale a pena ver de novo</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { 
    flex: 1, 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { fontSize: 42, fontWeight: 'bold', color: colors.accent, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.secondary, marginBottom: 50 },
  button: { backgroundColor: colors.primary, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, width: '90%', alignItems: 'center', marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3 },
  buttonText: { color: colors.accent, fontSize: 16, fontWeight: '600' },
});