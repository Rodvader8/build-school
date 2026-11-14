import { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import ArrivalRow from '../components/ArrivalRow';
import OccupancyCard from '../components/OccupancyCard';
import { morning } from '../data/morning';
import { earlyArrivals, sortByArrival } from '../lib/summary';
import { colors } from '../theme';

const Separator = () => <View style={styles.separator} />;

export default function MorningView() {
  const [earlyOnly, setEarlyOnly] = useState(false);

  // Work out what to show from state each render, instead of storing a second copy of the list.
  const shown = sortByArrival(earlyOnly ? earlyArrivals(morning.arrivals) : morning.arrivals);

  return (
    <View style={styles.screen}>
      <Text role="heading" aria-level={1} style={styles.title}>Good morning</Text>
      <OccupancyCard occupied={morning.occupied} total={morning.totalRooms} />

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Early arrivals only (before 2pm)</Text>
        <Switch aria-label="Early arrivals only" value={earlyOnly} onValueChange={setEarlyOnly} />
      </View>
      <Text style={styles.count}>{shown.length} {shown.length === 1 ? 'arrival' : 'arrivals'}</Text>

      <FlatList
        data={shown}
        keyExtractor={(item) => item.ref}
        renderItem={({ item }) => <ArrivalRow arrival={item} />}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={<Text style={styles.empty}>No early arrivals</Text>}
      />
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
