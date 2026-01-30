import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const apiService = {
  async calculatePlan(profileData: any) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/calculate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating plan:', error);
      throw error;
    }
  },

  async savePlan(planData: any) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving plan:', error);
      throw error;
    }
  },

  async getUserPlans(userId: string) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/plans/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  async calculateGoal(goalData: { amount_today: number; years: number }) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/calculate-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating goal:', error);
      throw error;
    }
  },

  async getSchemeRates() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/scheme-rates`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching scheme rates:', error);
      throw error;
    }
  },
};
