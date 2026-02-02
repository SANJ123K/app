import { create } from 'zustand';

interface ProfileData {
  age: number | null;
  monthly_income: number | null;
  monthly_expenses: number | null;
  family_size: number | null;
  has_dependents: boolean;
  risk_comfort: string;
  has_daughter: boolean;
  daughter_age: number | null;
  has_son: boolean;
  son_age: number | null;
}

interface PrioritySelection {
  emergency_fund: boolean;
  term_insurance: boolean;
  health_insurance: boolean;
  nps: boolean;
  child_plans: boolean;
  mutual_funds: boolean;
  gold: boolean;
  stocks: boolean;
}

interface PlanState {
  userId: string;
  currentStep: number;
  profile: ProfileData;
  calculatedPlan: any;
  goals: any[];
  priorities: PrioritySelection;
  editingComponent: string | null;
  
  setUserId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  setCalculatedPlan: (plan: any) => void;
  addGoal: (goal: any) => void;
  updateGoal: (goalId: string, data: any) => void;
  deleteGoal: (goalId: string) => void;
  setPriority: (component: string, enabled: boolean) => void;
  setEditingComponent: (component: string | null) => void;
  resetPlan: () => void;
}

const initialProfile: ProfileData = {
  age: null,
  monthly_income: null,
  monthly_expenses: null,
  family_size: null,
  has_dependents: false,
  risk_comfort: 'Medium',
  has_daughter: false,
  daughter_age: null,
  has_son: false,
  son_age: null,
};

const initialPriorities: PrioritySelection = {
  emergency_fund: true,
  term_insurance: true,
  health_insurance: true,
  nps: true,
  child_plans: true,
  mutual_funds: true,
  gold: true,
  stocks: false,
};

export const usePlanStore = create<PlanState>((set) => ({
  userId: 'user_' + Date.now(), // Generate a unique user ID
  currentStep: 0,
  profile: initialProfile,
  calculatedPlan: null,
  goals: [],
  priorities: initialPriorities,
  editingComponent: null,
  
  setUserId: (id) => set({ userId: id }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateProfile: (data) => set((state) => ({
    profile: { ...state.profile, ...data }
  })),
  
  setCalculatedPlan: (plan) => set({ calculatedPlan: plan }),
  
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal]
  })),
  
  updateGoal: (goalId, data) => set((state) => ({
    goals: state.goals.map(g => g.goal_id === goalId ? { ...g, ...data } : g)
  })),
  
  deleteGoal: (goalId) => set((state) => ({
    goals: state.goals.filter(g => g.goal_id !== goalId)
  })),
  
  setPriority: (component, enabled) => set((state) => ({
    priorities: { ...state.priorities, [component]: enabled }
  })),
  
  setEditingComponent: (component) => set({ editingComponent: component }),
  
  resetPlan: () => set({
    currentStep: 0,
    profile: initialProfile,
    calculatedPlan: null,
    goals: [],
    priorities: initialPriorities,
    editingComponent: null,
  }),
}));
