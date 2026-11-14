import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { copyText } from '../lib/copy';
import { colors } from '../theme';

// The button does nothing yet. Wire it up:
//   1. onPress calls copyText(code) from lib/copy.js and stores 'copied' or 'failed' in status.
//   2. After a good copy, the button says "Copied" and a <Text role="status"> says "Copied to your clipboard".
//   3. After a failed copy, a <Text role="status"> says "Couldn't copy. Press and hold the code to copy it yourself."
//   4. The code's Text gets the selectable prop, so a person can copy it by hand when the button can't.
export default function DoorCodeCard({ code }) {
  const [status, setStatus] = useState('idle'); // idle | copied | failed

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Door code for late arrivals</Text>
      <Text style={styles.code}>{code}</Text>
      <Pressable role="button" aria-label="Copy the door code" style={styles.button}>
        <Text style={styles.buttonText}>Copy code</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16 },
  label: { color: colors.muted },
  code: { marginVertical: 8, fontSize: 36, fontWeight: '700', letterSpacing: 4, color: colors.ink },
  button: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  buttonText: { color: colors.onAccent, fontWeight: '600' },
  note: { marginTop: 8, color: colors.muted },
  problem: { marginTop: 8, color: '#9b1c1c' },
});
