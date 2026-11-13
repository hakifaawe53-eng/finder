// Finder - guide.js : visite guidée et guide de la plateforme
(function(){
if(window.__finderGuide)return;window.__finderGuide=1;
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const mob=()=>matchMedia("(max-width:899px)").matches;
const vis=el=>!!el&&!el.hidden&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=="hidden";
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>50)clearInterval(iv)},200)};
const st=document.createElement("style");
st.textContent=`
#gtour{position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0;border-radius:0!important;background:transparent;overflow:hidden;animation:none!important;touch-action:none}
#gtour::backdrop{background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
#gtspot{position:absolute;border-radius:14px;box-shadow:0 0 0 9999px rgba(8,35,40,.74);outline:3px solid #19D3C5;transition:left .35s,top .35s,width .35s,height .35s;pointer-events:none;animation:gtp 1.8s ease-in-out infinite}
#gtspot.none{left:50%;top:50%;width:0;height:0;outline:none;animation:none}
@keyframes gtp{0%,100%{outline-color:#19D3C5}50%{outline-color:rgba(25,211,197,.25)}}
#gtcard{position:absolute;left:50%;transform:translateX(-50%);width:min(92vw,420px);background:#fff;border-radius:20px;padding:16px 18px 14px;box-shadow:0 20px 60px rgba(0,0,0,.4);color:#12212B}
#gtcard.up{top:12px}
#gtcard.dn{bottom:12px}
#gtcard.mid{top:50%;transform:translate(-50%,-50%)}
.gtprog{height:4px;background:#E8F6F5;border-radius:4px;overflow:hidden;margin-bottom:10px}
.gtprog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#00A39A,#007782);transition:width .3s}
.gthd{display:flex;align-items:center;gap:10px}
#gtic{font-size:1.7rem}
#gtt{margin:0;font-size:1.1rem}
#gtx{margin:8px 0 12px;line-height:1.45}
.gtcta{width:100%;margin-bottom:10px}
.gtnav{display:flex;align-items:center;justify-content:space-between;gap:8px}
.gtbtns{display:flex;gap:8px}
#gtcount{color:#6A7B84;font-size:.85rem}
#gtask{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;width:min(92vw,420px);background:#fff;border:1px solid #BFE5E1;border-radius:18px;padding:14px 16px;box-shadow:0 12px 36px rgba(0,87,95,.3);z-index:60;animation:gtup .4s ease}
#gtask[hidden]{display:none}
#gtask p{margin:4px 0 10px}
@keyframes gtup{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}
@media(max-width:899px){#gtask{bottom:92px}}
#bgd:before{content:"🧭"}
.gdr{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #E2EBEB}
.gdr i{font-style:normal;font-size:1.4rem;width:2rem;text-align:center}
.gdr div{flex:1}
.gdr small{color:#6A7B84;display:block}
.gdr button{padding:7px 12px}
#dguide h3{margin:16px 0 4px}
`;
document.head.appendChild(st);
const GD=[
["🛒 Acheter",[
["🔎","Rechercher","Tapez un article, ou @identifiant pour retrouver une boutique.","q",0],
["🗂️","Catégories","Parcourez les articles par catégorie.","cats",0],
["❤️","Favoris","Gardez les annonces qui vous plaisent.","fav",1],
["🔔","Alertes","Soyez prévenu quand un article correspond à votre recherche.","bal",1],
["👥","Abonnements","Suivez des boutiques pour voir leurs nouveautés.","babo",1],
["🤝","Offres de prix","Négociez le prix avant d’acheter.","boff",1],
["📦","Mes achats","Suivez vos commandes et la livraison.","ord",1],
["💬","Messages","Écrivez aux vendeurs.","msgs",1]]],
["🏷️ Vendre",[
["➕","Publier une annonce","Photos, prix, catégorie et description.","sell",1],
["🏪","Ma boutique","Nom, logo, identifiant, promotions, mode vacances.","bq",1],
["🪪","Vérifier mon identité","Pour le badge bleu et une limite de ventes plus haute.","bid",1],
["📈","Ma carrière","Vos ventes, vos avis, votre ancienneté.","bcar",1]]],
["👤 Mon compte",[
["👛","Porte-monnaie","Recharge (test), historique, transferts.","wal",1],
["⚙️","Paramètres","Profil, sécurité, notifications, vos données.","pro",1]]],
["🆘 Aide",[
["❓","Centre d’aide","Les questions fréquentes.","bhelp",0],
["🎧","Contacter le support","Écrivez à l’équipe Finder.","bsup",1],
["🎁","Inviter des amis","Partagez Finder sur WhatsApp.","binv",0]]]
];
document.body.insertAdjacentHTML("beforeend",'<dialog id="gtour"><div id="gtspot" class="none"></div><div id="gtcard" class="mid"><div class="gtprog"><i></i></div><div class="gthd"><span id="gtic"></span><h3 id="gtt"></h3></div><p id="gtx"></p><button type="button" class="pri gtcta" id="gtcta" hidden></button><div class="gtnav"><button type="button" id="gtskip">Quitter</button><span id="gtcount"></span><span class="gtbtns"><button type="button" id="gtprev">←</button><button type="button" class="pri" id="gtnext">Suivant</button></span></div></div></dialog><div id="gtask" hidden><b></b><p></p><div class="row"><button type="button" class="pri" data-yes></button><button type="button" data-no>Non merci</button></div></div><dialog id="dguide"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Guide de Finder</h2></div><p class="meta">Tout ce qu’il faut savoir pour bien démarrer sur Finder.</p><div class="row"><button type="button" class="pri" data-tour="gen">▶ Visite guidée</button><button type="button" data-tour="sell">🏪 Guide du vendeur</button></div><div id="gdbody"></div></dialog>');
const tour=q("#gtour"),spot=q("#gtspot"),card=q("#gtcard"),dguide=q("#dguide"),ask=q("#gtask");
dguide.querySelector("[data-x]").onclick=()=>dguide.close();
q("#gdbody").innerHTML=GD.map(g=>"<h3>"+g[0]+"</h3>"+g[1].map(r=>'<div class="gdr"><i>'+r[0]+"</i><div><b>"+r[1]+"</b><small>"+r[2]+'</small></div><button type="button" data-g="'+r[3]+'" data-l="'+r[4]+'">Ouvrir</button></div>').join("")).join("");
function stepsGen(){
const S=[];
S.push({ic:"👋",t:"Bienvenue sur Finder",x:"Finder est la plateforme de vente d’articles d’occasion en Côte d’Ivoire. En une minute, découvrez où se trouve chaque chose."});
S.push({ic:"🔎",t:"La recherche",x:"Tapez un article (iPhone, robe, moto…) ou @identifiant pour retrouver une boutique. Affinez par ville et par état.",el:()=>q("#f")});
S.push({ic:"🗂️",t:"Les catégories",x:"Touchez une catégorie pour ne voir que ces articles. Sur mobile, le bouton « Catégories » en bas ouvre la liste complète.",el:()=>q("#hcats")});
S.push({ic:"📍",t:"Près de chez vous",x:"Activez la localisation pour voir les annonces de votre ville et les bonnes affaires (prix sous la moyenne de leur catégorie).",el:()=>q("#geochip")});
S.push({ic:"🛍️",t:"Une annonce",x:"Touchez une annonce pour voir les photos, le prix, la protection acheteur, négocier le prix, écrire au vendeur, partager ou suivre sa boutique.",el:()=>q("#grid .card")});
S.push({ic:"🧭",t:"La navigation",x:mob()?"En bas : Accueil, Catégories, le bouton + pour vendre, Messages et votre Profil. Le menu ☰ en haut donne accès au reste.":"Le menu à gauche donne accès à tout : catégories, commandes, messages, porte-monnaie, boutique et aide.",el:()=>mob()?q("#bnav"):q("#side")});
if(user){
S.push({ic:"🔔",t:"Vos notifications",x:"Commandes, offres de prix, alertes, nouvelles annonces des boutiques que vous suivez : tout arrive ici, en direct.",el:()=>q("#bell")});
S.push({ic:"👛",t:"Le porte-monnaie",x:"Votre argent sur Finder (en mode test pour l’instant : recharge fictive). Lors d’un achat, il est gardé en sécurité jusqu’à la confirmation de réception.",el:()=>q("#wal"),side:true});
S.push({ic:"📦",t:"Achats et suivi",x:"Suivez vos commandes et l’état de la livraison, confirmez la réception ou signalez un problème.",el:()=>q("#ord"),side:true});
S.push({ic:"⚙️",t:"Paramètres",x:"Profil, mot de passe, validation en deux étapes, notifications, localisation et téléchargement de vos données.",el:()=>q("#pro"),side:true});
}else{
S.push({ic:"👤",t:"Créer un compte",x:"Un compte gratuit permet d’acheter, de vendre, de suivre des boutiques, de recevoir des alertes et de négocier les prix.",el:()=>q("#auth")});
}
S.push({ic:"🛡️",t:"Achat sécurisé",x:"L’argent est gardé par Finder jusqu’à la réception de l’article, et vous pouvez signaler un problème avant de confirmer. Les boutiques certifiées portent le badge bleu ✓."});
S.push({ic:"🏷️",t:"Vendre sur Finder",x:user&&acct==="client"?"Pour vendre, passez en compte vendeur avec le bouton « Compte client ⇄ Vendeur ». Vous pourrez ensuite publier une annonce en une minute.":"Appuyez sur « Vendre », ajoutez titre, prix, catégorie et photos (vous pouvez les prendre sur le moment). Créez ensuite votre boutique pour gagner la confiance des acheteurs.",el:()=>mob()?q("#bnav .plus"):(vis(q("#sell"))?q("#sell"):q("#sw"))});
S.push({ic:"🎉",t:"Vous êtes prêt !",x:"Retrouvez cette visite à tout moment dans le menu, rubrique « Guide de Finder ».",cta:user?{label:"Explorer les annonces",run:()=>window.scrollTo({top:0,behavior:"smooth"})}:{label:"Créer mon compte",run:()=>q("#da").showModal()}});
return S;
}
function stepsSell(){
return [
{ic:"🏪",t:"Votre espace vendeur",x:"Voici en une minute comment vendre sur Finder et gagner la confiance des acheteurs."},
{ic:"🏷️",t:"Publier une annonce",x:"Titre, prix, catégorie et photos (prises en direct si vous voulez). Téléphones, ordinateurs et véhicules demandent un numéro de série ou un IMEI : c’est obligatoire pour lutter contre le vol.",el:()=>mob()?q("#bnav .plus"):q("#sell")},
{ic:"🏪",t:"Votre boutique",x:"Créez votre boutique (nom, logo, ville, délai de livraison). Vous y trouvez aussi votre identifiant @, les promotions, le mode vacances et le partage WhatsApp.",el:()=>q("#bq"),side:true},
{ic:"✅",t:"Le badge bleu",x:"Faites vérifier votre identité (pièce recto et verso, selfie), complétez la boutique et réunissez ventes et avis : le badge bleu rassure les acheteurs et relève votre limite de ventes.",el:()=>q("#bid"),side:true},
{ic:"🤝",t:"Offres de prix",x:"Les acheteurs peuvent proposer un prix. Acceptez, refusez ou répondez par un autre prix : un accord est réservé à l’acheteur pendant 48 heures.",el:()=>q("#boff"),side:true},
{ic:"📦",t:"Ventes et livraison",x:"Dans « Mes ventes », vous voyez l’adresse du client et mettez à jour le statut : en préparation, expédiée, en livraison, livrée. L’acheteur est prévenu à chaque étape.",el:()=>q("#ord"),side:true},
{ic:"🔥",t:"Promotions",x:"Ouvrez une de vos annonces, ou « Ma boutique », pour appliquer une réduction : le prix d’origine reste barré et vos abonnés sont prévenus."},
{ic:"🏖️",t:"Mode vacances",x:"Absent quelques jours ? Dans « Ma boutique », activez le mode vacances : les achats sont suspendus, vos annonces restent visibles."},
{ic:"👛",t:"Porte-monnaie vendeur",x:"Vous êtes payé quand l’acheteur confirme la réception. La limite est de "+fcfa(plStd)+", et jusqu’à "+fcfa(plBq)+" avec une boutique et une identité vérifiée.",el:()=>q("#wal"),side:true},
{ic:"🎉",t:"À vous de jouer !",x:"Publiez votre première annonce : plus vos photos sont nettes et votre description précise, plus vous vendez vite.",cta:myShop?{label:"Publier une annonce",run:()=>q("#sell").click()}:{label:"Créer ma boutique",run:()=>q("#bq").click()}}
];
}
let T=null,cur=null;
function place(el){
card.classList.remove("up","dn","mid");
if(!vis(el)){spot.className="none";spot.removeAttribute("style");card.classList.add("mid");return}
const r=el.getBoundingClientRect(),p=6;
spot.className="";
spot.style.left=(r.left-p)+"px";spot.style.top=(r.top-p)+"px";spot.style.width=(r.width+p*2)+"px";spot.style.height=(r.height+p*2)+"px";
card.classList.add(r.top+r.height/2>innerHeight/2?"up":"dn");
}
function render(){
const s=T.steps[T.i],n=T.steps.length,last=T.i===n-1;
q("#gtic").textContent=s.ic;q("#gtt").textContent=s.t;q("#gtx").textContent=s.x;
q(".gtprog i").style.width=((T.i+1)/n*100)+"%";
q("#gtcount").textContent=(T.i+1)+" / "+n;
q("#gtprev").hidden=T.i===0;
q("#gtnext").textContent=last?"Terminer":"Suivant";
const cta=q("#gtcta");
if(last&&s.cta){cta.textContent=s.cta.label;cta.hidden=false;cta.onclick=()=>{const run=s.cta.run;endTour();setTimeout(run,250)}}else cta.hidden=true;
const needMenu=!!(s.side&&mob());
document.body.classList.toggle("menu",needMenu);
setTimeout(()=>{
if(!T)return;
const el=s.el?s.el():null;
if(vis(el)&&!el.closest("#side,#bnav,.top")){try{el.scrollIntoView({block:"center"})}catch(e){}}
cur=vis(el)?el:null;
setTimeout(()=>{if(T)place(cur)},80);
},needMenu?380:60);
}
function startTour(kind){
document.querySelectorAll("dialog[open]").forEach(d=>{if(d!==tour)d.close()});
ask.hidden=true;
T={kind,steps:kind==="sell"?stepsSell():stepsGen(),i:0};
if(!tour.open)tour.showModal();
render();
}
function endTour(){if(tour.open)tour.close()}
function next(){if(!T)return;if(T.i>=T.steps.length-1){endTour();return}T.i++;render()}
function prev(){if(!T||T.i===0)return;T.i--;render()}
q("#gtnext").onclick=next;
q("#gtprev").onclick=prev;
q("#gtskip").onclick=endTour;
tour.addEventListener("close",()=>{if(T)LS.set("finder_tour_"+T.kind,"1");T=null;cur=null;document.body.classList.remove("menu")});
tour.addEventListener("keydown",e=>{if(e.key==="ArrowRight")next();else if(e.key==="ArrowLeft")prev()});
tour.addEventListener("wheel",e=>e.preventDefault(),{passive:false});
window.addEventListener("resize",()=>{if(T)place(cur)});
/* Invitation */
function offer(kind){
ask.dataset.k=kind;
ask.querySelector("b").textContent=kind==="sell"?"🏪 Nouveau vendeur ?":"👋 Bienvenue sur Finder !";
ask.querySelector("p").textContent=kind==="sell"?"Découvrez en 1 minute comment vendre, créer votre boutique et gagner la confiance des acheteurs.":"Faites la visite guidée (1 minute) pour découvrir où trouver chaque chose.";
ask.querySelector("[data-yes]").textContent=kind==="sell"?"Voir le guide vendeur":"Commencer la visite";
ask.hidden=false;
}
ask.onclick=e=>{
const k=ask.dataset.k;
if(e.target.closest("[data-yes]"))startTour(k);
else if(e.target.closest("[data-no]")){LS.set("finder_tour_"+k,"1");ask.hidden=true}
};
let tries=0;
function maybeOffer(){
if(LS.get("finder_tour_gen"))return;
if(T||document.querySelector("dialog[open]")||!(mode==="all"&&!cat)){if(++tries<6)setTimeout(maybeOffer,4000);return}
offer("gen");
}
setTimeout(maybeOffer,3500);
const A0=window.applyUI;
window.applyUI=function(){
const r=A0.apply(this,arguments);
try{
if(user&&acct==="vendeur"&&!LS.get("finder_tour_sell")&&!sessionStorage.getItem("finder_ts")){
sessionStorage.setItem("finder_ts","1");
setTimeout(()=>{if(!T&&!document.querySelector("dialog[open]")&&ask.hidden)offer("sell")},2500);
}
}catch(e){}
return r;
};
/* Menu, guide et liens */
const bgd=document.createElement("button");
bgd.id="bgd";bgd.textContent="Guide de Finder";
q("#bhelp").before(bgd);
bgd.onclick=()=>dguide.showModal();
function openG(id,needLogin){
dguide.close();
if(needLogin&&!user){q("#da").showModal();return}
if(id==="q"){q("#q").focus();window.scrollTo({top:0,behavior:"smooth"});return}
if(id==="cats"){
if(mob()){const d=q("#dcat");if(d)d.showModal()}
else{const c=q("#hcats");if(c)c.scrollIntoView({behavior:"smooth"})}
return;
}
const t=q("#"+id);
if(t)setTimeout(()=>t.click(),80);
}
document.addEventListener("click",e=>{
const t=e.target.closest("[data-tour]");
if(t){startTour(t.dataset.tour);return}
const g=e.target.closest("[data-g]");
if(g)openG(g.dataset.g,g.dataset.l==="1");
});
try{
const h2=q("#dhelp h2");
if(h2)h2.insertAdjacentHTML("afterend",'<p><button type="button" class="pri sbtn" data-tour="gen">▶ Lancer la visite guidée</button> <button type="button" class="sbtn" data-tour="sell">🏪 Guide du vendeur</button></p>');
}catch(e){}
when("#dset",d=>{
const box=[...d.querySelectorAll("details.setd")].find(x=>x.textContent.includes("Aide et informations"));
if(box&&!box.querySelector("[data-go=bgd]"))box.insertAdjacentHTML("beforeend",'<button type="button" class="sbtn" data-go="bgd">🧭 Guide de Finder</button>');
});
})();
