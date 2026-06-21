import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../constants/theme';

export default function DisclaimerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconWrap}>
          <MaterialIcons name="health-and-safety" size={52} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Medical Disclaimer</Text>
        <Text style={styles.subtitle}>Please read carefully before proceeding</Text>

        <View style={styles.card}>
          <DisclaimerItem
            icon="info"
            text="S.T.R.I.D.E. is a personal health and fitness companion designed to support your wellness goals."
          />
          <View style={styles.divider} />
          <DisclaimerItem
            icon="block"
            text="This app does NOT diagnose, treat, cure, or prevent any medical condition or disease."
          />
          <View style={styles.divider} />
          <DisclaimerItem
            icon="block"
            text="This app does NOT replace the advice, diagnosis, or treatment of a qualified medical professional."
          />
          <View style={styles.divider} />
          <DisclaimerItem
            icon="warning"
            text="Always consult your physician before starting any new diet, exercise program, or fasting protocol — especially if you have existing health conditions."
          />
          <View style={styles.divider} />
          <DisclaimerItem
            icon="warning"
            text="Extended fasting, high-intensity exercise, and significant dietary changes can pose serious health risks. Proceed with caution and medical guidance."
          />
          <View style={styles.divider} />
          <DisclaimerItem
            icon="info"
            text="Health data you enter is used only to personalize your experience and is stored locally on your device."
          />
        </View>

        <Text style={styles.notice}>
          By tapping "I Understand & Accept" you acknowledge that you have read, understood, and agree to these terms. You accept full responsibility for your health and safety decisions.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/onboarding/signin')}
        >
          <MaterialIcons name="check-circle" size={20} color={Colors.textInverse} />
          <Text style={styles.acceptText}>I Understand & Accept</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DisclaimerItem({ icon, text }: { icon: keyof typeof MaterialIcons.glyphMap; text: string }) {
  const isBlock = icon === 'block';
  const isWarn = icon === 'warning';
  const color = isBlock ? Colors.danger : isWarn ? Colors.warning : Colors.info;
  return (
    <View style={styles.item}>
      <MaterialIcons name={icon} size={18} color={color} style={styles.itemIcon} />
      <Text style={styles.itemText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary + '18',
    borderWidth: 1.5,
    borderColor: Colors.primary + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  itemIcon: { marginTop: 2 },
  itemText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  notice: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  acceptText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    includeFontPadding: false,
  },
});
