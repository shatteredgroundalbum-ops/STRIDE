import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontSize, FontWeight } from '../../constants/theme';

interface FastingRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  elapsedLabel: string;
  subLabel?: string;
  color?: string;
}

export function FastingRing({
  progress,
  size = 240,
  strokeWidth = 12,
  elapsedLabel,
  subLabel,
  color = Colors.primary,
}: FastingRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * Math.min(1, Math.max(0, progress));
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center},${center}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.elapsed, { color }]}>{elapsedLabel}</Text>
        {subLabel ? <Text style={styles.sub}>{subLabel}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  elapsed: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    includeFontPadding: false,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: FontWeight.medium,
    includeFontPadding: false,
  },
});
