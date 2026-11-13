// Finder - search.js : recherche avancée, filtres, tri et chargement progressif
(function(){
if(window.__finderSearch)return;window.__finderSearch=1;
const q=s=>document.querySelector(s);
const PAGE=24;
const S0={q:"",cat:"",ville:"",etat:"",min:"",max:"",sort:"recent",promo:false,cert:false,vendus:false};
let S={...S0},page=0,total=0,busy=false;
const MAP={};
const CERT={ids:null,t:0};
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
`;
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dsr"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Recherche</h2></div><details id="srdet" open><summary>⚙️ Filtres et tri</summary><form id="srf"><label>Mot-clé</label><input name="q" placeholder="Que cherchez-vous ?" autocomplete="off"><div class="sr2"><select name="cat"></select><select name="ville"></select></div><div class="sr2"><select name="etat"></select><select name="sort"><option value="recent">Plus récentes</option><option value="prix_asc">Prix croissant</option><option value="prix_desc">Prix décroissant</option><option value="promo">Promotions d’abord</option></select></div><div class="sr2"><input name="min" type="number" inputmode="numeric" min="0" placeholder="Prix min (FCFA)"><input name="max" type="number" inputmode="numeric" min="0" placeholder="Prix max (FCFA)"></div><label class="chk"><input type="checkbox" name="promo"> 🏷️ En promotion seulement</label><label class="chk"><input type="checkbox" name="cert"> ✓ Boutiques certifiées seulement</label><label class="chk"><input type="checkbox" name="vendus"> Inclure les articles vendus</label><div class="row"><button class="pri">Rechercher</button><button type="button" id="srreset">Réinitialiser</button></div><button type="button" class="sbtn" id="sralert">🔔 M’alerter des nouvelles annonces</button></form></details><p class="meta" id="srinfo"></p><div id="srgrid" class="sgrid"></div><button type="button" class="sbtn" id="srmore" hidden>Charger plus</button></dialog>');
const dsr=q("#dsr");
dsr.querySelector("[data-x]").onclick=()=>dsr.close();
const f=q("#srf");
const opt=(arr,first)=>(first?'<option value="">'+first+"</option>":"")+arr.map(x=>"<option>"+esc(x)+"</option>").join("");
function build(){
f.cat.innerHTML=opt(CATS,"Toutes catégories");
f.ville.innerHTML=opt(CITIES,"Toutes villes");
f.etat.innerHTML=opt(ETATS,"Tous états");
}
function toForm(){
f.q.value=S.q;f.cat.value=S.cat;f.ville.value=S.ville;f.etat.value=S.etat;f.min.value=S.min;f.max.value=S.max;f.sort.value=S.sort;
f.promo.checked=S.promo;f.cert.checked=S.cert;f.vendus.checked=S.vendus;
}
function fromForm(){
S={q:f.q.value,cat:f.cat.value,ville:f.ville.value,etat:f.etat.value,min:f.min.value,max:f.max.value,sort:f.sort.value,promo:f.promo.checked,cert:f.cert.checked,vendus:f.vendus.checked};
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
async function run(reset){
if(busy)return;
busy=true;
const info=q("#srinfo"),grid=q("#srgrid"),more=q("#srmore");
if(reset){page=0;grid.innerHTML="";more.hidden=true}
info.textContent="Recherche…";
try{
let r=sb.from("listings").select("*",{count:"exact"}).eq("statut","actif");
if(!S.vendus)r=r.eq("vendu",false);
const kw=S.q.trim().replace(/[%,()]/g," ");
if(kw)r=r.or("title.ilike.%"+kw+"%,marque.ilike.%"+kw+"%");
if(S.cat)r=r.eq("category",S.cat);
if(S.ville)r=r.eq("city",S.ville);
if(S.etat)r=r.eq("etat",S.etat);
const mn=parseInt(S.min,10),mx=parseInt(S.max,10);
if(mn>0)r=r.gte("price",mn);
if(mx>0)r=r.lte("price",mx);
if(S.promo)r=r.not("prix_initial","is",null);
if(S.cert){const ids=await certIds();r=r.in("user_id",ids.length?ids:["00000000-0000-0000-0000-000000000000"])}
if(S.sort==="prix_asc")r=r.order("price",{ascending:true});
else if(S.sort==="prix_desc")r=r.order("price",{ascending:false});
else if(S.sort==="promo")r=r.order("promo_pct",{ascending:false,nullsFirst:false});
r=r.order("created_at",{ascending:false}).range(page*PAGE,page*PAGE+PAGE-1);
const{data,count,error}=await r;
if(error)throw error;
const L=data||[];
if(reset)total=count||0;
const uids=[...new Set(L.map(i=>i.user_id))];
if(uids.length){
const[a,b,c]=await Promise.all([sb.from("profils").select("*").in("user_id",uids),sb.from("boutiques").select("*").in("user_id",uids),sb.from("avis").select("seller_id,note").in("seller_id",uids)]);
(a.data||[]).forEach(p=>{pro[p.user_id]=p});
(b.data||[]).forEach(s=>{shops[s.user_id]=s});
const agg={};
(c.data||[]).forEach(v=>{const x=agg[v.seller_id]||(agg[v.seller_id]={s:0,n:0});x.s+=v.note;x.n++});
uids.forEach(u=>{if(agg[u])R[u]=agg[u];else delete R[u]});
}
L.forEach(i=>{MAP[i.id]=i;if(!items.find(x=>x.id===i.id))items.push(i)});
grid.insertAdjacentHTML("beforeend",L.map(card).join(""));
decor();
const s=summary();
info.textContent=total?total+" résultat"+(total>1?"s":"")+(s?" · "+s:""):"Aucun résultat. Essayez d’élargir vos filtres.";
more.hidden=(page+1)*PAGE>=total;
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
f.onsubmit=e=>{e.preventDefault();fromForm();q("#srdet").open=false;run(true)};
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
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment filtrer et trier les annonces ?</summary><p>Sous la barre de recherche, appuyez sur « Filtres, tri et prix » : choisissez la catégorie, la ville, l’état, une fourchette de prix, les promotions ou les boutiques certifiées. Appuyez sur « M’alerter » pour être prévenu des nouvelles annonces qui correspondent.</p></details>");
}catch(e){}
})();
