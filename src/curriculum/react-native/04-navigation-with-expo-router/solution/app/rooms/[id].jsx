import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { rooms } from '../../data/rooms';
import { colors } from '../../theme';

// A file name in square brackets is a parameter. /rooms/loft gives this screen { id: 'loft' }.
export default function RoomDetails() {
  const { id } = useLocalSearchParams();
  const room = rooms.find((r) => r.id === id);

  // Anyone can type any address, so a missing room is a normal case, not a crash.
  if (!room) {
    return (
      <View style={styles.screen}>
        <Text style={styles.body}>Room not found</Text>
        <Link href="/" style={styles.link}>Back to all rooms</Link>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* A Stack.Screen with no name sets the header for the screen it's inside. */}
      <Stack.Screen options={{ title: room.name }} />
      <Text role="heading" aria-level={1} style={styles.title}>{room.name}</Text>
      <Text style={styles.body}>{room.description}</Text>
      <Text style={styles.body}>${room.price} a night</Text>
      <Link href="/" style={styles.link}>Back to all rooms</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  body: { fontSize: 16, color: colors.muted, marginBottom: 8 },
  link: { fontSize: 16, color: colors.accent, marginTop: 16 },
});
