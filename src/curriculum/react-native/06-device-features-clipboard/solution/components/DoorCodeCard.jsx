import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { copyText } from '../lib/copy';
import { colors } from '../theme';

export default function DoorCodeCard({ code }) {
  const [status, setStatus] = useState('idle'); // idle | copied | failed

  async function onCopy() {
    const result = await copyText(code);
    setStatus(result.ok ? 'copied' : 'failed');
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Door code for late arrivals</Text>
      {/* selectable lets a person press and hold to copy the code themselves, which is the fallback when the button can't. */}
      <Text selectable style={styles.code}>{code}</Text>
      <Pressable role="button" aria-label="Copy the door code" onPress={onCopy} style={styles.button}>
        <Text style={styles.buttonText}>{status === 'copied' ? 'Copied' : 'Copy code'}</Text>
      </Pressable>
      {/* role="status" makes screen readers announce the result without moving focus. */}
      {status === 'copied' && <Text role="status" style={styles.note}>Copied to your clipboard</Text>}
      {status === 'failed' && <Text role="status" style={styles.problem}>Couldn't copy. Press and hold the code to copy it yourself.</Text>}
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
