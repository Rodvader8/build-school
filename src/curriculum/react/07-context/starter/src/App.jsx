import PeriodToggle from './components/PeriodToggle.jsx';
import Summary from './components/Summary.jsx';
import Breakdown from './components/Breakdown.jsx';

// Step 3: Summary and Breakdown read the period from context, so something above them has to provide it.
export default function App() {
  return (
    <div className="page">
      <h1>Returns</h1>
      <PeriodToggle />
      <Summary />
      <Breakdown />
    </div>
  );
}
