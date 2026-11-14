import { Stack } from 'expo-router';
import { colors } from '../theme';

const screenOptions = { headerTintColor: colors.accent };

export default function RootLayout() {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Hotel Marlow' }} />
    </Stack>
  );
}
