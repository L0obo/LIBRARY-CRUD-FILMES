// movie-app/src/components/MovieItem.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform, Animated, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { IMAGE_BASE_URL } from '../api/tmdbApi';

const { width } = Dimensions.get('window');
const ITEM_MARGIN_HORIZONTAL = 12;
const ITEM_SPACING = 12;
const ITEM_WIDTH = (width - (ITEM_MARGIN_HORIZONTAL * 2) - ITEM_SPACING) / 2;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function MovieItem({ movie, onEdit, onDelete, onSave, onRemove, isSavedList = false, onPress, isSaving = false, savedStatus = 'none', onMarkAsWatched }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim, slideAnim]);

  const posterPath = isSavedList ? movie.posterURL : movie.poster_path;
  const posterUrl = posterPath ? `${IMAGE_BASE_URL}${posterPath}` : null;
  const imageSource = posterUrl ? { uri: posterUrl } : require('../../assets/placeholder.png');

  // Função para determinar o conteúdo do botão de ação
  const getButtonContent = () => {
      if (savedStatus === 'watched') return { text: '✓ Assistido', style: styles.watchedButton, action: null, disabled: true };
      if (savedStatus === 'saved') return { text: 'X Remover', style: styles.removeButton, action: onRemove, disabled: isSaving };
      return { text: '+ Salvar', style: {}, action: onSave, disabled: isSaving };
  };

  const buttonContent = getButtonContent();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
        <Image source={imageSource} style={styles.poster} />
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          <Text style={styles.year}>{isSavedList ? movie.year : (movie.release_date ? movie.release_date.substring(0, 4) : '')}</Text>
        </View>
        
        {isSavedList && (
            <View style={styles.actionButtonsContainer}>
                {onMarkAsWatched && (
                    <TouchableOpacity style={[styles.actionButton, styles.watchActionButton]} onPress={onMarkAsWatched}>
                        <Text style={styles.buttonIcon}>📺</Text>
                    </TouchableOpacity>
                )}
                {onEdit && (
                    <TouchableOpacity style={styles.actionButton} onPress={onEdit}><Text style={styles.buttonIcon}>✏️</Text></TouchableOpacity>
                )}
                {onDelete && (
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.danger}]} onPress={onDelete}><Text style={styles.buttonIcon}>🗑️</Text></TouchableOpacity>
                )}
            </View>
        )}

        {!isSavedList && (
          <TouchableOpacity style={[styles.saveButton, buttonContent.style]} onPress={buttonContent.action} disabled={buttonContent.disabled}>
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text style={styles.saveButtonText}>{buttonContent.text}</Text>
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { width: ITEM_WIDTH, height: ITEM_HEIGHT, marginBottom: ITEM_SPACING + 8, borderRadius: 12, backgroundColor: colors.secondary, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 4 },
  poster: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(13, 27, 42, 0.85)', paddingVertical: 10, paddingHorizontal: 8 },
  title: { color: colors.accent, fontSize: Platform.OS === 'ios' ? 14 : 13, fontWeight: 'bold' },
  year: { color: colors.secondary, fontSize: 12, marginTop: 2 },
  actionButtonsContainer: { position: 'absolute', top: 8, right: 8, flexDirection: 'row' },
  actionButton: { backgroundColor: 'rgba(65, 90, 119, 0.9)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  watchActionButton: { backgroundColor: '#1E5A2D' },
  buttonIcon: { fontSize: 16 },
  saveButton: { position: 'absolute', top: 8, right: 8, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, elevation: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', minWidth: 70, alignItems: 'center', justifyContent: 'center' },
  removeButton: { backgroundColor: colors.danger }, // Cor vermelha para o botão de remover
  watchedButton: { backgroundColor: '#0D3B66' },
  saveButtonText: { color: colors.accent, fontWeight: 'bold', fontSize: 12 }
});