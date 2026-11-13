// Finder - deal.js : promotions des vendeurs et négociation de prix
(function(){
if(window.__finderDeal)return;window.__finderDeal=1;
const q=s=>document.querySelector(s);
const tod=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const fd=ts=>new Date(new Date(ts).getTime()-1000).toLocaleDateString("fr-FR",{day:"numeric",month:"long"});
const fdt=ts=>new Date(ts).toLocaleString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
const ACT=["en_attente","contre_offre","acceptee"];
const PCTS=[5,10,15,20,25,30,40,50,60,70];
Object.assign(ERR,{
"reduction invalide":"La réduction doit être comprise entre 5 % et 70 %.",
"date promo invalide":"La date de fin de la promotion doit être comprise entre aujourd’hui et 90 jours.",
"aucun article":"Vous n’avez aucun article actif à mettre en promotion.",
"offre invalide":"Votre offre doit être inférieure au prix affiché et d’au moins 50 % de ce prix.",
"trop d offres":"Vous avez déjà fait 3 offres sur cet article.",
"offre deja en cours":"Vous avez déjà une offre en cours sur cet article.",
"offre close":"Cette offre n’est plus disponible.",
"offre introuvable":"Offre introuvable.",
"action invalide":"Action impossible."
});
const st=document.createElement("style");
st.textContent=`
s.old{color:#8A99A0;font-weight:400;font-size:.82rem;margin-left:6px}
.pbadge{background:#E5484D;color:#fff;border-radius:999px;padding:2px 9px;font-size:.78rem;font-weight:700;margin-left:6px}
.tagp{background:#E5484D}
.promo{background:#FFF4F4;border:1px solid #F5C6C6;border-radius:16px;padding:12px 14px;margin:12px 0}
.promo h3,.nego h3{margin:0 0 6px}
.nego{background:#EEF8F7;border:1px solid #BFE5E1;border-radius:16px;padding:12px 14px;margin:12px 0}
.nego .big{font-size:1.1rem;color:#007782}
.ofi{background:#fff;border:1px solid #E2EBEB;border-radius:16px;padding:12px;margin:10px 0}
#boff:before{content:"🤝"}
`;
document.head.appendChild(st);
try{
const t=+localStorage.getItem("finder_cln")||0;
if(Date.now()-t>300000){localStorage.setItem("finder_cln",String(Date.now()));sb.rpc("nettoyer_offres_promos").then(()=>{},()=>{})}
}catch(e){}
/* Affichage des promotions sur les cartes */
function paint(){
document.querySelectorAll("#grid .card").forEach(c=>{
if(c.dataset.pp)return;
const i=items.find(x=>x.id===c.dataset.id);
if(!i)return;
c.dataset.pp="1";
if(i.prix_initial&&i.prix_initial>i.price&&!i.vendu){
const pct=i.promo_pct||Math.round((1-i.price/i.prix_initial)*100);
const b=c.querySelector("b");
if(b)b.insertAdjacentHTML("afterend",'<s class="old">'+fcfa(i.prix_initial)+"</s>");
if(!c.querySelector(".tag"))c.insertAdjacentHTML("afterbegin",'<span class="tag tagp">-'+pct+"%</span>");
}
});
}
const D0=window.load;
window.load=async function(){const r=await D0.apply(this,arguments);paint();return r};
/* Fiche d'un article */
const OFFS={};
const S6=window.show;
window.show=function(i){
const r=S6.apply(this,arguments);
try{extras(i)}catch(e){}
return r;
};
function extras(i){
const dc=q("#dc");
const own=user&&user.id===i.user_id;
if(i.prix_initial&&i.prix_initial>i.price){
const pct=i.promo_pct||Math.round((1-i.price/i.prix_initial)*100);
const pr=dc.querySelector(".pr");
if(pr&&!pr.querySelector(".old"))pr.insertAdjacentHTML("beforeend",' <s class="old">'+fcfa(i.prix_initial)+'</s> <span class="pbadge">-'+pct+"%</span>");
if(i.promo_fin&&!dc.querySelector(".pend")){const pt=dc.querySelector(".pt");if(pt)pt.insertAdjacentHTML("afterend",'<p class="meta pend">🏷️ Promotion jusqu’au '+fd(i.promo_fin)+"</p>")}
}
if(i.vendu||i.statut!=="actif")return;
if(own)promoPanel(i);else negoBlock(i);
}
function promoPanel(i){
const dc=q("#dc");
if(dc.querySelector(".promo"))return;
const on=i.prix_initial&&i.prix_initial>i.price;
const html='<div class="promo" data-pl="'+i.id+'" data-base="'+(i.prix_initial||i.price)+'"><h3>🏷️ Promotion</h3>'+(on?'<p>En promotion : <b>-'+(i.promo_pct||0)+'%</b> (prix d’origine '+fcfa(i.prix_initial)+")"+(i.promo_fin?" jusqu’au "+fd(i.promo_fin):"")+'.</p><button type="button" class="sbtn" data-pend="'+i.id+'">Terminer la promotion</button><hr>':'<p class="meta">Attirez les acheteurs avec un prix réduit. Le prix d’origine reste affiché, barré.</p>')+'<label>Réduction</label><select class="pcts">'+PCTS.map(p=>'<option value="'+p+'"'+(p===(i.promo_pct||20)?" selected":"")+">-"+p+" %</option>").join("")+'</select><p class="meta pnew"></p><label>Date de fin (facultatif)</label><input type="date" class="pfin" min="'+tod()+'"><p class="err perr"></p><button type="button" class="sbtn pri" data-papp="'+i.id+'">'+(on?"Modifier la promotion":"Appliquer la promotion")+"</button></div>";
const del=dc.querySelector(".del");
if(del)del.insertAdjacentHTML("beforebegin",html);else dc.insertAdjacentHTML("beforeend",html);
updNew(dc.querySelector(".promo"));
}
function updNew(box){
if(!box)return;
const base=+box.dataset.base,p=+box.querySelector(".pcts").value;
const n=Math.max(100,Math.round(base*(100-p)/100/10)*10);
box.querySelector(".pnew").textContent="Nouveau prix : "+fcfa(n)+" (au lieu de "+fcfa(base)+")";
}
document.addEventListener("change",e=>{if(e.target.classList.contains("pcts"))updNew(e.target.closest(".promo"))});
/* Négociation côté acheteur */
function stateHtml(o,i){
if(o.statut==="en_attente")return '<p>⏳ Votre offre de <b>'+fcfa(o.montant)+'</b> attend la réponse du vendeur<span class="meta"> (jusqu’au '+fdt(o.expire_le)+')</span>.</p><button type="button" class="sbtn" data-oc="'+o.id+'">Annuler mon offre</button>';
if(o.statut==="contre_offre")return '<p>💬 Le vendeur propose <b class="big">'+fcfa(o.contre_montant)+'</b><span class="meta"> (jusqu’au '+fdt(o.expire_le)+')</span></p><button type="button" class="sbtn pri" data-ca="'+o.id+'">Accepter '+fcfa(o.contre_montant)+'</button><button type="button" class="sbtn" data-cr="'+o.id+'">Refuser</button>';
return '<p>✅ Prix négocié pour vous : <b class="big">'+fcfa(Math.min(i.price,o.prix_accorde))+'</b><span class="meta"> (valable jusqu’au '+fdt(o.expire_le)+')</span></p><p class="meta">Appuyez sur « Acheter au prix négocié » ci-dessous.</p><button type="button" class="sbtn" data-oc="'+o.id+'">Renoncer à cet accord</button>';
}
async function negoBlock(i){
const dc=q("#dc");
if(dc.querySelector(".nego"))return;
const buy=dc.querySelector(".buybtn");
if(!buy)return;
buy.insertAdjacentHTML("beforebegin",'<div class="nego" data-nl="'+i.id+'"><button type="button" class="sbtn" data-offer="'+i.id+'">🤝 Faire une offre de prix</button><p class="meta">Proposez votre prix : le vendeur peut accepter, refuser ou répondre par un autre prix.</p></div>');
OFFS[i.id]=null;
if(!user)return;
const{data}=await sb.from("offres").select("*").eq("listing_id",i.id).eq("buyer_id",user.id).order("maj_le",{ascending:false}).limit(5);
const L=data||[];
const act=L.find(o=>ACT.includes(o.statut)&&new Date(o.expire_le).getTime()>Date.now());
OFFS[i.id]=act||null;
const box=q('.nego[data-nl="'+i.id+'"]');
if(!box)return;
if(act){
box.innerHTML=stateHtml(act,i);
if(act.statut==="acceptee"){
const p=Math.min(i.price,act.prix_accorde),b=q("#dc .buybtn");
if(b)b.textContent="Acheter au prix négocié · "+fcfa(p+protFee(p));
}
}else if(L.length>=3)box.innerHTML='<p class="meta">Vous avez déjà fait 3 offres sur cet article.</p>';
}
function refreshNego(){
const box=q("#dc .nego");
if(!box)return;
const i=items.find(x=>x.id===box.dataset.nl);
box.remove();
if(i)negoBlock(i);
}
document.body.insertAdjacentHTML("beforeend",'<dialog id="doff"><h2>Faire une offre</h2><p id="offt"></p><p class="meta" id="offh"></p><form id="offf"><label>Votre offre (FCFA)</label><input name="m" type="number" inputmode="numeric" min="100" required><p class="err" id="offe" role="alert"></p><div class="row"><button class="pri">Envoyer l’offre</button><button type="button" data-x>Annuler</button></div></form></dialog><dialog id="dofs"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2 id="ofsh">Offres</h2></div><p class="meta" id="ofsi"></p><div id="ofsl"></div></dialog>');
const doff=q("#doff"),dofs=q("#dofs");
doff.querySelector("[data-x]").onclick=()=>doff.close();
dofs.querySelector("[data-x]").onclick=()=>dofs.close();
let offItem=null;
function offerOpen(id){
if(!user){q("#da").showModal();return}
if(acct!=="client"){alert("Passez en compte client pour faire une offre.");return}
const i=items.find(x=>x.id===id);
if(!i)return;
offItem=i;
const min=Math.ceil(i.price*0.5);
q("#offt").innerHTML="<b>"+esc(i.title)+"</b><br>Prix affiché : "+fcfa(i.price);
q("#offh").textContent="Votre offre doit être comprise entre "+fcfa(min)+" et "+fcfa(i.price-1)+". Elle reste valable 48 heures. Si le vendeur accepte, ce prix est réservé pour vous pendant 48 heures.";
const f=q("#offf");
f.reset();f.m.min=min;f.m.max=i.price-1;
q("#offe").textContent="";
doff.showModal();
}
q("#offf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#offe");
const v=parseInt(f.m.value,10);
if(!v||!offItem){m.textContent="Entrez un montant valide.";return}
m.textContent="Envoi…";
const{error}=await sb.rpc("faire_offre",{p_listing:offItem.id,p_montant:v});
if(error){m.textContent=err(error);return}
doff.close();
showToast("Offre envoyée au vendeur. Il a 48 heures pour répondre.","notif");
refreshNego();offBadge();
};
/* Achat au prix négocié */
document.addEventListener("click",e=>{
const b=e.target.closest(".buybtn");
if(!b||!user)return;
const id=b.dataset.b,o=OFFS[id];
if(!o||o.statut!=="acceptee"||new Date(o.expire_le).getTime()<=Date.now())return;
const i=items.find(x=>x.id===id);
if(!i)return;
e.stopImmediatePropagation();e.preventDefault();
openDelivery({...i,price:Math.min(i.price,o.prix_accorde)});
},true);
/* Liste des offres */
const eff=o=>(ACT.includes(o.statut)&&new Date(o.expire_le).getTime()<=Date.now())?"expiree":o.statut;
function ofItem(o,l,name,sell){
const s=eff(o);
const th=l&&l.photos&&l.photos[0];
const head='<div class="ihead">'+(th?'<img class="ithumb" src="'+esc(th)+'" alt="">':'<div class="ithumb"></div>')+"<div><b>"+esc(l?l.title:"Annonce supprimée")+'</b><br><span class="meta">Prix affiché : '+(l?fcfa(l.price):"—")+" · "+(sell?"Acheteur : ":"Vendeur : ")+esc(name||"—")+"</span></div></div>";
const exp='<span class="meta"> · jusqu’au '+fdt(o.expire_le)+"</span>";
let st="",acts="";
if(s==="en_attente"){
st="💰 Offre : <b>"+fcfa(o.montant)+"</b>"+(l&&l.price>0?" ("+Math.round((1-o.montant/l.price)*100)+" % de moins)":"")+exp;
acts=sell?'<button type="button" class="sbtn pri" data-ra="'+o.id+'">✅ Accepter</button><button type="button" class="sbtn" data-rc="'+o.id+'" data-p="'+(l?l.price:0)+'" data-m="'+o.montant+'">↔️ Contre-offre</button><button type="button" class="sbtn del" data-rr="'+o.id+'">Refuser</button>':'<button type="button" class="sbtn" data-oc="'+o.id+'">Annuler mon offre</button>';
}else if(s==="contre_offre"){
st=sell?"⏳ Contre-offre envoyée : <b>"+fcfa(o.contre_montant)+"</b>, en attente de l’acheteur"+exp:"💬 Le vendeur propose <b>"+fcfa(o.contre_montant)+"</b>"+exp;
acts=sell?"":'<button type="button" class="sbtn pri" data-ca="'+o.id+'">Accepter</button><button type="button" class="sbtn" data-cr="'+o.id+'">Refuser</button>';
}else if(s==="acceptee"){
st="✅ Accord à <b>"+fcfa(o.prix_accorde)+"</b>"+exp;
acts=sell?"":'<button type="button" class="sbtn pri" data-buy2="'+o.listing_id+'" data-p="'+o.prix_accorde+'">Acheter à ce prix</button><button type="button" class="sbtn" data-oc="'+o.id+'">Renoncer</button>';
}else st={refusee:"❌ Offre refusée",expiree:"⌛ Offre expirée",utilisee:"🛍️ Achat réalisé à ce prix",annulee:"Offre annulée"}[s]||s;
return '<div class="ofi">'+head+'<p style="margin:8px 0">'+st+"</p>"+acts+"</div>";
}
async function openOffers(){
if(!user){q("#da").showModal();return}
const sell=acct==="vendeur";
q("#ofsh").textContent=sell?"Offres reçues":"Mes offres";
q("#ofsi").textContent=sell?"Répondez aux propositions de prix. Une offre expire au bout de 48 heures.":"Suivez vos propositions de prix. Un prix accepté est réservé pour vous pendant 48 heures.";
if(!dofs.open)dofs.showModal();
const box=q("#ofsl");
box.innerHTML="<p class='meta'>Chargement…</p>";
const{data}=await sb.from("offres").select("*").eq(sell?"seller_id":"buyer_id",user.id).order("maj_le",{ascending:false}).limit(60);
const L=data||[];
if(!L.length){box.innerHTML="<p class='meta'>Aucune offre pour l’instant.</p>";return}
const lids=[...new Set(L.map(o=>o.listing_id))],uids=[...new Set(L.map(o=>sell?o.buyer_id:o.seller_id))];
const[r1,r2]=await Promise.all([sb.from("listings").select("id,title,price,photos").in("id",lids),sb.from("profils").select("user_id,nom").in("user_id",uids)]);
const LS=Object.fromEntries((r1.data||[]).map(x=>[x.id,x])),PS=Object.fromEntries((r2.data||[]).map(x=>[x.user_id,x.nom]));
box.innerHTML=L.map(o=>ofItem(o,LS[o.listing_id],PS[sell?o.buyer_id:o.seller_id],sell)).join("");
}
/* Actions */
async function act(fn,args){
const{error}=await sb.rpc(fn,args);
if(error){alert(err(error));return false}
if(dofs.open)openOffers();
refreshNego();offBadge();
return true;
}
document.addEventListener("click",async e=>{
const t=e.target;
let b;
if((b=t.closest("[data-offer]")))return offerOpen(b.dataset.offer);
if((b=t.closest("[data-oc]"))){if(!confirm("Annuler cette offre ?"))return;return act("annuler_offre",{p_offre:b.dataset.oc})}
if((b=t.closest("[data-ca]")))return act("repondre_contre",{p_offre:b.dataset.ca,p_accepter:true});
if((b=t.closest("[data-cr]")))return act("repondre_contre",{p_offre:b.dataset.cr,p_accepter:false});
if((b=t.closest("[data-ra]")))return act("repondre_offre",{p_offre:b.dataset.ra,p_action:"accepter"});
if((b=t.closest("[data-rr]"))){if(!confirm("Refuser cette offre ?"))return;return act("repondre_offre",{p_offre:b.dataset.rr,p_action:"refuser"})}
if((b=t.closest("[data-rc]"))){
const p=+b.dataset.p,m=+b.dataset.m;
const v=prompt("Votre contre-proposition en FCFA (entre "+(m+1)+" et "+(p-1)+")");
if(v===null)return;
const n=parseInt(String(v).replace(/\D/g,""),10);
if(!n||n<=m||n>=p){alert("Montant invalide : il doit être supérieur à l’offre et inférieur au prix affiché.");return}
return act("repondre_offre",{p_offre:b.dataset.rc,p_action:"contre",p_contre:n});
}
if((b=t.closest("[data-buy2]"))){
const{data:l}=await sb.from("listings").select("*").eq("id",b.dataset.buy2).maybeSingle();
if(!l||l.vendu||l.statut!=="actif"){alert("Cet article n’est plus disponible.");return}
dofs.close();
openDelivery({...l,price:Math.min(l.price,+b.dataset.p)});
return;
}
if((b=t.closest("[data-papp]"))){
const box=b.closest(".promo"),id=b.dataset.papp;
const fin=box.querySelector(".pfin").value||null,pct=+box.querySelector(".pcts").value;
const{error}=await sb.rpc("promouvoir",{p_listing:id,p_pct:pct,p_fin:fin});
if(error){box.querySelector(".perr").textContent=err(error);return}
await load();
const j=items.find(x=>x.id===id);
q("#dd").close();
if(j)show(j);
showToast("Promotion appliquée ✓","msg");
return;
}
if((b=t.closest("[data-pend]"))){
const id=b.dataset.pend;
const{error}=await sb.rpc("terminer_promo",{p_listing:id});
if(error){alert(err(error));return}
await load();
const j=items.find(x=>x.id===id);
q("#dd").close();
if(j)show(j);
showToast("Promotion terminée.","msg");
}
});
/* Menu Offres et pastille */
const boff=document.createElement("button");
boff.id="boff";boff.textContent="Offres";
q("#ord").after(boff);
boff.onclick=openOffers;
let lastB=0;
async function offBadge(force){
if(!user){boff.textContent="Offres";return}
if(!force&&Date.now()-lastB<4000)return;
lastB=Date.now();
const sell=acct==="vendeur";
let n=0;
try{
let r=sb.from("offres").select("id",{count:"exact",head:true}).eq(sell?"seller_id":"buyer_id",user.id).gt("expire_le",new Date().toISOString());
r=sell?r.eq("statut","en_attente"):r.in("statut",["contre_offre","acceptee"]);
n=(await r).count||0;
}catch(e){}
boff.textContent=(sell?"Offres reçues":"Mes offres")+(n?" ("+n+")":"");
}
const N0=window.refreshNotifs;
window.refreshNotifs=async function(){const r=await N0.apply(this,arguments);offBadge();return r};
const A0=window.applyUI;
window.applyUI=function(){const r=A0.apply(this,arguments);offBadge();return r};
/* Promotions de toute la boutique */
const dbq=q("#dbq"),bqx=q("#bqx");
const sp=document.createElement("div");
sp.id="spromo";
sp.innerHTML='<h3>🏷️ Promotions de la boutique</h3><p class="meta">Appliquez une réduction à tous vos articles en vente. Le prix d’origine reste affiché barré et vos abonnés sont prévenus.</p><label>Réduction</label><select id="spct">'+PCTS.map(p=>'<option value="'+p+'"'+(p===20?" selected":"")+">-"+p+" %</option>").join("")+'</select><label>Date de fin (facultatif)</label><input type="date" id="spfin" min="'+tod()+'"><p class="meta" id="spn"></p><p class="err" id="sperr" role="alert"></p><button type="button" class="sbtn pri" id="spapp">Appliquer à tous mes articles</button><button type="button" class="sbtn" id="spend">Terminer toutes les promotions</button>';
bqx.insertBefore(sp,bqx.firstChild);
async function renderSp(){
if(!user)return;
q("#sperr").textContent="";
const{count}=await sb.from("listings").select("id",{count:"exact",head:true}).eq("user_id",user.id).eq("vendu",false).not("prix_initial","is",null);
q("#spn").textContent=count?count+" article"+(count>1?"s":"")+" actuellement en promotion.":"Aucune promotion en cours.";
}
q("#spapp").onclick=async()=>{
const pct=+q("#spct").value,fin=q("#spfin").value||null,m=q("#sperr");
if(!confirm("Appliquer -"+pct+" % à tous vos articles en vente ?"))return;
m.textContent="Un instant…";
const{data,error}=await sb.rpc("promouvoir_boutique",{p_pct:pct,p_fin:fin});
if(error){m.textContent=err(error);return}
m.textContent="";
await load();renderSp();
showToast(data+" article"+(data>1?"s":"")+" en promotion ✓","msg");
};
q("#spend").onclick=async()=>{
if(!confirm("Terminer toutes les promotions de la boutique ?"))return;
const{error}=await sb.rpc("terminer_promo",{p_listing:null});
if(error){q("#sperr").textContent=err(error);return}
await load();renderSp();
showToast("Promotions terminées.","msg");
};
const onShop=()=>{if(dbq.open&&!bqx.hidden)renderSp()};
new MutationObserver(onShop).observe(dbq,{attributes:true,attributeFilter:["open"]});
new MutationObserver(onShop).observe(bqx,{attributes:true,attributeFilter:["hidden"]});
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment négocier le prix d’un article ?</summary><p>Sur la fiche de l’article, appuyez sur « Faire une offre de prix » (entre 50 % et 100 % du prix, 3 offres maximum par article). Le vendeur a 48 heures pour accepter, refuser ou proposer un autre prix. Si vous tombez d’accord, le prix est réservé pour vous pendant 48 heures : appuyez sur « Acheter au prix négocié ».</p></details><details><summary>Vendeur : comment faire une promotion ?</summary><p>Ouvrez la fiche d’un de vos articles et utilisez le bloc « Promotion », ou ouvrez « Ma boutique » pour une réduction sur tous vos articles. Le prix d’origine reste affiché barré. Vos abonnés sont prévenus.</p></details>");
const hb=hBy("#dt","Paiements et protection acheteur");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Un vendeur peut proposer des promotions. Un acheteur peut proposer un prix : l’accord n’engage que le vendeur et l’acheteur concernés, il est réservé à cet acheteur pendant 48 heures et le paiement s’effectue ensuite au prix convenu, avec la protection acheteur.</li>");
}catch(e){}
})();
