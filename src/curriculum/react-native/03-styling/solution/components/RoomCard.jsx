import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// A function style: Pressable calls it with { pressed }, and an array lets you layer one style over another.
export const buttonStyle = ({ pressed }) => [styles.button, pressed && styles.buttonPressed];

export default function RoomCard({ room }) {
  const [held, setHeld] = useState(false);

  return (
    <View style={styles.card}>
      <Image source={room.photo} aria-label={`Photo of the ${room.name}`} style={styles.photo} />
      <View style={styles.header}>
        <Text role="heading" aria-level={2} style={styles.name}>{room.name}</Text>
        <Text style={styles.price}>${room.price} a night</Text>
      </View>
      <Text style={styles.description}>{room.description}</Text>
      <Pressable role="button" aria-label={`Hold the ${room.name}`} onPress={() => setHeld(!held)} style={buttonStyle}>
        <Text style={styles.buttonText}>{held ? 'Held for 24 hours' : 'Hold this room'}</Text>
      </Pressable>
    </View>
  );
}

// Styles are plain objects, made once with StyleSheet.create. The names are camelCase (marginTop, not margin-top),
// numbers are density-independent pixels, and there is no cascade: a Text doesn't inherit its parent's colour.
export const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)' },
  photo: { width: '100%', height: 140, borderRadius: 8 },
  // Every View is a flex column by default. Switch to a row to put the name and the price side by side.
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  name: { fontSize: 20, fontWeight: '700', color: colors.ink },
  price: { fontSize: 14, color: colors.muted },
  description: { marginTop: 4, fontSize: 15, color: colors.muted },
  button: { marginTop: 12, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  buttonPressed: { backgroundColor: colors.accentPressed },
  buttonText: { color: colors.onAccent, fontWeight: '600' },
});
