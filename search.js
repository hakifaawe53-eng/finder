// Finder - search.js v3 : recherche classée par pertinence (goûts, confiance, fraîcheur), filtres et tri
(function(){
if(window.__finderSearch)return;window.__finderSearch=1;
const q=s=>document.querySelector(s);
const PAGE=24,CAND_MAX=150,HOME_TO_RANKED=true;
const S0={q:"",cat:"",ville:"",etat:"",min:"",max:"",sort:"pertinence",promo:false,cert:false,vendus:false,pub:"",taille:""};
let S={...S0},page=0,total=0,busy=false,CAND=[];
const MAP={};
const CERT={ids:null,t:0};
const rng=(a,b,s)=>{const r=[];for(let i=a;i<=b;i+=(s||1))r.push(String(i));return r};
const SZ={
"Vêtements":["XXS","XS","S","M","L","XL","XXL","3XL","4XL",...rng(34,54,2),"Taille unique"],
"Chaussures":rng(28,47),
"Bébé et enfants":["Naissance","0-3 mois","3-6 mois","6-9 mois","9-12 mois","12-18 mois","18-24 mois","2 ans","3 ans","4 ans","5 ans","6 ans","7 ans","8 ans","10 ans","12 ans","14 ans"]
};
const SZL={"Vêtements":"Toutes tailles","Chaussures":"Toutes pointures","Bébé et enfants":"Tous âges"};
/* ===== Moteur de classement ===== */
const STOP=new Set(["de","du","la","le","les","des","un","une","et","pour","en","a","à","au","aux","sur","avec","d","l"]);
const ACC={telephone:"téléphone",televiseur:"téléviseur",tele:"télé",electromenager:"électroménager",ecran:"écran",velo:"vélo",bebe:"bébé",ete:"été",ecouteur:"écouteur",ecouteurs:"écouteurs",machine:"machine"};
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const stem=w=>w.length>=4&&/[sx]$/.test(w)?w.slice(0,-1):w;
function tokens(txt){
return String(txt||"").toLowerCase().replace(/[%,()"\\*]/g," ").split(/\s+/).filter(w=>w.length>=2&&!STOP.has(norm(w))).slice(0,5);
}
function cond(t){
const st=stem(t),vs=[st];
const a=ACC[norm(st)];
if(a&&!vs.includes(a))vs.push(a);
const cols=["title","marque","description","category"];
return vs.flatMap(x=>cols.map(c=>c+".ilike.%"+x+"%")).join(",");
}
function interest(){
const o={cat:{},brand:{},pmed:0};
try{
if(localStorage.getItem("finder_perso")==="off")return o;
const B=JSON.parse(localStorage.getItem("finder_beh_v1")||"null");
if(!B||!Array.isArray(B.ev))return o;
const now=Date.now(),HL=7*864e5,W={view:1,fav:3,offer:4,search:2,cat:1.5},pr=[];
B.ev.forEach(e=>{
const w=(W[e.type]||1)*Math.pow(.5,(now-e.t)/HL);
if(e.cat)o.cat[e.cat]=(o.cat[e.cat]||0)+w;
if(e.brand)o.brand[e.brand]=(o.brand[e.brand]||0)+w;
if(e.price&&e.type!=="cat"&&e.type!=="search")pr.push([e.price,w]);
});
const mc=Math.max(1e-9,...Object.values(o.cat)),mb=Math.max(1e-9,...Object.values(o.brand));
Object.keys(o.cat).forEach(k=>{o.cat[k]/=mc});
Object.keys(o.brand).forEach(k=>{o.brand[k]/=mb});
if(pr.length){
pr.sort((a,b)=>a[0]-b[0]);
const tot=pr.reduce((s,x)=>s+x[1],0);let acc=0;
for(const x of pr){acc+=x[1];if(acc>=tot/2){o.pmed=x[0];break}}
}
}catch(e){}
return o;
}
function medians(list){
const g={};
list.forEach(i=>{if(i.price>0)(g[i.category]=g[i.category]||[]).push(i.price)});
const m={};
Object.keys(g).forEach(k=>{
const a=g[k].sort((x,y)=>x-y);
m[k]=a.length>=4?a[Math.floor(a.length/2)]:0;
});
return m;
}
function score(i,ctx){
let s=0;
const title=norm(i.title),brand=norm(i.marque),cat=norm(i.category),desc=norm(i.description);
const t=ctx.toks;
if(t.length){
if(title.includes(t.join(" ")))s+=18;
let all=0;
t.forEach(k=>{
if(title.includes(k)){all++;s+=7;if(title.startsWith(k))s+=2}
else if(brand.includes(k)){all++;s+=5}
else if(cat.includes(k)){all++;s+=3}
else if(desc.includes(k)){all++;s+=1.5}
});
if(all===t.length)s+=6;
}
const it=ctx.int;
s+=(it.cat[i.category]||0)*6+(it.brand[norm(i.marque)]||0)*5;
if(it.pmed&&i.price){const r=i.price/it.pmed;if(r>=.5&&r<=1.6)s+=2}
const sh=typeof shops!=="undefined"?shops[i.user_id]:null;
if(sh&&sh.certifiee)s+=6;
const rt=typeof R!=="undefined"?R[i.user_id]:null;
if(rt&&rt.n>=2){s+=((rt.s/rt.n)-3.5)*3;if(rt.n>=5)s+=1}
const np=(i.photos||[]).length;
s+=np===0?-8:np===1?-3:np>=5?4:np>=3?3:0;
const dl=String(i.description||"").trim().length;
s+=dl>=60?2:dl<15?-2:0;
const age=(Date.now()-new Date(i.created_at||Date.now()))/864e5;
s+=Math.max(0,7-age)*.9-(age>45?3:0);
if(i.prix_initial&&i.prix_initial>i.price){
const pct=i.promo_pct||Math.round((1-i.price/i.prix_initial)*100);
s+=Math.min(8,pct/4);
}
const med=ctx.med[i.category];
if(med&&i.price>0){
const r=i.price/med;
if(r<.3)s-=5;else if(r<.85)s+=3;else if(r>1.6)s-=2;
}
if(i.reserve_jusqu&&new Date(i.reserve_jusqu)>new Date())s-=8;
if(i.vendu)s-=60;
return s;
}
function rankList(list,txt){
const toks=tokens(txt).map(w=>stem(norm(w)));
const ctx={toks,int:interest(),med:medians(list)};
const pool=list.map(i=>({i,s:score(i,ctx),u:i.user_id})).sort((a,b)=>b.s-a.s);
const out=[],cnt={};
while(pool.length){
let bi=0,bv=-1e9;
const lim=Math.min(pool.length,40);
for(let k=0;k<lim;k++){
const v=pool[k].s-2.5*(cnt[pool[k].u]||0);
if(v>bv){bv=v;bi=k}
}
const p=pool.splice(bi,1)[0];
out.push(p);
cnt[p.u]=(cnt[p.u]||0)+1;
}
return out;
}
function trackSearch(term){
try{
if(localStorage.getItem("finder_perso")==="off")return;
const t=norm(term);
if(t.length<2)return;
const B=JSON.parse(localStorage.getItem("finder_beh_v1")||"null")||{};
B.ev=Array.isArray(B.ev)?B.ev:[];B.nud=B.nud||{};B.last=B.last||Date.now();
B.ev.push({t:Date.now(),type:"search",term:t});
if(B.ev.length>300)B.ev.shift();
localStorage.setItem("finder_beh_v1",JSON.stringify(B));
}catch(e){}
}
/* ===== Interface ===== */
const st=document.createElement("style");
st.textContent=`
#advrow{margin:8px 0}
#advrow button{width:100%;background:#fff;border:1.5px solid #E2EBEB;color:#005961}
#dsr{width:min(96vw,980px)}
.sgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:10px}
@media(min-width:640px){.sgrid{grid-template-columns:repeat(3,1fr)}}
@media(min-width:900px){.sgrid{grid-template-columns:repeat(4,1fr)}}
.sr2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
#dsr details{background:#fff;border:1px solid #E2EBEB;border-radius:16px;padding:6px 14px;margin:8px 0}
#dsr summary{font-weight:700;padding:8px 0;cursor:pointer}
#moreRow{margin:14px 0;text-align:center}
#srmore{width:100%;margin:14px 0}
.tagr{background:#FFF3C4;color:#8A5A00}
`;
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dsr"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Recherche</h2></div><details id="srdet" open><summary>⚙️ Filtres et tri</summary><form id="srf"><label>Mot-clé</label><input name="q" placeholder="Que cherchez-vous ?" autocomplete="off"><div class="sr2"><select name="cat"></select><select name="ville"></select></div><div class="sr2"><select name="etat"></select><select name="sort"><option value="pertinence">⭐ Pertinence (conseillé)</option><option value="recent">Plus récentes</option><option value="prix_asc">Prix croissant</option><option value="prix_desc">Prix décroissant</option><option value="promo">Promotions d’abord</option></select></div><div class="sr2"><select name="pub"></select><select name="taille"></select></div><div class="sr2"><input name="min" type="number" inputmode="numeric" min="0" placeholder="Prix min (FCFA)"><input name="max" type="number" inputmode="numeric" min="0" placeholder="Prix max (FCFA)"></div><label class="chk"><input type="checkbox" name="promo"> 🏷️ En promotion seulement</label><label class="chk"><input type="checkbox" name="cert"> ✓ Boutiques certifiées seulement</label><label class="chk"><input type="checkbox" name="vendus"> Inclure les articles vendus</label><div class="row"><button class="pri">Rechercher</button><button type="button" id="srreset">Réinitialiser</button></div><button type="button" class="sbtn" id="sralert">🔔 M’alerter des nouvelles annonces</button></form></details><p class="meta" id="srinfo"></p><div id="srgrid" class="sgrid"></div><button type="button" class="sbtn" id="srmore" hidden>Charger plus</button></dialog>');
const dsr=q("#dsr");
dsr.querySelector("[data-x]").onclick=()=>dsr.close();
const f=q("#srf");
const opt=(arr,first)=>(first?'<option value="">'+first+"</option>":"")+arr.map(x=>"<option>"+esc(x)+"</option>").join("");
function fillTaille(v){
const L=SZ[f.cat.value];
f.taille.disabled=!L;
f.taille.innerHTML=L?'<option value="">'+SZL[f.cat.value]+"</option>"+L.map(x=>"<option>"+esc(x)+"</option>").join(""):'<option value="">Taille : choisissez Vêtements, Chaussures ou Bébé</option>';
if(L&&v&&L.includes(v))f.taille.value=v;
}
function build(){
f.cat.innerHTML=opt(CATS,"Toutes catégories");
f.ville.innerHTML=opt(CITIES,"Toutes villes");
f.etat.innerHTML=opt(ETATS,"Tous états");
f.pub.innerHTML=opt(["Homme","Femme","Enfant","Mixte"],"Tout public");
fillTaille("");
}
f.cat.onchange=()=>fillTaille("");
function toForm(){
f.q.value=S.q;f.cat.value=S.cat;f.ville.value=S.ville;f.etat.value=S.etat;f.min.value=S.min;f.max.value=S.max;f.sort.value=S.sort;
f.pub.value=S.pub;
fillTaille(S.taille);
f.promo.checked=S.promo;f.cert.checked=S.cert;f.vendus.checked=S.vendus;
}
function fromForm(){
S={q:f.q.value,cat:f.cat.value,ville:f.ville.value,etat:f.etat.value,min:f.min.value,max:f.max.value,sort:f.sort.value,pub:f.pub.value,taille:f.taille.value,promo:f.promo.checked,cert:f.cert.checked,vendus:f.vendus.checked};
}
async function certIds(){
if(CERT.ids&&Date.now()-CERT.t<300000)return CERT.ids;
const{data}=await sb.from("boutiques").select("user_id").eq("certifiee",true);
CERT.ids=(data||[]).map(x=>x.user_id);CERT.t=Date.now();
return CERT.ids;
}
function summary(){
const p=[];
if(S.q.trim())p.push("« "+S.q.trim()+" »");
if(S.cat)p.push(S.cat);
if(S.pub)p.push(S.pub);
if(S.taille)p.push(S.taille);
if(S.ville)p.push(S.ville);
if(S.etat)p.push(S.etat);
const mn=parseInt(S.min,10),mx=parseInt(S.max,10);
if(mn>0||mx>0)p.push((mn>0?fcfa(mn):"0")+" – "+(mx>0?fcfa(mx):"∞"));
if(S.promo)p.push("promotions");
if(S.cert)p.push("boutiques certifiées");
return p.join(" · ");
}
function decor(){
q("#srgrid").querySelectorAll(".card").forEach(c=>{
if(c.dataset.sd)return;
c.dataset.sd="1";
const i=MAP[c.dataset.id];
if(!i)return;
if(i.prix_initial&&i.prix_initial>i.price&&!i.vendu){
const pct=i.promo_pct||Math.round((1-i.price/i.prix_initial)*100);
const b=c.querySelector("b");
if(b)b.insertAdjacentHTML("afterend",'<s class="old">'+fcfa(i.prix_initial)+"</s>");
if(!c.querySelector(".tag"))c.insertAdjacentHTML("afterbegin",'<span class="tag tagp">-'+pct+"%</span>");
}
});
}
function tagTop(){
if(S.sort!=="pertinence"||CAND.length<6)return;
[...q("#srgrid").querySelectorAll(".card")].slice(0,3).forEach(c=>{
if(c.dataset.top)return;
c.dataset.top="1";
if(!c.querySelector(".tag"))c.insertAdjacentHTML("afterbegin",'<span class="tag tagr">⭐ Top résultat</span>');
});
}
async function sellers(L){
const uids=[...new Set(L.map(i=>i.user_id))];
if(!uids.length)return;
const[a,b,c]=await Promise.all([sb.from("profils").select("*").in("user_id",uids),sb.from("boutiques").select("*").in("user_id",uids),sb.from("avis").select("seller_id,note").in("seller_id",uids)]);
(a.data||[]).forEach(p=>{pro[p.user_id]=p});
(b.data||[]).forEach(s=>{shops[s.user_id]=s});
const agg={};
(c.data||[]).forEach(v=>{const x=agg[v.seller_id]||(agg[v.seller_id]={s:0,n:0});x.s+=v.note;x.n++});
uids.forEach(u=>{if(agg[u])R[u]=agg[u];else delete R[u]});
}
const register=i=>{MAP[i.id]=i;if(!items.find(x=>x.id===i.id))items.push(i)};
async function run(reset){
if(busy)return;
busy=true;
const info=q("#srinfo"),grid=q("#srgrid"),more=q("#srmore");
const ranked=S.sort==="pertinence";
if(reset){page=0;CAND=[];grid.innerHTML="";more.hidden=true}
info.textContent="Recherche…";
try{
if(ranked&&!reset){
const L=CAND.slice(page*PAGE,page*PAGE+PAGE);
grid.insertAdjacentHTML("beforeend",L.map(card).join(""));
decor();
more.hidden=(page+1)*PAGE>=CAND.length;
busy=false;
return;
}
let r=sb.from("listings").select("*",{count:"exact"}).eq("statut","actif");
if(!S.vendus)r=r.eq("vendu",false);
tokens(S.q).forEach(t=>{r=r.or(cond(t))});
if(S.cat)r=r.eq("category",S.cat);
if(S.ville)r=r.eq("city",S.ville);
if(S.etat)r=r.eq("etat",S.etat);
if(S.pub)r=r.eq("public_cible",S.pub);
if(S.taille)r=r.eq("taille",S.taille);
const mn=parseInt(S.min,10),mx=parseInt(S.max,10);
if(mn>0)r=r.gte("price",mn);
if(mx>0)r=r.lte("price",mx);
if(S.promo)r=r.not("prix_initial","is",null);
if(S.cert){const ids=await certIds();r=r.in("user_id",ids.length?ids:["00000000-0000-0000-0000-000000000000"])}
if(ranked){
r=r.order("created_at",{ascending:false}).range(0,CAND_MAX-1);
}else{
if(S.sort==="prix_asc")r=r.order("price",{ascending:true});
else if(S.sort==="prix_desc")r=r.order("price",{ascending:false});
else if(S.sort==="promo")r=r.order("promo_pct",{ascending:false,nullsFirst:false});
r=r.order("created_at",{ascending:false}).range(page*PAGE,page*PAGE+PAGE-1);
}
const{data,count,error}=await r;
if(error)throw error;
let L=data||[];
if(reset)total=count||0;
await sellers(L);
L.forEach(register);
if(ranked){
CAND=rankList(L,S.q).map(x=>x.i);
L=CAND.slice(0,PAGE);
}
grid.insertAdjacentHTML("beforeend",L.map(card).join(""));
decor();
if(ranked)tagTop();
const s=summary();
let t=total?total+" résultat"+(total>1?"s":"")+(s?" · "+s:""):"Aucun résultat. Essayez d’élargir vos filtres.";
if(total&&ranked)t+=" · classés par pertinence"+(total>CAND_MAX?" (sur les "+CAND_MAX+" plus récents)":"");
info.textContent=t;
more.hidden=ranked?CAND.length<=PAGE:(page+1)*PAGE>=total;
}catch(e){
info.textContent="Impossible de charger les résultats. Vérifiez votre connexion.";
}
busy=false;
}
function openSearch(){
build();toForm();
q("#srdet").open=true;
if(!dsr.open)dsr.showModal();
run(true);
}
f.onsubmit=e=>{e.preventDefault();fromForm();trackSearch(S.q);q("#srdet").open=false;run(true)};
f.sort.onchange=()=>{fromForm();run(true)};
q("#srreset").onclick=()=>{S={...S0};toForm();run(true)};
q("#srmore").onclick=()=>{page++;run(false)};
q("#sralert").onclick=async()=>{
const info=q("#srinfo");
if(!user){q("#da").showModal();return}
fromForm();
if(!S.q.trim()&&!S.cat){info.textContent="Pour créer une alerte, ajoutez un mot-clé ou choisissez une catégorie.";return}
const mn=parseInt(S.min,10),mx=parseInt(S.max,10);
const{error}=await sb.rpc("creer_alerte",{p_mot:S.q.trim()||null,p_cat:S.cat||null,p_ville:S.ville||null,p_min:mn>0?mn:null,p_max:mx>0?mx:null});
if(error){
const t=error.message||"";
info.textContent=t.includes("trop d alertes")?"Vous pouvez créer 10 alertes au maximum.":t.includes("prix invalide")?"Le prix minimum doit être inférieur au prix maximum.":"Création de l’alerte impossible. Réessayez.";
return;
}
showToast("Alerte créée ✓ Vous serez prévenu des nouvelles annonces correspondantes.","notif");
};
async function ensure(i){
if(pro[i.user_id]&&(i.user_id in shops||!i.user_id))return;
const[a,b]=await Promise.all([sb.from("profils").select("*").eq("user_id",i.user_id).maybeSingle(),sb.from("boutiques").select("*").eq("user_id",i.user_id).maybeSingle()]);
if(a.data)pro[i.user_id]=a.data;
if(b.data)shops[i.user_id]=b.data;
}
q("#srgrid").onclick=async e=>{
const h=e.target.closest(".heart");
if(h){
if(!user){q("#da").showModal();return}
const id=h.dataset.h;
if(favs.has(id)){favs.delete(id);h.classList.remove("on");await sb.from("favoris").delete().eq("listing_id",id)}
else{favs.add(id);h.classList.add("on");await sb.from("favoris").insert({listing_id:id})}
return;
}
const c=e.target.closest(".card");
if(!c)return;
const i=MAP[c.dataset.id];
if(!i)return;
if(!items.find(x=>x.id===i.id))items.push(i);
await ensure(i);
show(i);
};
const adv=document.createElement("div");
adv.id="advrow";
adv.innerHTML='<button type="button">⚙️ Filtres, tri et prix</button>';
q("#f").after(adv);
adv.querySelector("button").onclick=()=>{S={...S0,q:q("#q").value,ville:q("#fv").value,etat:q("#fe").value,cat:cat||""};openSearch()};
const more=document.createElement("div");
more.id="moreRow";
more.innerHTML='<button type="button" class="pri sbtn">Voir toutes les annonces et filtrer →</button>';
q("#grid").after(more);
more.querySelector("button").onclick=()=>{S={...S0,q:q("#q").value,ville:q("#fv").value,etat:q("#fe").value,cat:cat||""};openSearch()};
const L0=window.labels;
window.labels=function(){const r=L0.apply(this,arguments);more.hidden=mode!=="all";return r};
more.hidden=mode!=="all";
/* La recherche de l'accueil utilise le classement par pertinence */
if(HOME_TO_RANKED){
q("#f").addEventListener("submit",e=>{
const t=(q("#q").value||"").trim();
if(t.length<2)return;
e.preventDefault();e.stopImmediatePropagation();
trackSearch(t);
S={...S0,q:t,ville:q("#fv").value,etat:q("#fe").value,cat:cat||""};
openSearch();
},true);
}
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment fonctionne la recherche ?</summary><p>Tapez ce que vous cherchez dans la barre de recherche : les meilleurs résultats s’affichent en premier (mots du titre, confiance du vendeur, photos, fraîcheur, vos goûts). Appuyez sur « Filtres, tri et prix » pour choisir la catégorie, la ville, l’état, le public, la taille, le prix, les promotions ou les boutiques certifiées. Appuyez sur « M’alerter » pour être prévenu des nouvelles annonces qui correspondent.</p></details>");
}catch(e){}
})();
// FIN DU FICHIER
