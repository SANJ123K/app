import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '../../store/planStore';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { ProgressBar } from '../../components/ProgressBar';
import { apiService } from '../../services/api';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, addGoal, setCurrentStep } = usePlanStore();
  
  const [showForm, setShowForm] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalYears, setGoalYears] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [calculating, setCalculating] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    else if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const validateGoal = () => {
    const newErrors: any = {};
    if (!goalName.trim()) newErrors.goalName = 'Goal name required';
    if (!goalAmount || parseFloat(goalAmount) <= 0) newErrors.goalAmount = 'Valid amount required';
    if (!goalYears || parseInt(goalYears) <= 0 || parseInt(goalYears) > 20) {
      newErrors.goalYears = 'Years must be between 1 and 20';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGoal = async () => {
    if (!validateGoal()) return;

    setCalculating(true);
    try {
      const result = await apiService.calculateGoal({
        amount_today: parseFloat(goalAmount),
        years: parseInt(goalYears),
      });

      const newGoal = {
        goal_id: 'goal_' + Date.now(),
        name: goalName,
        amount_today: parseFloat(goalAmount),
        time_horizon: parseInt(goalYears),
        future_cost: result.future_cost,
        monthly_saving: result.monthly_saving,
        probability: 'Medium',
      };

      addGoal(newGoal);
      setGoalName('');
      setGoalAmount('');
      setGoalYears('');
      setShowForm(false);
    } catch (error) {
      console.error('Error calculating goal:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleContinue = () => {
    setCurrentStep(9);
    router.push('/wizard/plan-builder');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ProgressBar current={9} total={12} />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="flag" size={48} color={Colors.primary.dark} />
              </View>
              <Text style={styles.title}>Your Financial Goals</Text>
              <Text style={styles.subtitle}>
                Dream big! Let's plan for what matters to you
              </Text>
            </View>

            {goals.length > 0 && (
              <View style={styles.goalsContainer}>
                <Text style={styles.goalsTitle}>Added Goals ({goals.length})</Text>
                {goals.map((goal: any) => (
                  <Card key={goal.goal_id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <Ionicons name="star" size={24} color={Colors.accent.gold} />
                      <Text style={styles.goalName}>{goal.name}</Text>
                    </View>
                    <View style={styles.goalDetails}>
                      <View style={styles.goalDetailRow}>
                        <Text style={styles.goalDetailLabel}>Future Cost:</Text>
                        <Text style={styles.goalDetailValue}>{formatCurrency(goal.future_cost)}</Text>
                      </View>
                      <View style={styles.goalDetailRow}>
                        <Text style={styles.goalDetailLabel}>Monthly Saving:</Text>
                        <Text style={styles.goalDetailValue}>{formatCurrency(goal.monthly_saving)}</Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {!showForm && (
              <Button
                title="+ Add New Goal"
                onPress={() => setShowForm(true)}
                variant="outline"
                fullWidth
              />
            )}

            {showForm && (
              <Card style={styles.formCard}>
                <Text style={styles.formTitle}>✨ New Goal</Text>
                
                <Input
                  label="Goal Name"
                  value={goalName}
                  onChangeText={setGoalName}
                  placeholder="e.g., Home, Car, Vacation"
                  error={errors.goalName}
                />
                
                <Input
                  label="Amount (Today's Cost)"
                  value={goalAmount}
                  onChangeText={setGoalAmount}
                  placeholder="e.g., 500000"
                  keyboardType="numeric"
                  prefix="₹"
                  error={errors.goalAmount}
                />
                
                <Input
                  label="Time Horizon (Years)"
                  value={goalYears}
                  onChangeText={setGoalYears}
                  placeholder="e.g., 5"
                  keyboardType="numeric"
                  error={errors.goalYears}
                />

                <View style={styles.formButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowForm(false)}
                    variant="outline"
                  />
                  <Button
                    title="Add Goal"
                    onPress={handleAddGoal}
                    loading={calculating}
                  />
                </View>
              </Card>
            )}

            <Card style={styles.buddyCard}>
              <View style={styles.buddyContent}>
                <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
                <Text style={styles.buddyText}>
                  Goals are optional! You can always add them later. Skip if you want to finalize your plan first.
                </Text>
              </View>
            </Card>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={goals.length > 0 ? 'Continue to Plan Builder' : 'Skip & Continue'}
            onPress={handleContinue}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.secondary.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
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
    textAlign: 'center',
    lineHeight: 22,
  },
  goalsContainer: {
    marginBottom: Spacing.lg,
  },
  goalsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  goalCard: {
    marginBottom: Spacing.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  goalName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  goalDetails: {
    paddingLeft: Spacing.xl,
  },
  goalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  goalDetailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  goalDetailValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  formButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  buddyCard: {
    backgroundColor: Colors.secondary.lavender,
    marginTop: Spacing.md,
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