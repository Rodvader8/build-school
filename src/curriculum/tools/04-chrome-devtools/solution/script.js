// Loads the PageSpeed scores and draws one card per site.
async function load() {
  const res = await fetch('results.json');
  const sites = await res.json();

  const list = document.getElementById('sites');
  for (const site of sites) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = '<h2>' + site.name + '</h2><div class="score">' + site.score + '</div>';
    list.append(card);
  }

  const good = sites.filter((s) => s.score >= 90).length;
  document.getElementById('summary').textContent = good + ' of ' + sites.length + ' sites score 90 or more';
}

load();
