import { getMenu } from '@/lib/bakery-api.js';
import { groupByCategory } from '@/lib/group.js';

// An async server component: await the data right where you use it.
export default async function MenuPage() {
  const groups = groupByCategory(await getMenu());

  return (
    <>
      <h1 className="text-3xl font-bold">The menu</h1>
      {groups.map((group) => (
        <section key={group.category} className="mt-8">
          <h2 className="text-xl font-semibold text-crust-dark">{group.label}</h2>
          <ul className="mt-3 divide-y divide-oat">
            {group.items.map((item) => (
              <li key={item.slug} className="flex justify-between py-2">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
