const menu = [
  ['starters','STARTERS','Jalapeno Poppers','R62','Cream cheese, crumbed and fried with a sweet chilli finish.'],
  ['starters','STARTERS','Mexican Chicken Wings','R65','BBQ, lemon & herb or peri-peri sauce.'],
  ['starters','STARTERS','Blooming Onion','R48','Chopped, battered and fried until crisp.'],
  ['starters','STARTERS','Nachos Starter','R85','Cheese, salsa and your choice of beef, chicken or pork.'],
  ['starters','STARTERS','Halloumi Cheese Starter','R65','Grilled halloumi with sweet chilli sauce.'],
  ['mains','CANTINA CLASSICS','Beef Burrito','R115','Prime beef strips and peppers in two large tortillas.'],
  ['mains','CANTINA CLASSICS','Chicken Fajita','R115','Sizzling peppers, warm tortillas, salsa and guacamole.'],
  ['mains','CANTINA CLASSICS','Tacos x4','R105','Four tacos with your choice of filling.'],
  ['mains','CANTINA CLASSICS','Chilli Con Carne','R100','Smoky beef, bacon, beans, chillies and melted cheese.'],
  ['mains','CANTINA CLASSICS','Chicken Burrito','R100','Succulent chicken strips and peppers in two tortillas.'],
  ['grills','FROM THE GRILL','Delicioso Ribs','R160','500g pork belly ribs, BBQ glaze, chips and chipotle mayo.'],
  ['grills','FROM THE GRILL','Mexican Rump Steak','R165','300g rump grilled to your liking with a side.'],
  ['grills','FROM THE GRILL','Pollo Chorizo Queso','R110','Chicken breasts stuffed with cream cheese and chorizo.'],
  ['grills','FROM THE GRILL','Hake & Chips','R75','Crisp hake served with golden chips.'],
  ['platters','BUILT TO SHARE','Share It Platter Carne','R480','Wings, chimichangas, quesadilla, tacos and nachos.'],
  ['platters','BUILT TO SHARE','Share It Platter Vegetarian','R480','Halloumi, mushrooms, veg tacos, nachos and poppers.'],
  ['kids','KIDDIES MEALS','Bebe Pollo','R50','Crumbed, deep-fried chicken strips.'],
  ['kids','KIDDIES MEALS','Bebe Fajita','R50','Small chicken tortilla with salad and cheese.'],
  ['kids','KIDDIES MEALS','Mini Quesadilla','R60','Small toasted tortilla with cheese and ham.'],
  ['drinks','SOMETHING COLD','Lime & Mint Cooler','R45','Fresh lime, mint and ice.'],
  ['drinks','SOMETHING COLD','Coke 300ml','R25','An ice-cold classic.'],
  ['drinks','SOMETHING COLD','Appletiser','R32','Sparkling apple refreshment.']
].map(([category,label,name,price,description])=>({category,label,name,price,description}));
const cart=new Map();
const menuItems=document.querySelector('#menu-items');
const orderItems=document.querySelector('#order-items');
const orderDialog=document.querySelector('#order-dialog');
const orderForm=document.querySelector('#order-form');
const pickupFields=document.querySelector('#pickup-fields');
const deliveryRoute=document.querySelector('#delivery-route');
const zar=value=>Number(String(value).replace(/[^0-9.]/g,''));
function renderMenu(filter='all'){if(!menuItems)return;menuItems.replaceChildren();let label='';menu.filter(i=>filter==='all'||i.category===filter).forEach((item,index)=>{if(item.label!==label){label=item.label;const h=document.createElement('p');h.className='menu-category-title';h.textContent=label;menuItems.append(h)}const row=document.createElement('article');row.className='menu-item';row.style.animationDelay=`${index*35}ms`;row.innerHTML=`<div><h4>${item.name}</h4><p>${item.description}</p></div><strong>${item.price}</strong><button class="add-to-order" type="button" data-item="${item.name}" aria-label="Add ${item.name} to order">+ Add</button>`;menuItems.append(row)})}
function total(){return [...cart].reduce((sum,[name,qty])=>sum+zar(menu.find(i=>i.name===name)?.price||0)*qty,0)}
function itemCount(){return [...cart.values()].reduce((sum,n)=>sum+n,0)}
function renderCart(){document.querySelectorAll('.cart-count').forEach(el=>{el.textContent=itemCount();el.setAttribute('aria-label',`${itemCount()} items in basket`)});orderItems.replaceChildren();if(!cart.size){const p=document.createElement('p');p.className='cart-empty';p.textContent='Your basket is waiting for something good.';orderItems.append(p);return}cart.forEach((qty,name)=>{const row=document.createElement('div');row.className='order-item';row.innerHTML=`<span>${name}</span><span class="item-quantity"><button type="button" data-change="-1" data-item="${name}" aria-label="Remove one ${name}">−</button><b>${qty}</b><button type="button" data-change="1" data-item="${name}" aria-label="Add one ${name}">+</button></span>`;orderItems.append(row)});const totalRow=document.createElement('strong');totalRow.className='order-total';totalRow.textContent=`Subtotal: R${total()}`;orderItems.append(totalRow)}
function change(name,amount){const next=(cart.get(name)||0)+amount;if(next>0)cart.set(name,next);else cart.delete(name);renderCart()}
function setFilter(filter){document.querySelectorAll('.menu-tab').forEach(tab=>{const active=tab.dataset.filter===filter;tab.classList.toggle('is-active',active);tab.setAttribute('aria-pressed',active)});renderMenu(filter)}
document.querySelectorAll('.menu-tab').forEach(tab=>tab.addEventListener('click',()=>setFilter(tab.dataset.filter)));
document.querySelectorAll('[data-menu-filter]').forEach(card=>card.addEventListener('click',()=>setFilter(card.dataset.menuFilter)));
menuItems?.addEventListener('click',e=>{const button=e.target.closest('.add-to-order');if(button){change(button.dataset.item,1);button.textContent='Added';setTimeout(()=>button.textContent='+ Add',800)}});
orderItems?.addEventListener('click',e=>{const button=e.target.closest('[data-change]');if(button)change(button.dataset.item,Number(button.dataset.change))});
document.querySelectorAll('[data-open-order]').forEach(button=>button.addEventListener('click',()=>orderDialog.showModal()));document.querySelector('[data-close-order]')?.addEventListener('click',()=>orderDialog.close());orderDialog?.addEventListener('click',e=>{if(e.target===orderDialog)orderDialog.close()});
document.querySelector('.menu-toggle')?.addEventListener('click',e=>{const button=e.currentTarget;const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));button.setAttribute('aria-label',open?'Open navigation':'Close navigation');document.querySelector('.primary-nav').classList.toggle('is-open',!open)});
document.querySelectorAll('.primary-nav a,.primary-nav button').forEach(el=>el.addEventListener('click',()=>document.querySelector('.primary-nav')?.classList.remove('is-open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&orderDialog?.open)orderDialog.close()});
document.querySelectorAll('input[name="fulfilment"]').forEach(radio=>radio.addEventListener('change',()=>{const delivery=radio.checked&&radio.value==='Delivery';deliveryRoute.hidden=!delivery;pickupFields.hidden=delivery}));
orderForm?.addEventListener('submit',e=>{e.preventDefault();if(!cart.size)return;const data=new FormData(orderForm);if(data.get('fulfilment')==='Delivery')return;const lines=[`Hi Pablos! I'd like to place a pickup order.`,`Name: ${data.get('customerName')}`,`Mobile: ${data.get('customerPhone')}`,`Preferred time: ${data.get('pickupTime')||'As soon as possible'}`,'','Items:',...[...cart].map(([name,qty])=>`${qty} x ${name}`),``,`Estimated subtotal: R${total()}`];if(data.get('notes'))lines.push(`Notes: ${data.get('notes')}`);window.open(`https://wa.me/27687710345?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener,noreferrer')});
const schema={"@context":"https://schema.org","@type":"Restaurant","name":"Pablos Mexican Cantina","description":"Mexican food, grills, tacos and cold drinks in Northmead, Benoni.","telephone":"+27 68 771 0345","servesCuisine":"Mexican","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"1 6th Ave & 1st St","addressLocality":"Northmead","addressRegion":"Gauteng","postalCode":"1501","addressCountry":"ZA"},"openingHours":["Mo-Sa 11:00-23:00","Su 11:00-20:30"]};const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(schema);document.head.append(script);document.querySelector('#year').textContent=new Date().getFullYear();renderMenu();renderCart();
