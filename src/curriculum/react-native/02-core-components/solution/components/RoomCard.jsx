import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function RoomCard({ room }) {
  const [held, setHeld] = useState(false);

  return (
    <View style={styles.card}>
      {/* Image needs a source, and aria-label is what a screen reader says in place of the picture. */}
      <Image source={room.photo} aria-label={`Photo of the ${room.name}`} style={styles.photo} />
      <Text role="heading" aria-level={2} style={styles.name}>{room.name}</Text>
      <Text style={styles.description}>{room.description}</Text>
      {/* Pressable is the all-purpose button. onPress is React Native's onClick. */}
      <Pressable role="button" aria-label={`Hold the ${room.name}`} onPress={() => setHeld(!held)} style={styles.button}>
        <Text style={styles.buttonText}>{held ? 'Held for 24 hours' : 'Hold this room'}</Text>
      </Pressable>
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
