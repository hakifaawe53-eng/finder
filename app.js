// Finder - application (app.js)
const SB_URL="https://lgaspyiqaqntmsljooba.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYXNweWlxYXFudG1zbGpvb2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NTcwOTcsImV4cCI6MjEwODUzMzA5N30.ArQcp2h2dGHGe3Y8pQOl8eXJmLjpyzQfyrN3B2oiWQg";
const sb=supabase.createClient(SB_URL,SB_KEY);
const CATS=["Vêtements","Électroménager","Téléphones","Chaussures","Informatique","Meubles","Véhicules et motos","Bébé et enfants","Autres"];
const CITIES=["Abidjan","Yamoussoukro","Bouaké","Daloa","San-Pédro","Korhogo","Man","Autre ville"];
const ETATS=["Neuf avec étiquette","Neuf sans étiquette","Très bon état","Bon état","Satisfaisant"];
const DELAIS=["Remise en main propre le jour même","1 à 2 jours","3 à 5 jours","6 à 10 jours","Plus de 10 jours"];
const NUMREQ={"Téléphones":["IMEI du téléphone","Tapez *#06# sur le téléphone pour l’afficher : 15 chiffres."],"Informatique":["Numéro de série de l’appareil","Il est écrit sous l’appareil ou dans ses paramètres."],"Véhicules et motos":["Numéro de châssis ou plaque d’immatriculation","Il figure sur la carte grise."]};
const VB='<span class="vb" title="Boutique certifiée">✓</span>';
const SH='<svg class="shield" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M9 12l2 2 4-4"/></svg>';
const TT={recharge_test:"Recharge (test)",achat:"Achat",protection:"Protection acheteur",vente:"Vente",commission:"Commission Finder",remboursement:"Remboursement",retrait_test:"Transfert (test)"};
const ST={paye:"Payé, en attente de confirmation de réception",livre:"Terminé",annule:"Annulé et remboursé",litige:"Litige en cours : Finder examine la situation"};
const LIVS=["nouvelle","en_preparation","expediee","en_livraison","livree"];
const LIVL={nouvelle:"Commande reçue",en_preparation:"En préparation",expediee:"Expédiée",en_livraison:"En livraison",livree:"Livrée"};
const LIVC={nouvelle:"Reçue",en_preparation:"Préparation",expediee:"Expédiée",en_livraison:"En livraison",livree:"Livrée"};
const ERR={"solde insuffisant":"Solde insuffisant. Rechargez votre porte-monnaie.","mode client requis":"Passez en compte client pour faire cette action.","article deja vendu":"Cet article est déjà vendu.","commande deja traitee":"Cette commande est déjà traitée.","vous ne pouvez pas acheter":"Vous ne pouvez pas acheter votre propre article.","motif requis":"Décrivez le problème en quelques mots.","imei invalide":"IMEI invalide : il doit avoir 15 chiffres. Tapez *#06# sur le téléphone pour le voir.","numero requis":"Le numéro de série (ou l’IMEI) est obligatoire pour cette catégorie.","numero invalide":"Le numéro saisi n’est pas valide.","attestation requise":"Vous devez certifier que l’article vous appartient.","mode vendeur requis":"Passez en compte vendeur pour publier une annonce.","trop de declarations":"Trop de déclarations aujourd’hui. Réessayez demain.","annonce non disponible":"Cette annonce n’est pas disponible.","acces refuse":"Accès refusé.","plafond vendeur depasse":"Ce prix dépasse la place disponible dans votre porte-monnaie vendeur. Transférez de l’argent vers votre Mobile Money, ou créez une boutique Finder et faites vérifier votre identité pour augmenter la limite.","plafond vendeur atteint":"Cet article ne peut pas être acheté pour le moment.","age minimum 18 ans":"Vous devez avoir au moins 18 ans.","naissance invalide":"Date de naissance invalide.","telephone invalide":"Numéro de téléphone invalide.","numero piece invalide":"Numéro de pièce invalide (5 caractères minimum).","adresse invalide":"Adresse invalide.","nom invalide":"Nom ou prénoms invalides.","photos requises":"Les deux photos sont obligatoires.","identite deja soumise":"Votre demande est déjà enregistrée.","message trop court":"Écrivez un message plus détaillé (5 caractères minimum).","trop de demandes":"Trop de demandes aujourd’hui. Réessayez demain.","livraison incomplete":"Complétez toutes les informations de livraison (la position GPS est facultative).","statut invalide":"Ce changement de statut n’est pas possible.","commande introuvable":"Commande introuvable."};
const $=s=>document.querySelector(s);
const BASE=document.title;
let user=null,items=[],mode="all",cat="",acct="client",wbal=0,protPct=5,protFix=150,plStd=250000,plBq=10000000,kycReq=true,kycCreate=false,plaf=null,favs=new Set(),me=null,myId=null,pro={},shops={},myShop=null,R={},sellerId=null,revSeller=null,repListing=null,needProfile=false,recov=false,chat=null,tm=null,lastN="",nt=null,unread=0,first=true,ordN=0,nUnread=0,seenN=new Set(),nFirst=true,toastAct="msg",livItem=null,livGps=null;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fcfa=n=>Number(n).toLocaleString("fr-FR")+" FCFA";
const protFee=p=>Math.round(p*protPct/100)+protFix;
const err=e=>{const m=(e&&e.message)||"";for(const k in ERR)if(m.includes(k))return ERR[k];return "Opération impossible. Réessayez."};
function depuis(ts){
if(!ts)return "";
const days=Math.floor((Date.now()-new Date(ts).getTime())/864e5);
if(days<1)return "aujourd’hui";
if(days<30)return days+" jour"+(days>1?"s":"");
if(days<365)return Math.floor(days/30)+" mois";
const a=Math.floor(days/365),m=Math.floor((days%365)/30);
return a+" an"+(a>1?"s":"")+(m?" et "+m+" mois":"");
}
const vs=p=>p&&p.vendeur_depuis?"Vendeur sur Finder depuis "+depuis(p.vendeur_depuis):"";
const fill=(sel,arr,firstOpt)=>{sel.innerHTML=(firstOpt?`<option value="">${firstOpt}</option>`:"")+arr.map(x=>`<option>${x}</option>`).join("")};
function injectLiv(){
const st=document.createElement("style");
st.textContent=".lv{font-size:.8rem;color:var(--mut);margin:4px 0}.lv span{margin-right:8px;white-space:nowrap;display:inline-block}.lv .on{color:var(--t);font-weight:600}.lsel{margin-top:8px}#dliv h3{margin:12px 0 4px;font-size:1rem}";
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",`<dialog id="dliv">
<h2>Livraison</h2>
<p id="livres"></p>
<p class="meta">Indiquez où le vendeur doit livrer votre commande. Le montant sera retiré de votre porte-monnaie client et gardé jusqu’à la réception de l’article.</p>
<form id="lf">
<label for="ln">Nom et prénom du destinataire</label><input id="ln" name="ln" required minlength="3" maxlength="80" autocomplete="name">
<label for="lt">Téléphone du destinataire</label><input id="lt" name="lt" type="tel" inputmode="tel" required placeholder="07 00 00 00 00" autocomplete="tel">
<label for="lv">Ville</label><select id="lv" name="lv"></select>
<label for="lc">Commune</label><input id="lc" name="lc" required minlength="2" maxlength="60" placeholder="Ex : Cocody">
<label for="lq">Quartier</label><input id="lq" name="lq" required minlength="2" maxlength="60" placeholder="Ex : Riviera Palmeraie">
<label for="la">Adresse précise</label><textarea id="la" name="la" rows="2" required minlength="5" maxlength="200" placeholder="Rue, numéro, bâtiment, étage…"></textarea>
<label for="lr">Point de repère</label><input id="lr" name="lr" required minlength="3" maxlength="150" placeholder="Ex : à côté de la pharmacie, derrière l’école">
<div class="row"><button type="button" id="lgps">📍 Ajouter ma position GPS (facultatif)</button></div>
<p class="meta" id="lgm"></p>
<p class="meta">Ces informations sont transmises uniquement au vendeur de cette commande, pour la livraison.</p>
<p id="lerr" class="err" role="alert"></p>
<div class="row"><button class="pri" id="lpay">Payer</button><button type="button" data-x>Annuler</button></div>
</form>
</dialog>`);
}
function patchTexts(){
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const ul=$("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Vos coordonnées de livraison</b>, lorsque vous passez commande : nom du destinataire, téléphone, ville, commune, quartier, adresse précise, point de repère et, si vous le souhaitez, votre position GPS. Elles sont transmises uniquement au vendeur de la commande, pour qu’il puisse vous livrer, tant que la commande est en cours.</li>");
const h3=hBy("#dpriv","3.");
if(h3&&h3.nextElementSibling)h3.nextElementSibling.insertAdjacentHTML("beforeend"," Vos coordonnées de livraison ne sont visibles que par le vendeur de votre commande.");
const hw=hBy("#dhelp","Porte-monnaie");
if(hw)hw.insertAdjacentHTML("beforebegin","<h3>Livraison</h3><details><summary>Quelles informations dois-je donner pour être livré ?</summary><p>Au moment de l’achat, indiquez le nom du destinataire, son téléphone, la ville, la commune, le quartier, l’adresse précise et un point de repère. La position GPS est facultative mais aide le livreur à vous trouver.</p></details><details><summary>Qui voit mes coordonnées de livraison ?</summary><p>Uniquement le vendeur de votre commande, pour vous livrer, tant que la commande est en cours.</p></details><details><summary>Comment suivre ma commande ?</summary><p>Ouvrez « Mes achats » : le suivi indique si la commande est reçue, en préparation, expédiée, en livraison ou livrée. Vous recevez une notification à chaque changement.</p></details><details><summary>Vendeur : comment mettre à jour la livraison ?</summary><p>Ouvrez « Mes ventes », consultez les coordonnées du client, puis choisissez le nouveau statut et appuyez sur « Mettre à jour le statut ». Le statut ne peut qu’avancer.</p></details>");
const hp=hBy("#dt","Paiements et protection acheteur");
if(hp&&hp.nextElementSibling)hp.nextElementSibling.insertAdjacentHTML("beforeend","<li>À la commande, l’acheteur indique ses coordonnées de livraison. Elles sont transmises au vendeur uniquement pour livrer la commande, et le vendeur s’engage à ne les utiliser qu’à cette fin. Le vendeur met à jour le statut de livraison et l’acheteur est prévenu à chaque changement.</li>");
}catch(e){}
}
injectLiv();
patchTexts();
fill($("#fv"),CITIES,"Toutes villes");fill($("#fe"),ETATS,"Tous états");
fill($("#sc"),CATS);fill($("#sv"),CITIES);fill($("#se"),ETATS);fill($("#pv"),CITIES,"Ville (facultatif)");
fill($("#bqv"),CITIES);fill($("#bqd"),DELAIS);fill($("#lv"),CITIES);
document.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>b.closest("dialog").close());
document.querySelectorAll(".tosl").forEach(a=>a.onclick=e=>{e.preventDefault();$("#dt").showModal()});
document.querySelectorAll(".hlpl").forEach(a=>a.onclick=e=>{e.preventDefault();$("#dhelp").showModal()});
document.querySelectorAll(".abtl").forEach(a=>a.onclick=e=>{e.preventDefault();$("#dabout").showModal()});
document.querySelectorAll(".prvl").forEach(a=>a.onclick=e=>{e.preventDefault();$("#dpriv").showModal()});
$("#bhelp").onclick=()=>$("#dhelp").showModal();
$("#babt").onclick=()=>$("#dabout").showModal();
$("#bprv").onclick=()=>$("#dpriv").showModal();
$("#bsup").onclick=()=>openSupport();
document.querySelectorAll("[data-sup]").forEach(b=>b.onclick=()=>{b.closest("dialog").close();openSupport()});
$("#dm").onclose=()=>clearInterval(tm);
$("#dn").onclose=()=>{recov=false};
$("#burger").onclick=()=>document.body.classList.toggle("menu");
$("#ov").onclick=()=>document.body.classList.remove("menu");
$("#side").addEventListener("click",e=>{if(e.target.closest("button"))document.body.classList.remove("menu")});
function numUI(){
const r=NUMREQ[$("#sc").value];
$("#nsw").hidden=!r;
$("#nsn").required=!!r;
if(r){$("#nsl").textContent=r[0];$("#nsh").textContent=r[1]+" Il n’est jamais affiché publiquement."}
}
$("#sc").onchange=numUI;
async function dhash(file){
try{
const bmp=await createImageBitmap(file);
const c=document.createElement("canvas");c.width=9;c.height=8;
const x=c.getContext("2d");x.drawImage(bmp,0,0,9,8);
const d=x.getImageData(0,0,9,8).data;
const g=i=>d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114;
let bits="";
for(let r=0;r<8;r++)for(let k=0;k<8;k++)bits+=g((r*9+k)*4)>g((r*9+k+1)*4)?"1":"0";
let hex="";
for(let i=0;i<64;i+=4)hex+=parseInt(bits.slice(i,i+4),2).toString(16);
return "x"+hex;
}catch(e){return null}
}
async function loadParams(){
const{data}=await sb.from("parametres").select("cle,valeur").in("cle",["protection_pct","protection_fixe","plafond_standard","plafond_boutique","kyc_obligatoire","kyc_creation_boutique"]);
for(const x of data||[]){
const v=Number(x.valeur);
if(x.cle==="protection_pct")protPct=v;
if(x.cle==="protection_fixe")protFix=v;
if(x.cle==="plafond_standard")plStd=v;
if(x.cle==="plafond_boutique")plBq=v;
if(x.cle==="kyc_obligatoire")kycReq=v!==0;
if(x.cle==="kyc_creation_boutique")kycCreate=v!==0;
}
document.querySelectorAll(".pp").forEach(x=>x.textContent=String(protPct).replace(".",","));
document.querySelectorAll(".pfx").forEach(x=>x.textContent=fcfa(protFix));
document.querySelectorAll(".pl1").forEach(x=>x.textContent=fcfa(plStd));
document.querySelectorAll(".pl2").forEach(x=>x.textContent=fcfa(plBq));
updNet();
if(items.length)$("#grid").innerHTML=items.map(card).join("");
}
function updNet(){
const p=parseInt($("#prix").value,10);
$("#cm").textContent=p>0?"Aucune commission : vous recevez "+fcfa(p)+". L’acheteur paiera "+fcfa(p+protFee(p))+" (dont "+fcfa(protFee(p))+" de protection acheteur).":"Aucune commission pour le vendeur : vous recevez la totalité du prix. Les frais de protection sont payés par l’acheteur.";
}
async function loadPlaf(){
if(!user){plaf=null;return}
const{data}=await sb.rpc("etat_plafond");
plaf=data||null;
}
function updPl(){
const el=$("#plh");
if(!plaf){el.textContent="";return}
const p=parseInt($("#prix").value,10);
let t="Limite de votre porte-monnaie vendeur : il peut encore recevoir "+fcfa(plaf.restant)+" (limite de "+fcfa(plaf.limite)+", solde et ventes en attente compris).";
if(plaf.tier==="standard")t+=myShop?" Pour passer à "+fcfa(plaf.boutique_limite)+", faites vérifier votre identité.":" Pour passer à "+fcfa(plaf.boutique_limite)+", créez une boutique Finder et faites vérifier votre identité.";
if(p>plaf.restant)t+=" Ce prix dépasse la place disponible : transférez de l’argent ou relevez votre limite.";
el.textContent=t;
}
$("#prix").oninput=()=>{updNet();updPl()};
function showProt(price){
const fr=protFee(price);
$("#dpic").innerHTML=`<div class="wrow"><span>Prix de l’article</span><b>${fcfa(price)}</b></div><div class="wrow"><span>Protection acheteur<br><small class="meta">${String(protPct).replace(".",",")} % du prix + ${fcfa(protFix)}</small></span><b>${fcfa(fr)}</b></div><div class="wrow"><span>Total à payer</span><b>${fcfa(price+fr)}</b></div>`;
$("#dpi").showModal();
}
const askNotif=()=>{if("Notification" in window&&Notification.permission==="default")Notification.requestPermission()};
const sub=i=>[i.marque,i.etat].filter(Boolean).join(" · ");
const rt=u=>R[u]?" · ★ "+(R[u].s/R[u].n).toFixed(1).replace(".",",")+" ("+R[u].n+")":"";
const badge=u=>shops[u]&&shops[u].certifiee?VB:"";
const stag=i=>i.statut==="en_revue"?`<span class="tag">En vérification</span>`:i.statut==="bloque"?`<span class="tag">Refusée</span>`:"";
const card=i=>`<article class="card${i.vendu?" sold":""}" data-id="${i.id}">${i.photos&&i.photos[0]?`<img loading="lazy" src="${esc(i.photos[0])}" alt="">`:`<div class="ph"></div>`}${i.vendu?`<span class="tag">Vendu</span>`:stag(i)}<button class="heart${favs.has(i.id)?" on":""}" data-h="${i.id}" aria-label="Ajouter aux favoris">♥</button><div><b>${fcfa(i.price)}</b><span class="pt">${fcfa(i.price+protFee(i.price))} incl. ${SH}</span><h3>${esc(i.title)}</h3><small>${esc(sub(i)||i.city)}${rt(i.user_id)}${badge(i.user_id)}</small></div></article>`;
function renderSide(){
const L=["Toutes les annonces",...CATS];
$("#cats").innerHTML=L.map((c,i)=>`<button class="cat${mode==="all"&&(i?cat===c:!cat)?" on":""}" data-c="${i?esc(c):""}">${esc(c)}</button>`).join("");
}
$("#cats").onclick=e=>{const b=e.target.closest(".cat");if(!b)return;cat=b.dataset.c;mode="all";labels();load();window.scrollTo(0,0)};
function labels(){
$("#back").hidden=mode!=="seller";
$("#sect").textContent=mode==="mine"?"Mes annonces":mode==="fav"?"Mes favoris":mode==="seller"?"Articles":(cat||"Toutes les annonces");
$("#mine").classList.toggle("on",mode==="mine");
$("#fav").classList.toggle("on",mode==="fav");
renderSide();
}
function idLabel(){
const s=myId&&myId.statut;
return s==="verifie"?"Identité vérifiée ✓":s==="en_attente"?"Identité : en cours de vérification":s==="refuse"?"Identité refusée : refaire":"Vérifier mon identité (badge bleu)";
}
function updBadges(){
const c=acct==="client";
$("#ord").textContent=(c?"Mes achats":"Mes ventes")+(ordN?" ("+ordN+")":"");
$("#bell").hidden=!user;
$("#bn").hidden=!nUnread;
$("#bn").textContent=nUnread>99?"99+":nUnread;
$("#bnt").textContent="Notifications"+(nUnread?" ("+nUnread+")":"");
}
function applyUI(){
const c=acct==="client";
document.body.dataset.acct=user?acct:"";
$("#acc").hidden=!user;
$("#mine").hidden=c;
$("#bq").hidden=c;
$("#bcar").hidden=c;
$("#bq").textContent=myShop?"Ma boutique":"Créer ma boutique";
$("#fav").hidden=!c;
$("#bid").hidden=c;
$("#bid").textContent=idLabel();
$("#bmod").hidden=!(me&&me.admin);
$("#sell").hidden=!!(user&&c);
$("#sw").hidden=!user;
$("#sw").textContent=c?"Compte client ⇄ Vendeur":"Compte vendeur ⇄ Client";
$("#wal").textContent="Porte-monnaie : "+fcfa(wbal);
updBadges();
}
async function refreshOrdCount(){
if(!user){ordN=0;return}
const c=acct==="client";
const{count}=await sb.from("commandes").select("id",{count:"exact",head:true}).eq(c?"buyer_id":"seller_id",user.id).neq("statut","annule");
ordN=count||0;
}
async function loadWallet(){
if(!user){wbal=0;ordN=0;return}
const{data}=await sb.from("portefeuilles").select("solde").eq("role",acct).maybeSingle();
wbal=data?data.solde:0;
await refreshOrdCount();
}
async function loadMyShop(){
if(!user){myShop=null;return}
const{data}=await sb.from("boutiques").select("*").eq("user_id",user.id).maybeSingle();
myShop=data||null;
}
async function loadIdent(){
if(!user){myId=null;return}
const{data}=await sb.from("identites").select("statut,motif_refus").eq("user_id",user.id).maybeSingle();
myId=data||null;
}
function showToast(text,act){
const t=$("#toast");
toastAct=act;t.textContent=text;t.hidden=false;
clearTimeout(t._h);t._h=setTimeout(()=>t.hidden=true,6000);
if("Notification" in window&&Notification.permission==="granted"&&document.hidden)new Notification("Finder",{body:text});
}
function notify(n){showToast(n===1?"Vous avez 1 nouveau message":"Vous avez "+n+" messages non lus","msg")}
async function refreshBadge(){
if(!user)return;
const{count}=await sb.from("messages").select("id",{count:"exact",head:true}).eq("receiver_id",user.id).eq("lu",false);
const n=count||0;
$("#msgs").textContent=n?"Messages ("+n+")":"Messages";
document.title=(n?"("+n+") ":"")+BASE;
if(n>unread||(first&&n>0))notify(n);
unread=n;first=false;
}
async function refreshNotifs(){
if(!user)return;
const{data,count}=await sb.from("notifications").select("id,titre,message",{count:"exact"}).eq("lu",false).order("created_at",{ascending:false}).limit(20);
const list=data||[];
nUnread=count||0;
const fresh=list.filter(x=>!seenN.has(x.id));
list.forEach(x=>seenN.add(x.id));
if(fresh.length&&!$("#dnt").open){
if(nFirst)showToast(nUnread===1?"Vous avez 1 notification non lue":"Vous avez "+nUnread+" notifications non lues","notif");
else showToast(fresh.length===1?fresh[0].titre:fresh.length+" nouvelles notifications","notif");
}
nFirst=false;
updBadges();
}
async function checkUnread(){
if($("#dm").open&&chat)await loadChat();
await refreshBadge();
await refreshNotifs();
await refreshOrdCount();
updBadges();
}
$("#toast").onclick=()=>{$("#toast").hidden=true;toastAct==="notif"?openNotifs():openInbox()};
async function openNotifs(){
if(!user)return;
askNotif();
$("#ntl").innerHTML="<p class='meta'>Chargement…</p>";
if(!$("#dnt").open)$("#dnt").showModal();
const{data}=await sb.from("notifications").select("*").order("created_at",{ascending:false}).limit(60);
const L=data||[];
$("#ntl").innerHTML=L.length?L.map(n=>`<div class="nt${n.lu?"":" new"}"><b>${esc(n.titre)}</b>${esc(n.message)}<br><span class="meta">${new Date(n.created_at).toLocaleString("fr-FR")}${n.role?" · Compte "+(n.role==="vendeur"?"vendeur":"client"):""}</span></div>`).join(""):"<p class='meta'>Aucune notification pour l’instant.</p>";
const ids=L.filter(n=>!n.lu).map(n=>n.id);
if(ids.length){
await sb.from("notifications").update({lu:true}).in("id",ids);
L.forEach(n=>seenN.add(n.id));
await refreshNotifs();
}
}
$("#bell").onclick=openNotifs;
$("#bnt").onclick=openNotifs;
async function loadFavs(){
const{data}=await sb.from("favoris").select("listing_id");
favs=new Set((data||[]).map(x=>x.listing_id));
}
async function loadMe(){
const{data}=await sb.from("profils").select("*").eq("user_id",user.id).maybeSingle();
me=data||null;
}
async function refreshMe(){const k=me;await loadMe();if(!me)me=k}
function renderShop(){
const box=$("#shophd");
if(mode!=="seller"||!sellerId){box.hidden=true;return}
const sh=shops[sellerId],p=pro[sellerId];
const name=sh?sh.nom:(p?p.nom:"Vendeur");
const ville=sh?sh.ville:(p&&p.ville?p.ville:"");
const rate=R[sellerId]?"★ "+(R[sellerId].s/R[sellerId].n).toFixed(1).replace(".",",")+" ("+R[sellerId].n+" avis)":"Aucun avis pour l’instant";
const logo=sh&&sh.logo_url?`<img class="logo2" src="${esc(sh.logo_url)}" alt="">`:`<div class="logo2 ph2">${esc(name.slice(0,1).toUpperCase())}</div>`;
const buyer=!user||acct==="client";
box.hidden=false;
box.innerHTML=`<div class="shp">${logo}<div><h2>${esc(name)}${sh&&sh.certifiee?VB:""}</h2><p class="meta">${ville?esc(ville):""}${sh?" · Livraison : "+esc(sh.delai):""}</p><p class="meta">${rate}${p&&p.identite_verifiee?` · <span class="idv" style="margin:0">Identité vérifiée</span>`:""}</p>${vs(p)?`<p class="meta">${esc(vs(p))}</p>`:""}</div></div>${sh&&sh.certifiee?`<p class="meta">Boutique certifiée par Finder</p>`:""}<div id="rv2"></div>${buyer&&!(user&&user.id===sellerId)?`<button class="revbtn" data-r="${sellerId}">Laisser un avis sur la boutique</button>`:""}`;
loadReviews(sellerId,"#rv2");
}
$("#shophd").onclick=e=>{
const rb=e.target.closest(".revbtn");
if(!rb)return;
if(!user){$("#da").showModal();return}
if(acct!=="client"){alert("Passez en compte client pour laisser un avis.");return}
openReview(rb.dataset.r);
};
async function load(){
const m=$("#msg");
if(mode!=="seller")$("#shophd").hidden=true;
if(mode==="fav"&&!favs.size){items=[];$("#grid").innerHTML="";m.textContent="Aucun favori pour l’instant. Appuyez sur le cœur d’une annonce.";return}
m.textContent="Chargement…";
let r=sb.from("listings").select("*").order("created_at",{ascending:false}).limit(60);
const q=$("#q").value.trim().replace(/[%,()]/g," ");
if(q)r=r.or(`title.ilike.%${q}%,marque.ilike.%${q}%`);
if(mode!=="mine")r=r.eq("statut","actif");
if(cat&&mode==="all")r=r.eq("category",cat);
if($("#fv").value)r=r.eq("city",$("#fv").value);
if($("#fe").value)r=r.eq("etat",$("#fe").value);
if(mode==="mine"&&user)r=r.eq("user_id",user.id);
if(mode==="seller")r=r.eq("user_id",sellerId);
if(mode==="fav")r=r.in("id",[...favs]);
const{data,error}=await r;
if(error){m.textContent="Impossible de charger les annonces. Vérifiez votre connexion.";return}
items=data;
const ids=[...new Set([...data.map(i=>i.user_id),...(mode==="seller"&&sellerId?[sellerId]:[])])];
R={};
if(ids.length){
const{data:ps}=await sb.from("profils").select("*").in("user_id",ids);
pro=Object.fromEntries((ps||[]).map(p=>[p.user_id,p]));
const{data:bs}=await sb.from("boutiques").select("*").in("user_id",ids);
shops=Object.fromEntries((bs||[]).map(b=>[b.user_id,b]));
const{data:av}=await sb.from("avis").select("seller_id,note").in("seller_id",ids);
for(const a of av||[]){const x=R[a.seller_id]||(R[a.seller_id]={s:0,n:0});x.s+=a.note;x.n++}
}
m.textContent=data.length?"":"Aucune annonce pour l’instant.";
$("#grid").innerHTML=data.map(card).join("");
renderShop();
}
async function loadReviews(u,sel){
const box=$(sel||"#rv");
if(!box)return;
const{data}=await sb.from("avis").select("*").eq("seller_id",u).order("created_at",{ascending:false}).limit(50);
if(!data||!data.length){box.innerHTML="<p class='meta'>Aucun avis pour l’instant.</p>";return}
const ids=[...new Set(data.map(a=>a.reviewer_id))];
const{data:ps}=await sb.from("profils").select("user_id,nom").in("user_id",ids);
const N=Object.fromEntries((ps||[]).map(p=>[p.user_id,p.nom]));
const avg=data.reduce((s,a)=>s+a.note,0)/data.length;
box.innerHTML=`<p><b>★ ${avg.toFixed(1).replace(".",",")}</b> · ${data.length} avis</p>`+data.map(a=>`<p class="rev"><span class="stars">${"★".repeat(a.note)}${"☆".repeat(5-a.note)}</span> <b>${esc(N[a.reviewer_id]||"Acheteur")}</b>${a.commentaire?"<br>"+esc(a.commentaire):""}</p>`).join("");
}
function show(i){
const own=user&&user.id===i.user_id,p=pro[i.user_id],sh=shops[i.user_id];
const buyer=!user||acct==="client";
const nm=sh?sh.nom:(p?p.nom:"Vendeur Finder");
const vl=sh?sh.ville:(p&&p.ville?p.ville:"");
const fr=protFee(i.price);
let contact="";
if(i.vendu)contact=`<p class="soldnote">Cet article est vendu</p>`;
else if(i.statut==="en_revue")contact=`<p class="soldnote">Annonce en cours de vérification par Finder</p>`;
else if(i.statut==="bloque")contact=`<p class="soldnote">Annonce refusée par Finder</p>`;
else if(own)contact="";
else if(!buyer)contact=`<p class="soldnote">Passez en compte client pour acheter ou contacter ce vendeur.</p>`;
else contact=`<button class="buybtn pri sbtn" data-b="${i.id}">Acheter · ${fcfa(i.price+fr)}</button><button class="chatbtn seebtn" data-u="${i.user_id}" data-l="${i.id}" data-t="${esc(i.title)}">Écrire au vendeur</button>`;
const ptxt=`${fcfa(i.price+fr)} incl. ${SH} Protection acheteur${own?" (sous-total pour l’acheteur)":""} <button type="button" class="ibtn" data-info="${i.id}" aria-label="Détail des frais">ⓘ</button>`;
$("#dc").innerHTML=(i.photos||[]).map(u=>`<img src="${esc(u)}" alt="">`).join("")+`<h2>${esc(i.title)}</h2><p class="pr">${fcfa(i.price)}</p><p class="pt">${ptxt}</p><p class="meta">${esc([i.category,i.marque,i.etat,i.city].filter(Boolean).join(" · "))}</p><p>${esc(i.description)}</p><p class="seller"><b>${esc(nm)}</b>${sh&&sh.certifiee?VB:""}${p&&p.identite_verifiee?`<span class="idv">Identité vérifiée</span>`:""}${vl?" · "+esc(vl):""}</p>${vs(p)?`<p class="meta">${esc(vs(p))}</p>`:""}${sh?`<p class="meta">Livraison : ${esc(sh.delai)}</p>`:(p&&p.bio?`<p class="meta">${esc(p.bio)}</p>`:"")}<div id="rv"></div><button class="seebtn" data-u="${i.user_id}">${sh?"Voir la boutique":"Voir ses annonces"}</button>`+(!own&&buyer?`<button class="revbtn" data-r="${i.user_id}">Laisser un avis</button>`:"")+contact+`<p class="safe">La protection acheteur garde votre argent jusqu’à la réception de l’article. Vous pouvez signaler un problème avant de confirmer.</p>`+(own?(i.statut==="bloque"?"":`<button class="del" data-id="${i.id}">Supprimer l’annonce</button>`):`<button class="repbtn" data-l="${i.id}">Signaler cette annonce</button>`);
$("#dd").showModal();
loadReviews(i.user_id);
}
async function openReview(u){
revSeller=u;
const f=$("#rf");
f.note.value="5";f.com.value="";$("#rm").textContent="";
$("#rt").textContent="Avis sur "+(shops[u]?"la boutique "+shops[u].nom:(pro[u]?pro[u].nom:"ce vendeur"));
const{data}=await sb.from("avis").select("*").eq("seller_id",u).eq("reviewer_id",user.id).maybeSingle();
if(data){f.note.value=String(data.note);f.com.value=data.commentaire||""}
$("#dd").close();
$("#dr").showModal();
}
$("#rf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#rm");
const{error}=await sb.from("avis").upsert({seller_id:revSeller,reviewer_id:user.id,note:+f.note.value,commentaire:f.com.value.trim()||null},{onConflict:"seller_id,reviewer_id"});
if(error){m.textContent="Impossible d’envoyer l’avis. Vous pouvez noter un vendeur après lui avoir écrit un message.";return}
m.textContent="";$("#dr").close();load();
};
$("#rgf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#rgm");
const{error}=await sb.from("signalements").insert({listing_id:repListing,motif:f.motif.value,details:f.det.value.trim()||null});
if(error){m.textContent=error.code==="23505"?"Vous avez déjà signalé cette annonce.":"Envoi impossible. Réessayez.";return}
f.reset();m.textContent="";$("#dg").close();
alert("Merci, votre signalement a été envoyé.");
};
$("#grid").onclick=async e=>{
const h=e.target.closest(".heart");
if(h){
if(!user){$("#da").showModal();return}
const id=h.dataset.h;
if(favs.has(id)){favs.delete(id);h.classList.remove("on");await sb.from("favoris").delete().eq("listing_id",id);if(mode==="fav")load()}
else{favs.add(id);h.classList.add("on");await sb.from("favoris").insert({listing_id:id})}
return;
}
const c=e.target.closest(".card");
if(c)show(items.find(i=>i.id===c.dataset.id));
};
async function openDelivery(i){
livItem=i;livGps=null;
const f=$("#lf");
f.reset();
$("#lerr").textContent="";$("#lgm").textContent="";
$("#lgps").textContent="📍 Ajouter ma position GPS (facultatif)";
const fr=protFee(i.price);
$("#livres").innerHTML=`<b>${esc(i.title)}</b><br>Prix ${fcfa(i.price)} + protection acheteur ${fcfa(fr)} = <b>${fcfa(i.price+fr)}</b>`;
$("#lpay").textContent="Payer "+fcfa(i.price+fr);
$("#dd").close();
$("#dliv").showModal();
const{data}=await sb.from("livraisons").select("*").eq("buyer_id",user.id).order("cree_le",{ascending:false}).limit(1);
const p=data&&data[0];
if(p&&!f.ln.value){f.ln.value=p.nom;f.lt.value=p.telephone;f.lv.value=p.ville;f.lc.value=p.commune;f.lq.value=p.quartier;f.la.value=p.adresse;f.lr.value=p.repere}
}
$("#lgps").onclick=()=>{
const g=$("#lgm");
if(livGps){livGps=null;g.textContent="Position GPS retirée.";$("#lgps").textContent="📍 Ajouter ma position GPS (facultatif)";return}
if(!navigator.geolocation){g.textContent="La localisation n’est pas disponible sur cet appareil. Vous pouvez continuer sans.";return}
g.textContent="Recherche de votre position…";
navigator.geolocation.getCurrentPosition(p=>{
livGps={lat:+p.coords.latitude.toFixed(6),lng:+p.coords.longitude.toFixed(6)};
g.textContent="Position enregistrée ✓";
$("#lgps").textContent="Retirer ma position GPS";
},()=>{g.textContent="Impossible d’obtenir votre position. Vous pouvez continuer sans."},{enableHighAccuracy:true,timeout:15000});
};
$("#lf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#lerr");
if(!livItem)return;
const tel=f.lt.value.replace(/[^0-9+]/g,"");
if(tel.replace(/\D/g,"").length<8){m.textContent="Entrez un numéro de téléphone valide.";return}
m.textContent="Paiement en cours…";
$("#lpay").disabled=true;
const{error}=await sb.rpc("acheter",{p_listing:livItem.id,p_nom:f.ln.value.trim(),p_tel:tel,p_ville:f.lv.value,p_commune:f.lc.value.trim(),p_quartier:f.lq.value.trim(),p_adresse:f.la.value.trim(),p_repere:f.lr.value.trim(),p_lat:livGps?livGps.lat:null,p_lng:livGps?livGps.lng:null});
$("#lpay").disabled=false;
if(error){m.textContent=err(error);return}
$("#dliv").close();livItem=null;livGps=null;
await loadWallet();applyUI();load();refreshNotifs();
alert("Achat effectué. Vos coordonnées de livraison ont été transmises au vendeur. Suivez l’état de votre commande dans « Mes achats ». Quand vous avez l’article, confirmez la réception.");
};
$("#dc").onclick=async e=>{
const ib=e.target.closest("[data-info]");
if(ib){
const it=items.find(x=>x.id===ib.dataset.info);
if(it)showProt(it.price);
return;
}
const bb=e.target.closest(".buybtn");
if(bb){
if(!user){$("#dd").close();$("#da").showModal();return}
const i=items.find(x=>x.id===bb.dataset.b);
if(!i)return;
openDelivery(i);
return;
}
const gb=e.target.closest(".repbtn");
if(gb){
if(!user){$("#dd").close();$("#da").showModal();return}
repListing=gb.dataset.l;$("#rgm").textContent="";$("#rgf").reset();
$("#dd").close();$("#dg").showModal();return;
}
const rb=e.target.closest(".revbtn");
if(rb){
if(!user){$("#dd").close();$("#da").showModal();return}
openReview(rb.dataset.r);return;
}
const s=e.target.closest(".seebtn:not(.chatbtn)");
if(s){sellerId=s.dataset.u;mode="seller";$("#dd").close();labels();load();window.scrollTo(0,0);return}
const c=e.target.closest(".chatbtn");
if(c){
if(!user){$("#dd").close();$("#da").showModal();return}
openChat(c.dataset.l,c.dataset.u,c.dataset.t);return;
}
const b=e.target.closest(".del");
if(!b||!confirm("Supprimer cette annonce ?"))return;
await sb.from("listings").delete().eq("id",b.dataset.id);
$("#dd").close();load();
};
async function openChat(lid,other,title){
askNotif();
chat={lid,other};lastN="";
$("#mt").textContent=title;
$("#mb").innerHTML="";
$("#dd").close();$("#di").close();
$("#dm").showModal();
await loadChat();
clearInterval(tm);tm=setInterval(loadChat,5000);
}
async function loadChat(){
if(!chat||!user)return;
const{data}=await sb.from("messages").select("*").eq("listing_id",chat.lid).or(`sender_id.eq.${chat.other},receiver_id.eq.${chat.other}`).order("created_at");
if(!data)return;
const key=data.length+"-"+data.filter(m=>m.lu).length;
if(key!==lastN){
lastN=key;
const b=$("#mb");
b.innerHTML=data.map(m=>`<div class="b ${m.sender_id===user.id?"me":""}">${esc(m.body)}${m.sender_id===user.id?`<span class="st">${m.lu?"✓✓ Lu":"✓ Envoyé"}</span>`:""}</div>`).join("");
b.scrollTop=b.scrollHeight;
}
if(data.some(m=>m.receiver_id===user.id&&!m.lu)){
await sb.from("messages").update({lu:true}).eq("listing_id",chat.lid).eq("receiver_id",user.id).eq("sender_id",chat.other).eq("lu",false);
refreshBadge();
}
}
$("#mf").onsubmit=async e=>{
e.preventDefault();
const i=$("#mi"),t=i.value.trim();
if(!t)return;
i.value="";
const{error}=await sb.from("messages").insert({listing_id:chat.lid,receiver_id:chat.other,body:t});
if(error){i.value=t;return}
loadChat();
};
async function openInbox(){
askNotif();
$("#il").innerHTML="<p class='meta'>Chargement…</p>";
$("#di").showModal();
const{data}=await sb.from("messages").select("*").order("created_at",{ascending:false}).limit(200);
const seen=new Map();
for(const m of data||[]){
const o=m.sender_id===user.id?m.receiver_id:m.sender_id,k=m.listing_id+"|"+o;
if(!seen.has(k))seen.set(k,{lid:m.listing_id,o,last:m,u:0});
if(m.receiver_id===user.id&&!m.lu)seen.get(k).u++;
}
const list=[...seen.values()];
if(!list.length){$("#il").innerHTML="<p class='meta'>Aucun message pour l’instant.</p>";return}
const lids=[...new Set(list.map(x=>x.lid))],uids=[...new Set(list.map(x=>x.o))];
const[{data:ls},{data:ps}]=await Promise.all([sb.from("listings").select("id,title").in("id",lids),sb.from("profils").select("user_id,nom").in("user_id",uids)]);
const T=Object.fromEntries((ls||[]).map(x=>[x.id,x.title])),N=Object.fromEntries((ps||[]).map(x=>[x.user_id,x.nom]));
$("#il").innerHTML=list.map(x=>`<button class="conv" data-l="${x.lid}" data-o="${x.o}" data-t="${esc(T[x.lid]||"Annonce")}">${x.u?`<span class="dot">${x.u}</span> `:""}<b>${esc(N[x.o]||"Utilisateur")}</b> · ${esc(T[x.lid]||"Annonce")}<br><span class="meta">${esc(x.last.body.slice(0,60))}</span></button>`).join("");
}
$("#il").onclick=e=>{const c=e.target.closest(".conv");if(c)openChat(c.dataset.l,c.dataset.o,c.dataset.t)};
$("#msgs").onclick=openInbox;
async function renderWallet(){
const c=acct==="client";
$("#wt").textContent="Mon porte-monnaie";
$("#wb").textContent=fcfa(wbal);
$("#wbtn").textContent=c?"Recharger mon porte-monnaie (test)":"Transférer vers Mobile Money (test)";
$("#wi").placeholder=c?"Montant à recharger en FCFA":"Montant à transférer en FCFA";
const[rw,rc]=await Promise.all([sb.from("portefeuilles").select("*").eq("role",acct).maybeSingle(),sb.from("commandes").select("montant,commission,frais_acheteur").eq(c?"buyer_id":"seller_id",user.id).in("statut",["paye","litige"])]);
const w=rw.data,cm=rc.data||[];
const pend=cm.reduce((s,o)=>s+(c?o.montant+(o.frais_acheteur||0):o.montant-o.commission),0);
$("#wp").textContent=fcfa(pend);
$("#wini").textContent=fcfa(0);
$("#wd").textContent=w&&w.cree_le?new Date(w.cree_le).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):"—";
if(c){$("#wpl").hidden=true}
else{
await loadPlaf();
if(plaf){
$("#wpl").hidden=false;
$("#wpd").textContent="solde + ventes en attente";
$("#wpv").textContent=fcfa(plaf.utilise)+" / "+fcfa(plaf.limite);
$("#wpb").hidden=plaf.tier!=="standard";
$("#wpb").textContent=myShop?"Augmenter ma limite : faire vérifier mon identité":"Augmenter ma limite : créer une boutique Finder";
}else $("#wpl").hidden=true;
}
}
$("#wpb").onclick=()=>{$("#dw").close();if(myShop)openKyc();else openShopDlg()};
async function openWallet(){
await loadWallet();applyUI();
$("#wm").textContent="";
if(!$("#dw").open)$("#dw").showModal();
await renderWallet();
}
$("#wal").onclick=openWallet;
async function openHistory(){
$("#wl").innerHTML="<p class='meta'>Chargement…</p>";
if(!$("#dwh").open)$("#dwh").showModal();
const{data}=await sb.from("transactions").select("*").eq("role",acct).order("created_at",{ascending:false}).limit(100);
$("#wl").innerHTML=(data&&data.length)?data.map(t=>`<p class="tx"><b>${t.montant>0?"+":""}${fcfa(t.montant)}</b> · ${esc(TT[t.type]||t.type)}<br><span class="meta">${new Date(t.created_at).toLocaleString("fr-FR")}</span></p>`).join(""):"<p class='meta'>Aucune opération pour l’instant.</p>";
}
$("#wh").onclick=openHistory;
$("#wf").onsubmit=async e=>{
e.preventDefault();
const m=$("#wm"),n=parseInt($("#wi").value,10);
if(!n||n<=0){m.textContent="Entrez un montant valide.";return}
m.textContent="Un instant…";
const{error}=await sb.rpc(acct==="client"?"recharger_test":"retirer_test",{p_montant:n});
if(error){m.textContent=err(error);return}
$("#wi").value="";
await loadWallet();applyUI();m.textContent="";
await renderWallet();
refreshNotifs();
};
function ordMsg(o,c){
const net=o.montant-o.commission;
if(c){
if(o.statut==="paye")return "Dès que vous validerez la réception de l’article, le vendeur sera payé.";
if(o.statut==="livre")return "Terminé : vous avez confirmé la réception.";
if(o.statut==="annule")return "Annulé : vous avez été remboursé, protection acheteur comprise.";
return "Litige en cours : votre argent reste bloqué, Finder examine la situation.";
}
if(o.statut==="paye")return "<b>Vendu.</b> Dès que l’acheteur validera la réception de l’article, vous recevrez "+fcfa(net)+" dans votre porte-monnaie Finder.";
if(o.statut==="livre")return "Terminé : vous avez reçu "+fcfa(net)+" dans votre porte-monnaie Finder.";
if(o.statut==="annule")return "Annulé : l’acheteur a été remboursé.";
return "Litige en cours : Finder examine la situation. Vous serez payé si le litige est résolu en votre faveur.";
}
function livBlock(l){
if(!l)return `<p class="meta">Coordonnées de livraison non disponibles pour cette commande.</p>`;
const gps=l.latitude!=null&&l.longitude!=null?`<br>📍 <a href="https://www.google.com/maps?q=${l.latitude},${l.longitude}" target="_blank" rel="noopener">Voir la position GPS sur la carte</a>`:"";
return `<div class="ost"><b>Livrer à : ${esc(l.nom)}</b><br>📞 <a href="tel:${esc(l.telephone)}">${esc(l.telephone)}</a><br>${esc(l.ville)}, ${esc(l.commune)}, ${esc(l.quartier)}<br>${esc(l.adresse)}<br><span class="meta">Repère : ${esc(l.repere)}</span>${gps}</div>`;
}
async function openOrders(){
const c=acct==="client";
$("#ot").textContent=c?"Mes achats":"Mes ventes";
$("#ol").innerHTML="<p class='meta'>Chargement…</p>";
$("#ost").hidden=true;
if(!$("#do").open)$("#do").showModal();
const[r1,r2]=await Promise.all([sb.from("commandes").select("*").eq(c?"buyer_id":"seller_id",user.id).order("created_at",{ascending:false}).limit(50),sb.from("commandes").select("montant,commission,statut").eq(c?"buyer_id":"seller_id",user.id).limit(1000)]);
const data=r1.data,all=r2.data||[];
const valid=all.filter(o=>o.statut!=="annule"),done=all.filter(o=>o.statut==="livre"),pend=all.filter(o=>o.statut==="paye"||o.statut==="litige");
ordN=valid.length;updBadges();
if(all.length){
const lbl=c?"achat":"vente",sum=done.reduce((s,o)=>s+(c?o.montant:o.montant-o.commission),0);
$("#ost").innerHTML=`<b>${valid.length} ${lbl}${valid.length>1?"s":""}</b> · ${done.length} terminée${done.length>1?"s":""} · ${pend.length} en attente<br><span class="meta">${c?"Total payé pour les achats terminés":"Total encaissé sur les ventes terminées"} : ${fcfa(sum)}</span>`;
$("#ost").hidden=false;
}
if(!data||!data.length){$("#ol").innerHTML="<p class='meta'>Aucune commande pour l’instant.</p>";return}
const lids=[...new Set(data.map(o=>o.listing_id).filter(Boolean))];
let ph={};
if(lids.length){const{data:ls}=await sb.from("listings").select("id,photos").in("id",lids);ph=Object.fromEntries((ls||[]).map(x=>[x.id,x.photos&&x.photos[0]]))}
const{data:lvr}=await sb.from("livraisons").select("*").in("commande_id",data.map(o=>o.id));
const LV=Object.fromEntries((lvr||[]).map(x=>[x.commande_id,x]));
$("#ol").innerHTML=data.map(o=>{
const fr=o.frais_acheteur||0,th=ph[o.listing_id],l=LV[o.id];
const head=`<div class="ihead">${th?`<img class="ithumb" src="${esc(th)}" alt="">`:`<div class="ithumb"></div>`}<div><b>${esc(o.titre)}</b><br>${fcfa(o.montant)}<br><span class="pt">${fcfa(o.montant+fr)} incl. ${SH} ${c?"(total payé)":"(sous-total pour l’acheteur)"}</span></div></div>`;
let liv="",ctl="";
if(o.statut!=="annule"){
const done5=o.statut==="livre";
const key=done5?"livree":(LIVS.includes(o.livraison)?o.livraison:"nouvelle");
const idx=LIVS.indexOf(key);
const track=`<p class="lv">${LIVS.map((s,i)=>`<span class="${i<=idx?"on":""}">${i<=idx?"●":"○"} ${LIVC[s]}</span>`).join("")}</p>`;
const stline=`<p class="pt" style="color:var(--ink)"><b>${c?"Livraison":"Statut de livraison"} : ${LIVL[key]}</b></p>`;
if(c){
liv=stline+track+(l?`<p class="meta">Livraison à ${esc(l.nom)} · ${esc(l.telephone)} · ${esc(l.quartier)}, ${esc(l.commune)}, ${esc(l.ville)}</p>`:"");
}else if(o.statut==="paye"||o.statut==="litige"){
liv=livBlock(l)+stline+track;
}
if(!c&&o.statut==="paye"){
const opts=LIVS.slice(idx+1);
ctl=opts.length?`<select class="lsel" aria-label="Nouveau statut de livraison">${opts.map(s=>`<option value="${s}">${LIVL[s]}</option>`).join("")}</select><button class="sbtn pri" data-lu="${o.id}">Mettre à jour le statut</button>`:`<p class="meta">Livrée : en attente de la confirmation de réception de l’acheteur.</p>`;
}
}
const btn=o.statut==="paye"?(c?`<button class="sbtn pri" data-ok="${o.id}">J’ai reçu l’article</button><button class="sbtn" data-pb="${o.id}">Signaler un problème</button>`:`<button class="sbtn" data-no="${o.id}">Annuler la vente</button>`):"";
return `<div class="ord">${head}${liv}<p class="ordmsg">${ordMsg(o,c)}</p><span class="meta">${new Date(o.created_at).toLocaleDateString("fr-FR")}</span>${ctl}${btn}</div>`;
}).join("");
}
$("#ord").onclick=openOrders;
$("#ol").onclick=async e=>{
const ok=e.target.closest("[data-ok]"),no=e.target.closest("[data-no]"),pb=e.target.closest("[data-pb]"),lu=e.target.closest("[data-lu]");
if(pb){
const motif=prompt("Quel est le problème avec cette commande ? Par exemple : article non reçu, ou article différent de l’annonce.");
if(motif===null)return;
if(motif.trim().length<3){alert("Décrivez le problème en quelques mots.");return}
const{error}=await sb.rpc("signaler_probleme",{p_commande:pb.dataset.pb,p_motif:motif});
if(error){alert(err(error));return}
alert("Votre signalement est envoyé. Votre argent reste bloqué le temps que Finder examine la situation.");
}else if(lu){
const sel=lu.parentElement.querySelector(".lsel");
if(!sel)return;
const{error}=await sb.rpc("maj_livraison",{p_commande:lu.dataset.lu,p_statut:sel.value});
if(error){alert(err(error));return}
}else if(ok){
if(!confirm("Confirmez-vous avoir reçu l’article ? Le vendeur sera payé."))return;
const{error}=await sb.rpc("confirmer_reception",{p_commande:ok.dataset.ok});
if(error){alert(err(error));return}
}else if(no){
if(!confirm("Annuler cette vente ? L’acheteur sera remboursé."))return;
const{error}=await sb.rpc("annuler_commande",{p_commande:no.dataset.no});
if(error){alert(err(error));return}
}else return;
await loadWallet();applyUI();openOrders();load();refreshNotifs();
};
async function openCareer(){
if(!user)return;
$("#carc").innerHTML="<p class='meta'>Chargement…</p>";
if(!$("#dcar").open)$("#dcar").showModal();
await refreshMe();
const[r1,r2]=await Promise.all([sb.from("commandes").select("montant,statut").eq("seller_id",user.id),sb.from("avis").select("note").eq("seller_id",user.id)]);
const done=(r1.data||[]).filter(o=>o.statut==="livre");
const total=done.reduce((s,o)=>s+o.montant,0);
const av=r2.data||[];
const note=av.length?(av.reduce((s,a)=>s+a.note,0)/av.length).toFixed(1).replace(".",",")+" ★ ("+av.length+" avis)":"Pas encore d’avis";
const since=me&&me.vendeur_depuis;
const dt=since?new Date(since).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):"";
$("#carc").innerHTML=since?`<p class="wbig" style="font-size:1.3rem">Vendeur sur Finder depuis ${esc(depuis(since))}</p><p class="meta">Depuis le ${esc(dt)}</p><div class="wrow"><span>Ventes terminées</span><b>${done.length}</b></div><div class="wrow"><span>Total vendu</span><b>${fcfa(total)}</b></div><div class="wrow"><span>Note moyenne</span><b>${esc(note)}</b></div>`:"<p class='meta'>Votre carrière démarre dès que vous passez en compte vendeur.</p>";
}
$("#bcar").onclick=openCareer;
async function openSupport(){
if(!user){$("#da").showModal();return}
$("#sf2").reset();$("#sm2").textContent="";
$("#stl").innerHTML="<p class='meta'>Chargement…</p>";
if(!$("#dsup").open)$("#dsup").showModal();
await loadTickets();
}
async function loadTickets(){
const{data}=await sb.from("support_tickets").select("*").order("cree_le",{ascending:false}).limit(20);
$("#stl").innerHTML=(data&&data.length)?data.map(t=>`<div class="ord"><b>${esc(t.sujet)}</b> · <span class="meta">${new Date(t.cree_le).toLocaleDateString("fr-FR")} · ${t.statut==="ouvert"?"En attente de réponse":"Répondu"}</span><br>${esc(t.message)}${t.reponse?`<p class="soldnote" style="text-align:left;font-weight:400"><b>Réponse du support :</b><br>${esc(t.reponse)}</p>`:""}</div>`).join(""):"<p class='meta'>Aucune demande pour l’instant.</p>";
}
$("#sf2").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#sm2");
m.textContent="Envoi en cours…";
const{error}=await sb.rpc("envoyer_support",{p_sujet:f.sujet.value,p_message:f.msg.value});
if(error){m.textContent=err(error);return}
f.reset();m.textContent="Votre demande est envoyée. Vous serez prévenu dès que nous aurons répondu.";
await loadTickets();refreshNotifs();
};
$("#bvol").onclick=()=>{
if(!user){$("#da").showModal();return}
$("#vf").reset();$("#vm").textContent="";$("#dvol").showModal();
};
$("#vf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#vm");
m.textContent="Un instant…";
const{error}=await sb.rpc("declarer_vol",{p_numero:f.vn.value,p_description:f.vd.value});
if(error){m.textContent=err(error);return}
f.reset();m.textContent="";$("#dvol").close();
alert("Votre déclaration est enregistrée. Si une annonce porte ce numéro, Finder la vérifiera. Pensez aussi à porter plainte.");
};
function openKyc(){
if(!user)return;
const s=myId&&myId.statut,info=$("#kinfo"),form=$("#kf");
if(s==="verifie"){
info.innerHTML="<p class='soldnote'>Votre identité est vérifiée ✓</p><p class='meta'>Ce critère du badge bleu est rempli."+(myShop?"":" Vous pouvez créer votre boutique Finder.")+"</p>";
form.hidden=true;$("#kclose").hidden=false;
}else if(s==="en_attente"){
info.innerHTML="<p class='soldnote'>Vérification en cours. Finder examine vos informations. Vous serez prévenu dès que ce sera terminé.</p>";
form.hidden=true;$("#kclose").hidden=false;
}else{
const intro=`La vérification d’identité fait partie des critères du badge bleu de votre boutique. Elle permet aussi de porter la limite de votre porte-monnaie vendeur à ${fcfa(plBq)}. Vos informations ne sont jamais affichées publiquement.`;
info.innerHTML=(s==="refuse"?`<p class="err">Votre dernière demande a été refusée : ${esc((myId&&myId.motif_refus)||"informations non conformes")}. Vous pouvez la refaire.</p>`:"")+`<p class="meta">${intro}</p>`;
form.hidden=false;$("#kclose").hidden=true;
form.reset();
const d=new Date();d.setFullYear(d.getFullYear()-18);
$("#kd").max=d.toISOString().slice(0,10);
$("#km").textContent="";
}
if(!$("#dkyc").open)$("#dkyc").showModal();
}
$("#bid").onclick=()=>{
if(myId&&myId.statut==="verifie"&&!myShop){openShopDlg();return}
openKyc();
};
$("#kf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#km"),nais=f.kd.value;
const age=Math.floor((Date.now()-new Date(nais).getTime())/31557600000);
if(!nais||age<18){m.textContent="Vous devez avoir au moins 18 ans.";return}
const p1=f.kf1.files[0],p2=f.kf2.files[0];
if(!p1||!p2){m.textContent="Ajoutez la photo de la pièce et le selfie.";return}
if(p1.size>5e6||p2.size>5e6){m.textContent="Chaque photo doit faire moins de 5 Mo.";return}
m.textContent="Envoi en cours…";
const up=async(file,tag)=>{
const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
const path=`${user.id}/${tag}-${Date.now()}.${ext}`;
const r=await sb.storage.from("identites").upload(path,file);
return r.error?null:path;
};
const a=await up(p1,"piece"),b=await up(p2,"selfie");
if(!a||!b){m.textContent="L’envoi des photos a échoué. Utilisez des photos JPG ou PNG de moins de 5 Mo, puis réessayez.";return}
const{error}=await sb.rpc("soumettre_identite",{p_nom:f.kn.value,p_prenoms:f.kp.value,p_naissance:nais,p_adresse:f.ka.value,p_tel:f.kt.value,p_type:f.kty.value,p_numero:f.kno.value,p_piece:a,p_selfie:b});
if(error){m.textContent=err(error);return}
await loadIdent();applyUI();$("#dkyc").close();refreshNotifs();
alert("Votre demande est envoyée. Dès que Finder aura vérifié votre identité, vous serez prévenu et ce critère du badge bleu sera rempli.");
};
async function openMod(){
$("#dmc").innerHTML="<p class='meta'>Chargement…</p>";
if(!$("#dmod").open)$("#dmod").showModal();
const[r1,r2,r3]=await Promise.all([sb.rpc("file_moderation"),sb.rpc("file_identites"),sb.rpc("file_support")]);
if(r1.error||!r1.data){$("#dmc").innerHTML="<p class='meta'>Accès refusé ou indisponible.</p>";return}
const A=r1.data.annonces||[],D=r1.data.declarations||[],I=r2.data||[],S=r3.data||[];
$("#dmc").innerHTML=`<h3>Demandes au support (${S.length})</h3>`+(S.length?S.map(s=>`<div class="ord"><b>${esc(s.sujet)}</b> · <span class="meta">${esc(s.profil)} · ${new Date(s.date).toLocaleDateString("fr-FR")}</span><br>${esc(s.message)}<button class="sbtn pri" data-sr="${s.id}">Répondre</button></div>`).join(""):"<p class='meta'>Aucune demande à traiter.</p>")+`<h3>Identités à vérifier (${I.length})</h3>`+(I.length?I.map(d=>`<div class="ord"><b>${esc(d.prenoms)} ${esc(d.nom)}</b> · ${d.age} ans (né(e) le ${esc(d.naissance)})<br><span class="meta">Compte : ${esc(d.profil)} · ${esc(d.type)} · ${esc(d.adresse)} · ${esc(d.tel)}</span>${d.doublon?`<p class="err">Attention : cette pièce est déjà utilisée par un autre compte.</p>`:""}<div class="row"><button type="button" data-vp="${esc(d.piece)}">Voir la pièce</button><button type="button" data-vp="${esc(d.selfie)}">Voir le selfie</button></div><div class="idimgs"></div><button class="sbtn pri" data-iv="${d.user_id}">Vérifier l’identité</button><button class="sbtn del" data-ir="${d.user_id}">Refuser</button></div>`).join(""):"<p class='meta'>Aucune identité à vérifier.</p>")+`<h3>Annonces à vérifier (${A.length})</h3>`+(A.length?A.map(a=>`<div class="ord"><div class="ihead">${a.photo?`<img class="ithumb" src="${esc(a.photo)}" alt="">`:`<div class="ithumb"></div>`}<div><b>${esc(a.titre)}</b><br>${fcfa(a.prix)} · ${esc(a.categorie)}<br><span class="meta">Vendeur : ${esc(a.vendeur)} · Risque ${a.score}</span></div></div><ul>${(a.raisons||[]).map(r=>`<li>${esc(r)}</li>`).join("")}</ul>${a.numero?`<p class="meta">Numéro : ${esc(a.numero)}</p>`:""}<button class="sbtn pri" data-ap="${a.id}">Approuver</button><button class="sbtn del" data-bl="${a.id}">Bloquer</button></div>`).join(""):"<p class='meta'>Rien à vérifier.</p>")+`<h3>Déclarations de vol (${D.length})</h3>`+(D.length?D.map(d=>`<div class="ord"><b>${esc(d.numero)}</b><br><span class="meta">${esc(d.description||"")}</span><button class="sbtn pri" data-dc="${d.id}">Confirmer le vol (bloque les annonces)</button><button class="sbtn" data-dr="${d.id}">Rejeter</button></div>`).join(""):"<p class='meta'>Aucune déclaration à traiter.</p>");
}
$("#bmod").onclick=openMod;
$("#dmc").onclick=async e=>{
const vp=e.target.closest("[data-vp]"),iv=e.target.closest("[data-iv]"),ir=e.target.closest("[data-ir]");
const ap=e.target.closest("[data-ap]"),bl=e.target.closest("[data-bl]"),dc=e.target.closest("[data-dc]"),dr=e.target.closest("[data-dr]"),sr=e.target.closest("[data-sr]");
if(vp){
const{data,error}=await sb.storage.from("identites").createSignedUrl(vp.dataset.vp,300);
if(error||!data){alert("Impossible d’afficher la photo.");return}
vp.closest(".ord").querySelector(".idimgs").innerHTML=`<img class="idimg" src="${esc(data.signedUrl)}" alt="">`;
return;
}
let r;
if(sr){const n=prompt("Votre réponse à l’utilisateur");if(n===null||n.trim().length<2)return;r=await sb.rpc("repondre_support",{p_id:sr.dataset.sr,p_reponse:n})}
else if(iv)r=await sb.rpc("decider_identite",{p_user:iv.dataset.iv,p_decision:"verifier",p_motif:null});
else if(ir){const n=prompt("Motif du refus (par exemple : photo floue, nom différent de la pièce)");if(n===null)return;r=await sb.rpc("decider_identite",{p_user:ir.dataset.ir,p_decision:"refuser",p_motif:n})}
else if(ap)r=await sb.rpc("moderer_annonce",{p_id:ap.dataset.ap,p_decision:"approuver",p_note:null});
else if(bl){const n=prompt("Motif du blocage (facultatif)");if(n===null)return;r=await sb.rpc("moderer_annonce",{p_id:bl.dataset.bl,p_decision:"bloquer",p_note:n})}
else if(dc){if(!confirm("Confirmer ce vol ? Toutes les annonces avec ce numéro seront bloquées."))return;r=await sb.rpc("traiter_declaration",{p_id:dc.dataset.dc,p_decision:"confirmer"})}
else if(dr)r=await sb.rpc("traiter_declaration",{p_id:dr.dataset.dr,p_decision:"rejeter"});
else return;
if(r.error){alert(err(r.error));return}
openMod();load();
};
function maybeAskLongTerm(){
if(!user||!me||acct!=="vendeur"||myShop)return;
if(me.long_terme===true||me.long_terme===false)return;
if(document.querySelector("dialog[open]"))return;
$("#dlt").showModal();
}
$("#ltyes").onclick=async()=>{
if(acct!=="vendeur"){$("#dlt").close();return}
await sb.from("profils").update({long_terme:true}).eq("user_id",user.id);
me.long_terme=true;$("#dlt").close();openShopDlg();
};
$("#ltno").onclick=async()=>{
await sb.from("profils").update({long_terme:false}).eq("user_id",user.id);
me.long_terme=false;$("#dlt").close();
};
function showLogo(url,name){
const img=$("#bqimg"),ph=$("#bqph");
if(url){img.src=url;img.hidden=false;ph.hidden=true}
else{img.hidden=true;ph.hidden=false;ph.textContent=(name||"?").slice(0,1).toUpperCase()}
}
function openShopDlg(){
if(!user)return;
if(acct!=="vendeur"){alert("Passez en compte vendeur pour créer ou gérer une boutique.");return}
if(!me){openProfile(true);return}
if(!myShop&&kycCreate&&kycReq&&!me.admin&&!(myId&&myId.statut==="verifie")){openKyc();return}
const s=myShop;
$("#bqt").textContent=s?"Ma boutique Finder":"Créer ma boutique Finder";
$("#bqn").value=s?s.nom:"";
$("#bqv").value=s?s.ville:CITIES[0];
$("#bqd").value=s?s.delai:DELAIS[0];
$("#bqp").value="";
showLogo(s?s.logo_url:null,s?s.nom:"");
$("#bqs").textContent=s?"Enregistrer":"Créer ma boutique";
$("#bqx").hidden=!s;
$("#bqm").textContent="";
if(!$("#dbq").open)$("#dbq").showModal();
if(s)renderCert();
}
$("#bq").onclick=openShopDlg;
$("#bqf").onsubmit=async e=>{
e.preventDefault();
if(acct!=="vendeur"){$("#bqm").textContent="Passez en compte vendeur pour gérer une boutique.";return}
const f=e.target,m=$("#bqm"),file=f.bphoto.files[0];
if(file&&file.size>5e6){m.textContent="La photo doit faire moins de 5 Mo.";return}
m.textContent="Enregistrement…";
let logo=myShop?myShop.logo_url:null;
if(file){
const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
const p=`${user.id}/boutique-${Date.now()}.${ext}`;
const up=await sb.storage.from("photos").upload(p,file);
if(up.error){m.textContent="L’envoi de la photo a échoué. Réessayez.";return}
logo=sb.storage.from("photos").getPublicUrl(p).data.publicUrl;
}
const v={nom:f.bnom.value.trim(),logo_url:logo,ville:f.bville.value,delai:f.bdelai.value};
const wasNew=!myShop;
const{error}=wasNew?await sb.from("boutiques").insert({user_id:user.id,...v}):await sb.from("boutiques").update(v).eq("user_id",user.id);
if(error){m.textContent=error.code==="23505"?"Ce nom de boutique est déjà pris.":"Enregistrement impossible. Vérifiez les champs et que vous êtes en compte vendeur.";return}
await loadMyShop();await loadPlaf();applyUI();openShopDlg();load();refreshNotifs();
if(wasNew)alert("Votre boutique est créée. La limite de votre porte-monnaie vendeur est de "+fcfa(plaf?plaf.limite:plStd)+(plaf&&plaf.tier==="standard"?". Faites vérifier votre identité pour passer à "+fcfa(plBq)+" et obtenir le badge bleu.":"."));
};
$("#bqa").onclick=()=>{$("#dbq").close();$("#sell").click()};
$("#bqo").onclick=()=>{$("#dbq").close();sellerId=user.id;mode="seller";labels();load();window.scrollTo(0,0)};
async function renderCert(){
const box=$("#bqc");
box.innerHTML="<p class='meta'>Chargement…</p>";
const{data:e,error}=await sb.rpc("etat_certification");
if(error||!e){box.innerHTML="<p class='meta'>Indisponible pour le moment.</p>";return}
const row=(ok,t)=>`<p class="crit">${ok?"✓":"○"} ${t}</p>`;
box.innerHTML=(e.certifiee?`<p class="soldnote">Votre boutique est certifiée ${VB}</p>`:"")
+row(e.complet,"Boutique complète : nom, photo, ville et délai de livraison")
+row(e.jours>=e.jours_min,`Ouverte depuis ${e.jours_min} jours (actuellement ${e.jours})`)
+row(e.ventes>=e.ventes_min,`${e.ventes_min} ventes terminées (actuellement ${e.ventes})`)
+row(e.avis>=e.avis_min&&e.note>=e.note_min,`${e.avis_min} avis au moins, avec une note moyenne de ${e.note_min} (actuellement ${e.avis} avis, note ${e.note})`)
+row(e.signalements<=e.signalements_max,`${e.signalements_max} signalements au maximum en 90 jours (actuellement ${e.signalements})`)
+row(e.identite,"Identité vérifiée par Finder")
+(e.identite?"":`<button type="button" class="sbtn" id="bqid">Faire vérifier mon identité</button>`)
+(e.certifiee?"":`<button type="button" class="sbtn pri" id="bqcert"${e.tous_ok?"":" disabled"}>Certifier ma boutique</button>`)
+`<p class="meta">Le badge est retiré automatiquement si un critère cesse d’être rempli.</p>`;
}
$("#bqc").onclick=async e=>{
if(e.target.id==="bqid"){$("#dbq").close();openKyc();return}
if(e.target.id!=="bqcert")return;
const{error}=await sb.rpc("certifier_boutique");
if(error){alert("Les critères ne sont pas encore tous remplis.");return}
await loadMyShop();await renderCert();load();refreshNotifs();
alert("Votre boutique est maintenant certifiée.");
};
$("#sw").onclick=async()=>{
if(!me){openProfile(true);return}
const n=acct==="client"?"vendeur":"client";
const{error}=await sb.from("profils").update({mode:n}).eq("user_id",user.id);
if(error){alert("Changement impossible. Réessayez.");return}
await refreshMe();
me.mode=n;acct=n;mode="all";
if(n==="client"){$("#dbq").close();$("#dlt").close()}
await loadWallet();applyUI();labels();load();
if(n==="vendeur"){await loadPlaf();maybeAskLongTerm()}
};
$("#f").onsubmit=e=>{e.preventDefault();load()};
$("#mine").onclick=()=>{mode="mine";labels();load();window.scrollTo(0,0)};
$("#fav").onclick=()=>{mode="fav";labels();load();window.scrollTo(0,0)};
$("#back").onclick=()=>{mode="all";labels();load()};
function openProfile(need){
if($("#dp").open||recov)return;
needProfile=need;
const f=$("#pf");
f.nom.value=me?me.nom:"";f.pville.value=me&&me.ville?me.ville:"";f.bio.value=me&&me.bio?me.bio:"";
$("#pmw").hidden=!!me;
$("#pm").textContent=need?"Choisissez votre nom et votre type de compte pour continuer.":"";
$("#dp").showModal();
}
$("#pro").onclick=()=>openProfile(false);
$("#pf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#pm");
const row={user_id:user.id,nom:f.nom.value.trim(),ville:f.pville.value||null,bio:f.bio.value.trim()||null,mode:me?me.mode:f.pmode.value};
const{error}=await sb.from("profils").upsert(row);
if(error){m.textContent="Enregistrement impossible. Vérifiez le nom (2 caractères minimum).";return}
me={...(me||{}),...row};await refreshMe();
acct=me.mode;needProfile=false;m.textContent="";$("#dp").close();
await loadWallet();applyUI();labels();load();
maybeAskLongTerm();
};
async function doAuth(signup){
const f=$("#af"),m=$("#am"),c={email:f.em.value,password:f.pw.value};
m.textContent="Un instant…";
const{error}=signup?await sb.auth.signUp(c):await sb.auth.signInWithPassword(c);
if(error){m.textContent=signup?"Création impossible. Vérifiez l’email et utilisez 6 caractères minimum.":"Email ou mot de passe incorrect.";return}
if(signup){m.textContent="Compte créé. Si un email de confirmation arrive, ouvrez-le, puis connectez-vous.";return}
m.textContent="";$("#da").close();
}
$("#af").onsubmit=e=>{e.preventDefault();doAuth(false)};
$("#su").onclick=()=>$("#af").reportValidity()&&doAuth(true);
$("#spw").onchange=e=>{$("#pw").type=e.target.checked?"text":"password"};
$("#snp").onchange=e=>{const t=e.target.checked?"text":"password";$("#np").type=t;$("#nc").type=t};
$("#fg").onclick=async e=>{
e.preventDefault();
const m=$("#am"),em=$("#em").value.trim();
if(!em||!em.includes("@")){m.textContent="Entrez votre email ci-dessus, puis appuyez sur « Mot de passe oublié ? ».";return}
m.textContent="Un instant…";
const{error}=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+location.pathname});
m.textContent=error?"Envoi impossible pour le moment. Réessayez dans quelques minutes.":"Si cet email existe, un lien pour changer le mot de passe vient d’être envoyé. Vérifiez aussi vos spams.";
};
$("#nf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#nm");
if(f.np.value!==f.nc.value){m.textContent="Les deux mots de passe ne sont pas identiques.";return}
m.textContent="Un instant…";
const{error}=await sb.auth.updateUser({password:f.np.value});
if(error){m.textContent="Changement impossible. Utilisez un autre mot de passe ou redemandez un lien.";return}
f.reset();m.textContent="";recov=false;$("#dn").close();
history.replaceState(null,"",location.pathname);
alert("Votre mot de passe a été changé.");
};
$("#auth").onclick=()=>user?sb.auth.signOut():$("#da").showModal();
$("#sell").onclick=async()=>{
if(!user){$("#da").showModal();return}
if(!me){openProfile(true);return}
if(acct!=="vendeur"){alert("Passez en compte vendeur pour publier une annonce.");return}
$("#sf").reset();$("#sm").textContent="";updNet();numUI();
await loadPlaf();updPl();
$("#ds").showModal();
};
$("#sf").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=$("#sm"),files=[...f.photos.files].slice(0,3);
if(files.some(x=>x.size>5e6)){m.textContent="Chaque photo doit faire moins de 5 Mo.";return}
m.textContent="Publication en cours…";
const urls=[];
for(const[n,file]of files.entries()){
const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
const p=`${user.id}/${Date.now()}-${n}.${ext}`;
const up=await sb.storage.from("photos").upload(p,file);
if(up.error){m.textContent="L’envoi d’une photo a échoué. Réessayez.";return}
urls.push(sb.storage.from("photos").getPublicUrl(p).data.publicUrl);
}
const hash=files[0]?await dhash(files[0]):null;
const{data:res,error}=await sb.rpc("publier_annonce",{p_title:f.ttl.value.trim(),p_price:+f.prix.value,p_category:f.cat.value,p_city:f.ville.value,p_etat:f.etat.value,p_marque:f.marque.value.trim()||null,p_description:f.desc.value.trim(),p_photos:urls,p_numero:f.numero.value.trim()||null,p_hash:hash,p_attest:f.att.checked});
if(error){m.textContent=err(error);return}
f.reset();m.textContent="";$("#ds").close();numUI();
if(res&&res.statut==="en_revue")alert("Votre annonce est enregistrée. Elle est en cours de vérification par Finder et sera visible dès qu’elle sera approuvée.");
else if(res&&res.statut==="bloque")alert("Cette annonce n’a pas pu être publiée. Si vous pensez qu’il y a une erreur, contactez Finder.");
mode="mine";labels();load();refreshNotifs();
};
labels();applyUI();loadParams();
sb.auth.onAuthStateChange((ev,s)=>{
if(ev==="PASSWORD_RECOVERY"){recov=true;setTimeout(()=>{$("#da").close();$("#dp").close();if(!$("#dn").open)$("#dn").showModal()},0)}
user=s&&s.user?s.user:null;
$("#auth").textContent=user?"Déconnexion":"Connexion";
clearInterval(nt);
setTimeout(async()=>{
if(user){
await loadFavs();await loadMe();await loadMyShop();await loadIdent();
acct=me&&me.mode?me.mode:"client";
await loadWallet();await loadPlaf();
first=true;unread=0;nFirst=true;seenN=new Set();await checkUnread();nt=setInterval(checkUnread,10000);
if(!me)openProfile(true);
}else{
favs=new Set();me=null;myShop=null;myId=null;plaf=null;acct="client";wbal=0;ordN=0;nUnread=0;seenN=new Set();nFirst=true;unread=0;first=true;document.title=BASE;$("#msgs").textContent="Messages";$("#toast").hidden=true;
if(mode!=="seller")mode="all";
}
applyUI();labels();load();
if(user&&me)maybeAskLongTerm();
},0);
});
// FIN DU FICHIER
// Modernisation de l'interface
(function(){var l=document.createElement("link");l.rel="stylesheet";l.href="style.css?v=1";document.head.appendChild(l);var s=document.createElement("script");s.src="ui.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="cat.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="media.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="plus.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="vac.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="bonus.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="fix.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="shop.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="ident.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="deal.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="guide.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="remise.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="search.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="codeseul.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="delai.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="litiges.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="stats.js?v=1";document.body.appendChild(s)})();
(function(){var s=document.createElement("script");s.src="dash.js?v=1";document.body.appendChild(s)})();
