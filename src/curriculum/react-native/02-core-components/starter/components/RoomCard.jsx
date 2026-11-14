import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

// Right now a room is just two lines of text. Build the real card, top to bottom:
//   1. <Image source={room.photo} aria-label="Photo of the ..." style={styles.photo} /> (aria-label is what screen readers say)
//   2. the name as a heading: <Text role="heading" aria-level={2}>
//   3. the description
//   4. a <Pressable role="button" aria-label="Hold the ..."> with a Text inside. Its onPress toggles "held" state:
//      the text says "Hold this room", and after a press it says "Held for 24 hours". Press again to let go.
// The styles you need are already in the StyleSheet at the bottom.
export default function RoomCard({ room }) {
  const [held, setHeld] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{room.name}</Text>
      <Text style={styles.description}>{room.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16 },
  photo: { width: '100%', height: 140, borderRadius: 8 },
  name: { marginTop: 12, fontSize: 20, fontWeight: '700', color: '#1d2433' },
  description: { marginTop: 4, color: '#4a5368' },
  button: { marginTop: 12, backgroundColor: '#1f6f78', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
