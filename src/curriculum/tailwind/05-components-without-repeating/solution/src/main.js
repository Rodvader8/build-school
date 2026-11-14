import { entities } from './data.js';
import { card } from './components.js';

document.querySelector('#cards').innerHTML = entities.map(card).join('');
