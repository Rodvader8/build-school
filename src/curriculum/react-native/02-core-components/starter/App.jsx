import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RoomCard from './components/RoomCard';
import { rooms } from './data/rooms';

// A View doesn't scroll. With three rooms it already runs off a phone's screen.
// Swap the outer View for a ScrollView (keep the styles: style={styles.screen} contentContainerStyle={styles.content}).
export default function App() {
  return (
    <View style={styles.screen}>
      <Text role="heading" aria-level={1} style={styles.title}>Rooms</Text>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f5f0', padding: 20 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1d2433', marginBottom: 16 },
});
