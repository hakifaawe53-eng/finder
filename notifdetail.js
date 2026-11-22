// Finder - notifdetail.js : détails et navigation depuis les notifications
(function(){
if(window.__finderNotifDetail)return;window.__finderNotifDetail=1;
const q=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let w=0;
const iv=setInterval(()=>{
if(window.__finderUI&&q("#ntl")&&q("#dnt")){clearInterval(iv);init()}
else if(++w>80){clearInterval(iv);if(q("#ntl")&&q("#dnt"))init()}
},250);
function init(){
const dnt=q("#dnt");
const NTI={vente:"💰",achat:"🛍️",paiement:"✅",reception:"📦",remboursement:"↩️",annulation:"✖️",litige:"⚠️",livraison:"🚚",annonce:"📝",identite:"🪪",boutique:"🏪",portefeuille:"👛",support:"💬",alerte:"🔔",offre:"🤝",rdv:"📅",reservation:"🔖",abonnement:"👥"};
const CMD=new Set(["vente","achat","paiement","reception","remboursement","annulation","litige","livraison"]);
const ACT=new Set(["offre","rdv","reservation","abonnement"]);
const st=document.createElement("style");
st.textContent=`
.nt{cursor:pointer}
.nt .ntg{margin-left:auto;align-self:center;color:#6A7B84;font-size:1.3rem;padding-left:6px}
.ntdh{display:flex;gap:12px;align-items:center}
.ntdm{white-space:pre-wrap;margin:12px 0;line-height:1.45}
@keyframes ntflash{0%,100%{box-shadow:0 0 0 0 rgba(0,163,154,0)}30%{box-shadow:0 0 0 6px rgba(0,163,154,.45)}}
.ntflash{animation:ntflash 1.6s ease 2}
`;
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dntd"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Détail de la notification</h2></div><div id="ntdb"></div></dialog>');
const dd=q("#dntd");
dd.addEventListener("click",e=>{if(e.target.closest("[data-x]"))dd.close()});
let DATA=[],TAB="all",DETAIL=null,lastToast=0;
const T0=window.showToast;
window.showToast=function(t,a){if(a==="notif")lastToast=Date.now();return T0.apply(this,arguments)};
const icon=n=>NTI[n.type]||"🔔";
const click=sel=>{const e=q(sel);if(e)setTimeout(()=>e.click(),60)};
async function switchTo(r){
if(acct===r)return true;
if(!me)return false;
q("#sw").click();
for(let i=0;i<30;i++){await sleep(200);if(acct===r)return true}
return acct===r;
}
async function openListing(id){
const{data:l}=await sb.from("listings").select("*").eq("id",id).maybeSingle();
if(!l){alert("Cette annonce n’est plus disponible.");return}
if(!items.find(x=>x.id===l.id))items.push(l);
if(!pro[l.user_id]||!(l.user_id in shops)){
const[a,b]=await Promise.all([sb.from("profils").select("*").eq("user_id",l.user_id).maybeSingle(),sb.from("boutiques").select("*").eq("user_id",l.user_id).maybeSingle()]);
if(a.data)pro[l.user_id]=a.data;
if(b.data)shops[l.user_id]=b.data;
}
show(l);
}
async function openOrder(n){
let titre="";
try{const{data:o}=await sb.from("commandes").select("titre").eq("id",n.commande_id).maybeSingle();titre=(o&&o.titre)||""}catch(e){}
await openOrders();
const c=[...document.querySelectorAll("#ol .ord")].find(x=>{const b=x.querySelector(".ihead b");return b&&b.textContent===titre});
if(c){
c.scrollIntoView({block:"center",behavior:"smooth"});
c.classList.add("ntflash");
setTimeout(()=>c.classList.remove("ntflash"),3500);
}
}
function target(n){
const t=n.type,r=n.role,ti=n.titre||"";
if(/^Nouveau litige|Alerte rendez-vous/i.test(ti))return{label:"Ouvrir la modération",run:()=>click("#bmod")};
if(/Retrait à payer/i.test(ti))return{label:"Ouvrir le tableau de bord",run:()=>click("#bdash")};
if(n.commande_id)return{label:r==="vendeur"?"Voir mes ventes":"Voir mes achats",role:r,run:()=>openOrder(n)};
if(t==="offre"){
if(r==="vendeur")return{label:"Voir les offres reçues",role:"vendeur",run:()=>click("#boff")};
if(n.listing_id)return{label:"Ouvrir l’annonce",run:()=>openListing(n.listing_id)};
return{label:"Voir mes offres",role:"client",run:()=>click("#boff")};
}
if(t==="reservation"){
if(r==="vendeur")return{label:"Voir les articles réservés",role:"vendeur",run:()=>click("#bres")};
if(n.listing_id)return{label:"Ouvrir l’annonce",run:()=>openListing(n.listing_id)};
return{label:"Voir mes articles de côté",role:"client",run:()=>click("#bres")};
}
if(t==="rdv")return{label:"Voir mes rendez-vous",run:()=>click("#brdv")};
if(t==="alerte"||t==="abonnement"||t==="annonce"){
if(n.listing_id)return{label:"Ouvrir l’annonce",run:()=>openListing(n.listing_id)};
if(t==="abonnement")return{label:"Voir mes abonnements",run:()=>click("#babo")};
if(t==="annonce")return{label:"Voir mes annonces",role:"vendeur",run:()=>{mode="mine";labels();load();window.scrollTo(0,0)}};
return null;
}
if(t==="identite")return{label:"Vérification d’identité",run:()=>click("#bid")};
if(t==="boutique")return{label:"Ouvrir ma boutique",role:"vendeur",run:()=>click("#bq")};
if(t==="portefeuille")return{label:"Ouvrir le porte-monnaie",role:r,run:()=>click("#wal")};
if(t==="support")return{label:"Voir mes demandes au support",run:()=>click("#bsup")};
if(n.listing_id)return{label:"Ouvrir l’annonce",run:()=>openListing(n.listing_id)};
return null;
}
const when=n=>new Date(n.created_at).toLocaleString("fr-FR");
const roleLab=n=>n.role==="vendeur"?"Compte vendeur":n.role==="client"?"Compte client":"";
function filt(){return DATA.filter(n=>TAB==="all"||(TAB==="alerte"?n.type==="alerte":TAB==="act"?ACT.has(n.type):CMD.has(n.type)))}
function draw(){
const L=filt();
q("#ntl").innerHTML=L.length?L.map(n=>'<div class="nt'+(n.lu?"":" new")+'" data-nid="'+n.id+'" role="button" tabindex="0"><div class="nti">'+icon(n)+'</div><div class="ntb"><b>'+esc(n.titre)+"</b>"+esc(n.message)+'<br><span class="meta">'+when(n)+(roleLab(n)?" · "+roleLab(n):"")+'</span></div><span class="ntg">›</span></div>').join(""):"<p class='meta'>Aucune notification dans cette catégorie.</p>";
}
async function linked(n){
const box=q("#ntdl");
let h="";
if(n.commande_id){
const{data:o}=await sb.from("commandes").select("titre,montant,statut,livraison,created_at").eq("id",n.commande_id).maybeSingle();
if(o)h+='<div class="ord"><b>'+esc(o.titre)+"</b><br>"+fcfa(o.montant)+" · "+esc(ST[o.statut]||o.statut)+(o.statut==="paye"?'<br><span class="meta">Livraison : '+esc(LIVL[o.livraison]||"")+"</span>":"")+'<br><span class="meta">Commande du '+new Date(o.created_at).toLocaleDateString("fr-FR")+"</span></div>";
}
if(n.listing_id){
const{data:l}=await sb.from("listings").select("id,title,price,photos,vendu,statut,city").eq("id",n.listing_id).maybeSingle();
if(l)h+='<div class="ord"><div class="ihead">'+(l.photos&&l.photos[0]?'<img class="ithumb" src="'+esc(l.photos[0])+'" alt="">':'<div class="ithumb"></div>')+"<div><b>"+esc(l.title)+"</b><br>"+fcfa(l.price)+" · "+esc(l.city||"")+(l.vendu?" · <b>Vendu</b>":"")+"</div></div></div>";
}
if(box&&DETAIL&&DETAIL.id===n.id)box.innerHTML=h;
}
function openDetail(n){
DETAIL=n;
const dest=target(n);
q("#ntdb").innerHTML='<div class="ntdh"><span class="nti">'+icon(n)+'</span><div><b>'+esc(n.titre)+'</b><br><span class="meta">'+when(n)+(roleLab(n)?" · "+roleLab(n):"")+'</span></div></div><p class="ntdm">'+esc(n.message)+'</p><div id="ntdl"></div><div class="row">'+(dest?'<button type="button" class="pri" id="ntdgo">'+esc(dest.label)+"</button>":"")+'<button type="button" data-x>Fermer</button></div>';
dd.showModal();
linked(n).catch(()=>{});
}
q("#ntdb").addEventListener("click",async e=>{
if(!e.target.closest("#ntdgo")||!DETAIL)return;
const dest=target(DETAIL);
if(!dest)return;
if(dest.role&&dest.role!==acct){
const lab=dest.role==="vendeur"?"vendeur":"client";
if(!confirm("Cette notification concerne votre compte "+lab+". Passer en compte "+lab+" ?"))return;
if(!(await switchTo(dest.role))){alert("Changement de compte impossible. Réessayez.");return}
}
if(dd.open)dd.close();
if(dnt.open)dnt.close();
await dest.run();
});
q("#ntl").addEventListener("click",e=>{
const el=e.target.closest("[data-nid]");
if(!el)return;
const n=DATA.find(x=>String(x.id)===el.dataset.nid);
if(n)openDetail(n);
});
q("#ntl").addEventListener("keydown",e=>{
if(e.key!=="Enter"&&e.key!==" ")return;
const el=e.target.closest("[data-nid]");
if(!el)return;
e.preventDefault();
const n=DATA.find(x=>String(x.id)===el.dataset.nid);
if(n)openDetail(n);
});
let tabs=q("#nttabs");
if(!tabs){
q("#ntl").insertAdjacentHTML("beforebegin",'<div id="nttabs" class="tabs"><button type="button" data-t="all" class="on">Toutes</button><button type="button" data-t="cmd">Commandes</button><button type="button" data-t="alerte">Alertes</button></div>');
tabs=q("#nttabs");
}
if(!tabs.querySelector('[data-t="act"]'))tabs.insertAdjacentHTML("beforeend",'<button type="button" data-t="act">Activité</button>');
tabs.onclick=e=>{
const b=e.target.closest("[data-t]");
if(!b)return;
TAB=b.dataset.t;
tabs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
draw();
};
async function openNotifs3(){
if(!user)return;
askNotif();
TAB="all";
tabs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x.dataset.t==="all"));
q("#ntl").innerHTML="<p class='meta'>Chargement…</p>";
if(!dnt.open)dnt.showModal();
const{data}=await sb.from("notifications").select("*").order("created_at",{ascending:false}).limit(80);
DATA=data||[];
draw();
const unread=DATA.filter(n=>!n.lu),ids=unread.map(n=>n.id);
if(ids.length){
await sb.from("notifications").update({lu:true}).in("id",ids);
ids.forEach(i=>seenN.add(i));
await refreshNotifs();
}
if(unread.length===1&&Date.now()-lastToast<8000)openDetail(unread[0]);
}
window.openNotifs=openNotifs3;
q("#bell").onclick=openNotifs3;
q("#bnt").onclick=openNotifs3;
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Que fait un appui sur une notification ?</summary><p>Il ouvre le détail : message complet, date et résumé de la commande ou de l’annonce concernée, avec un bouton qui vous emmène au bon endroit (vos achats, vos ventes, l’annonce, les offres, les rendez-vous…). Si la notification concerne votre autre compte, Finder vous propose de basculer.</p></details>");
}catch(e){}
}
})();
