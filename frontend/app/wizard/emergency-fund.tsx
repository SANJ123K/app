import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '../../store/planStore';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function EmergencyFundScreen() {
  const router = useRouter();
  const { calculatedPlan, setCurrentStep } = usePlanStore();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const handleContinue = () => {
    setCurrentStep(4);
    router.push('/wizard/retirement');
  };

  if (!calculatedPlan) return null;

  const { emergency_fund } = calculatedPlan.wealth;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={4} total={12} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="umbrella" size={48} color={Colors.primary.dark} />
            </View>
            <Text style={styles.title}>Your Safety Net</Text>
            <Text style={styles.subtitle}>
              Emergency fund protects you from unexpected expenses
            </Text>
          </View>

          <Card style={styles.amountCard}>
            <Text style={styles.amountLabel}>Required Emergency Fund</Text>
            <Text style={styles.amountValue}>{formatCurrency(emergency_fund.required_amount)}</Text>
            <Text style={styles.amountSubtext}>6 months of expenses</Text>
          </Card>

          <Card style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Monthly Contribution</Text>
              <Text style={styles.detailValue}>{formatCurrency(emergency_fund.monthly_contribution)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time to Build</Text>
              <Text style={styles.detailValue}>12 months</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Where to Keep It</Text>
            {emergency_fund.tools.map((tool: string, index: number) => (
              <View key={index} style={styles.toolItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
                <Text style={styles.toolText}>{tool}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                This protects you from sudden expenses like medical emergencies or job loss.
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
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
  amountCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  amountValue: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
  },
  amountSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  detailCard: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  infoCard: {
    backgroundColor: Colors.secondary.lavender,
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  toolText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  buddyCard: {
    backgroundColor: Colors.secondary.lavender,
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