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

export default function RetirementScreen() {
  const router = useRouter();
  const { profile, calculatedPlan, setCurrentStep } = usePlanStore();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    else if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const handleContinue = () => {
    setCurrentStep(5);
    if (profile.has_daughter || profile.has_son) {
      router.push('/wizard/child-plans');
    } else {
      router.push('/wizard/mutual-funds');
    }
  };

  if (!calculatedPlan) return null;

  const { nps_plan } = calculatedPlan.wealth;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={5} total={12} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={48} color={Colors.primary.dark} />
            </View>
            <Text style={styles.title}>Retirement Planning</Text>
            <Text style={styles.subtitle}>
              Secure your golden years with NPS
            </Text>
          </View>

          <Card style={styles.amountCard}>
            <Text style={styles.amountLabel}>Target Retirement Corpus</Text>
            <Text style={styles.amountValue}>{formatCurrency(nps_plan.target_corpus)}</Text>
            <Text style={styles.amountSubtext}>At age 60</Text>
          </Card>

          <Card style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Monthly NPS Contribution</Text>
              <Text style={styles.detailValue}>{formatCurrency(nps_plan.monthly_contribution)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Years to Retirement</Text>
              <Text style={styles.detailValue}>{nps_plan.years_to_retirement} years</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expected Returns</Text>
              <Text style={styles.detailValue}>10% per year</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>✨ NPS Benefits</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
              <Text style={styles.benefitText}>Tax benefit up to ₹2 lakh/year</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
              <Text style={styles.benefitText}>Market-linked growth potential</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
              <Text style={styles.benefitText}>Low cost, government backed</Text>
            </View>
          </Card>

          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                Starting early gives you the power of compounding. Even small amounts grow significantly!
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
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    flex: 1,
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