import { StyleSheet, Text, View } from 'react-native';
import ArrivalRow from '../components/ArrivalRow';
import OccupancyCard from '../components/OccupancyCard';
import { morning } from '../data/morning';
import { colors } from '../theme';

// The owner's morning view. Build it in this order, running the checks as you go:
//   1. lib/summary.js: make the three functions right.
//   2. components/OccupancyCard.jsx: the percentage, the sentence and the dots.
//   3. Here: a toggle. useState(false) for earlyOnly, and a <Switch aria-label="Early arrivals only" value onValueChange> in a row with a label.
//   4. Here: show sortByArrival(earlyOnly ? earlyArrivals(arrivals) : arrivals), under a line like "6 arrivals" (singular for 1).
//   5. Replace the map below with a FlatList: keyExtractor by ref, a separator, and ListEmptyComponent "No early arrivals".
export default function MorningView() {
  return (
    <View style={styles.screen}>
      <Text role="heading" aria-level={1} style={styles.title}>Good morning</Text>
      <OccupancyCard occupied={morning.occupied} total={morning.totalRooms} />
      {morning.arrivals.map((arrival) => (
        <ArrivalRow key={arrival.ref} arrival={arrival} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { flex: 1, color: colors.ink },
  count: { marginVertical: 8, color: colors.muted },
  separator: { height: 1, backgroundColor: colors.muted, opacity: 0.2 },
  empty: { marginTop: 24, textAlign: 'center', color: colors.muted },
});
