import NetWorth from './components/NetWorth.jsx';
import Clock from './components/Clock.jsx';

export default function App() {
  return (
    <div className="page">
      <h1>Overview</h1>
      <Clock />
      <NetWorth />
    </div>
  );
}
