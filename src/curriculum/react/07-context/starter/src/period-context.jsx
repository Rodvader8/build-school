// Step 1: build the context.
//   - createContext() holds the value
//   - PeriodProvider keeps the period in state (default '1Y', or the `initial` prop) and shares { period, setPeriod }
//   - usePeriod() reads it, and throws 'usePeriod must be used inside a PeriodProvider' when there's no provider
export function PeriodProvider({ children }) {
  return children;
}

export function usePeriod() {
  return {};
}
