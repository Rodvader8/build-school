import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { rooms } from '../data/rooms';
import { colors } from '../theme';

// app/index.jsx is the screen at "/". Each file in app/ becomes a route, so there's no route table to maintain.
// The room names are plain text. Turn each one into a <Link href={`/rooms/${room.id}`} style={styles.link}> so it opens its detail screen.
export default function Home() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text role="heading" aria-level={1} style={styles.title}>Rooms</Text>
      {rooms.map((room) => (
        <Text key={room.id} style={styles.link}>{room.name}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 16 },
  link: { fontSize: 18, color: colors.accent, paddingVertical: 12 },
});
