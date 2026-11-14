import { PeriodProvider } from './period-context.jsx';
import PeriodToggle from './components/PeriodToggle.jsx';
import Summary from './components/Summary.jsx';
import Breakdown from './components/Breakdown.jsx';

export default function App() {
  return (
    <PeriodProvider>
      <div className="page">
        <h1>Returns</h1>
        <PeriodToggle />
        <Summary />
        <Breakdown />
      </div>
    </PeriodProvider>
  );
}
