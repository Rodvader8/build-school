/**
 * Groups menu items by category, in the order each category first appears.
 * Returns [{ category: 'bread', label: 'Bread', items: [...] }, ...] with items in their original order.
 */
export function groupByCategory(items) {
  const groups = [];
  for (const item of items) {
    let group = groups.find((g) => g.category === item.category);
    if (!group) {
      group = { category: item.category, label: item.category[0].toUpperCase() + item.category.slice(1), items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}
