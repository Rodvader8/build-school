// Everything lives in one function for now. Your job is to split it into components.
export default function App() {
  return (
    <div class="page">
      <header class="site-header">
        <h1>Kestrel Coffee</h1>
        <nav class="site-nav" aria-label="Main">
          <a href="#menu">Menu</a>
          <a href="#visit">Visit</a>
          <a href="#about">About</a>
        </nav>
      </header>
      <main>
        <section class="card">
          <h2>This week</h2>
          <p>Three single-origin blends, roasted on Tuesday.</p>
        </section>
      </main>
      <footer class="site-footer">
        <p>Copyright 2026 Kestrel Coffee</p>
      </footer>
    </div>
  );
}
