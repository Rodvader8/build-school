import { Stack } from 'expo-router';
import { colors } from '../theme';

const screenOptions = { headerTintColor: colors.accent };

// The layout wraps every screen in the app/ folder. A Stack gives you a header and a back button that slide screens on and off,
// the way phone apps normally navigate.
export default function RootLayout() {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Hotel Marlow' }} />
      <Stack.Screen name="rooms/[id]" options={{ title: 'Room details' }} />
    </Stack>
  );
}
