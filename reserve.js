// Finder - reserve.js : mettre un article de côté 24 heures
(function(){
if(window.__finderReserve)return;window.__finderReserve=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
Object.assign(ERR,{
"article reserve":"Cet article est mis de côté par un autre acheteur. Revenez plus tard : il sera de nouveau disponible s’il n’est pas acheté.",
"reservation deja faite":"Vous avez déjà mis cet article de côté récemment. Contactez le vendeur pour convenir d’une suite.",
"trop de reservations":"Vous pouvez mettre au maximum 2 articles de côté en même temps.",
"reservation introuvable":"Réservation introuvable ou déjà terminée.",
"reservation invalide":"Vous ne pouvez pas mettre cet article de côté."
});
const SRC={manuel:"mis de côté par l’acheteur",offre:"offre acceptée",rdv:"rendez-vous confirmé"};
const st=document.createElement("style");
st.textContent=`
.vres{background:#F3EEFF;border:1px solid #D4C4FA;border-radius:16px;padding:12px 14px;margin:12px 0}
.vres.bad{background:#FFF4F4;border-color:#F5C6C6}
.vres h3{margin:0 0 6px}
.tagr{background:#7C3AED}
#bres:before{content:"🔖"}
`;
document.head.appendChild(st);
const fh=ts=>new Date(ts).toLocaleString("fr-FR",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
const left=ts=>{const m=Math.max(0,Math.round((new Date(ts)-Date.now())/60000));return m>=60?Math.floor(m/60)+" h "+String(m%60).padStart(2,"0")+" min":m+" min"};
const isRes=i=>!!(i.reserve_jusqu&&new Date(i.reserve_jusqu)>new Date());
/* Fiche d'un article */
const S9=window.show;
window.show=function(i){
const r=S9.apply(this,arguments);
setTimeout(()=>{try{resUI(i)}catch(e){}},220);
return r;
};
async function resUI(i){
const dc=q("#dc");
if(!dc||!dc.querySelector("h2")||dc.querySelector(".vres")||i.vendu||i.statut!=="actif")return;
const own=user&&user.id===i.user_id,res=isRes(i);
if(own){
if(!res)return;
const{data:r}=await sb.from("reservations").select("id,buyer_id,expire_le,source").eq("listing_id",i.id).eq("statut","active").maybeSingle();
if(!r||dc.querySelector(".vres"))return;
const{data:p}=await sb.from("profils").select("nom").eq("user_id",r.buyer_id).maybeSingle();
const html='<div class="vres"><h3>🔖 Article mis de côté</h3><p>Pour <b>'+esc((p&&p.nom)||"un acheteur")+"</b> jusqu’au "+esc(fh(r.expire_le))+' <span class="meta">('+SRC[r.source]+')</span></p><button type="button" class="sbtn" data-rel="'+r.id+'">Libérer l’article</button></div>';
const del=dc.querySelector(".del");
if(del)del.insertAdjacentHTML("beforebegin",html);else dc.insertAdjacentHTML("beforeend",html);
return;
}
const buy=dc.querySelector(".buybtn");
if(!buy)return;
let mine=null;
if(res&&user){
const{data:r}=await sb.from("reservations").select("id,expire_le,source").eq("listing_id",i.id).eq("buyer_id",user.id).eq("statut","active").maybeSingle();
mine=r;
}
if(dc.querySelector(".vres"))return;
const anchor=dc.querySelector(".nego")||buy;
if(res&&!mine){
anchor.insertAdjacentHTML("beforebegin",'<div class="vres bad"><h3>🔖 Article réservé</h3><p>Un autre acheteur le garde jusqu’au '+esc(fh(i.reserve_jusqu))+". S’il ne l’achète pas, l’article sera de nouveau disponible.</p></div>");
const n=dc.querySelector(".nego");
if(n)n.remove();
buy.remove();
return;
}
if(mine){
anchor.insertAdjacentHTML("beforebegin",'<div class="vres"><h3>🔖 Mis de côté pour vous</h3><p>Jusqu’au <b>'+esc(fh(mine.expire_le))+"</b> (reste "+left(mine.expire_le)+') <span class="meta">('+SRC[mine.source]+')</span></p><button type="button" class="sbtn" data-rcan="'+mine.id+'">Annuler la réservation</button></div>');
return;
}
anchor.insertAdjacentHTML("beforebegin",'<div class="vres"><button type="button" class="sbtn" data-res="'+i.id+'">🔖 Mettre de côté 24 h</button><p class="meta">Gratuit : l’article est gardé pour vous pendant 24 heures, sans payer. 2 articles maximum à la fois.</p></div>');
}
async function refresh(id){
await load();
const j=items.find(x=>x.id===id);
if(q("#dd").open){
q("#dd").close();
if(j)show(j);
}
if(q("#dres").open)openRes();
resBadge(true);
}
document.addEventListener("click",async e=>{
let b;
if((b=e.target.closest("[data-res]"))){
if(!user){q("#da").showModal();return}
if(acct!=="client"){alert("Passez en compte client pour mettre un article de côté.");return}
const{error}=await sb.rpc("reserver_article",{p_listing:b.dataset.res});
if(error){alert(err(error));return}
showToast("Article mis de côté pour 24 heures ✓","notif");
refresh(b.dataset.res);
return;
}
if((b=e.target.closest("[data-rcan]"))){
if(!confirm("Annuler cette réservation ?"))return;
const{error}=await sb.rpc("annuler_reservation",{p_id:b.dataset.rcan});
if(error){alert(err(error));return}
refresh(b.dataset.lid||(q("#dc .h2")&&""));
return;
}
if((b=e.target.closest("[data-rel]"))){
if(!confirm("Libérer l’article ? Les autres acheteurs pourront l’acheter."))return;
const{error}=await sb.rpc("liberer_reservation",{p_id:b.dataset.rel});
if(error){alert(err(error));return}
refresh(b.dataset.lid||"");
}
});
/* Badges sur les cartes */
function paint(root){
root.querySelectorAll(".card").forEach(c=>{
if(c.dataset.rs)return;
const i=items.find(x=>x.id===c.dataset.id);
if(!i)return;
c.dataset.rs="1";
if(isRes(i)&&!i.vendu){
c.classList.add("paused");
if(!c.querySelector(".tag"))c.insertAdjacentHTML("afterbegin",'<span class="tag tagr">🔖 Réservé</span>');
}
});
}
["#grid","#srgrid"].forEach(sel=>when(sel,g=>{paint(g);new MutationObserver(()=>paint(g)).observe(g,{childList:true})}));
/* Mes articles de côté / Articles réservés */
document.body.insertAdjacentHTML("beforeend",'<dialog id="dres"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2 id="rest">Mes articles de côté</h2></div><p class="meta" id="resi"></p><div id="resl"></div></dialog>');
const dres=q("#dres");
dres.querySelector("[data-x]").onclick=()=>dres.close();
async function ensure(i){
if(pro[i.user_id]&&(i.user_id in shops))return;
const[a,b]=await Promise.all([sb.from("profils").select("*").eq("user_id",i.user_id).maybeSingle(),sb.from("boutiques").select("*").eq("user_id",i.user_id).maybeSingle()]);
if(a.data)pro[i.user_id]=a.data;
if(b.data)shops[i.user_id]=b.data;
}
async function openRes(){
if(!user){q("#da").showModal();return}
const sell=acct==="vendeur";
q("#rest").textContent=sell?"Articles réservés":"Mes articles de côté";
q("#resi").textContent=sell?"Articles que des acheteurs gardent pour eux. Vous pouvez en libérer un en cas de problème.":"Articles gardés pour vous. Finalisez l’achat avant la fin du délai.";
if(!dres.open)dres.showModal();
const box=q("#resl");
box.innerHTML="<p class='meta'>Chargement…</p>";
const{data}=await sb.from("reservations").select("*").eq(sell?"seller_id":"buyer_id",user.id).eq("statut","active").gt("expire_le",new Date().toISOString()).order("expire_le");
const L=data||[];
if(!L.length){box.innerHTML="<p class='meta'>Aucun article de côté pour l’instant.</p>";return}
const lids=[...new Set(L.map(r=>r.listing_id))],uids=[...new Set(L.map(r=>sell?r.buyer_id:r.seller_id))];
const[a,b]=await Promise.all([sb.from("listings").select("id,title,price,photos").in("id",lids),sb.from("profils").select("user_id,nom").in("user_id",uids)]);
const T=Object.fromEntries((a.data||[]).map(x=>[x.id,x])),N=Object.fromEntries((b.data||[]).map(x=>[x.user_id,x.nom]));
box.innerHTML=L.map(r=>{
const l=T[r.listing_id]||{title:"Annonce",price:0,photos:[]},o=r.source;
return'<div class="ord"><div class="ihead">'+(l.photos&&l.photos[0]?'<img class="ithumb" src="'+esc(l.photos[0])+'" alt="">':'<div class="ithumb"></div>')+"<div><b>"+esc(l.title)+"</b><br>"+fcfa(l.price)+'<br><span class="meta">'+(sell?"Acheteur : ":"Vendeur : ")+esc(N[sell?r.buyer_id:r.seller_id]||"—")+" · "+SRC[o]+"</span></div></div><p>⏳ Expire dans <b>"+left(r.expire_le)+'</b> <span class="meta">('+esc(fh(r.expire_le))+")</span></p>"+(sell?'<button type="button" class="sbtn" data-rel="'+r.id+'">Libérer l’article</button>':'<button type="button" class="sbtn pri" data-ropen="'+r.listing_id+'">👁️ Voir l’annonce</button><button type="button" class="sbtn" data-rcan="'+r.id+'">Annuler</button>')+"</div>";
}).join("");
}
q("#resl").addEventListener("click",async e=>{
const o=e.target.closest("[data-ropen]");
if(!o)return;
const{data:l}=await sb.from("listings").select("*").eq("id",o.dataset.ropen).maybeSingle();
if(!l){alert("Cette annonce n’est plus disponible.");return}
if(!items.find(x=>x.id===l.id))items.push(l);
await ensure(l);
dres.close();
show(l);
});
const bres=document.createElement("button");
bres.id="bres";bres.textContent="Mes articles de côté";
(q("#brdv")||q("#boff")||q("#ord")).after(bres);
bres.onclick=openRes;
let lastB=0;
async function resBadge(force){
if(!user){bres.textContent="Mes articles de côté";return}
const sell=acct==="vendeur";
if(!force&&Date.now()-lastB<15000)return;
lastB=Date.now();
try{
const{count}=await sb.from("reservations").select("id",{count:"exact",head:true}).eq(sell?"seller_id":"buyer_id",user.id).eq("statut","active").gt("expire_le",new Date().toISOString());
bres.textContent=(sell?"Articles réservés":"Mes articles de côté")+(count?" ("+count+")":"");
}catch(e){}
}
const N0=window.refreshNotifs;
window.refreshNotifs=async function(){const r=await N0.apply(this,arguments);resBadge();return r};
const A0=window.applyUI;
window.applyUI=function(){const r=A0.apply(this,arguments);resBadge();return r};
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment mettre un article de côté ?</summary><p>Sur la fiche de l’article, appuyez sur « Mettre de côté 24 h » : il est gardé pour vous pendant 24 heures, gratuitement, et les autres acheteurs ne peuvent plus l’acheter. Vous pouvez en garder 2 en même temps et annuler à tout moment. Un article est aussi gardé automatiquement quand un vendeur accepte votre offre de prix ou confirme un rendez-vous dans les 48 prochaines heures.</p></details><details><summary>Vendeur : un article réservé m’embête, que faire ?</summary><p>Ouvrez la fiche de l’article et appuyez sur « Libérer l’article » : les autres acheteurs pourront de nouveau l’acheter, et l’acheteur est prévenu.</p></details>");
const hb=hBy("#dt","Paiements et protection acheteur");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Un acheteur peut mettre un article de côté pendant 24 heures (2 articles maximum à la fois). Pendant ce délai, l’article ne peut pas être acheté par un autre acheteur. Le vendeur peut libérer l’article en cas d’abus, et Finder peut limiter l’usage de cette fonction.</li>");
}catch(e){}
})();
