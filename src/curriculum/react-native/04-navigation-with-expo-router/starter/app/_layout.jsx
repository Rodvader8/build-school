import { Slot } from 'expo-router';

// The layout wraps every screen in the app/ folder. Slot just drops the current screen in, with no header and no back button.
// Replace it with a <Stack> (from expo-router) that has two <Stack.Screen> children:
//   name="index" with the title "Hotel Marlow", and name="rooms/[id]" with the title "Room details".
// Pass screenOptions={{ headerTintColor: colors.accent }} to the Stack as a constant defined above the component.
export default function RootLayout() {
  return <Slot />;
}
