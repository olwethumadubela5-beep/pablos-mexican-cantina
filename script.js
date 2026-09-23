const menu = [
  { category: 'starters', label: '01 / TO BEGIN', name: 'Jalapeno Poppers', price: 62, description: 'Cream cheese, crumbed and fried with a sweet chilli finish.' },
  { category: 'starters', label: '01 / TO BEGIN', name: 'Mexican Chicken Wings', price: 65, description: 'BBQ, lemon & herb or peri-peri sauce.', featured: true },
  { category: 'starters', label: '01 / TO BEGIN', name: 'Blooming Onion', price: 48, description: 'Chopped, battered and fried until crisp.' },
  { category: 'starters', label: '01 / TO BEGIN', name: 'Nachos Starter', price: 85, description: 'Cheese, salsa and your choice of beef, chicken or pork.' },
  { category: 'starters', label: '01 / TO BEGIN', name: 'Halloumi Cheese Starter', price: 65, description: 'Grilled halloumi with sweet chilli sauce.' },
  { category: 'mains', label: '02 / CANTINA CLASSICS', name: 'Beef Burrito', price: 115, description: 'Prime beef strips and peppers in two large tortillas.' },
  { category: 'mains', label: '02 / CANTINA CLASSICS', name: 'Chicken Fajita', price: 115, description: 'Sizzling peppers, warm tortillas, salsa and guacamole.', featured: true },
  { category: 'mains', label: '02 / CANTINA CLASSICS', name: 'Tacos x4', price: 105, description: 'Four tacos with your choice of filling.' },
  { category: 'mains', label: '02 / CANTINA CLASSICS', name: 'Chilli Con Carne', price: 100, description: 'Smoky beef, bacon, beans, chillies and melted cheese.' },
  { category: 'mains', label: '02 / CANTINA CLASSICS', name: 'Chicken Burrito', price: 100, description: 'Succulent chicken strips and peppers in two tortillas.' },
  { category: 'grills', label: '03 / FROM THE FIRE', name: 'Delicioso Ribs', price: 160, description: '500g pork belly ribs, BBQ glaze, chips and chipotle mayo.', featured: true },
  { category: 'grills', label: '03 / FROM THE FIRE', name: 'Mexican Rump Steak', price: 165, description: '300g rump grilled to your liking with a side.' },
  { category: 'grills', label: '03 / FROM THE FIRE', name: 'Pollo Chorizo Queso', price: 110, description: 'Chicken breasts stuffed with cream cheese and chorizo.' },
  { category: 'grills', label: '03 / FROM THE FIRE', name: 'Hake & Chips', price: 75, description: 'Crisp hake served with golden chips.' },
  { category: 'platters', label: '04 / MADE TO SHARE', name: 'Share It Platter Carne', price: 480, description: 'Wings, chimichangas, quesadilla, tacos and nachos.', featured: true },
  { category: 'platters', label: '04 / MADE TO SHARE', name: 'Share It Platter Vegetarian', price: 480, description: 'Halloumi, mushrooms, veg tacos, nachos and poppers.' },
  { category: 'kids', label: '05 / LITTLE AMIGOS', name: 'Bebe Pollo', price: 50, description: 'Crumbed, deep-fried chicken strips.' },
  { category: 'kids', label: '05 / LITTLE AMIGOS', name: 'Bebe Fajita', price: 50, description: 'Small chicken tortilla with salad and cheese.' },
  { category: 'kids', label: '05 / LITTLE AMIGOS', name: 'Mini Quesadilla', price: 60, description: 'Small toasted tortilla with cheese and ham.' },
  { category: 'drinks', label: '06 / POUR SOMETHING COLD', name: 'Lime & Mint Cooler', price: 45, description: 'Fresh lime, mint and ice. Ask about the tequila version.', featured: true },
  { category: 'drinks', label: '06 / POUR SOMETHING COLD', name: 'Coke 300ml', price: 25, description: 'An ice-cold classic.' },
  { category: 'drinks', label: '06 / POUR SOMETHING COLD', name: 'Appletiser', price: 32, description: 'Sparkling apple refreshment.' }
];

const upsells = [
  { name: 'Guacamole & tortilla chips', price: 45, description: 'Freshly smashed avocado, lime and coriander.' },
  { name: 'Extra cheese', price: 20, description: 'A little more of the good stuff.' },
  { name: 'Chipotle mayo', price: 15, description: 'Smoky, creamy and made for dipping.' }
];

const cart = new Map();
const menuItems = document.querySelector('#menu-items');
const orderItems = document.querySelector('#order-items');
const orderDialog = document.querySelector('#order-dialog');
const orderForm = document.querySelector('#order-form');
const pickupFields = document.querySelector('#pickup-fields');
const deliveryRoute = document.querySelector('#delivery-route');
const money = value => `R${Number(value).toLocaleString('en-ZA')}`;
const getItem = name => [...menu, ...upsells].find(item => item.name === name);
const itemCount = () => [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
const subtotal = () => [...cart].reduce((sum, [name, quantity]) => sum + (getItem(name)?.price || 0) * quantity, 0);

function addToCart(name, amount = 1) {
  const next = (cart.get(name) || 0) + amount;
  if (next > 0) cart.set(name, next);
  else cart.delete(name);
  renderCart();
}

function setFilter(filter) {
  document.querySelectorAll('.menu-tab').forEach(tab => {
    const active = tab.dataset.filter === filter;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', String(active));
  });
  renderMenu(filter);
}

function renderMenu(filter = 'all') {
  if (!menuItems) return;
  menuItems.replaceChildren();
  let label = '';
  menu.filter(item => filter === 'all' || item.category === filter).forEach((item, index) => {
    if (item.label !== label) {
      label = item.label;
      const heading = document.createElement('p');
      heading.className = 'menu-category-title';
      heading.textContent = label;
      menuItems.append(heading);
    }
    const row = document.createElement('article');
    row.className = `menu-item${item.featured ? ' is-featured' : ''}`;
    row.style.setProperty('--item-index', index);
    row.innerHTML = `<div class="menu-item-copy"><h4>${item.name}${item.featured ? '<span class="chef-mark">Chef\'s pick</span>' : ''}</h4><p>${item.description}</p></div><strong class="menu-price">${money(item.price)}</strong><button class="add-to-order" type="button" data-item="${item.name}" aria-label="Add ${item.name} to order">+ Add</button>`;
    menuItems.append(row);
  });
}

function renderCart() {
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = itemCount();
    el.setAttribute('aria-label', `${itemCount()} items in basket`);
  });
  orderItems.replaceChildren();
  if (!cart.size) {
    const empty = document.createElement('p');
    empty.className = 'cart-empty';
    empty.textContent = 'Your basket is waiting for something good.';
    orderItems.append(empty);
  } else {
    cart.forEach((quantity, name) => {
      const row = document.createElement('div');
      row.className = 'order-item';
      row.innerHTML = `<span>${name}</span><span class="item-quantity"><button type="button" data-change="-1" data-item="${name}" aria-label="Remove one ${name}">−</button><b>${quantity}</b><button type="button" data-change="1" data-item="${name}" aria-label="Add one ${name}">+</button></span>`;
      orderItems.append(row);
    });
  }
  const total = document.createElement('div');
  total.className = 'order-total';
  total.innerHTML = `<span>Estimated subtotal</span><strong>${money(subtotal())}</strong>`;
  orderItems.append(total);
}

function renderUpsells() {
  if (document.querySelector('.upsell-panel')) return;
  const panel = document.createElement('aside');
  panel.className = 'upsell-panel';
  panel.innerHTML = `<div><p class="eyebrow eyebrow-dark">Complete the table</p><h3>Make it a little extra.</h3></div><div class="upsell-grid">${upsells.map(item => `<button class="upsell-card" type="button" data-upsell="${item.name}"><span><strong>${item.name}</strong><small>${item.description}</small></span><b>${money(item.price)} +</b></button>`).join('')}</div>`;
  document.querySelector('#menu-list').append(panel);
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-upsell]');
    if (!button) return;
    addToCart(button.dataset.upsell);
    button.classList.add('is-added');
    button.querySelector('b').textContent = 'Added';
    setTimeout(() => { button.classList.remove('is-added'); button.querySelector('b').textContent = `${money(getItem(button.dataset.upsell).price)} +`; }, 900);
  });
}

document.querySelectorAll('.menu-tab').forEach(tab => tab.addEventListener('click', () => setFilter(tab.dataset.filter)));
document.querySelectorAll('[data-menu-filter]').forEach(card => card.addEventListener('click', () => setFilter(card.dataset.menuFilter)));
menuItems?.addEventListener('click', event => {
  const button = event.target.closest('.add-to-order');
  if (!button) return;
  addToCart(button.dataset.item);
  button.textContent = 'Added';
  setTimeout(() => { button.textContent = '+ Add'; }, 800);
});
orderItems?.addEventListener('click', event => { const button = event.target.closest('[data-change]'); if (button) addToCart(button.dataset.item, Number(button.dataset.change)); });
document.querySelectorAll('[data-open-order]').forEach(button => button.addEventListener('click', () => orderDialog.showModal()));
document.querySelector('[data-close-order]')?.addEventListener('click', () => orderDialog.close());
orderDialog?.addEventListener('click', event => { if (event.target === orderDialog) orderDialog.close(); });
document.querySelector('.menu-toggle')?.addEventListener('click', event => { const button = event.currentTarget; const open = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!open)); button.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation'); document.querySelector('.primary-nav').classList.toggle('is-open', !open); });
document.querySelectorAll('.primary-nav a,.primary-nav button').forEach(el => el.addEventListener('click', () => document.querySelector('.primary-nav')?.classList.remove('is-open')));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && orderDialog?.open) orderDialog.close(); });
document.querySelectorAll('input[name="fulfilment"]').forEach(radio => radio.addEventListener('change', () => { const delivery = radio.checked && radio.value === 'Delivery'; deliveryRoute.hidden = !delivery; pickupFields.hidden = delivery; }));
orderForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!cart.size) return;
  const data = new FormData(orderForm);
  if (data.get('fulfilment') === 'Delivery') return;
  const lines = [`Hi Pablos! I'd like to place a pickup order.`, `Name: ${data.get('customerName')}`, `Mobile: ${data.get('customerPhone')}`, `Preferred time: ${data.get('pickupTime') || 'As soon as possible'}`, '', 'Items:', ...[...cart].map(([name, quantity]) => `${quantity} x ${name}`), '', `Estimated subtotal: ${money(subtotal())}`];
  if (data.get('notes')) lines.push(`Notes: ${data.get('notes')}`);
  window.open(`https://wa.me/27687710345?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
});

const luxuryStyles = document.createElement('style');
luxuryStyles.textContent = `.menu-section{background:linear-gradient(135deg,#fffaf3 0%,#f0e1cc 100%)}.menu-section .section-head h2{font-size:clamp(3.2rem,6vw,6.5rem)}.menu-category-title{margin-top:2rem;padding-bottom:.55rem;border-bottom:1px solid var(--line);letter-spacing:.22em}.menu-item{position:relative;padding:1.25rem 1.3rem;background:rgba(255,255,255,.78);box-shadow:0 12px 28px rgba(36,24,22,.05)}.menu-item.is-featured{border-color:rgba(215,170,82,.8);box-shadow:0 14px 32px rgba(128,88,30,.11)}.menu-item h4{display:flex;align-items:center;gap:.65rem}.chef-mark{display:inline-flex;padding:.25rem .45rem;border-radius:999px;background:#d7aa5220;color:#8c6727;font:700 .55rem var(--sans);letter-spacing:.08em;text-transform:uppercase}.menu-price{font-size:1.2rem!important;color:var(--rust)}.add-to-order{border:1px solid #b94f3940;background:transparent!important;transition:.2s}.add-to-order:hover,.add-to-order:focus-visible{background:var(--rust)!important;color:#fff}.upsell-panel{margin-top:3rem;padding:2rem;border:1px solid rgba(215,170,82,.45);border-radius:22px;background:#241816;color:#fff;box-shadow:0 18px 38px rgba(36,24,22,.12)}.upsell-panel h3{margin:0;font:2.3rem var(--serif)}.upsell-panel .eyebrow{margin-bottom:.45rem}.upsell-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-top:1.5rem}.upsell-card{display:flex;align-items:center;justify-content:space-between;gap:.7rem;min-height:80px;padding:.8rem;border:1px solid #ffffff22;border-radius:14px;background:#ffffff08;color:#fff;text-align:left}.upsell-card span{display:grid;gap:.2rem}.upsell-card strong{font-size:.85rem}.upsell-card small{color:#cbbdb4;font-size:.7rem;line-height:1.3}.upsell-card b{flex-shrink:0;color:var(--gold);font-size:.72rem}.upsell-card.is-added{border-color:var(--gold);background:#d7aa5218}.order-total{display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;padding:1rem 0;border-top:1px solid var(--line);font-size:.75rem;color:var(--muted)}.order-total strong{font-size:1.25rem;color:var(--rust)}@media(max-width:640px){.upsell-grid{grid-template-columns:1fr}.upsell-panel{padding:1.3rem}.upsell-panel h3{font-size:2rem}}`;
document.head.append(luxuryStyles);
const schema = { '@context': 'https://schema.org', '@type': 'Restaurant', name: 'Pablos Mexican Cantina', description: 'A refined Mexican cantina serving tacos, grills, share plates and cold drinks in Northmead, Benoni.', telephone: '+27 68 771 0345', servesCuisine: 'Mexican', priceRange: '$$', address: { '@type': 'PostalAddress', streetAddress: '1 6th Ave & 1st St', addressLocality: 'Northmead', addressRegion: 'Gauteng', postalCode: '1501', addressCountry: 'ZA' }, openingHours: ['Mo-Sa 11:00-23:00', 'Su 11:00-20:30'] };
const schemaScript = document.createElement('script'); schemaScript.type = 'application/ld+json'; schemaScript.textContent = JSON.stringify(schema); document.head.append(schemaScript);
document.querySelector('#year').textContent = new Date().getFullYear();
renderMenu(); renderUpsells(); renderCart();
