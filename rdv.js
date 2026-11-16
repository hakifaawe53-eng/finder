// Finder - rdv.js : rendez-vous en sécurité dans la messagerie
(function(){
if(window.__finderRdv)return;window.__finderRdv=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
Object.assign(ERR,{
"date rdv invalide":"Choisissez une date et une heure entre 30 minutes et 14 jours à partir de maintenant.",
"lieu invalide":"Indiquez un lieu précis (3 à 140 caractères).",
"trop de rdv":"Vous avez déjà deux rendez-vous confirmés pour cet article.",
"rendez-vous invalide":"Échangez d’abord quelques messages avec l’autre personne pour fixer un rendez-vous.",
"rendez-vous clos":"Ce rendez-vous n’est plus disponible.",
"rendez-vous introuvable":"Rendez-vous introuvable.",
"rdv hors horaire":"Cette action est possible d’une heure avant à deux heures après le rendez-vous.",
"position invalide":"Position invalide."
});
const COLS="id,listing_id,buyer_id,seller_id,propose_par,quand,lieu_type,lieu,note,statut,arrive_acheteur,arrive_vendeur";
const LT={pharmacie:["💊","Pharmacie"],station:["⛽","Station-service"],centre_commercial:["🏬","Centre commercial"],banque:["🏦","Banque"],restaurant:["🍽️","Restaurant ou café"],commissariat:["👮","Commissariat ou gendarmerie"],autre:["📍","Autre lieu public"]};
const st=document.createElement("style");
st.textContent=`
.rdvc{background:#FFF;border:1px solid #BFE5E1;border-left:5px solid #00A39A;border-radius:14px;padding:10px 12px;margin:8px 0;font-size:.92rem}
.rdvc .sbtn{margin:4px 4px 0 0;padding:7px 10px;font-size:.82rem}
.rdvc a.sbtn{display:inline-block;text-decoration:none;text-align:center}
#brdv:before{content:"📅"}
.rdvadm{border-left:5px solid #E5484D}
`;
document.head.appendChild(st);
const fq=ts=>new Date(ts).toLocaleString("fr-FR",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit",timeZone:"UTC"});
const inWin=r=>{const t=new Date(r.quand).getTime(),n=Date.now();return n>=t-36e5&&n<=t+72e5};
let CTX={city:"",title:""},RDV=[],lastR=0;
const mapLink=r=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(r.lieu+" "+(CTX.city||""));
document.body.insertAdjacentHTML("beforeend",'<dialog id="drdv"><h2>📅 Proposer un rendez-vous</h2><p class="vstep">🛡️ Choisissez un <b>lieu public, éclairé et fréquenté</b>, de préférence <b>de jour</b>, et venez accompagné si possible. Ne donnez jamais votre code de remise avant d’avoir contrôlé l’article.</p><form id="rdvf"><label>Jour</label><input type="date" name="d" required><label>Heure (heure de Côte d’Ivoire)</label><input type="time" name="h" required><label>Type de lieu</label><select name="t">'+Object.keys(LT).map(k=>'<option value="'+k+'">'+LT[k][0]+" "+LT[k][1]+"</option>").join("")+'</select><label>Lieu précis</label><input name="l" required minlength="3" maxlength="140" placeholder="Ex : devant la pharmacie du carrefour"><p><a id="rdvmap" target="_blank" rel="noopener">🗺️ Chercher ce type de lieu près de la ville</a></p><label>Précision (facultatif)</label><input name="n" maxlength="200" placeholder="Ex : je porte une veste bleue"><p class="err" id="rdve" role="alert"></p><div class="row"><button class="pri">Envoyer la proposition</button><button type="button" data-x>Annuler</button></div></form></dialog><dialog id="dalr"><h2>🚨 Alerte sécurité</h2><p>Si vous êtes en danger immédiat, <b>contactez d’abord les secours locaux</b> (police, gendarmerie, SAMU).</p><p class="meta">Finder transmettra ce rendez-vous et les positions partagées à l’équipe de modération. L’autre personne n’est pas prévenue.</p><label>Que se passe-t-il ? (facultatif)</label><textarea id="alm" rows="3" maxlength="300"></textarea><p class="err" id="ale"></p><div class="row"><button type="button" class="pri" id="algo" style="background:#D92D20">Envoyer l’alerte</button><button type="button" data-x>Annuler</button></div></dialog><dialog id="dmrd"><div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Mes rendez-vous</h2></div><div id="mrdl"></div></dialog>');
["#drdv","#dalr","#dmrd"].forEach(s=>{const d=q(s);d.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>d.close())});
const f=q("#rdvf");
function mapUpd(){
const t=f.t.value;
q("#rdvmap").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(LT[t][1]+" "+(CTX.city||""));
}
f.t.onchange=mapUpd;
async function msg(body){
if(!chat)return;
const{error}=await sb.from("messages").insert({listing_id:chat.lid,receiver_id:chat.other,body});
if(!error){lastN="";if(window.loadChat)await window.loadChat()}
}
async function loadCtx(){
if(!chat)return;
const{data}=await sb.from("listings").select("city,title").eq("id",chat.lid).maybeSingle();
CTX=data||{city:"",title:""};
}
function card(r){
const mine=r.propose_par===user.id,lt=LT[r.lieu_type]||LT.autre;
let s="",a="";
if(r.statut==="propose"){
s=mine?"⏳ En attente de la réponse":"💬 Proposition reçue";
a=mine?'<button type="button" class="sbtn" data-rc="'+r.id+'">Annuler</button>':'<button type="button" class="sbtn pri" data-ra="'+r.id+'">✅ Accepter</button><button type="button" class="sbtn" data-rm="'+r.id+'">↔️ Autre horaire</button><button type="button" class="sbtn" data-rr="'+r.id+'">Refuser</button>';
}else{
s="✅ Confirmé";
a='<a class="sbtn" target="_blank" rel="noopener" href="'+mapLink(r)+'">🗺️ Itinéraire</a>'+(inWin(r)?'<button type="button" class="sbtn" data-rp="'+r.id+'">📍 Partager ma position</button><button type="button" class="sbtn" data-rv="'+r.id+'">👁️ Voir sa position</button><button type="button" class="sbtn pri" data-rar="'+r.id+'">✅ Je suis arrivé(e)</button><button type="button" class="sbtn" style="color:#D92D20" data-ral="'+r.id+'">🚨 Alerte</button>':'<p class="meta">Les boutons « arrivé », position et alerte s’activent 1 heure avant le rendez-vous.</p>')+'<button type="button" class="sbtn" data-rc="'+r.id+'">Annuler le rendez-vous</button>';
}
const arr=(r.arrive_acheteur?"✓ Acheteur arrivé ":"")+(r.arrive_vendeur?"✓ Vendeur arrivé":"");
return'<div class="rdvc"><b>📅 '+esc(fq(r.quand))+"</b><br>"+lt[0]+" "+esc(lt[1])+" · "+esc(r.lieu)+(r.note?'<br><span class="meta">'+esc(r.note)+"</span>":"")+'<p class="meta">'+s+(arr?" · "+arr:"")+"</p>"+a+"</div>";
}
async function refreshRdv(force){
const box=q("#rdvbox");
if(!box||!user||!chat)return;
if(!force&&Date.now()-lastR<8000)return;
lastR=Date.now();
const U=user.id,O=chat.other;
const{data}=await sb.from("rendezvous").select(COLS).eq("listing_id",chat.lid).in("statut",["propose","confirme"]).or("and(buyer_id.eq."+U+",seller_id.eq."+O+"),and(buyer_id.eq."+O+",seller_id.eq."+U+")").order("quand");
RDV=data||[];
box.innerHTML=RDV.map(card).join("");
}
q("#mb").insertAdjacentHTML("beforebegin",'<div id="rdvbox"></div>');
function openForm(){
if(!user||!chat)return;
const t=new Date(),m=new Date(Date.now()+14*864e5);
f.reset();
f.d.min=t.toISOString().slice(0,10);
f.d.max=m.toISOString().slice(0,10);
q("#rdve").textContent="";
mapUpd();
q("#drdv").showModal();
}
f.onsubmit=async e=>{
e.preventDefault();
const m=q("#rdve");
m.textContent="Envoi…";
const quand=new Date(f.d.value+"T"+f.h.value+":00Z");
if(isNaN(quand)){m.textContent="Date ou heure invalide.";return}
const lieu=f.l.value.trim(),t=f.t.value;
const{error}=await sb.rpc("proposer_rdv",{p_listing:chat.lid,p_other:chat.other,p_quand:quand.toISOString(),p_type:t,p_lieu:lieu,p_note:f.n.value.trim()||null});
if(error){m.textContent=err(error);return}
q("#drdv").close();
await msg("📅 Proposition de rendez-vous : "+fq(quand)+" · "+LT[t][1]+" — "+lieu);
refreshRdv(true);rdvBadge(true);
};
async function act(fn,args,okMsg){
const{error}=await sb.rpc(fn,args);
if(error){alert(err(error));return false}
if(okMsg)await msg(okMsg);
refreshRdv(true);rdvBadge(true);
if(q("#dmrd").open)openMine();
return true;
}
let alertId=null;
q("#rdvbox").addEventListener("click",async e=>{
const b=e.target.closest("[data-ra],[data-rr],[data-rm],[data-rc],[data-rp],[data-rv],[data-rar],[data-ral]");
if(!b)return;
const d=b.dataset;
if(d.ra){await act("repondre_rdv",{p_rdv:d.ra,p_accepter:true},"✅ Rendez-vous confirmé. À bientôt !");return}
if(d.rr){if(!confirm("Refuser cette proposition ?"))return;await act("repondre_rdv",{p_rdv:d.rr,p_accepter:false},"❌ Rendez-vous refusé. Proposez-moi un autre horaire ou un autre lieu.");return}
if(d.rm){openForm();return}
if(d.rc){if(!confirm("Annuler ce rendez-vous ?"))return;await act("annuler_rdv",{p_rdv:d.rc},"Rendez-vous annulé.");return}
if(d.rar){const ok=await act("arriver_rdv",{p_rdv:d.rar});if(ok)showToast("Votre interlocuteur est prévenu ✓","msg");return}
if(d.rp){
if(!navigator.geolocation){alert("La localisation n’est pas disponible sur cet appareil.");return}
showToast("Recherche de votre position…","msg");
navigator.geolocation.getCurrentPosition(async p=>{
const ok=await act("partager_position",{p_rdv:d.rp,p_lat:p.coords.latitude,p_lng:p.coords.longitude});
if(ok)showToast("Position partagée ✓","msg");
},()=>alert("Impossible d’obtenir votre position. Autorisez la localisation dans le navigateur."),{enableHighAccuracy:true,timeout:15000});
return;
}
if(d.rv){
const{data,error}=await sb.rpc("position_autre",{p_rdv:d.rv});
if(error){alert(err(error));return}
if(!data){alert("Votre interlocuteur n’a pas encore partagé sa position.");return}
const mins=Math.max(0,Math.round((Date.now()-new Date(data.t))/60000));
if(confirm("Position partagée il y a "+mins+" min. Ouvrir la carte ?"))window.open("https://www.google.com/maps?q="+data.lat+","+data.lng,"_blank","noopener");
return;
}
if(d.ral){alertId=d.ral;q("#alm").value="";q("#ale").textContent="";q("#dalr").showModal()}
});
q("#algo").onclick=async()=>{
const{error}=await sb.rpc("alerte_rdv",{p_rdv:alertId,p_message:q("#alm").value.trim()||null});
if(error){q("#ale").textContent=err(error);return}
q("#dalr").close();
showToast("Alerte envoyée à l’équipe Finder.","msg");
};
/* Intégration dans la messagerie */
function addButton(){
const tools=q(".ctools");
if(tools&&!tools.querySelector("[data-ct2]")){
tools.insertAdjacentHTML("beforeend",'<button type="button" class="sbtn" data-ct2="rdv">📅 Rendez-vous</button>');
tools.addEventListener("click",e=>{if(e.target.closest("[data-ct2]"))openForm()});
}
}
let wrapped=false;
function wrapLoad(){
if(wrapped)return;
wrapped=true;
addButton();
const L1=window.loadChat;
window.loadChat=async function(){const r=await L1.apply(this,arguments);try{refreshRdv()}catch(e){}return r};
}
when(".ctools",wrapLoad);
setTimeout(wrapLoad,12000);
const C1=window.openChat;
window.openChat=async function(){
const r=await C1.apply(this,arguments);
try{await loadCtx();mapUpd();refreshRdv(true)}catch(e){}
return r;
};
/* Mes rendez-vous */
async function openMine(){
if(!user){q("#da").showModal();return}
if(!q("#dmrd").open)q("#dmrd").showModal();
const box=q("#mrdl");
box.innerHTML="<p class='meta'>Chargement…</p>";
const{data}=await sb.from("rendezvous").select(COLS).in("statut",["propose","confirme"]).gt("quand",new Date(Date.now()-3*36e5).toISOString()).order("quand");
const L=data||[];
if(!L.length){box.innerHTML="<p class='meta'>Aucun rendez-vous prévu. Proposez-en un depuis la messagerie, après avoir échangé avec l’autre personne.</p>";return}
const lids=[...new Set(L.map(r=>r.listing_id))],uids=[...new Set(L.map(r=>r.buyer_id===user.id?r.seller_id:r.buyer_id))];
const[a,b]=await Promise.all([sb.from("listings").select("id,title,city").in("id",lids),sb.from("profils").select("user_id,nom").in("user_id",uids)]);
const T=Object.fromEntries((a.data||[]).map(x=>[x.id,x])),N=Object.fromEntries((b.data||[]).map(x=>[x.user_id,x.nom]));
box.innerHTML=L.map(r=>{
const o=r.buyer_id===user.id?r.seller_id:r.buyer_id,l=T[r.listing_id]||{title:"Annonce",city:""};
CTX.city=CTX.city||l.city;
return'<div class="ord"><b>'+esc(l.title)+'</b> <span class="meta">avec '+esc(N[o]||"—")+"</span>"+card(r)+'<button type="button" class="sbtn pri" data-open="'+r.listing_id+'|'+o+'|'+esc(l.title)+'">💬 Ouvrir la conversation</button></div>';
}).join("");
}
q("#mrdl").addEventListener("click",async e=>{
const o=e.target.closest("[data-open]");
if(o){const p=o.dataset.open.split("|");q("#dmrd").close();openChat(p[0],p[1],p.slice(2).join("|"));return}
const b=e.target.closest("[data-ra],[data-rr],[data-rc]");
if(!b)return;
const d=b.dataset;
if(d.ra){await act("repondre_rdv",{p_rdv:d.ra,p_accepter:true});}
else if(d.rr){if(confirm("Refuser cette proposition ?"))await act("repondre_rdv",{p_rdv:d.rr,p_accepter:false})}
else if(d.rc){if(confirm("Annuler ce rendez-vous ?"))await act("annuler_rdv",{p_rdv:d.rc})}
});
const brdv=document.createElement("button");
brdv.id="brdv";brdv.textContent="Mes rendez-vous";
(q("#boff")||q("#ord")).after(brdv);
brdv.onclick=openMine;
let lastB=0;
async function rdvBadge(force){
if(!user){brdv.textContent="Mes rendez-vous";return}
if(!force&&Date.now()-lastB<15000)return;
lastB=Date.now();
try{
const{data}=await sb.from("rendezvous").select("id,propose_par,statut,quand").in("statut",["propose","confirme"]).gt("quand",new Date().toISOString());
const n=(data||[]).filter(r=>(r.statut==="propose"&&r.propose_par!==user.id)||(r.statut==="confirme"&&new Date(r.quand)-Date.now()<864e5)).length;
brdv.textContent="Mes rendez-vous"+(n?" ("+n+")":"");
}catch(e){}
}
const N0=window.refreshNotifs;
window.refreshNotifs=async function(){const r=await N0.apply(this,arguments);rdvBadge();return r};
const A0=window.applyUI;
window.applyUI=function(){const r=A0.apply(this,arguments);rdvBadge();return r};
/* Alertes dans Modération */
const M1=window.openMod;
window.openMod=async function(){
await M1.apply(this,arguments);
try{
const{data,error}=await sb.rpc("rdv_alertes");
const c=q("#dmc");
if(error||!data||!c||c.querySelector(".rdv-sec"))return;
const pos=p=>p&&p.lat?'<a target="_blank" rel="noopener" href="https://www.google.com/maps?q='+p.lat+","+p.lng+'">position</a>':"—";
c.insertAdjacentHTML("afterbegin",'<div class="rdv-sec"><h3>🚨 Alertes rendez-vous ('+data.length+")</h3>"+(data.length?data.map(x=>'<div class="ord rdvadm"><b>'+esc(x.title)+'</b><br><span class="meta">Alerte de '+esc(x.alerte_par_nom||"?")+" ("+esc(x.alerte_par_email||"")+") · "+new Date(x.alerte_le).toLocaleString("fr-FR")+"</span><br>Acheteur : "+esc(x.acheteur||"?")+" · Vendeur : "+esc(x.vendeur||"?")+"<br>Rendez-vous : "+esc(fq(x.quand))+" · "+esc(x.lieu)+(x.alerte_msg?'<p class="soldnote" style="text-align:left;font-weight:400">'+esc(x.alerte_msg)+"</p>":"")+'<p class="meta">Dernière position acheteur : '+pos(x.alerte_pos&&x.alerte_pos.acheteur)+" · vendeur : "+pos(x.alerte_pos&&x.alerte_pos.vendeur)+'</p><button type="button" class="sbtn pri" data-rt="'+x.id+'">Marquer traitée</button></div>').join(""):"<p class='meta'>Aucune alerte en cours.</p>")+"</div>");
}catch(e){}
};
q("#bmod").onclick=window.openMod;
q("#dmc").addEventListener("click",async e=>{
const b=e.target.closest("[data-rt]");
if(!b)return;
const{error}=await sb.rpc("rdv_alerte_traitee",{p_id:b.dataset.rt});
if(error){alert("Action impossible.");return}
openMod();
});
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment fixer un rendez-vous en sécurité ?</summary><p>Dans la messagerie, appuyez sur « Rendez-vous », choisissez un lieu public, éclairé et fréquenté, de préférence de jour. Vous recevez des rappels, et une heure avant l’heure prévue vous pouvez dire que vous êtes arrivé, partager votre position ou lancer une alerte.</p></details><details><summary>Que fait le bouton Alerte ?</summary><p>Il transmet le rendez-vous et les positions partagées à l’équipe de modération de Finder, sans prévenir l’autre personne. Il ne remplace pas les secours : en danger immédiat, contactez d’abord la police, la gendarmerie ou le SAMU.</p></details>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Finder propose des outils de rendez-vous (rappels, position partagée, alerte) mais ne garantit pas la sécurité d’une rencontre. Les utilisateurs restent responsables de leurs rendez-vous et doivent privilégier des lieux publics.</li>");
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Position partagée pendant un rendez-vous</b> : envoyée volontairement, visible uniquement par l’autre participant autour de l’heure du rendez-vous, et effacée 3 heures après. En cas d’alerte, elle est transmise à la modération.</li>");
}catch(e){}
})();
