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
  // TODO: filter by state.query and sort by state.key / state.dir before drawing.
  const rows = entities;

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

// TODO: header buttons change state.key and state.dir, update aria-sort, then render().

// TODO: the filter input changes state.query, then render().

render();
