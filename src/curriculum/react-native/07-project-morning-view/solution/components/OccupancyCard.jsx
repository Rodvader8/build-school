import { StyleSheet, Text, View } from 'react-native';
import { occupancyPercent } from '../lib/summary';
import { colors } from '../theme';

export default function OccupancyCard({ occupied, total }) {
  // One dot per room, so the owner reads the picture before the number. Two named styles, no dynamic widths needed.
  const dots = Array.from({ length: total }, (_, i) => i < occupied);

  return (
    <View style={styles.card}>
      <Text style={styles.percent}>{occupancyPercent(occupied, total)}%</Text>
      <Text style={styles.summary}>{occupied} of {total} rooms occupied</Text>
      <View style={styles.dots}>
        {dots.map((isOccupied, i) => (
          <View key={i} testID={isOccupied ? 'dot-on' : 'dot-off'} style={isOccupied ? styles.dotOn : styles.dotOff} />
        ))}
      </View>
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
