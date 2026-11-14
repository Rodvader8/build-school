import './style.css';
import { drawChart } from './charts.js';

document.getElementById('show').addEventListener('click', () => {
  drawChart(document.getElementById('chart'));
});
