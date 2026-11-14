import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <section className="card">
          <h2>This week</h2>
          <p>Three single-origin blends, roasted on Tuesday.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
