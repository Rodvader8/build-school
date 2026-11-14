import { StyleSheet, Text, View } from 'react-native';
import { occupancyPercent } from '../lib/summary';
import { colors } from '../theme';

// Show how full the hotel is, as a number and as a picture:
//   - the percentage, big: "75%" (use occupancyPercent)
//   - a line: "18 of 24 rooms occupied"
//   - one small dot per room: testID="dot-on" with styles.dotOn when occupied, testID="dot-off" with styles.dotOff when not.
//     Build them with Array.from({ length: total }, ...) inside a <View style={styles.dots}>.
export default function OccupancyCard({ occupied, total }) {
  return (
    <View style={styles.card}>
      <Text style={styles.summary}>{occupied} rooms</Text>
    </View>
  );
}

const dot = { width: 14, height: 14, borderRadius: 7 };

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16 },
  percent: { fontSize: 40, fontWeight: '700', color: colors.ink },
  summary: { marginTop: 2, color: colors.muted },
  dots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  dotOn: { ...dot, backgroundColor: colors.accent },
  dotOff: { ...dot, backgroundColor: colors.muted, opacity: 0.25 },
});
