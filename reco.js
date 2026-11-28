// Finder - reco.js : recommandations et conseils personnalisés (données sur le téléphone, désactivables)
(function(){
if(window.__finderReco)return;window.__finderReco=1;
const q=s=>document.querySelector(s);
const LSK="finder_beh_v1",OFF="finder_perso";
const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const ss={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}}};
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const on=()=>ls.get(OFF)!=="off";
const css=document.createElement("style");
css.textContent=`
#pourvous{margin:4px 0 14px}
.pvh{display:flex;justify-content:space-between;align-items:center;gap:8px}
.pvh h3{margin:0;font-size:1.1rem}
.pvo{border:0;background:none;color:#6A7B84;text-decoration:underline;font-size:.78rem;cursor:pointer;padding:4px}
.pvrow{display:flex;gap:10px;overflow-x:auto;padding:6px 2px 12px;scrollbar-width:none}
.pvrow::-webkit-scrollbar{display:none}
#pourvous .card{flex:0 0 150px;max-width:150px}
#pourvous .heart{display:none}
#nudge{position:fixed;left:10px;right:10px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:56;background:#fff;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,.28);padding:14px;display:flex;gap:12px}
#nudge[hidden]{display:none}
#nudge .nic{font-size:1.8rem;line-height:1}
#nudge .nbd{flex:1;min-width:0}
#nudge b{display:block;font-size:1rem;margin-bottom:2px}
#nudge p{margin:0 0 10px;font-size:.88rem;color:#5B6B73;line-height:1.35}
#nudge .nbt{display:flex;gap:8px;flex-wrap:wrap}
#nudge .go{border:0;border-radius:12px;padding:10px 14px;background:linear-gradient(135deg,#00A39A,#007782);color:#fff;font-weight:800;cursor:pointer}
#nudge .lt{border:1.5px solid #BFE5E1;background:#fff;color:#005961;border-radius:12px;padding:10px 12px;font-weight:700;cursor:pointer}
#nudge .no{margin-top:8px;border:0;background:none;color:#8A979D;font-size:.75rem;text-decoration:underline;cursor:pointer;padding:2px}
`;
document.head.appendChild(css);
let B;
function loadB(){
try{B=JSON.parse(ls.get(LSK)||"null")}catch(e){B=null}
if(!B||typeof B!=="object")B={};
B.ev=Array.isArray(B.ev)?B.ev:[];
B.nud=B.nud||{};
B.last=B.last||0;
const cut=Date.now()-30*864e5;
B.ev=B.ev.filter(e=>e&&e.t>cut).slice(-300);
}
function saveB(){ls.set(LSK,JSON.stringify(B))}
loadB();
const prevLast=B.last;
B.last=Date.now();saveB();
const gap=prevLast?(Date.now()-prevLast)/864e5:0;
function track(type,d){
if(!on())return;
B.ev.push(Object.assign({t:Date.now(),type},d||{}));
if(B.ev.length>300)B.ev.shift();
saveB();
}
const find=id=>typeof items!=="undefined"?items.find(x=>x.id===id):null;
const det=i=>({id:i.id,cat:i.category||"",brand:norm(i.marque),price:i.price||0});
const S0=window.show;
if(typeof S0==="function")window.show=function(i){try{if(i&&i.id)track("view",det(i))}catch(e){}return S0.apply(this,arguments)};
const G0=window.goCat;
if(typeof G0==="function")window.goCat=function(c){try{track("cat",{cat:c})}catch(e){}return G0.apply(this,arguments)};
const fm=q("#f");
if(fm)fm.addEventListener("submit",()=>{const t=norm(q("#q")&&q("#q").value);if(t.length>=2)track("search",{term:t})},true);
document.addEventListener("click",e=>{
const h=e.target.closest(".heart");
if(h){const c=h.closest(".card");const it=c&&find(c.dataset.id);if(it)track("fav",det(it))}
const o=e.target.closest("[data-offer]");
if(o){const it=find(o.dataset.offer);if(it)track("offer",det(it))}
},true);
function model(){
const now=Date.now(),HL=7*864e5,W={view:1,fav:3,offer:4,search:2,cat:1.5};
const cat={},brand={},terms={},seen={},pr=[];
B.ev.forEach(e=>{
const w=(W[e.type]||1)*Math.pow(.5,(now-e.t)/HL);
if(e.cat)cat[e.cat]=(cat[e.cat]||0)+w;
if(e.brand)brand[e.brand]=(brand[e.brand]||0)+w;
if(e.term)e.term.split(/\s+/).filter(x=>x.length>=3).forEach(x=>{terms[x]=(terms[x]||0)+w});
if(e.id&&e.type==="view")seen[e.id]=(seen[e.id]||0)+1;
if(e.price&&e.type!=="cat"&&e.type!=="search")pr.push([e.price,w]);
});
let pmed=0;
if(pr.length){
pr.sort((a,b)=>a[0]-b[0]);
const tot=pr.reduce((s,x)=>s+x[1],0);let acc=0;
for(const x of pr){acc+=x[1];if(acc>=tot/2){pmed=x[0];break}}
}
return{cat,brand,terms,seen,pmed};
}
function scoreItem(i,m){
let s=(m.cat[i.category]||0)*2+(m.brand[norm(i.marque)]||0)*1.5;
const t=norm(i.title);
for(const k in m.terms)if(t.includes(k))s+=m.terms[k]*2;
if(s<=0)return 0;
if(m.pmed&&i.price){const r=i.price/m.pmed;if(r>=.5&&r<=1.6)s+=1}
const age=(Date.now()-new Date(i.created_at||Date.now()))/864e5;
s+=Math.max(0,2-age/7);
s-=(m.seen[i.id]||0)*1.5;
return s;
}
function setOff(){
ls.set(OFF,"off");ls.del(LSK);
B={ev:[],nud:{},last:Date.now()};
const r=q("#pourvous");if(r)r.remove();
const n=q("#nudge");if(n)n.remove();
syncMenu();
alert("Recommandations et conseils désactivés. Ce qui était enregistré sur ce téléphone a été effacé.");
}
function rebuild(){
const old=q("#pourvous"),sect=q("#sect"),grid=q("#grid");
const home=sect&&/Toutes les annonces/i.test(sect.textContent)&&!(q("#q")&&q("#q").value.trim());
if(!on()||!home||B.ev.length<3||!grid||typeof card!=="function"||typeof items==="undefined"){if(old)old.remove();return}
const m=model(),mine=typeof user!=="undefined"&&user?user.id:null;
const list=items.filter(i=>!i.vendu&&i.user_id!==mine).map(i=>({i,s:scoreItem(i,m)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,8).map(x=>x.i);
if(old)old.remove();
if(list.length<2)return;
grid.insertAdjacentHTML("beforebegin",'<section id="pourvous"><div class="pvh"><h3>✨ Pour vous</h3><button type="button" class="pvo" data-pvoff="1">Désactiver</button></div><p class="meta">Selon les annonces que vous avez consultées sur ce téléphone.</p><div class="pvrow">'+list.map(i=>card(i)).join("")+"</div></section>");
}
let tm;
const sched=()=>{clearTimeout(tm);tm=setTimeout(rebuild,250)};
const grid=q("#grid"),sect=q("#sect");
if(grid)new MutationObserver(sched).observe(grid,{childList:true});
if(sect)new MutationObserver(sched).observe(sect,{childList:true,characterData:true,subtree:true});
setTimeout(rebuild,1500);
document.addEventListener("click",e=>{
const o=e.target.closest("[data-pvoff]");
if(o){if(confirm("Désactiver les recommandations et effacer ce qui a été enregistré sur ce téléphone ?"))setOff();return}
const c=e.target.closest("#pourvous .card");
if(c){const it=find(c.dataset.id);if(it&&typeof show==="function"){e.preventDefault();show(it)}}
});
const click=id=>{const e=document.getElementById(id);if(e)e.click()};
function signup(){window.__regPreMode="";const s=document.getElementById("su");if(s)s.click()}
async function candidates(){
const out=typeof user==="undefined"||!user;
const ev=B.ev,c=[];
const views=ev.filter(e=>e.type==="view");
if(out){
if(views.length>=3)c.push({key:"v_signup",ic:"🎁",t:"Gardez vos coups de cœur",x:"Créez votre compte gratuit pour contacter les vendeurs, enregistrer vos favoris et être prévenu des nouveautés.",cta:"Créer mon compte",act:signup});
const cc={};
views.forEach(e=>{if(e.cat)cc[e.cat]=(cc[e.cat]||0)+1});
const k=Object.keys(cc).find(x=>cc[x]>=2);
if(k)c.push({key:"v_cat_"+k,ic:"🔔",t:"Vous aimez « "+k+" » ?",x:"Créez un compte gratuit pour être prévenu dès qu’une nouvelle annonce « "+k+" » est publiée.",cta:"Créer mon compte",act:signup});
return c;
}
const sellerMode=typeof acct!=="undefined"&&acct==="vendeur";
if(sellerMode){
try{
const r=await sb.from("listings").select("id,title,photos,description,vendu,statut").eq("user_id",user.id).order("created_at",{ascending:false}).limit(20);
const L=r.data||[];
const age=(Date.now()-new Date(user.created_at||Date.now()))/864e5;
if(!L.length&&age>=1)c.push({key:"s_first",ic:"📸",t:"Publiez votre premier article",x:"Prenez une photo, indiquez un prix, publiez : 3 minutes. Des photos nettes inspirent confiance aux acheteurs.",cta:"Vendre un article",act:()=>click("sell")});
const weak=L.find(l=>!l.vendu&&l.statut==="actif"&&((l.photos||[]).length<3||!(l.description||"").trim()));
if(weak)c.push({key:"s_improve_"+weak.id,ic:"✨",t:"Améliorez votre annonce",x:"« "+weak.title+" » peut inspirer plus confiance : ajoutez des photos nettes et une description.",cta:"Mes annonces",act:()=>click("mine")});
if(L.length){
const id=await sb.from("identites").select("statut").eq("user_id",user.id).maybeSingle();
if(!id.data)c.push({key:"s_kyc",ic:"✅",t:"Faites vérifier votre identité",x:"Vous pourrez vendre des articles plus chers et rassurer les acheteurs.",cta:"Vérifier mon identité",act:()=>click("bid")});
}
}catch(e){}
}
const m=model();
const favN=typeof favs!=="undefined"&&favs?(favs.size!==undefined?favs.size:(favs.length||0)):0;
if(favN>=1&&gap>=2)c.push({key:"b_fav",ic:"❤️",t:"Vos favoris vous attendent",x:"Vous avez "+favN+" article"+(favN>1?"s":"")+" enregistré"+(favN>1?"s":"")+". Certains sont peut-être encore disponibles.",cta:"Voir mes favoris",act:()=>click("fav")});
if(!sellerMode){
const vc={};
views.forEach(e=>{if(e.id)vc[e.id]=(vc[e.id]||0)+1});
const fo=new Set(ev.filter(e=>e.type==="fav"||e.type==="offer").map(e=>e.id));
const again=Object.keys(vc).find(id=>vc[id]>=3&&!fo.has(id));
const it=again&&find(again);
if(it&&!it.vendu&&it.user_id!==user.id)c.push({key:"b_offer_"+again,ic:"🤝",t:"Cet article vous plaît ?",x:"Vous l’avez regardé plusieurs fois. Vous pouvez proposer votre prix au vendeur : il peut accepter.",cta:"Voir l’article",act:()=>{if(typeof show==="function")show(it)}});
}
const top=Object.keys(m.cat).sort((a,b)=>m.cat[b]-m.cat[a])[0];
if(gap>=5&&top&&prevLast){
try{
const r2=await sb.from("listings").select("id",{count:"exact",head:true}).eq("statut","actif").eq("vendu",false).eq("category",top).gt("created_at",new Date(prevLast).toISOString());
const n=r2.count||0;
if(n>=1)c.push({key:"l_new",ic:"🆕",t:"Du nouveau en « "+top+" »",x:n+" nouvelle"+(n>1?"s":"")+" annonce"+(n>1?"s":"")+" depuis votre dernière visite.",cta:"Voir",act:()=>{if(typeof goCat==="function")goCat(top)}});
}catch(e){}
}
return c;
}
function display(n){
const lb=q("#lbar");if(lb)lb.hidden=true;
document.body.insertAdjacentHTML("beforeend",'<div id="nudge"><div class="nic">'+n.ic+'</div><div class="nbd"><b>'+E(n.t)+'</b><p>'+E(n.x)+'</p><div class="nbt"><button type="button" class="go">'+E(n.cta)+'</button><button type="button" class="lt">Plus tard</button></div><button type="button" class="no">Ne plus recevoir de conseils</button></div></div>');
const box=q("#nudge");
ss.set("finder_nudge_shown","1");
B.nud[n.key]=Date.now();B.nudLast=Date.now();saveB();
const close=()=>{box.remove()};
box.querySelector(".go").onclick=()=>{close();try{n.act()}catch(e){}};
box.querySelector(".lt").onclick=close;
box.querySelector(".no").onclick=()=>{close();setOff()};
}
async function maybeNudge(){
if(!on()||ss.get("finder_nudge_shown")==="1")return;
if(document.querySelector("dialog[open]")||q("#nudge"))return;
if(Date.now()-(B.nudLast||0)<864e5)return;
const list=(await candidates()).filter(n=>Date.now()-(B.nud[n.key]||0)>3*864e5);
if(list.length)display(list[0]);
}
[7000,40000,90000].forEach(t=>setTimeout(()=>{maybeNudge().catch(()=>{})},t));
function syncMenu(){
const b=q('#vxm [data-v="perso"]');
if(b)b.textContent=on()?"✨ Recommandations : activées":"✨ Recommandations : désactivées";
}
function inject(){
const m=q("#vxm");
if(m&&!m.querySelector('[data-v="perso"]')){m.insertAdjacentHTML("beforeend",'<button type="button" data-v="perso"></button>');syncMenu()}
}
document.addEventListener("click",e=>{
if(!e.target.closest('[data-v="perso"]'))return;
e.preventDefault();
if(on()){if(confirm("Désactiver les recommandations et effacer ce qui a été enregistré sur ce téléphone ?"))setOff()}
else{ls.del(OFF);syncMenu();alert("Recommandations activées.")}
});
new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
inject();
setTimeout(()=>{
const pv=q("#dpriv");
if(!pv||pv.dataset.lgr)return;
pv.dataset.lgr="1";
const h=[...pv.querySelectorAll("h3")].find(x=>x.textContent.trim().startsWith("1."));
const u=h&&h.nextElementSibling&&h.nextElementSibling.tagName==="UL"?h.nextElementSibling:null;
if(u)u.insertAdjacentHTML("beforeend","<li><b>Votre navigation</b> : les annonces que vous consultez, vos recherches et vos favoris sont analysés sur votre téléphone pour vous proposer des annonces et des conseils adaptés. Ces informations ne sont pas envoyées à nos serveurs. Vous pouvez désactiver cette personnalisation à tout moment (bouton rond en bas à gauche, puis « Recommandations »).</li>");
},1500);
})();
// FIN DU FICHIER
