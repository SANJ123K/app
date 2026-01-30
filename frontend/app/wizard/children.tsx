import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '../../store/planStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function ChildrenScreen() {
  const router = useRouter();
  const { profile, updateProfile, setCurrentStep } = usePlanStore();

  const [hasDaughter, setHasDaughter] = useState(profile.has_daughter);
  const [daughterAge, setDaughterAge] = useState(profile.daughter_age?.toString() || '');
  const [hasSon, setHasSon] = useState(profile.has_son);
  const [sonAge, setSonAge] = useState(profile.son_age?.toString() || '');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (hasDaughter && (!daughterAge || parseInt(daughterAge) < 0 || parseInt(daughterAge) > 18)) {
      newErrors.daughterAge = 'Please enter age between 0 and 18';
    }
    if (hasSon && (!sonAge || parseInt(sonAge) < 0 || parseInt(sonAge) > 18)) {
      newErrors.sonAge = 'Please enter age between 0 and 18';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateProfile({
        has_daughter: hasDaughter,
        daughter_age: hasDaughter ? parseInt(daughterAge) : null,
        has_son: hasSon,
        son_age: hasSon ? parseInt(sonAge) : null,
      });
      setCurrentStep(2);
      router.push('/wizard/protection-overview');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ProgressBar current={2} total={9} />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>About your children</Text>
              <Text style={styles.subtitle}>
                Some government schemes work best if started early
              </Text>
            </View>

            {/* Daughter Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Do you have a daughter under 10?</Text>
              <View style={styles.optionRow}>
                <OptionButton
                  title="Yes"
                  selected={hasDaughter}
                  onPress={() => setHasDaughter(true)}
                />
                <OptionButton
                  title="No"
                  selected={!hasDaughter}
                  onPress={() => {
                    setHasDaughter(false);
                    setDaughterAge('');
                  }}
                />
              </View>

              {hasDaughter && (
                <View style={styles.ageInput}>
                  <Input
                    label="Daughter's Age"
                    value={daughterAge}
                    onChangeText={setDaughterAge}
                    placeholder="e.g., 5"
                    keyboardType="numeric"
                    error={errors.daughterAge}
                  />
                  {daughterAge && parseInt(daughterAge) < 10 && (
                    <Card style={styles.infoCard}>
                      <View style={styles.infoContent}>
                        <Ionicons name="information-circle" size={20} color={Colors.accent.gold} />
                        <Text style={styles.infoText}>
                          Perfect! Sukanya Samriddhi Yojana offers 8% returns with tax benefits
                        </Text>
                      </View>
                    </Card>
                  )}
                </View>
              )}
            </View>

            {/* Son Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Do you have a son?</Text>
              <View style={styles.optionRow}>
                <OptionButton
                  title="Yes"
                  selected={hasSon}
                  onPress={() => setHasSon(true)}
                />
                <OptionButton
                  title="No"
                  selected={!hasSon}
                  onPress={() => {
                    setHasSon(false);
                    setSonAge('');
                  }}
                />
              </View>

              {hasSon && (
                <View style={styles.ageInput}>
                  <Input
                    label="Son's Age"
                    value={sonAge}
                    onChangeText={setSonAge}
                    placeholder="e.g., 8"
                    keyboardType="numeric"
                    error={errors.sonAge}
                  />
                  <Card style={styles.infoCard}>
                    <View style={styles.infoContent}>
                      <Ionicons name="information-circle" size={20} color={Colors.accent.gold} />
                      <Text style={styles.infoText}>
                        PPF is a great long-term savings option with 7.1% returns
                      </Text>
                    </View>
                  </Card>
                </View>
              )}
            </View>

            {/* Buddy Message */}
            <Card style={styles.buddyCard}>
              <View style={styles.buddyContent}>
                <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
                <Text style={styles.buddyText}>
                  Starting early with child education plans gives maximum returns!
                </Text>
              </View>
            </Card>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface OptionButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ title, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.optionButton, selected && styles.optionButtonSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary.dark,
    backgroundColor: Colors.background.white,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary.dark,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.dark,
  },
  optionTextSelected: {
    color: Colors.background.white,
  },
  ageInput: {
    marginTop: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.secondary.lavender,
    marginTop: Spacing.sm,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  buddyCard: {
    backgroundColor: Colors.secondary.lavender,
    marginTop: Spacing.lg,
  },
  buddyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buddyText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary.lightGrey,
  },
});