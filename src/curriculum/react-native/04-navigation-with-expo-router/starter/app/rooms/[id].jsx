import { Text, View } from 'react-native';

// A file name in square brackets is a parameter: /rooms/loft should give this screen { id: 'loft' }.
// Build the screen:
//   1. const { id } = useLocalSearchParams() (from expo-router), then find the room in data/rooms.js with that id.
//   2. No such room? Show "Room not found" and a <Link href="/"> back to the list. Don't crash.
//   3. Otherwise show the name (a heading), description and price, plus a <Link href="/">Back to all rooms</Link>.
//   4. Set the header title to the room's name with <Stack.Screen options={{ title: room.name }} /> inside the screen.
// There's a StyleSheet pattern in app/index.jsx to copy.
export default function RoomDetails() {
  return (
    <View>
      <Text>Room details</Text>
    </View>
  );
}
