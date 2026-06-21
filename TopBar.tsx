import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '../../constants/theme';

interface TopBarProps {
  userName?: string;
  avatarUrl?: string;
  onAvatarPress?: () => void;
}

export function TopBar({ userName, onAvatarPress }: TopBarProps) {
  const initials = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <View style={styles.bar}>
      {/* Logo */}
      <View style={styles.logoGroup}>
        <MaterialIcons name="bolt" size={22} color={Colors.primary} />
        <View>
          <Text style={styles.logoText}>S.T.R.I.D.E.</Text>
          <Text style={styles.logoSub}>Health Companion</Text>
        </View>
      </View>

      {/* Avatar */}
      <Pressable
        style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.7 }]}
        onPress={onAvatarPress}
        hitSlop={8}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  logoSub: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '22',
    borderWidth: 1.5,
    borderColor: Colors.primary + '44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    includeFontPadding: false,
  },
});
