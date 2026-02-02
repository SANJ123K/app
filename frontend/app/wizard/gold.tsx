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

export default function GoldScreen() {
  const router = useRouter();
  const { calculatedPlan, setCurrentStep } = usePlanStore();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const handleContinue = () => {
    setCurrentStep(8);
    router.push('/wizard/goals');
  };

  if (!calculatedPlan) return null;

  const { gold } = calculatedPlan.wealth;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={8} total={12} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="diamond" size={48} color={Colors.accent.gold} />
            </View>
            <Text style={styles.title}>Gold Investment</Text>
            <Text style={styles.subtitle}>
              Balancing risk with stable asset allocation
            </Text>
          </View>

          <Card style={styles.amountCard}>
            <Text style={styles.amountLabel}>Monthly Gold Investment</Text>
            <Text style={styles.amountValue}>{formatCurrency(gold.monthly_amount)}</Text>
            <Text style={styles.amountSubtext}>{gold.percentage}% of portfolio</Text>
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>✨ Why Gold?</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="shield" size={20} color={Colors.accent.gold} />
              <Text style={styles.benefitText}>Hedge against inflation</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="bar-chart" size={20} color={Colors.accent.gold} />
              <Text style={styles.benefitText}>Portfolio diversification</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trending-up" size={20} color={Colors.accent.gold} />
              <Text style={styles.benefitText}>Stable long-term value</Text>
            </View>
          </Card>

          <Card style={styles.methodCard}>
            <Text style={styles.methodTitle}>💼 How to Invest</Text>
            <View style={styles.methodItem}>
              <Text style={styles.methodName}>Digital Gold</Text>
              <Text style={styles.methodDesc}>Buy/sell anytime, stored securely</Text>
            </View>
            <View style={styles.methodItem}>
              <Text style={styles.methodName}>Gold ETF</Text>
              <Text style={styles.methodDesc}>Stock market traded, liquid</Text>
            </View>
            <View style={styles.methodItem}>
              <Text style={styles.methodName}>Sovereign Gold Bonds</Text>
              <Text style={styles.methodDesc}>Government backed, 2.5% interest</Text>
            </View>
          </Card>

          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                Gold helps balance risk in your portfolio during market volatility.
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
    backgroundColor: '#FEF3C7',
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
    color: Colors.accent.gold,
  },
  amountSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  infoCard: {
    backgroundColor: '#FEF3C7',
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
  methodCard: {
    marginBottom: Spacing.md,
  },
  methodTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  methodItem: {
    marginBottom: Spacing.md,
  },
  methodName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  methodDesc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
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