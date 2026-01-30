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
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, setCurrentStep } = usePlanStore();

  const [age, setAge] = useState(profile.age?.toString() || '');
  const [income, setIncome] = useState(profile.monthly_income?.toString() || '');
  const [expenses, setExpenses] = useState(profile.monthly_expenses?.toString() || '');
  const [familySize, setFamilySize] = useState(profile.family_size?.toString() || '');
  const [hasDependents, setHasDependents] = useState(profile.has_dependents);
  const [riskComfort, setRiskComfort] = useState(profile.risk_comfort);

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!age || parseInt(age) < 18 || parseInt(age) > 70) {
      newErrors.age = 'Please enter age between 18 and 70';
    }
    if (!income || parseFloat(income) <= 0) {
      newErrors.income = 'Please enter valid monthly income';
    }
    if (!expenses || parseFloat(expenses) <= 0) {
      newErrors.expenses = 'Please enter valid monthly expenses';
    }
    if (expenses && income && parseFloat(expenses) >= parseFloat(income)) {
      newErrors.expenses = 'Expenses should be less than income';
    }
    if (!familySize || parseInt(familySize) < 1) {
      newErrors.familySize = 'Please enter valid family size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateProfile({
        age: parseInt(age),
        monthly_income: parseFloat(income),
        monthly_expenses: parseFloat(expenses),
        family_size: parseInt(familySize),
        has_dependents: hasDependents,
        risk_comfort: riskComfort,
      });
      setCurrentStep(1);
      
      // Navigate to children details if has dependents
      if (hasDependents) {
        router.push('/wizard/children');
      } else {
        router.push('/wizard/protection-overview');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ProgressBar current={1} total={9} />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Let's get to know you</Text>
              <Text style={styles.subtitle}>
                These details help us build a plan that fits you perfectly
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Your Age"
                value={age}
                onChangeText={setAge}
                placeholder="e.g., 30"
                keyboardType="numeric"
                error={errors.age}
              />

              <Input
                label="Monthly Income"
                value={income}
                onChangeText={setIncome}
                placeholder="e.g., 50000"
                keyboardType="numeric"
                prefix="₹"
                error={errors.income}
              />

              <Input
                label="Monthly Expenses"
                value={expenses}
                onChangeText={setExpenses}
                placeholder="e.g., 30000"
                keyboardType="numeric"
                prefix="₹"
                error={errors.expenses}
              />

              <Input
                label="Family Size"
                value={familySize}
                onChangeText={setFamilySize}
                placeholder="e.g., 4"
                keyboardType="numeric"
                error={errors.familySize}
              />

              {/* Dependents Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Do you have dependents?</Text>
                <View style={styles.optionRow}>
                  <OptionButton
                    title="Yes"
                    selected={hasDependents}
                    onPress={() => setHasDependents(true)}
                  />
                  <OptionButton
                    title="No"
                    selected={!hasDependents}
                    onPress={() => setHasDependents(false)}
                  />
                </View>
              </View>

              {/* Risk Comfort */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Risk Comfort Level</Text>
                <View style={styles.optionRow}>
                  <OptionButton
                    title="Low"
                    selected={riskComfort === 'Low'}
                    onPress={() => setRiskComfort('Low')}
                    icon="shield"
                  />
                  <OptionButton
                    title="Medium"
                    selected={riskComfort === 'Medium'}
                    onPress={() => setRiskComfort('Medium')}
                    icon="trending-up"
                  />
                  <OptionButton
                    title="High"
                    selected={riskComfort === 'High'}
                    onPress={() => setRiskComfort('High')}
                    icon="rocket"
                  />
                </View>
              </View>
            </View>

            {/* Buddy Message */}
            <Card style={styles.buddyCard}>
              <View style={styles.buddyContent}>
                <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
                <Text style={styles.buddyText}>
                  These details help me build a plan that fits you.
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
  icon?: any;
}

const OptionButton: React.FC<OptionButtonProps> = ({ title, selected, onPress, icon }) => (
  <TouchableOpacity
    style={[styles.optionButton, selected && styles.optionButtonSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon && (
      <Ionicons
        name={icon}
        size={20}
        color={selected ? Colors.background.white : Colors.primary.dark}
        style={styles.optionIcon}
      />
    )}
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
  form: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary.dark,
    backgroundColor: Colors.background.white,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary.dark,
    borderColor: Colors.primary.dark,
  },
  optionIcon: {
    marginRight: Spacing.xs,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.dark,
  },
  optionTextSelected: {
    color: Colors.background.white,
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
