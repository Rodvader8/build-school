import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// The card works, but it looks wrong and it's styled the wrong way. Fix it in four steps (see the lesson):
//   1. Move the two inline style objects below into StyleSheet.create, and name them.
//   2. Make styles.card, styles.photo and styles.header match what tests/styling.test.jsx describes.
//   3. Make the button text readable, and give a pressed button its own look with buttonStyle.
//   4. Take every colour from theme.js (colors.ink, colors.accent...) instead of typing hex codes.

// Pressable calls this with { pressed }. Return an array: the normal style, plus a pressed style while a finger is down.
export const buttonStyle = ({ pressed }) => styles.button;

export default function RoomCard({ room }) {
  const [held, setHeld] = useState(false);

  return (
    <View style={styles.card}>
      <Image source={room.photo} aria-label={`Photo of the ${room.name}`} style={styles.photo} />
      <View style={styles.header}>
        <Text role="heading" aria-level={2} style={styles.name}>{room.name}</Text>
        <Text style={{ fontSize: 14, color: '#4a5368' }}>${room.price} a night</Text>
      </View>
      <Text style={styles.description}>{room.description}</Text>
      <Pressable role="button" aria-label={`Hold the ${room.name}`} onPress={() => setHeld(!held)} style={buttonStyle}>
        <Text style={{ color: '#9ad0d5', fontWeight: '600' }}>{held ? 'Held for 24 hours' : 'Hold this room'}</Text>
      </Pressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', marginBottom: 16 },
  photo: { width: 100 },
  header: { marginTop: 12 },
  name: { fontSize: 20, color: '#1d2433' },
  description: { marginTop: 4, fontSize: 15, color: '#4a5368' },
  button: { marginTop: 12, backgroundColor: '#1f6f78', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
});
