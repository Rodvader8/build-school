import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Every screen is a component, the same as in React for the web. The difference is the building blocks:
// View and Text instead of div and p. They become real native views on a phone, and web elements in a browser.
export default function App() {
  return (
    <View style={styles.screen}>
      <Text role="heading" aria-level={1} style={styles.title}>Hotel Marlow</Text>
      <Text testID="tagline" style={styles.tagline}>Quiet rooms, a short walk from the harbour.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f7f5f0' },
  title: { fontSize: 32, fontWeight: '700', color: '#1d2433' },
  tagline: { marginTop: 8, fontSize: 16, color: '#4a5368', textAlign: 'center' },
});
