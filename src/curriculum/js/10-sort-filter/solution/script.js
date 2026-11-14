// Lesson 10: sort and filter the entities table.

const entities = [
  { name: 'Family Trust', type: 'Trust', value: 2400000 },
  { name: 'Rowan Super Fund', type: 'SMSF', value: 1850000 },
  { name: 'Harbour Holdings', type: 'Company', value: 3100000 },
  { name: 'Joint Account', type: 'Personal', value: 420000 },
  { name: 'Education Trust', type: 'Trust', value: 310000 },
];

const money = (n) => '$' + n.toLocaleString('en-AU');
const body = document.querySelector('.db-entities');

// The table's state: what to sort by, which way, and the filter text.
const state = { key: null, dir: 'ascending', query: '' };

function render() {
  const query = state.query.trim().toLowerCase();
  const rows = entities.filter((e) => e.name.toLowerCase().includes(query));

  if (state.key) {
    const key = state.key;
    const sign = state.dir === 'ascending' ? 1 : -1;
    rows.sort((a, b) => {
      if (typeof a[key] === 'number') return (a[key] - b[key]) * sign;
      return a[key].localeCompare(b[key]) * sign;
    });
  }

  body.replaceChildren();
  for (const entity of rows) {
    const tr = document.createElement('tr');
    for (const value of [entity.name, entity.type, money(entity.value)]) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    body.append(tr);
  }
}

const headers = document.querySelectorAll('th[data-key]');
for (const th of headers) {
  th.querySelector('button').addEventListener('click', () => {
    const key = th.dataset.key;
    state.dir = state.key === key && state.dir === 'ascending' ? 'descending' : 'ascending';
    state.key = key;
    for (const other of headers) {
      other.setAttribute('aria-sort', other === th ? state.dir : 'none');
    }
    render();
  });
}

document.querySelector('#filter').addEventListener('input', (event) => {
  state.query = event.target.value;
  render();
});

render();
