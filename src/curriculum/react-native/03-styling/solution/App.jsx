import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text } from 'react-native';
import RoomCard from './components/RoomCard';
import { rooms } from './data/rooms';
import { colors } from './theme';

export default function App() {
  return (
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
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 16 },
});
