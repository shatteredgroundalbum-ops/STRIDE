import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import type { UserProfile } from '../../store/profileStore';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setProfile } = useApp();
  const [loading, setLoading] = useState(false);

  const handleMockSignIn = async () => {
    setLoading(true);
    // Mock sign-in — creates a basic profile
    await new Promise(r => setTimeout(r, 1200));
    const mockProfile: UserProfile = {
      userId: 'mock_user_001',
      email: 'user@stride.app',
      displayName: 'Athlete',
      age: 35,
      gender: 'Male',
      heightFeet: 5,
      heightInches: 10,
      weightLbs: 185,
      fitnessLevel: 'Novice',
      goal: 'Lose Weight',
      healthConditions: [],
      occupationType: '',
      livingSituation: '',
      cookingAccess: '',
      sleepHours: 7,
      dietStyle: '',
      avoidFoods: [],
      allergies: '',
      selectedSupplements: [],
      takeMultivitamin: false,
      calorieTarget: 1800,
      proteinTarget: 185,
      carbTarget: 150,
      fatTarget: 60,
      waterTargetOz: 93,
      mealFrequency: 3,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await setProfile(mockProfile);
    setLoading(false);
    router.push('/onboarding/goals');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl }]}>
      <StatusBar style="light" />

      <View style={styles.heroBg} />

      <View style={styles.content}>
        <View style={styles.logoGroup}>
          <MaterialIcons name="bolt" size={36} color={Colors.primary} />
          <Text style={styles.logoText}>S.T.R.I.D.E.</Text>
        </View>
        <Text style={styles.tagline}>
          Steps · Tracking · Recovery{'\n'}Intermittent Fasting · Diet · Exercise
        </Text>
        <Text style={styles.description}>
          Your complete personal health companion. Built for real life.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.mockBadge}>
          <MaterialIcons name="info" size={12} color={Colors.warning} />
          <Text style={styles.mockText}>MOCK LOGIN — Google OAuth in production</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.6 }]}
          onPress={handleMockSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <>
              <MaterialIcons name="login" size={20} color={Colors.textInverse} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.legal}>
          By continuing you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoText: {
    fontSize: 36,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: 3,
    includeFontPadding: false,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  mockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.warningMuted,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
  },
  mockText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  googleBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  googleText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    includeFontPadding: false,
  },
  legal: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
