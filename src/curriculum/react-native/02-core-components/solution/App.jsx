import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text } from 'react-native';
import RoomCard from './components/RoomCard';
import { rooms } from './data/rooms';

export default function App() {
  return (
    // A View never scrolls by itself. ScrollView is the one that does, so a long list of cards stays reachable on a small screen.
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text role="heading" aria-level={1} style={styles.title}>Rooms</Text>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f5f0' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1d2433', marginBottom: 16 },
});
