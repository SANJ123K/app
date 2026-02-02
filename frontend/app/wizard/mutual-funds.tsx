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

export default function MutualFundsScreen() {
  const router = useRouter();
  const { calculatedPlan, setCurrentStep } = usePlanStore();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    else if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const handleContinue = () => {
    setCurrentStep(7);
    router.push('/wizard/gold');
  };

  if (!calculatedPlan) return null;

  const { mutual_funds } = calculatedPlan.wealth;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={7} total={12} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="trending-up" size={48} color={Colors.primary.dark} />
            </View>
            <Text style={styles.title}>Mutual Funds (SIP)</Text>
            <Text style={styles.subtitle}>
              Systematic wealth building for long-term growth
            </Text>
          </View>

          <Card style={styles.amountCard}>
            <Text style={styles.amountLabel}>Monthly SIP Amount</Text>
            <Text style={styles.amountValue}>{formatCurrency(mutual_funds.monthly_sip)}</Text>
            <Text style={styles.amountSubtext}>Suggested allocation</Text>
          </Card>

          <Card style={styles.allocationCard}>
            <Text style={styles.allocationTitle}>📊 Portfolio Split</Text>
            <View style={styles.allocationItem}>
              <View style={styles.allocationLeft}>
                <View style={[styles.allocationDot, { backgroundColor: Colors.primary.dark }]} />
                <Text style={styles.allocationLabel}>Index Funds (60%)</Text>
              </View>
              <Text style={styles.allocationValue}>{formatCurrency(mutual_funds.index_allocation)}</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={styles.allocationLeft}>
                <View style={[styles.allocationDot, { backgroundColor: Colors.accent.gold }]} />
                <Text style={styles.allocationLabel}>Active Funds (40%)</Text>
              </View>
              <Text style={styles.allocationValue}>{formatCurrency(mutual_funds.active_allocation)}</Text>
            </View>
          </Card>

          <Card style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expected Returns</Text>
              <Text style={styles.detailValue}>{mutual_funds.expected_return}% per year</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>20-Year Projection</Text>
              <Text style={styles.detailValue}>{formatCurrency(mutual_funds.projected_value)}</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>✨ Why Mutual Funds?</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
              <Text style={styles.benefitText}>Professional fund management</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
              <Text style={styles.benefitText}>Diversification across stocks</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
              <Text style={styles.benefitText}>Compounding over time</Text>
            </View>
          </Card>

          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                SIPs work great! Invest regularly regardless of market ups and downs.
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
  allocationCard: {
    backgroundColor: Colors.secondary.lavender,
    marginBottom: Spacing.md,
  },
  allocationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  allocationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  allocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  allocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  allocationLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  allocationValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
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