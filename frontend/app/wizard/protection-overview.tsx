import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlanStore } from '../../store/planStore';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { apiService } from '../../services/api';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function ProtectionOverviewScreen() {
  const router = useRouter();
  const { profile, setCalculatedPlan, setCurrentStep } = usePlanStore();
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<any>(null);

  useEffect(() => {
    calculatePlan();
  }, []);

  const calculatePlan = async () => {
    setLoading(true);
    try {
      const result = await apiService.calculatePlan(profile);
      setPlanData(result);
      setCalculatedPlan(result);
    } catch (error) {
      console.error('Failed to calculate plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setCurrentStep(3);
    router.push('/wizard/emergency-fund');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.dark} />
          <Text style={styles.loadingText}>Calculating your plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={3} total={9} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>First, let's protect your family</Text>
            <Text style={styles.subtitle}>
              Financial protection is the foundation of your plan
            </Text>
          </View>

          {planData && (
            <>
              {/* Term Insurance Card */}
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="shield-checkmark" size={32} color={Colors.primary.dark} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>Term Insurance</Text>
                    <Text style={styles.cardStatus}>Recommended</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cover Amount</Text>
                  <Text style={styles.detailValue}>
                    ₹{(planData.protection.term_insurance.cover_amount / 100000).toFixed(1)}L
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tenure</Text>
                  <Text style={styles.detailValue}>
                    {planData.protection.term_insurance.tenure} years
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Yearly Cost</Text>
                  <Text style={styles.detailValue}>
                    ₹{(planData.protection.term_insurance.yearly_cost / 1000).toFixed(1)}K
                  </Text>
                </View>
                
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle" size={16} color={Colors.primary.dark} />
                  <Text style={styles.infoText}>
                    This replaces your income if something happens
                  </Text>
                </View>
              </Card>

              {/* Health Insurance Card */}
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="fitness" size={32} color={Colors.primary.dark} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>Health Insurance</Text>
                    <Text style={styles.cardStatus}>Recommended</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cover Amount</Text>
                  <Text style={styles.detailValue}>
                    ₹{(planData.protection.health_insurance.cover_amount / 100000).toFixed(0)}L
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Family Size</Text>
                  <Text style={styles.detailValue}>
                    {planData.protection.health_insurance.family_size} members
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Yearly Cost</Text>
                  <Text style={styles.detailValue}>
                    ₹{(planData.protection.health_insurance.yearly_cost / 1000).toFixed(1)}K
                  </Text>
                </View>
                
                <View style={styles.tipBox}>
                  <Text style={styles.tipTitle}>Tips:</Text>
                  <Text style={styles.tipText}>• Choose room rent flexibility</Text>
                  <Text style={styles.tipText}>• Opt for family floater</Text>
                  <Text style={styles.tipText}>• Prefer fewer restrictions</Text>
                </View>
              </Card>
            </>
          )}

          {/* Buddy Message */}
          <Card style={styles.buddyCard}>
            <View style={styles.buddyContent}>
              <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.dark} />
              <Text style={styles.buddyText}>
                Protection first! Once secured, we'll build your wealth.
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <Button
          title="View Full Plan"
          onPress={handleContinue}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
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
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  cardStatus: {
    fontSize: Typography.fontSize.sm,
    color: Colors.status.success,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.secondary.lightGrey,
    marginVertical: Spacing.md,
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
  tipBox: {
    backgroundColor: Colors.background.main,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
  },
  tipTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  tipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
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