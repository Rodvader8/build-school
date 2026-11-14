import { FlatList, StyleSheet, Text, View } from 'react-native';
import ArrivalRow from './ArrivalRow';
import { colors } from '../theme';

const Separator = () => <View style={styles.separator} />;

// FlatList renders only the rows near the screen and recycles them as you scroll, so a thousand arrivals cost no more than ten.
// Three props do most of the work: data (the array), renderItem (how one row looks) and keyExtractor (which field names a row).
export default function ArrivalsList({ arrivals }) {
  return (
    <FlatList
      data={arrivals}
      // The key ties a row to a guest, not to a position. Never use the index: after a sort or an insert, rows would show the wrong guest's state.
      keyExtractor={(item) => item.ref}
      renderItem={({ item }) => <ArrivalRow arrival={item} />}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={<Text style={styles.empty}>No arrivals today</Text>}
    />
  );
}

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: colors.muted, opacity: 0.2 },
  empty: { marginTop: 24, textAlign: 'center', color: colors.muted },
});
