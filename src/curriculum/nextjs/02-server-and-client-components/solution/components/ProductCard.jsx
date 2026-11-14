// Pure display: no hooks, no events, so it needs no "use client" of its own.
export default function ProductCard({ item, children }) {
  return (
    <article className="rounded-xl bg-oat p-5">
      <h3 className="text-lg font-semibold">{item.name}</h3>
      <p className="text-sm">{item.blurb}</p>
      <p className="mt-2 font-medium">${item.price}</p>
      {children}
    </article>
  );
}
