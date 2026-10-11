window.catalog=window.catalog||{};
if(window.catalogTools)window.catalog.tools=window.catalogTools;
if(window.catalogClothes)window.catalog.clothes=window.catalogClothes;
if(window.catalogMilitary)window.catalog.military=window.catalogMilitary;
let cart=[],isOpen=true;
const TELEGRAM_BOT_TOKEN='8791143315:AAHIkx6LMQKn5E9ZIiXzUhms998M7WDXkiI';
const TELEGRAM_CHAT_ID='5393712604';
const catalog=window.catalog||{};
function showCategory(cat){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.tab').forEach(t=>{if((cat==='beauty'&&t.textContent.includes('Краса'))||(cat==='cosmetics'&&t.textContent.includes('Косметика'))||(cat==='tech'&&t.textContent.includes('Техніка'))||(cat==='tools'&&(t.textContent.includes('інструмент')||t.textContent.includes('Авто')))||(cat==='kitchen'&&t.textContent.includes('кухні'))||(cat==='clothes'&&t.textContent.includes('Одяг'))||(cat==='military'&&(t.textContent.includes('Воєнторг')||t.textContent.includes('воєн'))))t.classList.add('active')});const c=document.getElementById('products');c.innerHTML='';(catalog[cat]||[]).forEach(item=>{const d=document.createElement('div');d.className='product'+(item.desc?' wide':'');const desc=item.desc?`<div class="desc">${item.desc}</div>`:'';d.innerHTML=`<img src="${item.img}" alt="${item.name}" onclick="showProductDetail('${item.id}')" onerror="this.src='https://via.placeholder.com/320x240?text=Фото'"><h3 onclick="showProductDetail('${item.id}')">${item.name}</h3>${desc}<div class="price">${item.price} грн</div><button class="btn-buy" onclick="addToCart('${item.id}')">Купити</button>`;c.appendChild(d)})}
function findProduct(id){for(const[cat,items]of Object.entries(catalog)){const p=(items||[]).find(x=>x.id===id);if(p)return{product:p,category:cat}}return null}
let currentProductImages=[],currentSlideIdx=0;
function slideProduct(dir){if(!currentProductImages.length)return;currentSlideIdx=(currentSlideIdx+dir+currentProductImages.length)%currentProductImages.length;document.getElementById('pm-img').src=currentProductImages[currentSlideIdx];document.querySelectorAll('.pm-dot').forEach((d,i)=>d.classList.toggle('active',i===currentSlideIdx))}
function showProductDetail(id,updateUrl){const found=findProduct(id);if(!found)return;const p=found.product;if(found.category)showCategory(found.category);currentProductImages=(p.images&&p.images.length)?p.images:[p.img];currentSlideIdx=0;document.getElementById('pm-img').src=currentProductImages[0]||'';document.getElementById('pm-name').textContent=p.name;document.getElementById('pm-desc').textContent=p.desc||'';document.getElementById('pm-price').textContent=p.price+' грн';document.getElementById('pm-buy').onclick=()=>addToCart(p.id);const hasMany=currentProductImages.length>1;document.getElementById('pm-prev').style.display=hasMany?'flex':'none';document.getElementById('pm-next').style.display=hasMany?'flex':'none';const dots=document.getElementById('pm-dots');dots.innerHTML='';if(hasMany)currentProductImages.forEach((_,i)=>{const d=document.createElement('div');d.className='pm-dot'+(i===0?' active':'');d.onclick=()=>{currentSlideIdx=i;document.getElementById('pm-img').src=currentProductImages[i];document.querySelectorAll('.pm-dot').forEach((x,j)=>x.classList.toggle('active',j===i))};dots.appendChild(d)});const det=document.getElementById('pm-details');const tog=document.getElementById('pm-toggle');if(p.details){det.textContent=p.details;tog.style.display='block';tog.onclick=()=>{det.classList.toggle('show');tog.textContent=det.classList.contains('show')?'▲ Сховати опис':'▼ Показати повний опис'}}else{det.classList.remove('show');tog.style.display='none'}document.getElementById('product-modal').classList.add('show');if(updateUrl!==false){const u=new URL(location);u.searchParams.set('product',id);history.replaceState(null,'',u)}try{if(typeof fbq==='function')fbq('track','ViewContent',{content_ids:[id],content_type:'product',value:p.price,currency:'UAH'})}catch(e){}}
function closeProductDetail(){document.getElementById('product-modal').classList.remove('show');const u=new URL(location);u.searchParams.delete('product');history.replaceState(null,'',u)}
function addToCart(id){const found=findProduct(id);if(!found)return;const p=found.product;const ex=cart.find(x=>x.id===id);if(ex)ex.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1,link:p.link||''});updateCart();try{if(typeof fbq==='function')fbq('track','AddToCart',{content_ids:[id],content_type:'product',value:p.price,currency:'UAH'})}catch(e){}}
function changeQty(id,d){const i=cart.findIndex(x=>x.id===id);if(i<0)return;cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);updateCart()}
function updateCart(){const el=document.getElementById('cart-items'),cnt=document.getElementById('count'),tot=document.getElementById('total'),btn=document.getElementById('order-btn');cnt.textContent=cart.reduce((a,i)=>a+i.qty,0);let t=0;if(!cart.length){el.innerHTML='<p style="color:#999;text-align:center">Кошик порожній</p>';btn.disabled=true}else{el.innerHTML=cart.map(i=>{const s=i.price*i.qty;t+=s;return`<div class="cart-item"><span>${i.name} × ${i.qty}</span><span>${s} грн <button onclick="changeQty('${i.id}',-1)">−</button> <button onclick="changeQty('${i.id}',1)">+</button></span></div>`}).join('');btn.disabled=false}tot.textContent=t}
function toggleCart(){isOpen=!isOpen;document.getElementById('cart-content').style.display=isOpen?'block':'none';document.getElementById('toggle-icon').textContent=isOpen?'▼':'▲'}
function showOrderForm(){if(!cart.length)return;let s='<strong>Замовлення:</strong><br>',t=0;cart.forEach(i=>{const x=i.price*i.qty;t+=x;s+=`• ${i.name} × ${i.qty} — ${x} грн<br>`});s+=`<br><strong>Разом: ${t} грн</strong>`;document.getElementById('order-summary').innerHTML=s;document.getElementById('order-modal').classList.add('show');try{if(typeof fbq==='function')fbq('track','InitiateCheckout',{value:t,currency:'UAH',num_items:cart.reduce((a,i)=>a+i.qty,0)})}catch(e){}}
function closeOrderForm(){document.getElementById('order-modal').classList.remove('show')}
async function sendTelegram(text){
  const r=await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      chat_id:TELEGRAM_CHAT_ID,
      text:text,
      disable_web_page_preview:true
    })
  });
  const j=await r.json();
  if(!j.ok) throw new Error(j.description||('HTTP '+r.status));
  return j;
}
function splitTelegramText(text,maxLen){
  maxLen=maxLen||3900;
  if(text.length<=maxLen) return [text];
  const parts=[];
  let rest=text;
  while(rest.length>maxLen){
    let cut=rest.lastIndexOf('\n',maxLen);
    if(cut<maxLen*0.5) cut=maxLen;
    parts.push(rest.slice(0,cut).trimEnd());
    rest=rest.slice(cut).trimStart();
  }
  if(rest) parts.push(rest);
  return parts;
}
async function submitOrder(e){
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const phone=document.getElementById('phone').value.trim();
  const city=document.getElementById('city').value.trim();
  const address=document.getElementById('address').value.trim();
  const comment=document.getElementById('comment').value.trim();
  const btn=document.getElementById('submit-btn');
  if(!name||!phone||!city||!address){
    alert('Заповніть усі обов\'язкові поля');
    return;
  }
  if(!cart.length){
    alert('Кошик порожній');
    return;
  }
  let total=0, items='';
  cart.forEach(i=>{
    const s=i.price*i.qty;
    total+=s;
    items+=`• ${i.name} × ${i.qty} = ${s} грн`;
    if(i.link) items+=`\n  🔗 ${i.link}`;
    items+='\n';
  });
  const orderId=Date.now().toString(36).toUpperCase();
  const when=new Date().toLocaleString('uk-UA',{timeZone:'Europe/Kyiv'});
  const text=
`🛒 НОВЕ ЗАМОВЛЕННЯ #${orderId}
🕐 ${when}

👤 ${name}
📞 ${phone}
🏙 ${city}
📍 ${address}${comment?'\n💬 '+comment:''}

📦 Товари:
${items}
💰 Разом: ${total} грн`;

  btn.disabled=true;
  btn.textContent='Надсилаємо...';
  try{
    const parts=splitTelegramText(text,3900);
    for(let i=0;i<parts.length;i++){
      const chunk=parts.length>1
        ? `(${i+1}/${parts.length})\n`+parts[i]
        : parts[i];
      await sendTelegram(chunk);
      if(i<parts.length-1) await new Promise(r=>setTimeout(r,350));
    }
    document.getElementById('modal-content').innerHTML=
      `<div class="success-message"><h2>✅ Замовлення прийнято!</h2>`+
      `<p>Дякуємо, <strong>${name}</strong>!</p>`+
      `<p>${phone}</p>`+
      `<p>Сума: <strong>${total} грн</strong></p>`+
      `<p style="font-size:13px;color:#666">№ ${orderId}</p>`+
      `<button class="btn-submit" style="margin-top:20px;width:100%" onclick="finishOrder()">Закрити</button></div>`;
    try{
      if(typeof fbq==='function'){
        fbq('track','Lead',{value:total,currency:'UAH'});
        fbq('track','Purchase',{value:total,currency:'UAH'});
      }
    }catch(e){}
    cart=[];
    updateCart();
  }catch(err){
    const msg=String(err&&err.message||err);
    let hint='';
    if(/chat not found|bot was blocked|Forbidden/i.test(msg))
      hint='\n\nВідкрийте бота в Telegram і натисніть /start, потім спробуйте знову.';
    else if(/too long|message is too long/i.test(msg))
      hint='\n\nПовідомлення занадто довге. Спробуйте менше товарів у кошику.';
    alert('Помилка відправки: '+msg+hint);
    btn.disabled=false;
    btn.textContent='Підтвердити';
  }
}
function finishOrder(){closeOrderForm();location.reload()}
document.getElementById('order-modal').addEventListener('click',function(e){if(e.target===this)closeOrderForm()});
(function initFromUrl(){const id=new URLSearchParams(location.search).get('product');if(id&&findProduct(id)){showProductDetail(id,false)}else{showCategory('tech')}})();
