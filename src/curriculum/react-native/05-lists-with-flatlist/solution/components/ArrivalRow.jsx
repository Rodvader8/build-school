import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// One arrival. It remembers whether the guest has been checked in, in its own state.
// That memory belongs to this row, so the list has to keep each row attached to the right guest. That's what keys are for.
export default function ArrivalRow({ arrival }) {
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{arrival.name}</Text>
        <Text style={styles.detail}>{arrival.room}, expected {arrival.eta}</Text>
      </View>
      <Pressable role="button" aria-label={`Check in ${arrival.name}`} onPress={() => setCheckedIn(!checkedIn)} style={checkedIn ? styles.buttonDone : styles.button}>
        <Text style={checkedIn ? styles.buttonDoneText : styles.buttonText}>{checkedIn ? 'Checked in' : 'Check in'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  info: { flex: 1, paddingRight: 12 },
  name: { fontSize: 17, fontWeight: '600', color: colors.ink },
  detail: { marginTop: 2, color: colors.muted },
  button: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  buttonText: { color: colors.onAccent, fontWeight: '600' },
  buttonDone: { borderWidth: 1, borderColor: colors.accent, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  buttonDoneText: { color: colors.accent, fontWeight: '600' },
});
