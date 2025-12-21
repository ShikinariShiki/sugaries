import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { authApi } from '@/services/api';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    emoji: '💌',
    title: 'Welcome to Sugaries',
    description: 'Send beautiful, encrypted letters to your loved ones',
  },
  {
    emoji: '🔒',
    title: 'Private & Secure',
    description: 'Your letters are protected with PIN codes and encryption',
  },
  {
    emoji: '🎨',
    title: 'Beautiful Design',
    description: 'Customize your letters with colors, fonts, and music',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleComplete = async () => {
    setLoading(true);
    try {
      await authApi.completeOnboarding();
      await refreshUser();
      router.replace('/(app)/home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = ONBOARDING_STEPS[step];

  return (
    <View style={styles.container}>
      <Animated.View
        key={step}
        entering={FadeInRight.duration(600)}
        style={styles.content}
      >
        <Text style={styles.emoji}>{currentStep.emoji}</Text>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description}>{currentStep.description}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === step && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {step < ONBOARDING_STEPS.length - 1 ? (
          <Button
            title="Next"
            onPress={() => setStep(step + 1)}
            style={styles.button}
          />
        ) : (
          <Button
            title="Get Started"
            onPress={handleComplete}
            loading={loading}
            style={styles.button}
          />
        )}

        {step > 0 && (
          <Button
            title="Back"
            onPress={() => setStep(step - 1)}
            variant="outline"
            style={styles.secondaryButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfbf7',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e5e5',
  },
  dotActive: {
    backgroundColor: '#ffc1e3',
    width: 24,
  },
  button: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});
