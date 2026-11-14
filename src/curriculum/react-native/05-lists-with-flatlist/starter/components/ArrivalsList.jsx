import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ArrivalRow from './ArrivalRow';
import { colors } from '../theme';

const Separator = () => <View style={styles.separator} />;

// This builds every row up front with map, and keys them by position. It looks fine with four guests and breaks
// with four hundred, or the moment the list is re-sorted. Rewrite it with FlatList:
//   data={arrivals}
//   keyExtractor={(item) => item.ref}            (a field that identifies the guest, never the index)
//   renderItem={({ item }) => <ArrivalRow arrival={item} />}
//   ItemSeparatorComponent={Separator}
//   ListEmptyComponent={<Text style={styles.empty}>No arrivals today</Text>}
export default function ArrivalsList({ arrivals }) {
  return (
    <ScrollView>
      {arrivals.map((arrival, index) => (
        <View key={index}>
          {index > 0 && <Separator />}
          <ArrivalRow arrival={arrival} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: colors.muted, opacity: 0.2 },
  empty: { marginTop: 24, textAlign: 'center', color: colors.muted },
});
