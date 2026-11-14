import EntityList from './components/EntityList.jsx';
import { entities } from './data.js';

export default function App() {
  return (
    <div className="page">
      <h1>Entities</h1>
      <EntityList entities={entities} />
    </div>
  );
}
