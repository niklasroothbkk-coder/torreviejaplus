import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const walkthroughData = [
  {
    id: 1,
    image: require('../../assets/backgrounds/walkthrough1.png'),
    title: 'Explore it all in Torrevieja',
    description: 'Discover amazing destinations, plan trips easily, and start exploring today!',
  },
  {
    id: 2,
    image: require('../../assets/backgrounds/walkthrough2.png'),
    title: 'Walkthrough 2 Title',
    description: 'Add your description for walkthrough 2 here.',
  },
  {
    id: 3,
    image: require('../../assets/backgrounds/walkthrough3.png'),
    title: 'Walkthrough 3 Title',
    description: 'Add your description for walkthrough 3 here.',
  },
  {
    id: 4,
    image: require('../../assets/backgrounds/walkthrough4.png'),
    title: 'Walkthrough 4 Title',
    description: 'Add your description for walkthrough 4 here.',
  },
];

export default function WalkthroughScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastScreen = currentIndex === walkthroughData.length - 1;

  // Auto-advance timer is DISABLED - manual navigation only
  // useEffect(() => {
  //   if (!isLastScreen) {
  //     timerRef.current = setTimeout(() => {
  //       handleNext();
  //     }, 4000);
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   };
  // }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < walkthroughData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    // Skip walkthrough and go directly to splash screen
    onComplete();
  };

  const handleStart = () => {
    // Complete walkthrough and go to main app
    onComplete();
  };

  const currentScreen = walkthroughData[currentIndex];

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={currentScreen.image}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Overlay removed - images have their own styling */}

      {/* Title for first walkthrough only */}
      {currentIndex === 0 && (
        <View style={styles.firstWalkthroughTitle}>
          <Text style={styles.firstWalkthroughTitleText}>Explore the Best</Text>
          <Text style={styles.firstWalkthroughTitleText}>of Torrevieja</Text>
          <Text style={styles.firstWalkthroughSubtext}>The #1 Travelguide  - all you need</Text>
        </View>
      )}

      {/* Title for second walkthrough */}
      {currentIndex === 1 && (
        <View style={styles.firstWalkthroughTitle}>
          <Text style={styles.firstWalkthroughTitleText}>Find all the</Text>
          <Text style={styles.firstWalkthroughTitleText}>Best Deals</Text>
          <Text style={styles.firstWalkthroughSubtext}>Torrevieja has to offer </Text>
        </View>
      )}

      {/* Title for third walkthrough */}
      {currentIndex === 2 && (
        <View style={styles.firstWalkthroughTitle}>
          <Text style={styles.firstWalkthroughTitleText}>What Happens</Text>
          <Text style={styles.firstWalkthroughTitleText}>in Torrevieja</Text>
          <Text style={styles.firstWalkthroughSubtext}>We list the best happenings & events</Text>
        </View>
      )}

      {/* Title for fourth walkthrough */}
      {currentIndex === 3 && (
        <View style={styles.firstWalkthroughTitle}>
          <Text style={styles.firstWalkthroughTitleText}>Share taxi from</Text>
          <Text style={styles.firstWalkthroughTitleText}>or to the Airport</Text>
          <Text style={styles.firstWalkthroughSubtext}>An easy way share a ride and save</Text>
        </View>
      )}

      {/* Clickable area for blue arrow (right side, centered) */}
      {!isLastScreen && (
        <TouchableOpacity 
          style={styles.arrowClickArea}
          onPress={handleNext}
          activeOpacity={0.7}
        />
      )}

      {/* Content - Bottom */}
      <View style={styles.contentContainer}>
        {/* Bottom Row: Skip + Dots + Arrow/Start */}
        <View style={styles.bottomRow}>
          {/* Skip Button */}
          {!isLastScreen && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          {isLastScreen && <View style={{ width: 40 }} />}

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {walkthroughData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotActive : styles.dotInactive
                ]}
              />
            ))}
          </View>

          {/* Empty space on right */}
          <View style={{ width: 56 }} />
        </View>

        {/* Start Button - Only on Last Screen */}
        {isLastScreen && (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Let's Go</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  arrowClickArea: {
    position: 'absolute',
    right: 20,
    top: '50%',
    width: 80,
    height: 80,
    marginTop: -40,
    zIndex: 200,
  },
  verticalTextContainer: {
    position: 'absolute',
    right: 20,
    top: '20%',
    bottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  verticalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    transform: [{ rotate: '90deg' }],
    width: height * 0.6,
    textAlign: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    zIndex: 150,
  },
  firstWalkthroughTitle: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    zIndex: 140,
  },
  firstWalkthroughTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 25,
  },
  firstWalkthroughSubtext: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 38,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 40,
    lineHeight: 20,
    opacity: 0.9,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#0077B6',
    width: 24,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  arrowButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0077B6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: 'center',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
