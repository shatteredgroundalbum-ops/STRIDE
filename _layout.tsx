import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="disclaimer" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="about" />
      <Stack.Screen name="health" />
      <Stack.Screen name="lifestyle" />
      <Stack.Screen name="diet" />
      <Stack.Screen name="supplements" />
      <Stack.Screen name="nutrition" />
      <Stack.Screen name="generating" />
    </Stack>
  );
}
