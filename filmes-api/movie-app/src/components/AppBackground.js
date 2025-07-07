// movie-app/src/components/AppBackground.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';

export default function AppBackground({ children }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, '#0A1828', colors.primary]}
        style={StyleSheet.absoluteFill} // Faz o gradiente preencher todo o espaço
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Cor de fallback
  },
});