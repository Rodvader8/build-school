// Turns page titles into URL slugs, using the slug-lite package.
const slug = require('slug-lite');

const titles = ['Larkfield Coastal Reno', 'Brightwater: Pool & Spa!', 'Willow Cove Builders'];
for (const title of titles) console.log(slug(title));
