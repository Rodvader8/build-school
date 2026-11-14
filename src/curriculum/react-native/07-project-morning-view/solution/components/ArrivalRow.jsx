import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function ArrivalRow({ arrival }) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{arrival.name}</Text>
        <Text style={styles.detail}>{arrival.room}</Text>
      </View>
      <Text style={styles.time}>{arrival.eta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  info: { flex: 1, paddingRight: 12 },
  name: { fontSize: 17, fontWeight: '600', color: colors.ink },
  detail: { marginTop: 2, color: colors.muted },
  time: { fontSize: 17, fontWeight: '600', color: colors.accent },
});
