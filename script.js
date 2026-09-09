const listings = [
  {id:1,title:'Boutique hotel guest experience',type:'Hotel',city:'Fort Lauderdale',price:450,traffic:'8,500 monthly guests',activations:['Sampling','Product placement','Sponsored event'],desc:'Reach leisure travelers through lobby display, welcome materials, guest room sampling and select events.',audience:'Leisure travelers, couples, families and weekend visitors.',image:'https://images.pexels.com/photos/18426842/pexels-photo-18426842.jpeg?auto=compress&cs=tinysrgb&w=1600'},
  {id:2,title:'High traffic fitness studio',type:'Gym',city:'Miami',price:300,traffic:'6,200 monthly visits',activations:['Sampling','Product placement','Digital screens'],desc:'Place wellness, beverage, apparel or recovery brands in front of an active fitness audience.',audience:'Fitness focused adults, 22 to 45.',image:'https://images.pexels.com/photos/8933584/pexels-photo-8933584.jpeg?auto=compress&cs=tinysrgb&w=1600'},
  {id:3,title:'Independent specialty café',type:'Cafe',city:'Cannes',price:250,traffic:'5,700 monthly customers',activations:['Sampling','Product placement','Window advertising'],desc:'Counter placement, takeaway insert, cup sponsorship and sampling opportunities in central Cannes.',audience:'Locals, professionals and visitors.',image:'https://images.pexels.com/photos/31777032/pexels-photo-31777032.jpeg?auto=compress&cs=tinysrgb&w=1600'},
  {id:4,title:'Design led neighborhood store',type:'Retail',city:'New York',price:650,traffic:'9,400 monthly visitors',activations:['Pop up','Product placement','Window advertising'],desc:'Test products, host a compact pop up or take over high visibility window space.',audience:'Urban shoppers, creatives and tourists.',image:'https://images.pexels.com/photos/7618822/pexels-photo-7618822.jpeg?auto=compress&cs=tinysrgb&w=1600'},
  {id:5,title:'Premium beauty salon network',type:'Salon',city:'Toronto',price:400,traffic:'4,100 monthly clients',activations:['Sampling','Product placement','Digital screens'],desc:'Reach a highly engaged beauty audience during appointments and checkout.',audience:'Beauty and personal care consumers, primarily 25 to 54.',image:'https://images.pexels.com/photos/7750114/pexels-photo-7750114.jpeg?auto=compress&cs=tinysrgb&w=1600'},
  {id:6,title:'Lifestyle event venue',type:'Venue',city:'Dubai',price:900,traffic:'2,500 event guests',activations:['Sponsored event','Sampling','Pop up'],desc:'Sponsor select events, sample products and create branded moments around curated gatherings.',audience:'Professionals, creators, founders and affluent residents.',image:'https://images.pexels.com/photos/3835638/pexels-photo-3835638.jpeg?auto=compress&cs=tinysrgb&w=1600'}
];

let activeCategory = 'All';
const grid = document.getElementById('listingGrid');
const searchInput = document.getElementById('searchInput');
const locationFilter = document.getElementById('locationFilter');
const activationFilter = document.getElementById('activationFilter');
const budgetFilter = document.getElementById('budgetFilter');

function render(){
  const q = searchInput.value.toLowerCase().trim();
  const loc = locationFilter.value;
  const act = activationFilter.value;
  const budget = budgetFilter.value;
  const filtered = listings.filter(l => {
    const searchable = `${l.title} ${l.city} ${l.type} ${l.activations.join(' ')}`.toLowerCase();
    return (activeCategory==='All'||l.type===activeCategory) && (loc==='All'||l.city===loc) && (act==='All'||l.activations.includes(act)) && (budget==='All'||l.price<=Number(budget)) && (!q||searchable.includes(q));
  });
  grid.innerHTML = filtered.map(l => `
    <article class="listing-card" data-id="${l.id}">
      <div class="listing-image">
        <img src="${l.image}" alt="${l.title} in ${l.city}" loading="lazy">
        <span class="listing-tag">${l.type}</span>
      </div>
      <div class="listing-body">
        <div class="listing-title-row"><h3>${l.title}</h3><div class="listing-price">$${l.price}+</div></div>
        <div class="listing-meta">${l.city} · ${l.traffic}</div>
        <div class="listing-actions">${l.activations.slice(0,3).map(a=>`<span class="mini-chip">${a}</span>`).join('')}</div>
      </div>
    </article>`).join('');
  document.getElementById('noResults').classList.toggle('hidden', filtered.length>0);
  document.querySelectorAll('.listing-card').forEach(card=>card.addEventListener('click',()=>openListing(Number(card.dataset.id))));
}

document.querySelectorAll('.category-chip').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.category-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); activeCategory=btn.dataset.category; render();
}));
[searchInput,locationFilter,activationFilter,budgetFilter].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',render));

function openModal(id){document.getElementById(id).classList.add('open');document.getElementById(id).setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.open)));
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>closeModal(el.closest('.modal'))));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal.open').forEach(closeModal)});

function openListing(id){
  const l=listings.find(x=>x.id===id);
  const c=document.getElementById('listingModalContent');
  c.innerHTML=`<button class="modal-close" data-close>×</button><div class="eyebrow dark">${l.type.toUpperCase()} · ${l.city.toUpperCase()}</div><h2>${l.title}</h2><div class="listing-detail-hero"><img src="${l.image}" alt="${l.title} in ${l.city}"></div><div class="detail-meta"><span class="mini-chip">${l.traffic}</span><span class="mini-chip">from $${l.price}</span></div><div class="detail-box"><h4>Available opportunities</h4><p>${l.activations.join(' · ')}</p></div><div class="detail-box"><h4>About this space</h4><p>${l.desc}</p></div><div class="detail-box"><h4>Audience</h4><p>${l.audience}</p></div><button class="btn btn-dark btn-large full" id="requestThisSpace">Request this space</button>`;
  c.querySelector('[data-close]').addEventListener('click',()=>closeModal(document.getElementById('listingModal')));
  c.querySelector('#requestThisSpace').addEventListener('click',()=>{closeModal(document.getElementById('listingModal'));openModal('brandModal');document.querySelector('#brandForm textarea[name="details"]').value=`Interested in: ${l.title} in ${l.city}.`;});
  openModal('listingModal');
}

function mailtoForm(form, subjectPrefix){
  const data=new FormData(form); const lines=[]; data.forEach((v,k)=>lines.push(`${k}: ${v}`));
  const subject=encodeURIComponent(`${subjectPrefix}: ${data.get(subjectPrefix==='Brand brief'?'brand':'space')||''}`);
  const body=encodeURIComponent(lines.join('\n'));
  window.location.href=`mailto:hello@brandmystore.com?subject=${subject}&body=${body}`;
}
document.getElementById('brandForm').addEventListener('submit',e=>{e.preventDefault();mailtoForm(e.currentTarget,'Brand brief')});
document.getElementById('spaceForm').addEventListener('submit',e=>{e.preventDefault();mailtoForm(e.currentTarget,'New space')});

render();
