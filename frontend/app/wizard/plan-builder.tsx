import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlanStore } from '../../store/planStore';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function PlanBuilderScreen() {
  const router = useRouter();
  const { profile, calculatedPlan, priorities, setPriority } = usePlanStore();
  const [customizedTotal, setCustomizedTotal] = useState(0);

  useEffect(() => {
    calculateCustomizedTotal();
  }, [priorities, calculatedPlan]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    else if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const calculateCustomizedTotal = () => {
    if (!calculatedPlan) return;

    const { protection, wealth } = calculatedPlan;
    let total = 0;

    if (priorities.term_insurance) {
      total += protection.term_insurance.yearly_cost / 12;
    }
    if (priorities.health_insurance) {
      total += protection.health_insurance.yearly_cost / 12;
    }
    if (priorities.emergency_fund) {
      total += wealth.emergency_fund.monthly_contribution;
    }
    if (priorities.nps) {
      total += wealth.nps_plan.monthly_contribution;
    }
    if (priorities.child_plans && wealth.child_plans.length > 0) {
      total += wealth.child_plans.reduce((sum: number, plan: any) => sum + plan.yearly_deposit, 0) / 12;
    }
    if (priorities.mutual_funds) {
      total += wealth.mutual_funds.monthly_sip;
    }
    if (priorities.gold) {
      total += wealth.gold.monthly_amount;
    }
    if (priorities.stocks && wealth.stocks) {
      total += wealth.stocks.monthly_amount;
    }

    setCustomizedTotal(total);
  };

  const handleContinue = () => {
    if (!calculatedPlan) return;

    const availableSavings = calculatedPlan.available_monthly_savings;
    const affordability = calculatedPlan.affordability;

    if (customizedTotal > availableSavings) {
      Alert.alert(
        'Budget Exceeded',
        `Your customized plan (${formatCurrency(customizedTotal)}) exceeds your available savings (${formatCurrency(availableSavings)}). Consider adjusting priorities.`,
        [
          { text: 'Adjust Plan', style: 'cancel' },
          { text: 'Continue Anyway', onPress: () => router.push('/results/summary') }
        ]
      );
    } else {
      router.push('/results/summary');
    }
  };

  if (!calculatedPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>Loading plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { protection, wealth, available_monthly_savings, affordability } = calculatedPlan;
  const isAffordable = customizedTotal <= available_monthly_savings;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={Colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Ionicons name="construct" size={40} color={Colors.accent.gold} />
            <Text style={styles.headerTitle}>Customize Your Plan</Text>
            <Text style={styles.headerSubtitle}>
              Select priorities based on your goals
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Affordability Summary */}
          <Card style={[styles.summaryCard, !isAffordable && styles.warningCard]}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryLabel}>Available Monthly Savings</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(available_monthly_savings)}</Text>
              </View>
              <Ionicons
                name={isAffordable ? "checkmark-circle" : "alert-circle"}
                size={40}
                color={isAffordable ? Colors.status.success : Colors.status.warning}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryLabel}>Selected Plan Total</Text>
                <Text style={[styles.summaryAmount, !isAffordable && styles.warningText]}>
                  {formatCurrency(customizedTotal)}
                </Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryPercent}>
                  {((customizedTotal / available_monthly_savings) * 100).toFixed(0)}%
                </Text>
              </View>
            </View>

            {!isAffordable && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color={Colors.status.warning} />
                <Text style={styles.warningBoxText}>
                  Plan exceeds budget by {formatCurrency(customizedTotal - available_monthly_savings)}
                </Text>
              </View>
            )}
          </Card>

          {/* Affordability Suggestions */}
          {affordability && affordability.suggestions && affordability.suggestions.length > 0 && (
            <Card style={styles.suggestionsCard}>
              <Text style={styles.suggestionsTitle}>💡 Smart Suggestions</Text>
              {affordability.suggestions.map((suggestion: any, index: number) => (
                <View key={index} style={styles.suggestionItem}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(suggestion.priority) }]}>
                    <Text style={styles.priorityBadgeText}>{suggestion.priority.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.suggestionText}>{suggestion.message}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Priority Selection */}
          <Text style={styles.sectionTitle}>Select Your Priorities</Text>

          {/* Protection Section */}
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>🛡️ Protection (Essential)</Text>
            
            <PriorityCard
              icon="shield-checkmark"
              title="Term Insurance"
              amount={protection.term_insurance.yearly_cost / 12}
              subtitle={`${formatCurrency(protection.term_insurance.cover_amount)} cover`}
              enabled={priorities.term_insurance}
              onToggle={(val) => setPriority('term_insurance', val)}
              essential
            />
            
            <PriorityCard
              icon="fitness"
              title="Health Insurance"
              amount={protection.health_insurance.yearly_cost / 12}
              subtitle={`${formatCurrency(protection.health_insurance.cover_amount)} family cover`}
              enabled={priorities.health_insurance}
              onToggle={(val) => setPriority('health_insurance', val)}
              essential
            />
          </View>

          {/* Emergency & Retirement */}
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>💰 Savings & Retirement (Important)</Text>
            
            <PriorityCard
              icon="umbrella"
              title="Emergency Fund"
              amount={wealth.emergency_fund.monthly_contribution}
              subtitle="6 months expenses"
              enabled={priorities.emergency_fund}
              onToggle={(val) => setPriority('emergency_fund', val)}
              essential
            />
            
            <PriorityCard
              icon="trending-up"
              title="Retirement (NPS)"
              amount={wealth.nps_plan.monthly_contribution}
              subtitle={`Target: ${formatCurrency(wealth.nps_plan.target_corpus)}`}
              enabled={priorities.nps}
              onToggle={(val) => setPriority('nps', val)}
            />
          </View>

          {/* Child Plans */}
          {wealth.child_plans && wealth.child_plans.length > 0 && (
            <View style={styles.category}>
              <Text style={styles.categoryTitle}>🎓 Child Education</Text>
              
              <PriorityCard
                icon="school"
                title="Child Education Plans"
                amount={wealth.child_plans.reduce((sum: number, p: any) => sum + p.yearly_deposit, 0) / 12}
                subtitle={wealth.child_plans.map((p: any) => p.scheme_name).join(', ')}
                enabled={priorities.child_plans}
                onToggle={(val) => setPriority('child_plans', val)}
              />
            </View>
          )}

          {/* Wealth Building */}
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>📈 Wealth Building (Optional)</Text>
            
            <PriorityCard
              icon="pulse"
              title="Mutual Funds"
              amount={wealth.mutual_funds.monthly_sip}
              subtitle="60% Index + 40% Active"
              enabled={priorities.mutual_funds}
              onToggle={(val) => setPriority('mutual_funds', val)}
            />
            
            <PriorityCard
              icon="diamond"
              title="Gold"
              amount={wealth.gold.monthly_amount}
              subtitle="7.5% allocation"
              enabled={priorities.gold}
              onToggle={(val) => setPriority('gold', val)}
            />
            
            {wealth.stocks && wealth.stocks.monthly_amount > 0 && (
              <PriorityCard
                icon="rocket"
                title="Stocks"
                amount={wealth.stocks.monthly_amount}
                subtitle="High risk - market linked"
                enabled={priorities.stocks}
                onToggle={(val) => setPriority('stocks', val)}
              />
            )}
          </View>

          {/* Buddy Message */}
          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={28} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                {isAffordable 
                  ? "Great! Your plan fits your budget. You can always adjust later."
                  : "Consider prioritizing essentials first. You can add more as your income grows!"}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerLabel}>Monthly Commitment:</Text>
          <Text style={[styles.footerAmount, !isAffordable && styles.warningText]}>
            {formatCurrency(customizedTotal)}
          </Text>
        </View>
        <Button title="Continue to Summary" onPress={handleContinue} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical': return '#EF4444';
    case 'high': return '#F59E0B';
    case 'medium': return '#3B82F6';
    case 'low': return '#10B981';
    default: return Colors.text.secondary;
  }
};

interface PriorityCardProps {
  icon: any;
  title: string;
  amount: number;
  subtitle: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  essential?: boolean;
}

const PriorityCard: React.FC<PriorityCardProps> = ({
  icon,
  title,
  amount,
  subtitle,
  enabled,
  onToggle,
  essential,
}) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    else if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  return (
    <Card style={[styles.priorityCard, !enabled && styles.disabledCard]}>
      <View style={styles.priorityLeft}>
        <View style={[styles.priorityIcon, !enabled && styles.disabledIcon]}>
          <Ionicons name={icon} size={24} color={enabled ? Colors.primary.dark : Colors.text.light} />
        </View>
        <View style={styles.priorityInfo}>
          <Text style={[styles.priorityTitle, !enabled && styles.disabledText]}>{title}</Text>
          <Text style={[styles.prioritySubtitle, !enabled && styles.disabledText]}>{subtitle}</Text>
          {essential && <Text style={styles.essentialBadge}>Essential</Text>}
        </View>
      </View>
      <View style={styles.priorityRight}>
        <Text style={[styles.priorityAmount, !enabled && styles.disabledText]}>
          {formatCurrency(amount)}/mo
        </Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: Colors.secondary.lightGrey, true: Colors.primary.light }}
          thumbColor={enabled ? Colors.primary.dark : Colors.text.light}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  headerGradient: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background.white,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.background.white,
    opacity: 0.9,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.md,
    marginTop: -Spacing.md,
  },
  summaryCard: {
    marginBottom: Spacing.md,
  },
  warningCard: {
    borderWidth: 2,
    borderColor: Colors.status.warning,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
  },
  warningText: {
    color: Colors.status.warning,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryPercent: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.secondary.lightGrey,
    marginVertical: Spacing.md,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  warningBoxText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  suggestionsCard: {
    backgroundColor: Colors.secondary.lavender,
    marginBottom: Spacing.md,
  },
  suggestionsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background.white,
  },
  suggestionText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  category: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  priorityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  disabledCard: {
    opacity: 0.5,
  },
  priorityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  disabledIcon: {
    backgroundColor: Colors.secondary.lightGrey,
  },
  priorityInfo: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  prioritySubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  disabledText: {
    color: Colors.text.light,
  },
  essentialBadge: {
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.status.success,
    marginTop: 2,
  },
  priorityRight: {
    alignItems: 'flex-end',
  },
  priorityAmount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
    marginBottom: Spacing.xs,
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
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary.lightGrey,
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  footerLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  footerAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
  },
});
