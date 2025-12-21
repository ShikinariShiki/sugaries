import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface EnvelopeProps {
  isOpen: boolean;
  color?: string;
  children?: React.ReactNode;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  isOpen,
  color = '#ffc1e3',
  children,
}) => {
  const flapRotation = useSharedValue(0);
  const letterTranslateY = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      flapRotation.value = withSpring(-180, {
        damping: 15,
        stiffness: 100,
      });
      letterTranslateY.value = withTiming(-100, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      flapRotation.value = withSpring(0);
      letterTranslateY.value = withTiming(0);
    }
  }, [isOpen]);

  const flapStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${flapRotation.value}deg` },
    ],
  }));

  const letterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: letterTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.envelopeBody, { backgroundColor: color }]}>
        <Animated.View style={letterStyle}>
          {children}
        </Animated.View>
      </View>
      
      <Animated.View
        style={[
          styles.envelopeFlap,
          { backgroundColor: color, borderBottomColor: color },
          flapStyle,
        ]}
      />
      
      <View style={[styles.envelopeFront, { borderTopColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: 200,
    alignSelf: 'center',
    position: 'relative',
  },
  envelopeBody: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  envelopeFlap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    borderBottomWidth: 100,
    borderLeftWidth: width * 0.4,
    borderRightWidth: width * 0.4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transformOrigin: 'top',
  },
  envelopeFront: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    borderTopWidth: 75,
    borderLeftWidth: width * 0.4,
    borderRightWidth: width * 0.4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
