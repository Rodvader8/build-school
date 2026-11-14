import { createContext, useContext, useState } from 'react';

const PeriodContext = createContext(null);

export function PeriodProvider({ initial = '1Y', children }) {
  const [period, setPeriod] = useState(initial);
  return <PeriodContext value={{ period, setPeriod }}>{children}</PeriodContext>;
}

export function usePeriod() {
  const value = useContext(PeriodContext);
  if (value === null) throw new Error('usePeriod must be used inside a PeriodProvider');
  return value;
}
