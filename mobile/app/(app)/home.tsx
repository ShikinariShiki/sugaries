import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { letterApi } from '@/services/api';
import { Button } from '@/components/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function Home() {
  const { user, signOut } = useAuth();
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const data = await letterApi.getMyLetters();
      setLetters(data);
    } catch (error) {
      console.error('Error loading letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLetters();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
          <Text style={styles.subtitle}>Your sweet letters</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(app)/profile')}
          style={styles.profileButton}
        >
          <Text style={styles.profileInitial}>
            {user?.name?.[0]?.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {letters.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.emptyState}
          >
            <Text style={styles.emptyIcon}>💌</Text>
            <Text style={styles.emptyTitle}>No letters yet</Text>
            <Text style={styles.emptyText}>
              Start by composing your first sweet letter!
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.lettersGrid}>
            {letters.map((letter, index) => (
              <Animated.View
                key={letter.id}
                entering={FadeInDown.delay(index * 100).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.letterCard,
                    { backgroundColor: letter.envelopeColor || '#ffc1e3' },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/letter/${letter.shortcode}`);
                  }}
                >
                  <Text style={styles.letterTitle} numberOfLines={1}>
                    {letter.senderName}
                  </Text>
                  <Text style={styles.letterDate}>
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </Text>
                  {letter.hasPIN && (
                    <View style={styles.lockBadge}>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="✨ Compose Letter"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/(app)/compose');
          }}
          style={styles.composeButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfbf7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffc1e3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  lettersGrid: {
    gap: 16,
  },
  letterCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  letterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  letterDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  lockBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  lockIcon: {
    fontSize: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  composeButton: {
    width: '100%',
  },
});
