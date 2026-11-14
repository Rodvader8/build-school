import './style.css';

// The chart code is big and most visitors never open it, so it's only fetched when they ask.
document.getElementById('show').addEventListener('click', async () => {
  const { drawChart } = await import('./charts.js');
  drawChart(document.getElementById('chart'));
});
