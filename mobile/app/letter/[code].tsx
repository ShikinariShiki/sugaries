import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { letterApi } from '@/services/api';
import { Envelope } from '@/components/Envelope';
import { PaperCard } from '@/components/PaperCard';
import { PINInput } from '@/components/PINInput';
import { Button } from '@/components/Button';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

enum LetterState {
  LOADING = 'LOADING',
  NAME_CHECK = 'NAME_CHECK',
  LOCKED_ENVELOPE = 'LOCKED_ENVELOPE',
  PIN_CHECK = 'PIN_CHECK',
  READING = 'READING',
  ERROR = 'ERROR',
}

export default function LetterView() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [state, setState] = useState<LetterState>(LetterState.LOADING);
  const [letter, setLetter] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  useEffect(() => {
    if (code) {
      loadLetter();
    }
  }, [code]);

  useEffect(() => {
    if (pin.length === 4 && state === LetterState.PIN_CHECK) {
      verifyPIN();
    }
  }, [pin]);

  const loadLetter = async () => {
    try {
      const data = await letterApi.getByCode(code);
      setLetter(data);
      setState(LetterState.NAME_CHECK);
    } catch (error: any) {
      Alert.alert('Error', 'Letter not found');
      setState(LetterState.ERROR);
    }
  };

  const handleNameConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setState(LetterState.LOCKED_ENVELOPE);
  };

  const handleOpenEnvelope = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setEnvelopeOpen(true);
    setTimeout(() => {
      if (letter.hasPIN) {
        setState(LetterState.PIN_CHECK);
      } else {
        setState(LetterState.READING);
      }
    }, 1000);
  };

  const verifyPIN = async () => {
    try {
      await letterApi.verifyPIN(code, pin);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setState(LetterState.READING);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Incorrect PIN');
      setPin('');
    }
  };

  if (state === LetterState.LOADING) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffc1e3" />
      </View>
    );
  }

  if (state === LetterState.ERROR) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Letter not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {state === LetterState.NAME_CHECK && (
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.content}
        >
          <Text style={styles.title}>You have a letter! 💌</Text>
          <Text style={styles.subtitle}>
            From: <Text style={styles.bold}>{letter.senderName}</Text>
          </Text>
          <Text style={styles.subtitle}>
            To: <Text style={styles.bold}>{letter.recipientName}</Text>
          </Text>
          <Text style={styles.question}>Is this for you?</Text>
          <Button
            title="Yes, that's me!"
            onPress={handleNameConfirm}
            style={styles.button}
          />
        </Animated.View>
      )}

      {state === LetterState.LOCKED_ENVELOPE && (
        <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
          <Envelope
            isOpen={envelopeOpen}
            color={letter.envelopeColor}
          />
          <Button
            title="Open Envelope"
            onPress={handleOpenEnvelope}
            style={styles.button}
          />
        </Animated.View>
      )}

      {state === LetterState.PIN_CHECK && (
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.content}
        >
          <Text style={styles.title}>🔒 Enter PIN</Text>
          <Text style={styles.subtitle}>
            This letter is protected with a 4-digit PIN
          </Text>
          <PINInput
            value={pin}
            onChange={setPin}
            style={styles.pinInput}
          />
        </Animated.View>
      )}

      {state === LetterState.READING && (
        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.content}
        >
          <Text style={styles.letterHeader}>
            From: {letter.senderName} → To: {letter.recipientName}
          </Text>
          <PaperCard
            content={letter.content}
            fontFamily={letter.fontFamily}
            fontSize={letter.fontSize}
            textColor={letter.textColor}
            backgroundColor={letter.backgroundColor}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfbf7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: '#ffc1e3',
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  question: {
    fontSize: 18,
    color: '#333',
    marginTop: 16,
  },
  button: {
    marginTop: 12,
  },
  pinInput: {
    marginTop: 24,
  },
  letterHeader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
});
