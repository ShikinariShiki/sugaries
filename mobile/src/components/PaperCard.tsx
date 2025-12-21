import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PaperCardProps {
  content: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  content,
  fontFamily = 'System',
  fontSize = 16,
  textColor = '#333',
  backgroundColor = '#fffef9',
}) => {
  return (
    <Animated.View
      entering={SlideInUp.duration(600).springify()}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.paperTexture}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text
            entering={FadeIn.delay(300).duration(800)}
            style={[
              styles.text,
              {
                fontFamily,
                fontSize,
                color: textColor,
              },
            ]}
          >
            {content}
          </Animated.Text>
        </ScrollView>
      </View>
      
      {/* Paper edges effect */}
      <View style={styles.topEdge} />
      <View style={styles.bottomEdge} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    maxHeight: 500,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  paperTexture: {
    flex: 1,
    padding: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  text: {
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  topEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  bottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
