import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DoorCodeCard from './components/DoorCodeCard';
import { colors } from './theme';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text role="heading" aria-level={1} style={styles.title}>Late arrivals</Text>
      <DoorCodeCard code="4821" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 16 },
});
