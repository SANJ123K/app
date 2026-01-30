import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

// Conditionally import LinearGradient only for native platforms
let LinearGradient: any;
if (Platform.OS !== 'web') {
  LinearGradient = require('react-native-linear-gradient').LinearGradient;
}

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStartPlanning = () => {
    router.push('/wizard/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.primary.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* App Logo/Name */}
            <View style={styles.logoContainer}>
              <Text style={styles.appName}>PRP</Text>
              <Text style={styles.subtitle}>Finance</Text>
            </View>

            {/* Main Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Build your 20-Year</Text>
              <Text style={styles.title}>Money Plan</Text>
            </View>

            {/* Subtitle */}
            <Text style={styles.description}>
              We'll help you plan savings, protection, and goals step by step.
            </Text>

            {/* Feature Bullets */}
            <View style={styles.featuresContainer}>
              <FeatureItem
                icon="shield-checkmark"
                text="Protect your family"
              />
              <FeatureItem
                icon="wallet"
                text="Build safety and savings"
              />
              <FeatureItem
                icon="trending-up"
                text="Plan future goals"
              />
            </View>

            {/* CTA Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Start Planning"
                onPress={handleStartPlanning}
                variant="secondary"
                fullWidth
              />
            </View>

            {/* Buddy Message */}
            <View style={styles.buddyContainer}>
              <Ionicons name="chatbubble-ellipses" size={20} color={Colors.accent.gold} />
              <Text style={styles.buddyText}>
                I'm here to guide you through every step!
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: any;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={Colors.accent.gold} />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appName: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background.white,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.secondary.lavender,
    marginTop: Spacing.xs,
  },
  titleContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.background.white,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.background.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.background.white,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  buddyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buddyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.background.white,
    marginLeft: Spacing.sm,
    fontStyle: 'italic',
  },
});
