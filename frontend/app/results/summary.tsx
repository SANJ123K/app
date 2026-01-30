import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlanStore } from '../../store/planStore';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function SummaryScreen() {
  const router = useRouter();
  const { userId, profile, calculatedPlan, goals } = usePlanStore();
  const [saving, setSaving] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const handleSavePlan = async () => {
    setSaving(true);
    try {
      const planData = {
        user_id: userId,
        profile,
        protection: calculatedPlan.protection,
        wealth: calculatedPlan.wealth,
        goals: { goals },
        total_monthly_savings: calculatedPlan.total_monthly_savings,
      };

      await apiService.savePlan(planData);
      Alert.alert(
        'Plan Saved!',
        'Your 20-year financial plan has been saved successfully.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!calculatedPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>No plan data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { protection, wealth } = calculatedPlan;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={Colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Ionicons name="checkmark-circle" size={48} color={Colors.accent.gold} />
            <Text style={styles.headerTitle}>Your 20-Year Plan</Text>
            <Text style={styles.headerSubtitle}>
              A realistic and adjustable financial roadmap
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Total Monthly Savings */}
          <Card style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Monthly Savings Required</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(calculatedPlan.total_monthly_savings)}
            </Text>
            <Text style={styles.totalSubtext}>
              {((calculatedPlan.total_monthly_savings / profile.monthly_income!) * 100).toFixed(1)}% of your income
            </Text>
          </Card>

          {/* Protection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="shield" size={20} color={Colors.primary.dark} /> Protection
            </Text>
            
            <ChecklistItem
              icon="shield-checkmark"
              title="Term Insurance"
              value={formatCurrency(protection.term_insurance.cover_amount)}
              subtitle={`Cover till age ${profile.age! + protection.term_insurance.tenure}`}
            />
            
            <ChecklistItem
              icon="fitness"
              title="Health Insurance"
              value={formatCurrency(protection.health_insurance.cover_amount)}
              subtitle={`${protection.health_insurance.family_size} family members`}
            />
          </View>

          {/* Emergency Fund */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="umbrella" size={20} color={Colors.primary.dark} /> Emergency Fund
            </Text>
            
            <ChecklistItem
              icon="wallet"
              title="Safety Net"
              value={formatCurrency(wealth.emergency_fund.required_amount)}
              subtitle="6 months of expenses"
            />
          </View>

          {/* Retirement */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="time" size={20} color={Colors.primary.dark} /> Retirement
            </Text>
            
            <ChecklistItem
              icon="trending-up"
              title="NPS Contribution"
              value={`${formatCurrency(wealth.nps_plan.monthly_contribution)}/month`}
              subtitle={`Target: ${formatCurrency(wealth.nps_plan.target_corpus)}`}
            />
          </View>

          {/* Child Plans */}
          {wealth.child_plans && wealth.child_plans.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="school" size={20} color={Colors.primary.dark} /> Child Education
              </Text>
              
              {wealth.child_plans.map((plan: any, index: number) => (
                <ChecklistItem
                  key={index}
                  icon="ribbon"
                  title={plan.scheme_name}
                  value={formatCurrency(plan.maturity_value)}
                  subtitle={`${formatCurrency(plan.yearly_deposit)}/year`}
                />
              ))}
            </View>
          )}

          {/* Wealth Building */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="bar-chart" size={20} color={Colors.primary.dark} /> Wealth Building
            </Text>
            
            <ChecklistItem
              icon="pulse"
              title="Mutual Funds"
              value={`${formatCurrency(wealth.mutual_funds.monthly_sip)}/month`}
              subtitle={`60% Index + 40% Active | Target: ${formatCurrency(wealth.mutual_funds.projected_value)}`}
            />
            
            <ChecklistItem
              icon="diamond"
              title="Gold"
              value={`${formatCurrency(wealth.gold.monthly_amount)}/month`}
              subtitle={`${wealth.gold.percentage}% allocation`}
            />
            
            {wealth.stocks && wealth.stocks.monthly_amount > 0 && (
              <ChecklistItem
                icon="rocket"
                title="Stocks (Optional)"
                value={`${formatCurrency(wealth.stocks.monthly_amount)}/month`}
                subtitle="High risk - market linked"
                warning
              />
            )}
          </View>

          {/* Goals */}
          {goals.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="flag" size={20} color={Colors.primary.dark} /> Your Goals
              </Text>
              
              {goals.map((goal: any) => (
                <ChecklistItem
                  key={goal.goal_id}
                  icon="star"
                  title={goal.name}
                  value={formatCurrency(goal.future_cost)}
                  subtitle={`${formatCurrency(goal.monthly_saving)}/month for ${goal.time_horizon} years`}
                />
              ))}
            </View>
          )}

          {/* Buddy Message */}
          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={32} color={Colors.primary.dark} />
              <View style={styles.buddyTextContainer}>
                <Text style={styles.buddyText}>
                  This plan is realistic and adjustable anytime!
                </Text>
                <Text style={styles.buddySubtext}>
                  Review and update quarterly for best results.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.footer}>
        <Button
          title={saving ? 'Saving...' : 'Save Plan'}
          onPress={handleSavePlan}
          fullWidth
          loading={saving}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/wizard/profile')}
        >
          <Text style={styles.editButtonText}>Edit Plan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface ChecklistItemProps {
  icon: any;
  title: string;
  value: string;
  subtitle?: string;
  warning?: boolean;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  icon,
  title,
  value,
  subtitle,
  warning,
}) => (
  <Card style={[styles.checklistItem, warning && styles.warningItem]}>
    <View style={styles.itemLeft}>
      <View style={[styles.itemIcon, warning && styles.warningIcon]}>
        <Ionicons name={icon} size={24} color={warning ? Colors.status.warning : Colors.primary.dark} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Text style={styles.itemValue}>{value}</Text>
  </Card>
);

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
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.background.white,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.background.white,
    opacity: 0.9,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.md,
    marginTop: -Spacing.lg,
  },
  totalCard: {
    backgroundColor: Colors.background.white,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  totalLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  totalAmount: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
  },
  totalSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  warningItem: {
    backgroundColor: '#FEF3C7',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  warningIcon: {
    backgroundColor: Colors.status.warning,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  itemSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  itemValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.dark,
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
  buddyTextContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  buddyText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  buddySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary.lightGrey,
  },
  editButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.dark,
  },
});