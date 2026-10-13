/* ===== EcoLife – shared JS: data, header/footer, cart, page logic ===== */

/* ---------- Login gate ----------
   Guests can browse (home, shop, product, contact) but can't add to cart or reach cart/orders until logged in. */
const AUTH_PAGES = ['login','signup'];
const PROTECTED_PAGES = ['cart','orders'];
const isLoggedIn = () => { try{ return !!JSON.parse(localStorage.getItem('ecolife_user')); }catch{ return false; } };
const userName = () => { try{ const u=JSON.parse(localStorage.getItem('ecolife_user'))||{}; return (u.name||'').trim().split(' ')[0] || (u.email||'').split('@')[0] || 'there'; }catch{ return 'there'; } };
const currentUrl = () => (location.pathname.split('/').pop() || 'index.html') + location.search;
const loginUrl = (next=currentUrl()) => 'login.html?next=' + encodeURIComponent(next);
const safeNext = n => /^[\w-]+\.html(\?[\w=&.%-]*)?$/i.test(n||'') && !/^(login|signup)\.html/i.test(n) ? n : 'index.html';
const isGuest = () => { try{ return localStorage.getItem('ecolife_guest')==='1'; }catch{ return false; } };
// First visit: must pick Log in / Sign up / Continue as guest. Guests can browse, but cart & orders still need a login.
const NEEDS_LOGIN = !AUTH_PAGES.includes(document.body.dataset.page) && !isLoggedIn() && (PROTECTED_PAGES.includes(document.body.dataset.page) || !isGuest());
if(NEEDS_LOGIN) location.replace(loginUrl());   // demo only – real sites must check the session on the server

/* ---------- Product data ----------
   Put your photos in /img and match the file names below (prices are indicative demo prices).
   If a file is missing, a coloured emoji placeholder is shown instead. */
const PRODUCTS = [
  {id:1, name:'Bamboo Glass Bottle', price:297, mrp:330, cat:'Kitchen', sub:'Kitchen / Bottles', material:['Bamboo','Glass'], values:['Reusable','Plastic free'], stock:true, badge:'10% off', img:'bamboo-glass-bottle.jpg', heroImg:['double-wall-bottle','bamboo-bottles','bottles'], emoji:'🍶'},
  {id:2, name:'Electric Bamboo Toothbrush', price:199, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Bamboo'], values:['Reusable'], stock:true, badge:'Best Seller', img:'electric-bamboo-toothbrush.jpg', emoji:'🪥'},
  {id:3, name:'Bamboo Bath Set', price:699, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Bamboo','Natural fibre'], values:['Plastic free','Handmade'], stock:true, badge:'Sale', onSale:true, img:'bamboo-bath-set.jpg', emoji:'🛁'},
  {id:4, name:'Travel Cutlery Set', price:549, cat:'Kitchen', sub:'Kitchen', material:['Bamboo'], values:['Reusable','Plastic free'], stock:true, badge:'New', img:'travel-cutlery-set.jpg', emoji:'🍴'},
  {id:5, name:'Woven Storage Basket', price:499, cat:'Home & Living', sub:'Home & Living', material:['Natural fibre'], values:['Handmade'], stock:true, img:'woven-storage-basket.jpg', emoji:'🧺'},
  {id:6, name:'Bamboo Lunch Box', price:799, cat:'Kitchen', sub:'Kitchen', material:['Bamboo','Glass'], values:['Reusable','Plastic free'], stock:true, badge:'10% off', img:'bamboo-lunch-box.jpg', emoji:'🍱'},
  {id:7, name:'Natural Coconut Scrubber', price:199, cat:'Kitchen', sub:'Kitchen', material:['Natural fibre'], values:['Compostable'], stock:true, badge:'Best Seller', img:'coconut-scrubber.jpg', emoji:'🥥'},
  {id:8, name:'Organic Bamboo Toothbrush', price:99, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Bamboo'], values:['Compostable','Plastic free'], stock:true, img:'organic-bamboo-toothbrush.jpg', emoji:'🪥'},
  {id:9, name:'Natural Loofah (Set of 2)', price:50, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Natural fibre'], values:['Compostable','Plastic free'], stock:true, badge:'New', img:'natural-loofah.jpg', emoji:'🧽'},
  {id:10, name:'Bamboo Square Plates', price:99, cat:'Kitchen', sub:'Kitchen', material:['Bamboo'], values:['Compostable'], stock:true, badge:'Sale', onSale:true, img:'bamboo-square-plates.jpg', emoji:'🍽️'},
  {id:11, name:'Compostable Bags', price:299, cat:'Pets & Garden', sub:'Pets & Garden', material:['Paper & plant-based'], values:['Compostable'], stock:true, img:'compostable-bags.jpg', emoji:'🛍️'},
  {id:12, name:'Paper Tape', price:99, cat:'Home & Living', sub:'Home & Living', material:['Paper & plant-based'], values:['Plastic free','Compostable'], stock:false, badge:'Best Seller', img:'paper-tape.jpg', emoji:'📦'},

  /* ---- Home & Living ---- */
  {id:13, name:'Jute Doormat', price:449, cat:'Home & Living', sub:'Home & Living', material:['Natural fibre'], values:['Handmade','Compostable'], stock:true, img:'jute-doormat', emoji:'🚪'},
  {id:14, name:'Soy Wax Candle in Glass Jar', price:349, mrp:399, cat:'Home & Living', sub:'Home & Living / Candles', material:['Glass','Paper & plant-based'], values:['Handmade','Reusable'], stock:true, badge:'New', img:'soy-wax-candle', emoji:'🕯️'},
  {id:15, name:'Cotton Macramé Plant Hanger', price:299, cat:'Home & Living', sub:'Home & Living / Decor', material:['Cotton & hemp'], values:['Handmade','Plastic free'], stock:true, img:'macrame-plant-hanger', emoji:'🪴'},
  {id:16, name:'Recycled Cotton Cushion Cover', price:399, cat:'Home & Living', sub:'Home & Living / Decor', material:['Cotton & hemp'], values:['Handmade'], stock:true, badge:'Best Seller', img:'cushion-cover', emoji:'🛋️'},
  {id:17, name:'Bamboo Laundry Hamper', price:1299, cat:'Home & Living', sub:'Home & Living / Storage', material:['Bamboo'], values:['Plastic free','Handmade'], stock:true, img:'bamboo-laundry-hamper', emoji:'🧺'},
  /* ---- Kitchen ---- */
  {id:18, name:'Stainless Steel Straws (Set of 4)', price:249, cat:'Kitchen', sub:'Kitchen / Drinkware', material:['Metal'], values:['Reusable','Plastic free'], stock:true, badge:'Best Seller', img:'steel-straws', emoji:'🥤'},
  {id:19, name:'Beeswax Food Wraps (Set of 3)', price:399, cat:'Kitchen', sub:'Kitchen / Storage', material:['Cotton & hemp'], values:['Reusable','Compostable','Plastic free'], stock:true, badge:'New', img:'beeswax-wraps', emoji:'🍯'},
  {id:20, name:'Copper Water Bottle 750 ml', price:749, mrp:899, cat:'Kitchen', sub:'Kitchen / Bottles', material:['Metal'], values:['Reusable','Plastic free'], stock:true, badge:'Sale', onSale:true, img:'copper-bottle', emoji:'🥛'},
  {id:21, name:'Wooden Cooking Spoons (Set of 5)', price:449, cat:'Kitchen', sub:'Kitchen / Cookware', material:['Wood'], values:['Handmade','Plastic free'], stock:true, img:'wooden-spoons', emoji:'🥄'},
  {id:22, name:'Stainless Steel Tiffin (3 tier)', price:899, cat:'Kitchen', sub:'Kitchen / Lunch', material:['Metal'], values:['Reusable','Plastic free'], stock:true, img:'steel-tiffin', emoji:'🍲'},
  /* ---- Bathroom & Personal Care ---- */
  {id:23, name:'Neem Wood Comb', price:149, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Wood'], values:['Handmade','Plastic free'], stock:true, img:'neem-comb', emoji:'💈'},
  {id:24, name:'Shampoo Bar (Hibiscus & Amla)', price:249, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Paper & plant-based'], values:['Plastic free','Compostable','Handmade'], stock:true, badge:'Best Seller', img:'shampoo-bar', emoji:'🧴'},
  {id:25, name:'Reusable Makeup Remover Pads (7)', price:299, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Cotton & hemp'], values:['Reusable','Plastic free'], stock:true, img:'makeup-remover-pads', emoji:'🧼'},
  {id:26, name:'Safety Razor with Bamboo Handle', price:549, mrp:649, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Bamboo','Metal'], values:['Reusable','Plastic free'], stock:true, badge:'10% off', img:'safety-razor', emoji:'🪒'},
  {id:27, name:'Beeswax Lip Balm', price:149, cat:'Bathroom & Care', sub:'Bathroom & Personal Care', material:['Paper & plant-based'], values:['Plastic free','Handmade'], stock:true, badge:'New', img:'lip-balm', emoji:'💄'},
  /* ---- Pets & Garden ---- */
  {id:28, name:'Hemp Dog Leash', price:499, cat:'Pets & Garden', sub:'Pets & Garden / Dogs', material:['Cotton & hemp'], values:['Reusable','Handmade'], stock:true, img:'hemp-dog-leash', emoji:'🐕'},
  {id:29, name:'Eco-friendly Coir Pet Bed', price:1199, cat:'Pets & Garden', sub:'Pets & Garden / Pet care', material:['Natural fibre'], values:['Handmade','Compostable'], stock:true, img:'coir-pet-bed', emoji:'🐾'},
  {id:30, name:'Plantable Seed Paper (Set of 10)', price:199, cat:'Pets & Garden', sub:'Pets & Garden / Garden', material:['Paper & plant-based'], values:['Compostable','Plastic free'], stock:true, badge:'New', img:'seed-paper', emoji:'🌱'},
  {id:31, name:'Terracotta Planter Set (2)', price:499, cat:'Pets & Garden', sub:'Pets & Garden / Garden', material:['Clay'], values:['Handmade','Plastic free'], stock:true, img:'terracotta-planters', emoji:'🏺'},
  {id:32, name:'Cotton Catnip Toy', price:79, cat:'Pets & Garden', sub:'Pets & Garden / Cats', material:['Cotton & hemp'], values:['Handmade','Compostable'], stock:true, img:'catnip-toys', emoji:'🐈'},
  {id:33, name:'Bamboo Pet Feeding Bowl', price:399, cat:'Pets & Garden', sub:'Pets & Garden / Pet care', material:['Bamboo'], values:['Plastic free','Reusable'], stock:false, img:'bamboo-pet-bowl', emoji:'🥣'},
  /* ---- Fashion & Apparel ---- */
  {id:34, name:'Organic Cotton T-shirt (Set of 3)', price:1299, cat:'Fashion', sub:'Fashion / Tops', material:['Cotton & hemp'], values:['Handmade'], stock:true, badge:'Best Seller', img:'organic-cotton-tshirt', emoji:'👕'},
  {id:35, name:'Hemp Tote Bag', price:349, cat:'Fashion', sub:'Fashion / Bags', material:['Cotton & hemp'], values:['Reusable','Plastic free'], stock:true, img:'hemp-tote-bag', emoji:'👜'},
  {id:36, name:'Jute Floral Tote Bag', price:299, cat:'Fashion', sub:'Fashion / Bags', material:['Cotton & jute'], values:['Reusable','Plastic free'], stock:true, img:'jute-tote-bag', emoji:'👜'},
  {id:37, name:'Block-Print Cotton Scarf', price:599, mrp:699, cat:'Fashion', sub:'Fashion / Accessories', material:['Cotton & hemp'], values:['Handmade'], stock:true, badge:'Sale', onSale:true, img:'block-print-scarf', emoji:'🧣'},
  {id:38, name:'Bamboo Fibre Socks (Pack of 3)', price:449, cat:'Fashion', sub:'Fashion / Essentials', material:['Bamboo'], values:['Plastic free'], stock:true, badge:'New', img:'bamboo-socks', emoji:'🧦'},
  {id:39, name:'Jute Sling Bag', price:649, cat:'Fashion', sub:'Fashion / Bags', material:['Natural fibre'], values:['Handmade','Compostable'], stock:true, img:'jute-sling-bag', emoji:'🎒'},
  {id:40, name:'Handloom Linen Kurta Men', price:1299, cat:'Fashion', sub:'Fashion / Tops', material:['Cotton & hemp'], values:['Handmade'], stock:true, img:'linen-kurta', emoji:'👘'},
  {id:41, name:'Handloom Linen Kurta Women', price:1299, cat:'Fashion', sub:'Fashion / Tops', material:['Cotton & hemp'], values:['Handmade'], stock:true, img:'linen-kurta-women', emoji:'👘'}
];
const CATEGORIES = ['Home & Living','Kitchen','Bathroom & Care','Pets & Garden','Fashion'];

/* ---------- Image file names (without extension) – rename here to match your /img folder ---------- */
const IMG = {
  logo:['ecolife-logo','eco-life-logo','logo','ecolife','eco-life'],
  loginBg:['login-bg','login-background','login','login-screen','auth-bg'],
  hero:'hero', saleBanner:'sale-banner', saleBannerMobile:['sale-banner-mobile','sale-banner-phone','sale-banner-m'], kitchenTowel:'kitchen-towel', circularPlates:'circular-plates',
  shippingBanner:'shipping-banner', paperStraws:'paper-straws',
  bottlesTrio:['double-wall-bottle','bamboo-bottles','bottles'],
  cats:{ 'Home & Living':'home-living', 'Bathroom & Care':'bathroom-personal-care', 'Pets & Garden':'pets-garden', 'Fashion':'fashion-apparel' }
};
const SALE_FALLBACK = `<div class="ribbon"><small>SPRING</small><strong>SALE</strong></div>`;
const FREE_SHIP_ABOVE = 3000, SHIPPING_FEE = 99, PROMO = {code:'ECOSTORE10', pct:10};
const rupee = n => '₹' + Number(n).toLocaleString('en-IN');
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const byId = id => PRODUCTS.find(p => p.id === Number(id));

/* ---------- Images with emoji fallback ---------- */
let _imgSeq=0; const _imgState={};
/* Tries img/<name>.png, .jpg, .jpeg, .webp (and - / _ spelling variants) until one loads.
   If none exist, shows the fallback HTML instead. */
function smartImg(names, alt='', fallback='', cls=''){
  const id=++_imgSeq, list=[];
  [].concat(names).forEach(n=>{
    n=n.replace(/\.(png|jpe?g|webp|svg)$/i,'');
    [n, n.replace(/-/g,'_'), n.replace(/_/g,'-')].forEach(v=>['png','jpg','jpeg','webp'].forEach(e=>list.push(`img/${v}.${e}`)));
  });
  const uniq=[...new Set(list)]; _imgState[id]={list:uniq,i:0,fb:fallback};
  return `<img src="${uniq[0]}" alt="${alt}" class="${cls}" data-img="${id}" onerror="imgNext(this)">`;
}
function imgNext(el){
  const st=_imgState[el.dataset.img]; st.i++;
  if(st.i<st.list.length) el.src=st.list[st.i]; else el.outerHTML=st.fb;
}
function imgBox(p, cls='', useHero=false){
  const names = (useHero && p.heroImg) ? [...p.heroImg, p.img] : [p.img];
  return `<div class="imgbox ${cls}">${smartImg(names, p.name, `<div class="ph">${p.emoji}</div>`)}</div>`;
}

/* ---------- Toast ---------- */
function toast(msg, opts={}){
  let t = $('.toast');
  if(!t){ t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); document.body.append(t); }
  t.textContent='';
  const ic=document.createElement('span'); ic.className='toast-ic'; ic.textContent=opts.icon||'✓';
  const tx=document.createElement('span'); tx.className='toast-msg'; tx.textContent=msg;
  t.append(ic, tx);
  if(opts.href){ const a=document.createElement('a'); a.href=opts.href; a.className='toast-link'; a.textContent=opts.link||'View'; t.append(a); }
  t.classList.remove('show'); void t.offsetWidth;   // restart animation on rapid clicks
  t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), opts.ms||2600);
}

/* ---------- Cart (localStorage) ---------- */
const Cart = {
  get(){ if(!isLoggedIn()) return [];   // guests always have an empty cart
    try{ return JSON.parse(localStorage.getItem('ecolife_cart')) || []; }catch{ return []; } },
  save(items){ if(!isLoggedIn()) return;   // guests can't store anything
    localStorage.setItem('ecolife_cart', JSON.stringify(items)); updateCartCount(); },
  add(id, qty=1){
    if(!isLoggedIn()){ toast('Please log in to start shopping', {icon:'🔒', href:loginUrl(), link:'Log in', ms:4000}); return false; }
    const items=this.get(); const f=items.find(i=>i.id===id); f ? f.qty+=qty : items.push({id,qty}); this.save(items);
    const p = (typeof byId==='function') ? byId(id) : null;
    toast(p ? `${p.name} added to cart` : 'Added to cart', {href:'cart.html', link:'View cart'});
    const cc=$('#cart-count'); if(cc){ cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump'); }
    return true; },
  setQty(id, qty){ let items=this.get(); items = qty<=0 ? items.filter(i=>i.id!==id) : items.map(i=>i.id===id?{...i,qty}:i); this.save(items); },
  remove(id){ this.save(this.get().filter(i=>i.id!==id)); },
  count(){ return this.get().reduce((s,i)=>s+i.qty,0); }
};
function updateCartCount(){ const el=$('#cart-count'); if(el){ const c=Cart.count(); el.textContent=c; el.hidden=!c; } }

/* ---------- Header & footer ---------- */
const CART_SVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.6-1.4 2.4A2 2 0 0 0 7 17h12v-2H7.4l1.1-2h7.5a2 2 0 0 0 1.7-1l3.6-6.5A1 1 0 0 0 20.4 4H5.2l-.9-2H1Z"/></svg>`;
function renderChrome(){
  const page = document.body.dataset.page, authed = isLoggedIn();
  const link = (href, label, key) => `<li><a href="${href}" class="${page===key?'active':''}">${label}</a></li>`;
  const h = $('#site-header');
  if(h) h.outerHTML = `<header class="site-header"><div class="container nav">
    <a href="index.html" class="logo" aria-label="EcoLife home">ECO&#127807;L<i>i</i>FE</a>
    <ul id="nav-list">${link('index.html','Home','home')}${link('shop.html','Shop','shop')}${link('contact.html','Contact','contact')}${authed?link('orders.html','Orders','orders')+'<li class="nav-logout"><a href="login.html" class="logout-link">Log out</a></li>':''}</ul>
    <span class="user-chip ${authed?'':'guest'}" title="${authed?'Logged in':'Browsing as a guest'}">👤 ${authed?'Hi, '+userName().replace(/[<>&"]/g,''):'Guest'}</span>
    <a href="cart.html" class="cart-link">${CART_SVG} Cart <span class="cart-count" id="cart-count" hidden>0</span></a>
    ${authed?'<a href="login.html" class="cart-link logout-link" id="logout">Log out</a>':`<a href="${loginUrl()}" class="btn btn-olive btn-sm login-btn" id="login-btn">Log in</a>`}
    <button class="menu-btn" aria-label="Menu" aria-controls="nav-list" aria-expanded="false" onclick="this.setAttribute('aria-expanded',$('#nav-list').classList.toggle('open'))">☰</button></div></header>`;
  if(!authed && !AUTH_PAGES.includes(page)){
    let hidden=false; try{ hidden = sessionStorage.getItem('ecolife_guestbar')==='0'; }catch{}
    if(!hidden) document.querySelector('.site-header')?.insertAdjacentHTML('afterend', `<div class="guest-bar" role="note"><span>👤 You’re browsing as a <b>guest</b>. Log in or sign up to add items to your cart.</span><span class="gb-actions"><a class="gb-login" href="${loginUrl()}">Log in</a><a href="signup.html?next=${encodeURIComponent(currentUrl())}">Sign up</a><button class="gb-x" aria-label="Dismiss">×</button></span></div>`);
    $('.guest-bar .gb-x')?.addEventListener('click', e=>{ e.target.closest('.guest-bar').remove(); try{ sessionStorage.setItem('ecolife_guestbar','0'); }catch{} });
  }
  const f = $('#site-footer');
  if(f) f.outerHTML = `<footer class="site-footer"><div class="container">
    <div class="foot-grid">
      <div class="foot-brand"><a href="index.html" class="foot-logo" aria-label="EcoLife home">${smartImg(IMG.logo,'EcoLife',`<span class="logo">ECO&#127807;L<i>i</i>FE</span>`)}</a><p>Better Goods, Lighter Footprint</p>
        <div class="badges"><div><span>♻️</span>Plastic Free</div><div><span>🌍</span>Carbon Neutral</div><div><span>🌱</span>Sustainable</div></div></div>
      <div><h4>Quick Links</h4><ul><li><a href="shop.html">Shop All</a></li><li><a href="contact.html">Contact Us</a></ul></div>
      <div><h4>Customer Service</h4><ul><li><a href="orders.html">Shipping &amp; Returns</a></li><li><a href="contact.html">FAQs</a></li></ul></div>
      <div><h4>Get in Touch</h4><ul class="contact"><li>📞 +91-98765-43210</li><li>✉️ info@ecolife.com</li></ul><hr style="border:0;border-top:1px solid var(--line);margin:22px 0">
        <h4>Stay updated</h4><p class="copy">Get updates on new products and offers!</p>
        <form class="sub-form" id="sub-form"><input type="email" required placeholder="Email address" aria-label="Email address"><button>Subscribe</button></form>
        <button class="btn btn-olive btn-sm" id="install-app" hidden style="margin-bottom:14px">📲 Install the EcoLife app</button>
        <p class="copy">© 2026 EcoLife. All rights reserved.<br>Made with nature</p></div>
    </div></div></footer>`;
  const ib=$('#install-app'); if(ib){ if(deferredInstall) ib.hidden=false; ib.onclick=async()=>{ if(!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall=null; ib.hidden=true; }; }
  $('#sub-form')?.addEventListener('submit', e=>{ e.preventDefault(); e.target.reset(); toast('Thanks for subscribing!'); });
  const sb=$('#sale-banner'); if(sb) sb.innerHTML = `<div class="sb-desktop">${smartImg(IMG.saleBanner,'Spring sale', SALE_FALLBACK)}</div><div class="sb-mobile">${smartImg(IMG.saleBannerMobile,'Spring sale','')}</div>`;
  $$('.logout-link').forEach(a=>a.addEventListener('click', e=>{ e.preventDefault(); localStorage.removeItem('ecolife_user'); localStorage.removeItem('ecolife_guest'); location.href='login.html'; }));
  updateCartCount();
}

/* ---------- Product card ---------- */
function productCard(p){
  const badgeCls = {'10% off':'off','Sale':'sale','Best Seller':'best','New':'new'}[p.badge];
  return `<article class="card">
    <a href="product.html?id=${p.id}" class="imgbox-wrap">${p.badge?`<span class="badge ${badgeCls}">${p.badge}</span>`:''}${imgBox(p)}</a>
    <div class="body"><div class="cat">${p.sub}</div><h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="row"><span class="price">${rupee(p.price)}${p.mrp?`<s>${rupee(p.mrp)}</s>`:''}</span>
      <button class="btn btn-yellow btn-sm" data-add="${p.id}">Add to Cart</button></div></div></article>`;
}
document.addEventListener('click', e=>{ const b=e.target.closest('[data-add]'); if(!b) return; if(!Cart.add(Number(b.dataset.add))) return;
  if(!b._orig){ b._orig=b.textContent; } b.textContent='Added ✓'; b.classList.add('added'); clearTimeout(b._t);
  b._t=setTimeout(()=>{ b.textContent=b._orig; b.classList.remove('added'); }, 1400); });

/* =========================================================
   PAGE: HOME
   ========================================================= */
function initHome(){
  const fb = e => `<div class="ph">${e}</div>`;
  $('#hero-img').innerHTML = smartImg(IMG.hero,'Eco-friendly products on a table', fb('🛍️'));
  $('#mini-towel').innerHTML = smartImg(IMG.kitchenTowel,'Reusable bamboo kitchen towel', fb('🧻'));
  $('#mini-plates').innerHTML = smartImg(IMG.circularPlates,'Circular plates', fb('🍽️'));

  const cats = [
    ['c-yellow','Home & Living','Home & Living','Make your home feel like home','🛋️'],
    ['c-blue','Bathroom & Care','Bathroom & Personal Care','Stay fresh, feel your best','🧼'],
    ['c-lime','Pets & Garden','Pets & Garden','Happy pets, healthier greens','🐶'],
    ['c-pink','Fashion','Fashion & Apparel','Trendy looks for every you','👚']
  ];
  $('#cat-row').innerHTML = cats.map(([c,key,title,sub,e])=>`<div class="cat-card ${c}"><h3>${title}</h3><p>${sub}</p>
    <a class="btn" href="shop.html?cat=${encodeURIComponent(key)}">Order Now</a>
    <div class="cat-img">${smartImg(IMG.cats[key], title, fb(e))}</div></div>`).join('');

  const p1 = byId(1);
  $('#feat-hero').innerHTML = smartImg([...IMG.bottlesTrio, p1.img], p1.name, fb(p1.emoji));
  $('#feat-side').innerHTML = [7,8].map((id,i)=>{ const p=byId(id);
    return `<a href="product.html?id=${p.id}" class="feat-card ${i?'bg-cream':'bg-peach'}"><h4>${p.name.toUpperCase()}</h4>
    <div class="from">from <b>${rupee(p.price)}</b></div>${imgBox(p)}</a>`; }).join('');

  const p11=byId(11), p10=byId(10), p12=byId(12);
  $('#feat-row').innerHTML = `
    <a href="product.html?id=11" class="feat-card bg-peach"><h4>COMPOSTABLE BAGS</h4><div class="from from-badge">from <b>${rupee(p11.price)}</b></div>${imgBox(p11)}</a>
    <a href="product.html?id=10" class="feat-card bg-cream"><h4>BAMBOO SQUARE PLATES</h4>${imgBox(p10)}</a>
    <a href="product.html?id=12" class="feat-card bg-sage tape">${imgBox(p12)}</a>
    <a href="shop.html" class="feat-card bg-sky"><h4>PAPER STRAWS<br><small>Biodegradable</small></h4>
      <div class="imgbox">${smartImg(IMG.paperStraws,'Paper straws', fb('🥤'))}</div></a>`;
}

/* =========================================================
   PAGE: SHOP
   ========================================================= */
function initShop(){
  const params = new URLSearchParams(location.search);
  const state = { q:'', cats:new Set(params.get('cat') ? [params.get('cat')] : []), mats:new Set(), vals:new Set(), stock:false, sale:false, min:0, max:2000, sort:'default', page:1 };
  const catLabel = c => c==='Bathroom'?'Bathroom & Care':c;
  if(params.get('cat')){ state.cats = new Set([catLabel(params.get('cat'))]); }

  const checkbox = (name, label, set) => `<label><input type="checkbox" data-set="${name}" value="${label}" ${set.has(label)?'checked':''}> ${label}</label>`;
  const count = c => PRODUCTS.filter(p=>p.cat===c).length;
  $('#f-cats').innerHTML = CATEGORIES.map(c=>checkbox('cats', c, state.cats).replace('</label>',` (${count(c)})</label>`)).join('');
  $('#f-mats').innerHTML = ['Bamboo','Wood','Natural fibre','Cotton & hemp','Metal','Glass','Clay','Paper & plant-based'].map(m=>checkbox('mats',m,state.mats)).join('');
  $('#f-vals').innerHTML = ['Plastic free','Reusable','Compostable','Handmade'].map(m=>checkbox('vals',m,state.vals)).join('');

  function filtered(){
    let list = PRODUCTS.filter(p =>
      (!state.q || p.name.toLowerCase().includes(state.q.toLowerCase())) &&
      (!state.cats.size || state.cats.has(p.cat)) &&
      (!state.mats.size || p.material.some(m=>state.mats.has(m))) &&
      (!state.vals.size || p.values.some(v=>state.vals.has(v))) &&
      (!state.stock || p.stock) && (!state.sale || p.onSale || p.mrp) &&
      p.price>=state.min && p.price<=state.max);
    if(state.sort==='low') list.sort((a,b)=>a.price-b.price);
    if(state.sort==='high') list.sort((a,b)=>b.price-a.price);
    if(state.sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  }
  const drawer = open => { $('#filters').classList.toggle('open',open); document.body.style.overflow = open ? 'hidden' : ''; };
  $('#filter-toggle')?.addEventListener('click',()=>drawer(true));
  $$('[data-close-filters]').forEach(b=>b.addEventListener('click',()=>drawer(false)));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') drawer(false); });
  const PAGE_SIZE = 12;
  function render(keepPage){
    if(!keepPage) state.page = 1;
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length/PAGE_SIZE));
    state.page = Number.isFinite(state.page) ? Math.min(Math.max(1, state.page), pages) : 1;
    const from = (state.page-1)*PAGE_SIZE, slice = list.slice(from, from+PAGE_SIZE);
    $('#grid').innerHTML = slice.length ? slice.map(productCard).join('') : `<div class="empty"><h3>No products match</h3><p>Try removing a filter or widening the price range.</p></div>`;
    $('#showing').textContent = list.length ? `Showing ${from+1}–${from+slice.length} of ${list.length} results` : 'Showing 0 results';
    $('#pager').innerHTML = pages>1 ? Array.from({length:pages},(_,i)=>`<button class="${i+1===state.page?'on':''}" data-page="${i+1}" aria-label="Page ${i+1}">${i+1}</button>`).join('') : '';
    const chips = [...state.cats,...state.mats,...state.vals].map(v=>`<span class="chip">${v} <button data-chip="${v}" aria-label="Remove ${v}">×</button></span>`);
    if(state.stock) chips.push(`<span class="chip">In Stock <button data-chip="__stock" aria-label="Remove In Stock">×</button></span>`);
    if(state.sale) chips.push(`<span class="chip">On sale <button data-chip="__sale" aria-label="Remove On sale">×</button></span>`);
    $('#chips').innerHTML = chips.length ? `Active Filter: ${chips.join('')} <button class="link-btn" id="clear">Clear All</button>` : '';
  }
  document.addEventListener('change', e=>{
    const t=e.target;
    if(t.dataset.set){ t.checked ? state[t.dataset.set].add(t.value) : state[t.dataset.set].delete(t.value); }
    if(t.id==='f-stock') state.stock=t.checked;
    if(t.id==='f-sale') state.sale=t.checked;
    if(t.id==='sort') state.sort=t.value;
    render();
  });
  $('#q').addEventListener('input', e=>{ state.q=e.target.value; render(); });
  const syncPrice = ()=>{ state.min=Number($('#pmin').value)||0; state.max=Number($('#pmax').value)||2000; $('#range').value=state.max; render(); };
  $('#pmin').addEventListener('input', syncPrice); $('#pmax').addEventListener('input', syncPrice);
  $('#range').addEventListener('input', e=>{ $('#pmax').value=e.target.value; syncPrice(); });
  document.addEventListener('click', e=>{
    const pg=e.target.closest('#pager [data-page]');
    if(pg){ const n=parseInt(pg.dataset.page,10); if(!Number.isFinite(n)) return; state.page=n; render(true); $('#grid').scrollIntoView({behavior:'smooth',block:'start'}); return; }
    const c=e.target.closest('[data-chip]');
    if(c){ const v=c.dataset.chip;
      if(v==='__stock'){state.stock=false;$('#f-stock').checked=false}
      else if(v==='__sale'){state.sale=false;$('#f-sale').checked=false}
      else ['cats','mats','vals'].forEach(k=>{ if(state[k].delete(v)) $$(`[data-set="${k}"]`).forEach(i=>{ if(i.value===v) i.checked=false; }); });
      render(); }
    if(e.target.id==='clear'){ ['cats','mats','vals'].forEach(k=>state[k].clear()); state.stock=state.sale=false; $$('.filters input[type=checkbox]').forEach(i=>i.checked=false); render(); }
  });
  render();
}

/* =========================================================
   PAGE: PRODUCT
   ========================================================= */
/* ---------- Reviews (stored in this browser's localStorage – demo only; use a database for a real shop) ---------- */
const escHtml = v => String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Starter reviews shown to every visitor (read-only). Rows: [name, rating, title, text, date, verified purchase?]
   Products without an entry (e.g. ids 12, 13, 17, 28, 31, 33, 36, 39, 40, 41) intentionally have no reviews yet. */
const SEED_REVIEWS = (() => {
  const raw = {
    1: [
      ["Priya Nair",5,"Looks great, no plastic taste","Been using this at the office for two months. The glass is thick, the bamboo sleeve feels lovely and there is zero taste or smell, unlike my old plastic bottle.","2026-08-14",1],
      ["Rohan Deshmukh",4,"Solid, just a little heavy","Beautiful bottle and keeps water fresh. It is heavier than steel when full, so I carry it in my bag. Would still buy again.","2026-09-02",1],
      ["Ananya Rao",5,"Perfect gift","Bought two, one for me and one for my sister. The packaging was plastic free too, which was a nice touch.","2026-07-21",1],
      ["Vikram Singh",3,"Good, but handle with care","Lovely design but I dropped it once on tile and the glass chipped. Fine if you are careful with it.","2026-09-19",0]
    ],
    2: [
      ["Sneha Iyer",5,"Battery lasts forever","Charged it once and it ran for nearly three weeks of daily use. Bristles are soft and gentle on my gums.","2026-08-03",1],
      ["Karan Malhotra",4,"Good value","Does the job well for the price. Wish replacement heads were easier to find, but otherwise happy.","2026-09-11",1],
      ["Meera Kulkarni",5,"Love the bamboo handle","Feels nicer than a regular electric brush and looks good by the sink. The motor is quiet too.","2026-07-15",0],
      ["Rahul Verma",4,"Nice and gentle","Soft bristles and the two-minute timer is handy. The charging cable is a bit short.","2026-10-01",1]
    ],
    3: [
      ["Isha Kapoor",5,"Spa-like set","Got this on sale and it feels like a proper spa set. Everything feels natural and the brush has a good grip.","2026-08-22",1],
      ["Arjun Patel",4,"Great for the price","Good quality and nicely finished. The loofah mitt is a little rough at first but softens after a few uses.","2026-09-05",1],
      ["Kavya Menon",5,"Lovely gift","Gifted it for a housewarming and it was a hit. It arrived in neat recyclable packaging.","2026-10-04",0]
    ],
    4: [
      ["Siddharth Joshi",5,"Perfect for train journeys","Fork, spoon, knife and chopsticks fit in a neat pouch. Smooth finish, no splinters and it washes easily.","2026-09-08",1],
      ["Neha Gupta",4,"Handy for office lunches","Light and sturdy. The knife is fine for soft food but not very sharp, which is okay for me.","2026-08-27",1],
      ["Farhan Sheikh",5,"Done with disposable cutlery","Takes no space in my bag. Used it daily for six weeks and it still looks new.","2026-10-07",0]
    ],
    5: [
      ["Divya Reddy",5,"Sturdy and pretty","Holds all my throw blankets. The weave is tight and neat and there is no strong smell.","2026-07-30",1],
      ["Aditya Bose",4,"Great, but slightly smaller","Quality is excellent, though it is a bit smaller than I pictured. Check the dimensions before ordering.","2026-08-18",1],
      ["Pooja Shetty",5,"Exactly what the living room needed","Natural look, and it holds its shape even when full.","2026-09-23",0]
    ],
    6: [
      ["Manish Agarwal",5,"Leak-resistant and stylish","Carried dal and rice to work all week with no leaks. The glass container is easy to clean.","2026-08-09",1],
      ["Tanvi Choudhary",4,"Great, but not for thin gravies","Works perfectly for rotis and dry sabzi. With a thin curry I got slight seepage around the lid once.","2026-09-14",1],
      ["Nikhil Pillai",5,"Replaced my plastic tiffin","The kids love it. Looks premium and cleans easily.","2026-07-26",1],
      ["Shruti Banerjee",4,"Pretty and practical","Wipe the bamboo lid dry instead of soaking it and it should last. Happy with it.","2026-10-02",0]
    ],
    7: [
      ["Zoya Khan",5,"Better than synthetic scrubbers","Cleans greasy pans well and does not scratch. Dries fast and has no smell.","2026-08-12",1],
      ["Harsh Vora",4,"Works well","Tough on burnt-on food. It sheds a few fibres at first, then settles down.","2026-09-01",1],
      ["Lakshmi Narayanan",5,"Great and compostable","Used one for a month and then it went into my compost bin. A really easy swap.","2026-09-27",0]
    ],
    8: [
      ["Rhea D'Souza",5,"Best at this price","Soft bristles, comfortable handle and only ₹99. Bought a pack for the whole family.","2026-08-05",1],
      ["Aarav Mehta",4,"Does the job","Good brush. The bristles are nylon, so remove them before composting the handle.","2026-09-16",1],
      ["Kavya Menon",5,"Switched the whole family","Smooth finish with no splinters. An easy decision.","2026-10-06",1]
    ],
    9: [
      ["Pooja Shetty",4,"Gentle exfoliation","Soft once wet and lathers well. Two in a set is good value.","2026-08-20",1],
      ["Rahul Verma",5,"Great value","Lasted me a good while and it is compostable at the end. Love it.","2026-09-09",1],
      ["Isha Kapoor",3,"Okay, a bit coarse","Pretty rough when dry and took a couple of uses to soften. Fine afterwards.","2026-07-29",0]
    ],
    10: [
      ["Arjun Patel",4,"Good for parties","Used them at a birthday get-together. Sturdy enough for biryani and cleanup was easy.","2026-09-13",1],
      ["Sneha Iyer",5,"Great ₹99 buy","Looks elegant, much nicer than paper plates and fully compostable.","2026-08-24",1],
      ["Karan Malhotra",3,"Fine, but not very deep","Good for snacks, but gravy tends to spread. I wish the edges were a bit higher.","2026-10-03",0]
    ],
    11: [
      ["Meera Kulkarni",4,"Strong enough for daily use","Used for kitchen waste and no tearing so far. Keep them away from damp spots before use.","2026-08-30",1],
      ["Siddharth Joshi",5,"Great for pet walks","Good size and thickness, and no smell leaks through.","2026-09-21",1],
      ["Neha Gupta",3,"Fine, but pricey","Good bags but they cost more than regular ones. Worth it if you compost.","2026-07-18",0]
    ],
    14: [
      ["Divya Reddy",5,"Burns clean and even","Mild scent, no black soot and the jar is lovely to reuse afterwards.","2026-09-06",1],
      ["Farhan Sheikh",4,"Lovely, subtle scent","Not overpowering, which I like. Burn time felt close to what is listed.","2026-09-29",1],
      ["Aditya Bose",5,"Cosy evenings","Getting the house ready for Diwali and already ordering another.","2026-10-09",0]
    ],
    15: [
      ["Tanvi Choudhary",5,"Neat knots, strong cord","Holds a medium pot easily and looks great near my window.","2026-08-16",1],
      ["Nikhil Pillai",4,"Pretty","Adds a nice touch to the balcony. The length is just right.","2026-09-25",0]
    ],
    16: [
      ["Manish Agarwal",4,"Soft, lovely colours","The fabric feels soft and the stitching is neat. A slightly loose fit on my 16-inch cushions.","2026-08-08",1],
      ["Shruti Banerjee",5,"Lovely texture","Washed it twice and there is no fading. Good value for the price.","2026-09-17",1],
      ["Zoya Khan",4,"Good quality","The zip works smoothly. Would love more colour options.","2026-10-05",0]
    ],
    18: [
      ["Harsh Vora",5,"Comes with a cleaning brush","Great for smoothies and for the kids. No metallic taste at all.","2026-08-11",1],
      ["Lakshmi Narayanan",5,"Good thickness","Not flimsy at all and easy to clean. Smooth edges.","2026-09-03",1],
      ["Rhea D'Souza",4,"Best with cold drinks","Perfect for juices and cold coffee. With hot chai the straw gets warm, so be careful.","2026-09-26",1],
      ["Aarav Mehta",5,"Bought for the whole family","Fits neatly in my cutlery pouch.","2026-07-24",0]
    ],
    19: [
      ["Priya Nair",5,"Replaced my cling film","Mould nicely around bowls and keep cut veggies fresh. Wash in cool water and they last.","2026-08-19",1],
      ["Rohan Deshmukh",4,"Works well, mild scent","A little sticky at first, but great once warmed by your hands.","2026-09-12",1],
      ["Ananya Rao",5,"Good range of sizes","Small, medium and large cover everything from lemons to bowls.","2026-10-08",0]
    ],
    20: [
      ["Vikram Singh",5,"Traditional and beautiful","Water tastes fresh and the bottle looks premium. The cap seals well.","2026-08-01",1],
      ["Sneha Iyer",4,"Good build","Sturdy, if a bit heavy. A quick clean with lemon and salt keeps the shine.","2026-09-10",1],
      ["Karan Malhotra",5,"Great sale price","Bought it on offer and I am very happy with the finish.","2026-09-30",1],
      ["Meera Kulkarni",3,"Lid could fit tighter","Beautiful bottle, but the cap leaked a little in my bag until I tightened it fully.","2026-07-27",0]
    ],
    21: [
      ["Rahul Verma",5,"Smooth and well finished","No rough edges and perfect for non-stick pans.","2026-08-28",1],
      ["Isha Kapoor",4,"Good set","Five different shapes cover everything. Oil them once in a while.","2026-09-22",1]
    ],
    22: [
      ["Arjun Patel",5,"Great for office lunch","Three tiers hold dal, sabzi and rotis easily. Sturdy clasp and no leaks.","2026-08-07",1],
      ["Kavya Menon",5,"Solid build","Feels like it will last for years and is easy to clean.","2026-09-04",1],
      ["Siddharth Joshi",4,"Heavy when full","Very good quality, though a little heavy to carry with all three tiers filled.","2026-10-02",0]
    ],
    23: [
      ["Neha Gupta",5,"Less frizz","My hair feels smoother and there is far less static than with plastic combs.","2026-08-15",1],
      ["Farhan Sheikh",4,"Light and nice","Well finished teeth with no snagging. A faint woody smell.","2026-09-18",1],
      ["Divya Reddy",5,"Simple and effective","Will buy another one for travel.","2026-10-06",0]
    ],
    24: [
      ["Aditya Bose",5,"Lathers beautifully","Mild hibiscus scent and my hair feels clean without being dry. It lasts ages.","2026-08-04",1],
      ["Pooja Shetty",4,"Good bar","Took about a week for my hair to adjust, but now I love it.","2026-09-07",1],
      ["Manish Agarwal",5,"Plastic-free win","Travels well with no leaking. Good swap for a bottle.","2026-09-28",1],
      ["Tanvi Choudhary",3,"Nice, but a bit heavy for my scalp","Works better if you rinse thoroughly. Okay for me, may suit dry hair more.","2026-07-20",0]
    ],
    25: [
      ["Nikhil Pillai",5,"Soft and effective","Removes makeup with just water. Wash them in a mesh bag and they stay soft.","2026-08-21",1],
      ["Shruti Banerjee",4,"Good value","Seven pads last me the week and they are soft on the skin.","2026-09-15",1]
    ],
    26: [
      ["Zoya Khan",5,"Closer shave","Takes a day to get used to, but the shave is far smoother and cheaper in the long run.","2026-08-13",1],
      ["Harsh Vora",4,"Quality build","Weighty and well balanced. Go gently for the first few shaves.","2026-09-20",1],
      ["Lakshmi Narayanan",5,"Switched from cartridges","Saves money and cuts plastic waste. The bamboo handle grips well even when wet.","2026-10-04",0]
    ],
    27: [
      ["Rhea D'Souza",5,"Soft lips again","Smooth, not sticky, with a lovely natural scent.","2026-09-02",1],
      ["Aarav Mehta",4,"Nice and hydrating","Small, but a little goes a long way.","2026-09-24",1],
      ["Priya Nair",5,"Better than store-bought","No weird after-feel. I keep one in every bag now.","2026-10-09",0]
    ],
    29: [
      ["Rohan Deshmukh",5,"My dog approves","Took him a day to settle but now he naps on it all the time. Sturdy and easy to shake clean.","2026-08-26",1],
      ["Ananya Rao",4,"Good, a bit firm","Excellent quality. My older dog wanted extra padding so we added a blanket.","2026-09-19",1]
    ],
    30: [
      ["Vikram Singh",5,"Cute and clever","Used them as thank-you cards for a birthday party. Sprouted basil in two weeks!","2026-08-17",1],
      ["Sneha Iyer",4,"Lovely idea","Good sprouting rate. The paper is a little textured to write on with fine pens.","2026-09-08",1],
      ["Karan Malhotra",5,"Great gift","Planted it in a small pot and herbs came up nicely.","2026-10-05",0]
    ],
    32: [
      ["Meera Kulkarni",5,"Cat goes wild","My cat will not leave it alone. It is her clear favourite and the stitching is strong.","2026-08-29",1],
      ["Rahul Verma",4,"Cute and safe","Natural cotton with no plastic bits. The catnip lost some punch after a few weeks.","2026-09-14",1],
      ["Isha Kapoor",3,"Smaller than expected","My cat likes it, but it is quite small. Better for kittens.","2026-10-01",0]
    ],
    34: [
      ["Arjun Patel",5,"Soft and breathable","Perfect for Mumbai humidity. Fits true to size with no shrinking after washes.","2026-08-06",1],
      ["Kavya Menon",4,"Good everyday tees","The fabric is soft and the neckline holds its shape. Muted colours, which I like.","2026-09-01",1],
      ["Siddharth Joshi",5,"Great value for three","Excellent quality for the price.","2026-09-26",1],
      ["Neha Gupta",3,"Runs slightly large","Great fabric but I should have sized down.","2026-07-31",0]
    ],
    35: [
      ["Farhan Sheikh",5,"Strong and roomy","Carries my groceries and a laptop without any trouble. Solid stitching.","2026-08-23",1],
      ["Divya Reddy",4,"Simple and sturdy","A bit rough at first but it softens with washing.","2026-09-17",1],
      ["Aditya Bose",5,"Daily carry","Using it as my everyday bag for weeks now.","2026-10-07",0]
    ],
    37: [
      ["Pooja Shetty",5,"Gorgeous print","The colours are rich and the cotton drapes well. Got many compliments.","2026-08-31",1],
      ["Manish Agarwal",4,"Lovely handwork","Slight variations in the print, which is part of the charm.","2026-09-23",1],
      ["Tanvi Choudhary",5,"Perfect gift","Gifted it to my mother and she loved it.","2026-10-03",0]
    ],
    38: [
      ["Nikhil Pillai",5,"Incredibly soft","Softer than my cotton socks and they stay fresh all day.","2026-09-09",1],
      ["Shruti Banerjee",4,"Comfortable","Good stretch and they stay in place.","2026-09-30",1],
      ["Zoya Khan",5,"Worth it","The pack of three is great value.","2026-10-08",0]
    ]
  };
  const out = {};
  for (const [pid, list] of Object.entries(raw))
    out[pid] = list.map(([name, rating, title, text, date, verified], i) => ({
      id: `seed-${pid}-${i}`, seed: true, email: '', name, rating, title, text,
      ts: new Date(date + 'T10:00:00+05:30').getTime(), verified: !!verified
    }));
  return out;
})();
const Reviews = {
  all(){ try{ return JSON.parse(localStorage.getItem('ecolife_reviews')) || {}; }catch{ return {}; } },
  get(pid){ return [...(SEED_REVIEWS[pid] || []), ...(this.all()[pid] || [])]; },   // starter reviews + this browser's own
  save(pid, list){ const a=this.all(); a[pid]=list.filter(r=>!r.seed); try{ localStorage.setItem('ecolife_reviews', JSON.stringify(a)); }catch{} },
  stats(pid){ const l=this.get(pid), n=l.length; return { n, avg: n ? l.reduce((s,r)=>s+r.rating,0)/n : 0 }; }
};
const starStr = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5-Math.round(r));
function currentUser(){ try{ return JSON.parse(localStorage.getItem('ecolife_user')) || null; }catch{ return null; } }

function initReviews(p){
  const sec = document.createElement('section'); sec.className='reviews'; sec.id='reviews';
  $('.like').before(sec);
  const sort = { v:'new' };

  function headRating(){
    const {n,avg}=Reviews.stats(p.id), el=$('#rating-line'); if(!el) return;
    el.innerHTML = n ? `<span style="color:var(--muted)">${avg.toFixed(1)}</span> <span class="stars">${starStr(avg)}</span> <a href="#reviews" class="rev-link">${n} review${n>1?'s':''}</a>`
                     : `<span class="stars" style="color:#ccc">☆☆☆☆☆</span> <a href="#reviews" class="rev-link">No reviews yet – be the first</a>`;
  }

  function draw(){
    const user=currentUser(), list=Reviews.get(p.id).slice(), {n,avg}=Reviews.stats(p.id);
    const mine = user && list.find(r=>r.email===user.email);
    if(sort.v==='new') list.sort((a,b)=>b.ts-a.ts);
    if(sort.v==='high') list.sort((a,b)=>b.rating-a.rating||b.ts-a.ts);
    if(sort.v==='low') list.sort((a,b)=>a.rating-b.rating||b.ts-a.ts);
    const dist = [5,4,3,2,1].map(k=>{ const c=Reviews.get(p.id).filter(r=>r.rating===k).length; return `<div class="dist-row"><span>${k}★</span><div class="bar"><i style="width:${n?c/n*100:0}%"></i></div><span class="c">${c}</span></div>`; }).join('');
    let bought=false; try{ bought = typeof Orders!=='undefined' && Orders.get().some(o=>(o.items||[]).some(i=>i.id===p.id)); }catch{}

    const form = !user
      ? `<div class="rev-login"><b>Want to share your thoughts?</b><p>Log in to write a review.</p><a class="btn btn-olive" href="${loginUrl()}">Log in to review</a></div>`
      : `<form id="rev-form" novalidate><h3>${mine?'Update your review':'Write a review'}</h3>
          <div class="star-pick" role="radiogroup" aria-label="Your rating">${[5,4,3,2,1].map(k=>`<input type="radio" name="rating" id="st${k}" value="${k}" ${mine&&mine.rating===k?'checked':''}><label for="st${k}" title="${k} star${k>1?'s':''}">★</label>`).join('')}</div>
          <label class="field"><span class="i">✏️</span><input name="title" maxlength="80" placeholder="Review title (optional)" value="${escHtml(mine?.title||'')}"></label>
          <label class="field area"><textarea name="text" rows="5" maxlength="1000" placeholder="What did you like or dislike? How are you using it?">${escHtml(mine?.text||'')}</textarea></label>
          <div class="form-err" id="rev-err" role="alert"></div>
          <button class="btn btn-olive" type="submit">${mine?'Update review':'Submit review'}</button></form>`;

    sec.innerHTML = `<h2>Customer reviews</h2>
      <div class="rev-layout">
        <div class="rev-side">
          <div class="rev-summary">${n?`<div class="big">${avg.toFixed(1)}</div><div class="stars">${starStr(avg)}</div><div class="muted">${n} review${n>1?'s':''}</div>`:`<div class="muted">No reviews yet.</div>`}<div class="dist">${dist}</div></div>
          ${form}
        </div>
        <div class="rev-main">
          <div class="rev-toolbar"><span>${n?`${n} review${n>1?'s':''}`:''}</span><label>Sort by: <select id="rev-sort"><option value="new">Newest</option><option value="high">Highest rated</option><option value="low">Lowest rated</option></select></label></div>
          ${n ? list.map(r=>`<article class="review"><div class="rv-top"><span class="avatar">${escHtml((r.name||'?')[0].toUpperCase())}</span><div><b>${escHtml(r.name)}</b>${r.verified?' <span class="vbadge">✓ Verified purchase</span>':''}<div class="rv-date">${new Date(r.ts).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div></div></div>
            <div><span class="stars">${starStr(r.rating)}</span>${r.title?` <b class="rv-title">${escHtml(r.title)}</b>`:''}</div>
            <p>${escHtml(r.text).replace(/\n/g,'<br>')}</p>
            ${user&&r.email===user.email?`<button class="link-btn" data-del-review>Delete my review</button>`:''}</article>`).join('')
            : `<div class="empty"><h3>No reviews yet</h3><p>Be the first to review ${escHtml(p.name)}.</p></div>`}
        </div></div>`;
    $('#rev-sort').value = sort.v;
    $('#rev-sort').onchange = e=>{ sort.v=e.target.value; draw(); };
    sec.querySelector('[data-del-review]')?.addEventListener('click',()=>{ if(!confirm('Delete your review?')) return; Reviews.save(p.id, Reviews.get(p.id).filter(r=>r.email!==user.email)); toast('Review deleted'); headRating(); draw(); });
    $('#rev-form')?.addEventListener('submit', e=>{
      e.preventDefault(); const err=$('#rev-err'); err.textContent='';
      const d=Object.fromEntries(new FormData(e.target)); const rating=Number(d.rating);
      if(!rating) return err.textContent='Please choose a star rating.';
      if((d.text||'').trim().length<10) return err.textContent='Please write at least 10 characters.';
      const rec={ id:Date.now(), email:user.email, name:user.name||userName(), rating, title:(d.title||'').trim(), text:d.text.trim(), ts:Date.now(), verified:bought };
      Reviews.save(p.id, [...Reviews.get(p.id).filter(r=>r.email!==user.email), rec]);
      toast(mine?'Review updated':'Thanks for your review!'); headRating(); draw();
      $('.rev-main').scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  headRating(); draw();
}

function initProduct(){
  const p = byId(new URLSearchParams(location.search).get('id')) || PRODUCTS[0];
  document.title = p.name + ' – EcoLife';
  const off = p.mrp ? Math.round((1-p.price/p.mrp)*100) : 0;
  $('#product').innerHTML = `
    ${imgBox(p,'gallery',true)}
    <div>
      <div class="cat-path">${p.sub.toUpperCase()}</div>
      <h1>${p.name}</h1>
      <div id="rating-line"></div>
      <div style="margin-top:4px;color:var(--muted)"><b style="color:var(--ink)">2K+ bought</b> in past month</div>
      <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
      <div class="p-price">${off?`<span class="off">-${off}%</span>`:''}${rupee(p.price)}</div>
      ${p.mrp?`<div class="mrp">M.R.P.: <s>${rupee(p.mrp)}</s></div>`:''}
      <select class="qty" id="qty" aria-label="Quantity">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<option value="${n}">Quantity: ${n}</option>`).join('')}</select>
      <button class="btn btn-yellow btn-block" id="add" style="font-size:20px">Add to cart</button>
      <div class="trust"><div><span>🔒</span>Secure<br>transaction</div><div><span>↩️</span>10 days returns</div><div><span>🚚</span>Free delivery</div></div>
    </div>`;
  $('#add').onclick = ()=>Cart.add(p.id, Number($('#qty').value));
  initReviews(p);
  $('#d-img').innerHTML = imgBox(p);
  $('#d-name').textContent = p.name;
  $('#accordion').innerHTML = [
    ['Details', `A ${p.name.toLowerCase()} made from ${p.material.join(' and ').toLowerCase()}. Designed for everyday use with a clean, timeless look.`],
    ['Materials / Features', `${p.material.join(' · ')} · ${p.values.join(' · ')}. The natural materials give each item a subtly unique finish.`],
    ['Shipping','Free shipping on orders ₹3000+. Ships in 1–2 business days. Delivery in 3–5 business days. Returns within 30 days on unopened items.'],
    ['Care','Hand wash recommended. Dry completely after use. Do not soak natural components for prolonged periods.']
  ].map(([t,b],i)=>`<div class="acc-item ${i<4?'open':''}"><button aria-expanded="true"><span>${t}</span><span class="sign"></span></button><p>${b}</p></div>`).join('');
  $('#accordion').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; const it=b.parentElement; it.classList.toggle('open'); b.setAttribute('aria-expanded', it.classList.contains('open')); });
  $('#like').innerHTML = [...PRODUCTS.filter(x=>x.id!==p.id&&x.cat===p.cat), ...PRODUCTS.filter(x=>x.id!==p.id&&x.cat!==p.cat)].slice(0,4).map(x=>`<article class="card"><a href="product.html?id=${x.id}">${imgBox(x)}</a>
    <div class="body"><div>${x.name}</div><div style="margin:6px 0;font-size:14px">${rupee(x.price)}</div><div class="cat">${x.material.join(' · ')}</div></div></article>`).join('');
}

/* ---------- Checkout modal (collects delivery details, then creates the order) ---------- */
function openCheckout(items, promoApplied){
  const sub=items.reduce((s,i)=>s+i.price*i.qty,0);
  const disc=promoApplied?Math.round(sub*PROMO.pct/100):0;
  const ship=sub-disc>=FREE_SHIP_ABOVE?0:SHIPPING_FEE, total=sub-disc+ship;
  let saved={}; try{ saved=JSON.parse(localStorage.getItem('ecolife_address'))||{}; }catch{}
  let user={}; try{ user=JSON.parse(localStorage.getItem('ecolife_user'))||{}; }catch{}
  const m=document.createElement('div'); m.className='modal-back';
  m.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="ck-title">
    <h2 id="ck-title">Delivery details</h2>
    <form id="ck-form" novalidate>
      <label class="field"><span class="i">👤</span><input name="name" placeholder="Full name" value="${saved.name||user.name||''}" autocomplete="name"></label>
      <label class="field"><span class="i">📞</span><input name="phone" placeholder="Phone number" value="${saved.phone||''}" autocomplete="tel"></label>
      <label class="field"><span class="i">🏠</span><input name="line" placeholder="Address (flat, street, area)" value="${saved.line||''}" autocomplete="street-address"></label>
      <div class="two"><label class="field"><span class="i">📍</span><input name="city" placeholder="City" value="${saved.city||''}" autocomplete="address-level2"></label>
      <label class="field"><input name="pin" placeholder="PIN code" value="${saved.pin||''}" inputmode="numeric" autocomplete="postal-code"></label></div>
      <div class="form-err" id="ck-err" role="alert"></div>
      <div class="sum-total" style="margin-top:0"><span>Total to pay</span><span>${rupee(total)}</span></div>
      <p style="font-size:12px;color:var(--muted);margin:6px 0 16px">Demo checkout – no payment is taken. Connect a payment gateway for real orders.</p>
      <div class="modal-actions"><button type="button" class="btn btn-outline" id="ck-cancel">Back</button><button class="btn btn-lime" type="submit">Place order</button></div>
    </form></div>`;
  document.body.append(m); m.querySelector('input').focus();
  const close=()=>m.remove();
  m.addEventListener('click',e=>{ if(e.target===m) close(); });
  document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown',esc);} });
  $('#ck-cancel',m).onclick=close;
  $('#ck-form',m).addEventListener('submit',e=>{
    e.preventDefault(); const d=Object.fromEntries(new FormData(e.target)), err=$('#ck-err',m);
    if(!d.name.trim()) return err.textContent='Enter the receiver’s name.';
    if(!/^[0-9+\-\s]{8,15}$/.test(d.phone.trim())) return err.textContent='Enter a valid phone number.';
    if(d.line.trim().length<5) return err.textContent='Enter the delivery address.';
    if(!d.city.trim()) return err.textContent='Enter the city.';
    if(!/^\d{6}$/.test(d.pin.trim())) return err.textContent='PIN code should be 6 digits.';
    const address={name:d.name.trim(),phone:d.phone.trim(),line:d.line.trim(),city:d.city.trim(),pin:d.pin.trim()};
    localStorage.setItem('ecolife_address',JSON.stringify(address));
    const id=Orders.nextId();
    Orders.add({id, placed:new Date().toISOString(), status:'Processing',
      items:items.map(i=>({id:i.id,qty:i.qty,price:i.price})), subtotal:sub, discount:disc, shipping:ship, total, address});
    Cart.save([]); localStorage.removeItem('ecolife_promo');
    location.href='orders.html?new='+id;
  });
}

/* =========================================================
   PAGE: CART
   ========================================================= */
function initCart(){
  let promoApplied = localStorage.getItem('ecolife_promo') === PROMO.code;
  function render(){
    const items = Cart.get().map(i=>({...byId(i.id), qty:i.qty})).filter(i=>i.name);
    $('#cart-sub').textContent = `${items.reduce((s,i)=>s+i.qty,0)} items in your cart`;
    $('#cart-items').innerHTML = items.length ? items.map(i=>`<div class="cart-item">${imgBox(i)}
      <div class="info"><b>${i.name}</b><small>${i.material[0]} · ${i.values[0]}</small><small class="stock">${i.stock?'In Stock':'Out of stock'}</small></div>
      <div class="stepper"><button data-dec="${i.id}" aria-label="Decrease">−</button><span>${i.qty}</span><button class="plus" data-inc="${i.id}" aria-label="Increase">+</button></div>
      <div class="line-price">${rupee(i.price*i.qty)}</div><button class="rm" data-rm="${i.id}" aria-label="Remove ${i.name}">×</button></div>`).join('')
      : `<div class="box" style="text-align:center;padding:50px"><h3>Your cart is empty</h3><p style="color:var(--muted);margin-bottom:18px">Add something from the shop to get started.</p><a class="btn btn-yellow" href="shop.html">Browse the shop</a></div>`;
    const sub = items.reduce((s,i)=>s+i.price*i.qty,0);
    const disc = promoApplied ? Math.round(sub*PROMO.pct/100) : 0;
    const ship = !sub || sub-disc >= FREE_SHIP_ABOVE ? 0 : SHIPPING_FEE;
    $('#summary').innerHTML = `
      <div class="sum-row"><span>Subtotal (${items.reduce((s,i)=>s+i.qty,0)} items)</span><span>${rupee(sub)}</span></div>
      <div class="sum-row"><span>Discount (${promoApplied?PROMO.pct:0}%)</span><span>-${rupee(disc)}</span></div>
      <div class="sum-row"><span>Shipping</span><span>${ship?rupee(ship):'Free'}</span></div>
      <div class="sum-total"><span>Total</span><span>${rupee(sub-disc+ship)}</span></div>
      <p style="font-size:12px;color:var(--muted);margin:4px 0 16px">Including taxes where applicable</p>`;
    $('#checkout').disabled = !items.length;
    if(promoApplied){ $('#promo-msg').className='msg ok'; $('#promo-msg').textContent=`✓ Promo code applied – ${PROMO.pct}% off`; }
  }
  document.addEventListener('click', e=>{
    const t=e.target, q=id=>Cart.get().find(i=>i.id===Number(id))?.qty||0;
    if(t.dataset.inc) Cart.setQty(Number(t.dataset.inc), q(t.dataset.inc)+1);
    if(t.dataset.dec) Cart.setQty(Number(t.dataset.dec), q(t.dataset.dec)-1);
    if(t.dataset.rm) Cart.remove(Number(t.dataset.rm));
    if(t.dataset.inc||t.dataset.dec||t.dataset.rm) render();
  });
  $('#apply').onclick = ()=>{
    const v = $('#promo').value.trim().toUpperCase(), m=$('#promo-msg');
    if(v===PROMO.code){ promoApplied=true; localStorage.setItem('ecolife_promo',v); }
    else { promoApplied=false; localStorage.removeItem('ecolife_promo'); m.className='msg err'; m.textContent='That code isn’t valid. Try ECOSTORE10.'; }
    render();
  };
  function renderRecent(){
    const box=$('#recent-order'), o=Orders.latest(); if(!o){ box.hidden=true; return; } box.hidden=false;
    const lines=Orders.lines(o), more=lines.length-1;
    box.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><div><b style="font-size:14px">Recent Order</b><div style="font-size:12px;color:var(--muted)">Order #${o.id} · ${o.status}</div></div>
      <a href="orders.html?track=${o.id}" class="btn btn-olive btn-sm">Track Order</a></div>
      <div class="recent">${imgBox(lines[0])}<div><b style="color:var(--ink)">${lines[0].name}${more?` + ${more} more`:''}</b><br>${rupee(Orders.total(o))}</div></div>`;
  }
  renderRecent();
  $('#checkout').onclick = ()=>{
    const items=Cart.get().map(i=>({...byId(i.id),qty:i.qty})).filter(i=>i.name); if(!items.length) return;
    openCheckout(items, promoApplied);
  };
  if(promoApplied) $('#promo').value = PROMO.code;
  render();
}

/* =========================================================
   ORDERS  (stored in localStorage – replace with your backend)
   ========================================================= */
const SENDER = { name:'EcoLife Warehouse', line:'Unit 4, Andheri East', city:'Mumbai' };
const SEED_ORDERS = [
  {id:'LV-1048', placed:'2026-10-08T11:20:00', status:'Delivered', items:[{id:1,qty:1,variant:'750ml / Sand'}], address:{name:'Tom Hardy', line:'14 Hill Road, Bandra West', city:'Mumbai'}},
  {id:'LV-1047', placed:'2026-10-05T10:20:00', status:'Shipped',   items:[{id:2,qty:1,variant:'Soft Bristles'}], address:{name:'Tom Hardy', line:'14 Hill Road, Bandra West', city:'Mumbai'}},
  {id:'LV-1046', placed:'2026-09-28T16:05:00', status:'Delivered', items:[{id:3,qty:1,variant:'Full Set'}], address:{name:'Tom Hardy', line:'14 Hill Road, Bandra West', city:'Mumbai'}},
  {id:'LV-1045', placed:'2026-09-18T09:40:00', status:'Cancelled', items:[{id:9,qty:2,variant:'Set of 2'}], address:{name:'Tom Hardy', line:'14 Hill Road, Bandra West', city:'Mumbai'}}
];
const Orders = {
  KEY:'ecolife_orders_v2',
  all(){
    try{ const v=JSON.parse(localStorage.getItem(this.KEY)); if(Array.isArray(v)) return v; }catch{}
    localStorage.setItem(this.KEY, JSON.stringify(SEED_ORDERS)); return SEED_ORDERS.slice();
  },
  save(list){ localStorage.setItem(this.KEY, JSON.stringify(list)); },
  nextId(){ const n=Math.max(1048, ...this.all().map(o=>Number(o.id.replace(/\D/g,''))||0)); return 'LV-'+(n+1); },
  add(o){ const list=this.all(); list.unshift(o); this.save(list); },
  update(id, patch){ this.save(this.all().map(o=>o.id===id?{...o,...patch}:o)); },
  get(id){ return this.all().find(o=>o.id===id); },
  latest(){ return this.all().slice().sort((a,b)=>new Date(b.placed)-new Date(a.placed))[0]; },
  /* line items with product info + totals (older orders without stored totals are computed) */
  lines(o){ return o.items.map(i=>({...byId(i.id), ...i, price: i.price ?? byId(i.id)?.price ?? 0})); },
  total(o){ return o.total ?? this.lines(o).reduce((s,i)=>s+i.price*i.qty,0); }
};
const isActive = o => o.status==='Processing' || o.status==='Shipped';
const fmtDate = d => new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
const fmtDT = d => new Date(d).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:true}).replace(',','');
const addDays = (d,n) => new Date(new Date(d).getTime()+n*864e5);

/* tracking steps for an order (newest first, like the design) */
function trackingSteps(o){
  const p=o.placed, dest=o.address.city, hub=SENDER.city;
  if(o.status==='Cancelled') return [
    {label:'Cancelled', where:'Order cancelled', when:fmtDT(addDays(p,0.2)), state:'cancel'},
    {label:'Order placed', where:hub, when:fmtDT(p), state:'done'}];
  const idx = {Processing:0, Shipped:1, Delivered:3}[o.status] ?? 0;
  const steps=[
    {label:'Delivered', where:dest, offset:4},
    {label:'Out for delivery', where:dest, offset:3},
    {label:'Shipped', where:hub+' hub', offset:1},
    {label:'Order placed', where:hub, offset:0}];
  return steps.map((st,i)=>{ const n=3-i; // n = step index oldest→newest
    const when = n<=idx ? fmtDT(addDays(p,st.offset)) : 'Expected '+fmtDate(addDays(p,st.offset));
    return {...st, when, state: n<idx ? 'done' : n===idx ? (idx===3?'done':'now') : 'pending'}; });
}

function initOrders(){
  const params=new URLSearchParams(location.search);
  let filter='All Orders', q='', selected = params.get('track') || params.get('new') || (Orders.all().find(isActive)||Orders.all()[0])?.id;
  const opened=new Set();
  const statusOf = o => isActive(o) ? 'Active' : o.status;

  /* banner text */
  const active = Orders.all().filter(isActive).length;
  $('#banner-title').textContent = params.get('new') ? 'Thank you! Your order is placed.' : active ? 'Your order is on its way.' : 'Your orders';
  $('#ship-banner').innerHTML = smartImg(IMG.shippingBanner,'', '<span class="truck" aria-hidden="true">🚚</span>');
  if(params.get('new')) toast('Order '+params.get('new')+' placed');

  function cardHTML(o){
    const lines=Orders.lines(o), first=lines[0], more=lines.length-1;
    const units=lines.reduce((s,i)=>s+i.qty,0);
    const detail = `<div class="order-more">
        ${lines.map(i=>`<div class="ln"><span>${i.name} × ${i.qty}${i.variant?` <small>(${i.variant})</small>`:''}</span><span>${rupee(i.price*i.qty)}</span></div>`).join('')}
        ${o.discount?`<div class="ln"><span>Discount</span><span>-${rupee(o.discount)}</span></div>`:''}
        ${o.shipping!==undefined?`<div class="ln"><span>Shipping</span><span>${o.shipping?rupee(o.shipping):'Free'}</span></div>`:''}
        <div class="ln tot"><span>Total</span><span>${rupee(Orders.total(o))}</span></div>
        <div class="addr">Deliver to <b>${o.address.name}</b>, ${o.address.line}, ${o.address.city}${o.address.pin?' '+o.address.pin:''}</div></div>`;
    return `<div class="order ${o.id===selected?'sel':''}" data-oid="${o.id}">
      <div class="top"><div><b>Order #${o.id}</b><small>${fmtDate(o.placed)}</small></div><span class="status ${o.status}">${o.status}</span></div>
      <div class="mid">${imgBox(first)}<div class="nm"><b>${first.name}</b>${more?`<small>+ ${more} more item${more>1?'s':''}</small>`:''}
        <small>${more?`${units} items`:`Qty: ${first.qty}${first.variant?' · Variant: '+first.variant:''}`}</small></div><b>${rupee(Orders.total(o))}</b></div>
      ${opened.has(o.id)?detail:''}
      <div class="bot"><span>Total: ${rupee(Orders.total(o))}</span><div>
        <button class="btn btn-outline btn-sm" data-view="${o.id}" aria-expanded="${opened.has(o.id)}">${opened.has(o.id)?'Hide Order':'View Order'}</button>
        <button class="btn btn-olive btn-sm" data-track="${o.id}">Track Order</button></div></div></div>`;
  }
  function renderList(){
    const list=Orders.all().slice().sort((a,b)=>new Date(b.placed)-new Date(a.placed))
      .filter(o=>(filter==='All Orders'||statusOf(o)===filter) &&
        (o.id+' '+Orders.lines(o).map(l=>l.name).join(' ')).toLowerCase().includes(q.toLowerCase()));
    $('#order-list').innerHTML = list.length ? list.map(cardHTML).join('')
      : `<p style="color:var(--muted);padding:30px;text-align:center">${Orders.all().length?'No orders match.':'No orders yet.'} <a href="shop.html" style="color:var(--green-700);font-weight:600">Browse the shop</a></p>`;
  }
  function renderTrack(){
    const o=Orders.get(selected); const box=$('#track');
    if(!o){ box.hidden=true; return; } box.hidden=false;
    const lines=Orders.lines(o), more=lines.length-1;
    $('#t-img').innerHTML = imgBox(lines[0]);
    $('#track-title').textContent = lines[0].name + (more?` + ${more} more`:'') + ' · #'+o.id;
    $('#route').innerHTML = `<small>Sender</small><b>${SENDER.name}</b><div style="color:var(--muted)">${SENDER.line}, ${SENDER.city}</div>
      <div class="recv" style="margin-top:12px"><small>Receiver</small><b>${o.address.name}</b><div style="color:var(--muted)">${o.address.line}, ${o.address.city}${o.address.pin?' '+o.address.pin:''}</div></div>`;
    $('#timeline').innerHTML = trackingSteps(o).map(st=>`<li class="${st.state}"><div><b>${st.label}</b><small>${st.where}</small></div><small>${st.when}</small></li>`).join('');
    $('#track-total').textContent = rupee(Orders.total(o));
    const act=$('#pay');
    if(o.status==='Processing'){ act.textContent='Cancel order'; act.dataset.act='cancel'; }
    else if(o.status==='Shipped'){ act.textContent='Need help?'; act.dataset.act='help'; }
    else { act.textContent='Buy again'; act.dataset.act='again'; }
  }
  $$('.tab').forEach(t=>t.addEventListener('click',()=>{ $$('.tab').forEach(x=>x.classList.remove('on')); t.classList.add('on'); filter=t.textContent.trim(); renderList(); }));
  $('#oq').addEventListener('input',e=>{ q=e.target.value; renderList(); });
  $('#order-list').addEventListener('click',e=>{
    const v=e.target.closest('[data-view]'), t=e.target.closest('[data-track]');
    if(v){ const id=v.dataset.view; opened.has(id)?opened.delete(id):opened.add(id); renderList(); }
    if(t){ selected=t.dataset.track; renderList(); renderTrack(); if(innerWidth<1000) $('#track').scrollIntoView({behavior:'smooth'}); }
  });
  $('#pay').onclick = e=>{
    const o=Orders.get(selected); if(!o) return; const act=e.target.dataset.act;
    if(act==='cancel'){ if(confirm('Cancel order #'+o.id+'?')){ Orders.update(o.id,{status:'Cancelled'}); renderList(); renderTrack(); toast('Order cancelled'); } }
    if(act==='help') location.href='contact.html';
    if(act==='again'){ o.items.forEach(i=>{ const items=Cart.get(); const f=items.find(x=>x.id===i.id); f?f.qty+=i.qty:items.push({id:i.id,qty:i.qty}); Cart.save(items); }); toast('Items added to your cart'); setTimeout(()=>location.href='cart.html',700); }
  };
  $('#suggest').innerHTML = imgBox(byId(4));
  renderList(); renderTrack();
  if(params.get('track')||params.get('new')) $('.order.sel')?.scrollIntoView({block:'center'});
}

/* =========================================================
   PAGES: LOGIN / SIGN UP (front-end demo only – no real auth)
   ========================================================= */
function initAuth(kind){
  $('.auth-stage')?.insertAdjacentHTML('afterbegin', `<div class="auth-bg">${smartImg(IMG.loginBg,'','')}</div>`);
  const form = $('#auth-form'), err = $('#form-err');
  $('.auth-card')?.insertAdjacentHTML('beforeend','<div class="or-divider"><span>or</span></div><button type="button" class="btn btn-outline btn-block" id="guest-btn">Continue as Guest →</button><p class="guest-note">Browse the shop without an account. You’ll need to log in to add items to your cart.</p>');
  $('#guest-btn')?.addEventListener('click',()=>{ try{ localStorage.setItem('ecolife_guest','1'); }catch{} const n=safeNext(new URLSearchParams(location.search).get('next')); location.href = /^(cart|orders)\.html/.test(n) ? 'index.html' : n; });
  const next = safeNext(new URLSearchParams(location.search).get('next'));
  $$('.alt a').forEach(a=>{ if(/(login|signup)\.html/.test(a.getAttribute('href'))) a.href += '?next=' + encodeURIComponent(next); });
  form.addEventListener('submit', e=>{
    e.preventDefault(); err.textContent='';
    const d = Object.fromEntries(new FormData(form));
    if(!/^\S+@\S+\.\S+$/.test(d.email)) return err.textContent='Enter a valid email address.';
    if((d.password||'').length < 6) return err.textContent='Password must be at least 6 characters.';
    if(kind==='signup'){
      if(!d.name.trim()) return err.textContent='Enter your full name.';
      if(!d.terms) return err.textContent='Please accept the Terms & Conditions.';
      localStorage.setItem('ecolife_user', JSON.stringify({name:d.name, email:d.email}));
    } else {
      localStorage.setItem('ecolife_user', JSON.stringify({email:d.email}));
    }
    try{ localStorage.removeItem('ecolife_guest'); }catch{}
    toast(kind==='signup'?'Account created!':'Welcome back!');
    setTimeout(()=>location.href=next, 700);
  });
}

/* =========================================================
   PAGE: CONTACT (front-end only – hook the form up to your backend / email service)
   ========================================================= */
function initContact(){
  const form=$('#contact-form'), err=$('#c-err');
  form.addEventListener('submit', e=>{
    e.preventDefault(); err.textContent='';
    const d=Object.fromEntries(new FormData(form));
    if(!d.name.trim()) return err.textContent='Enter your name.';
    if(!/^\S+@\S+\.\S+$/.test(d.email)) return err.textContent='Enter a valid email address.';
    if(d.message.trim().length<10) return err.textContent='Tell us a little more (at least 10 characters).';
    const msgs=JSON.parse(localStorage.getItem('ecolife_messages')||'[]'); msgs.push({...d,at:new Date().toISOString()});
    localStorage.setItem('ecolife_messages', JSON.stringify(msgs));
    form.reset(); toast('Message sent. We reply within 1–2 business days.');
  });
  $('#faq').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; const it=b.parentElement; it.classList.toggle('open'); b.setAttribute('aria-expanded', it.classList.contains('open')); });
}

/* ---------- PWA: install button + service worker ---------- */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredInstall=e; const b=document.getElementById('install-app'); if(b) b.hidden=false; });
window.addEventListener('appinstalled', ()=>{ deferredInstall=null; const b=document.getElementById('install-app'); if(b) b.hidden=true; });
if('serviceWorker' in navigator && location.protocol!=='file:'){
  window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  if(NEEDS_LOGIN) return;
  renderChrome();
  const page = document.body.dataset.page;
  ({home:initHome, shop:initShop, product:initProduct, cart:initCart, orders:initOrders, contact:initContact,
    login:()=>initAuth('login'), signup:()=>initAuth('signup')})[page]?.();
});