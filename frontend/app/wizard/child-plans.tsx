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

export default function ChildPlansScreen() {
  const router = useRouter();
  const { calculatedPlan, setCurrentStep } = usePlanStore();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    else if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const handleContinue = () => {
    setCurrentStep(6);
    router.push('/wizard/mutual-funds');
  };

  if (!calculatedPlan || !calculatedPlan.wealth.child_plans || calculatedPlan.wealth.child_plans.length === 0) {
    handleContinue();
    return null;
  }

  const { child_plans } = calculatedPlan.wealth;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={6} total={12} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="school" size={48} color={Colors.primary.dark} />
            </View>
            <Text style={styles.title}>Child Education Plans</Text>
            <Text style={styles.subtitle}>
              Secure your children's future with government schemes
            </Text>
          </View>

          {child_plans.map((plan: any, index: number) => (
            <Card key={index} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planIconContainer}>
                  <Ionicons 
                    name={plan.scheme_name.includes('Sukanya') ? 'ribbon' : 'trophy'} 
                    size={32} 
                    color={Colors.primary.dark} 
                  />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.scheme_name}</Text>
                  <Text style={styles.planBenefit}>
                    {plan.scheme_name.includes('Sukanya') ? '8% returns' : '7.1% returns'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Yearly Deposit</Text>
                <Text style={styles.detailValue}>{formatCurrency(plan.yearly_deposit)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maturity Value</Text>
                <Text style={styles.detailValue}>{formatCurrency(plan.maturity_value)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Years to Maturity</Text>
                <Text style={styles.detailValue}>{plan.years_to_maturity} years</Text>
              </View>

              {plan.scheme_name.includes('Sukanya') && (
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle" size={16} color={Colors.primary.dark} />
                  <Text style={styles.infoText}>
                    Tax benefit under Section 80C up to ₹1.5 lakh
                  </Text>
                </View>
              )}
            </Card>
          ))}

          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Monthly Contribution</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(child_plans.reduce((sum: number, p: any) => sum + p.yearly_deposit, 0) / 12)}
            </Text>
          </Card>

          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                Starting early with child education plans gives maximum returns and tax benefits!
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
  planCard: {
    marginBottom: Spacing.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  planBenefit: {
    fontSize: Typography.fontSize.sm,
    color: Colors.status.success,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.secondary.lightGrey,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary.lavender,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
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