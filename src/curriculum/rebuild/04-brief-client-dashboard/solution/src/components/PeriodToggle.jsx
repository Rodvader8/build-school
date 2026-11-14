// A group of toggle buttons. aria-pressed tells a screen reader which one is on.
export default function PeriodToggle({ options, value, onChange }) {
  return (
    <div className="toggle" role="group" aria-label="Period">
      {options.map((o) => (
        <button key={o.id} type="button" className="toggle__btn" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
