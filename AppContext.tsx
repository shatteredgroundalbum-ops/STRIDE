import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { loadProfile, saveProfile, isOnboardingComplete, setOnboardingComplete, type UserProfile } from '../store/profileStore';
import { loadPlan, savePlan, type GeneratedPlan } from '../store/planStore';

interface AppContextType {
  profile: UserProfile | null;
  plan: GeneratedPlan | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => Promise<void>;
  setPlan: (plan: GeneratedPlan) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [plan, setPlanState] = useState<GeneratedPlan | null>(null);
  const [onboardingComplete, setOnboardingCompleteState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    const [p, pl, oc] = await Promise.all([
      loadProfile(),
      loadPlan(),
      isOnboardingComplete(),
    ]);
    setProfileState(p);
    setPlanState(pl);
    setOnboardingCompleteState(oc);
  }, []);

  useEffect(() => {
    refreshData().finally(() => setIsLoading(false));
  }, [refreshData]);

  const setProfile = useCallback(async (p: UserProfile) => {
    await saveProfile(p);
    setProfileState(p);
  }, []);

  const setPlan = useCallback(async (pl: GeneratedPlan) => {
    await savePlan(pl);
    setPlanState(pl);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingComplete();
    setOnboardingCompleteState(true);
    await refreshData();
  }, [refreshData]);

  const signOut = useCallback(async () => {
    const { clearAllData } = await import('../store/profileStore');
    await clearAllData();
    setProfileState(null);
    setPlanState(null);
    setOnboardingCompleteState(false);
  }, []);

  return (
    <AppContext.Provider value={{
      profile, plan, onboardingComplete, isLoading,
      setProfile, setPlan, completeOnboarding, refreshData, signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
