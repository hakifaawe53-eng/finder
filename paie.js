// Finder - paie.js : paiements réels (recharge Mobile Money, demandes de retrait)
(function(){
if(window.__finderPaie)return;window.__finderPaie=1;
const q=s=>document.querySelector(s);
Object.assign(TT,{recharge:"Recharge Mobile Money",retrait:"Retrait Mobile Money",retrait_annule:"Retrait annulé"});
Object.assign(ERR,{
"paiements non actives":"Les paiements réels ne sont pas encore activés.",
"montant invalide":"Montant invalide : multiple de 5 FCFA, dans les limites autorisées.",
"plafond recharge":"Limite de recharge sur 24 heures atteinte.",
"plafond retrait":"Limite de retrait sur 24 heures atteinte.",
"trop de paiements":"Trop de demandes en cours. Réessayez plus tard.",
"paiement indisponible":"Le paiement est momentanément indisponible. Réessayez dans quelques minutes.",
"identite requise":"Vérifiez d’abord votre identité (menu : Vérifier mon identité) pour retirer de l’argent.",
"tel invalide":"Numéro Mobile Money invalide : 10 chiffres.",
"operateur invalide":"Choisissez un opérateur.",
"retrait introuvable":"Demande introuvable ou déjà traitée."
});
let ST=null;
async function etat(){
try{const r=await sb.rpc("paiements_etat");ST=r.data||null}catch(e){ST=null}
return ST;
}
const st=document.createElement("style");
st.textContent=".pchip{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.pchip button{padding:7px 12px;font-size:.85rem}.pst{border-radius:999px;padding:1px 9px;font-size:.72rem;font-weight:700}.pst.ok{background:#E3F8EE;color:#0F8A55}.pst.att{background:#FFF4E5;color:#B45309}.pst.ko{background:#FFF4F4;color:#D92D20}";
document.head.appendChild(st);
const f=q("#wf"),wi=q("#wi");
wi.insertAdjacentHTML("beforebegin",'<div class="rw pchip" id="wchips" hidden>'+[1000,2000,5000,10000,25000].map(v=>'<button type="button" data-pv="'+v+'">'+fcfa(v)+"</button>").join("")+"</div>");
wi.insertAdjacentHTML("afterend",'<div class="rw" id="wsell" hidden><label>Numéro Mobile Money (10 chiffres)</label><input id="wtel" inputmode="numeric" maxlength="16" placeholder="07 00 00 00 00" autocomplete="tel"><label>Opérateur</label><select id="wop"><option value="orange">Orange Money</option><option value="mtn">MTN MoMo</option><option value="moov">Moov Money</option><option value="wave">Wave</option></select></div><p class="meta rw" id="wnote" hidden></p>');
f.insertAdjacentHTML("afterend",'<div id="wpay" hidden><h3>Mes paiements</h3><div id="wpl"></div></div>');
const fee=n=>Math.round(n*(+(ST&&ST.frais_pct)||0)/100)+(+(ST&&ST.frais_fixe)||0);
function note(){
const s=ST,el=q("#wnote");
if(!s||!s.reels){el.hidden=true;return}
const sell=acct==="vendeur",n=parseInt(wi.value,10)||0;
if(sell){
const fr=n?fee(n):0;
el.textContent="Retrait traité sous 24 heures ouvrées vers votre Mobile Money. Identité vérifiée obligatoire. Minimum "+fcfa(s.retrait_min)+", maximum "+fcfa(s.retrait_jour)+" par jour."+(n?" Vous recevrez "+fcfa(Math.max(0,n-fr))+(fr?" (frais : "+fcfa(fr)+")":"")+".":"");
}else el.textContent="Vous serez redirigé vers la page de paiement sécurisée (Orange Money, MTN, Moov, Wave). De "+fcfa(s.recharge_min)+" à "+fcfa(s.recharge_max)+" par recharge.";
el.hidden=false;
}
const SL={en_attente:["En attente","att"],reussi:["Réussi","ok"],echoue:["Échoué","ko"],annule:["Annulé","ko"],rejete:["Rejeté","ko"]};
async function list(){
const sell=acct==="vendeur";
const{data}=await sb.from("paiements").select("id,type,montant,frais,statut,ref,url,telephone,operateur,cree_le").eq("type",sell?"retrait":"recharge").order("cree_le",{ascending:false}).limit(10);
const L=data||[];
q("#wpl").innerHTML=L.length?L.map(p=>{
const s=SL[p.statut]||[p.statut,"att"];
let a="";
if(p.statut==="en_attente"){
a=p.type==="recharge"?(p.url?'<a class="sbtn" target="_blank" rel="noopener" href="'+esc(p.url)+'">💳 Payer</a>':"")+'<button type="button" class="sbtn" data-pv2="'+esc(p.ref)+'">🔄 Vérifier</button>':'<button type="button" class="sbtn" data-pc="'+p.id+'">Annuler la demande</button>';
}
return'<div class="tx"><b>'+fcfa(p.montant)+'</b> <span class="pst '+s[1]+'">'+s[0]+"</span>"+(p.type==="retrait"?' <span class="meta">→ '+esc(p.telephone||"")+" ("+esc(p.operateur||"")+")</span>":"")+'<br><span class="meta">'+new Date(p.cree_le).toLocaleString("fr-FR")+"</span><br>"+a+"</div>";
}).join(""):"<p class='meta'>Aucun paiement pour l’instant.</p>";
}
async function decor(){
const s=await etat();
const real=!!(s&&s.reels),sell=acct==="vendeur";
document.querySelectorAll("#dw .testnote").forEach(e=>{e.hidden=real});
f.querySelectorAll(".rw").forEach(e=>{e.hidden=true});
q("#wpay").hidden=!real;
if(!real)return;
q("#wchips").hidden=sell;
q("#wsell").hidden=!sell;
q("#wbtn").textContent=sell?"Demander le retrait":"Payer par Mobile Money";
wi.placeholder=sell?"Montant à retirer (FCFA)":"Montant à recharger (FCFA)";
wi.step=5;
note();
await list();
}
const W0=window.renderWallet;
window.renderWallet=async function(){
await W0.apply(this,arguments);
try{await decor()}catch(e){}
};
wi.addEventListener("input",note);
q("#wchips").addEventListener("click",e=>{
const b=e.target.closest("[data-pv]");
if(b){wi.value=b.dataset.pv;note()}
});
q("#wpay").addEventListener("click",async e=>{
const v=e.target.closest("[data-pv2]"),c=e.target.closest("[data-pc]"),m=q("#wm");
if(v){
m.textContent="Vérification…";
const{data,error}=await sb.rpc("verifier_paiement",{p_ref:v.dataset.pv2});
if(error){m.textContent=err(error);return}
m.textContent=data.statut==="reussi"?"✅ Paiement confirmé.":data.statut==="en_attente"?"Paiement pas encore confirmé par l’opérateur.":"Le paiement n’a pas abouti.";
await loadWallet();applyUI();await renderWallet();
return;
}
if(c){
if(!confirm("Annuler cette demande de retrait ? Le montant sera remis dans votre porte-monnaie."))return;
const{error}=await sb.rpc("annuler_retrait",{p_id:c.dataset.pc});
if(error){m.textContent=err(error);return}
m.textContent="Demande annulée.";
await loadWallet();applyUI();await renderWallet();
}
});
f.onsubmit=async e=>{
e.preventDefault();
const m=q("#wm"),n=parseInt(wi.value,10),s=ST;
if(!s||!s.reels){
if(!n||n<=0){m.textContent="Entrez un montant valide.";return}
m.textContent="Un instant…";
const{error}=await sb.rpc(acct==="client"?"recharger_test":"retirer_test",{p_montant:n});
if(error){m.textContent=err(error);return}
wi.value="";await loadWallet();applyUI();m.textContent="";await renderWallet();refreshNotifs();
return;
}
if(acct==="client"){
if(!n||n%5||n<s.recharge_min||n>s.recharge_max){m.textContent="Montant de "+fcfa(s.recharge_min)+" à "+fcfa(s.recharge_max)+", multiple de 5.";return}
m.textContent="Création du paiement…";
const{data,error}=await sb.rpc("creer_recharge",{p_montant:n});
if(error){m.textContent=err(error);return}
m.textContent="Redirection vers le paiement sécurisé…";
location.href=data.url;
return;
}
const tel=q("#wtel").value.replace(/\D/g,"");
if(!n||n%5||n<s.retrait_min){m.textContent="Montant minimum : "+fcfa(s.retrait_min)+" (multiple de 5).";return}
if(tel.length<10){m.textContent="Entrez votre numéro Mobile Money (10 chiffres).";return}
if(!confirm("Retirer "+fcfa(n)+" vers le "+tel+" ("+q("#wop").selectedOptions[0].text+") ? Vous recevrez "+fcfa(Math.max(0,n-fee(n)))+"."))return;
m.textContent="Envoi de la demande…";
const{error}=await sb.rpc("demander_retrait",{p_montant:n,p_tel:tel,p_operateur:q("#wop").value});
if(error){m.textContent=err(error);return}
wi.value="";
await loadWallet();applyUI();await renderWallet();
m.textContent="✅ Demande envoyée. Vous serez prévenu dès que le retrait est payé.";
refreshNotifs();
};
async function retour(){
const p=new URLSearchParams(location.search).get("paiement"),ref=p&&/FND[0-9a-f]{20}/.exec(p);
if(!ref)return;
history.replaceState(null,"",location.pathname);
let n=0;
while(!user&&n++<40)await new Promise(r=>setTimeout(r,250));
if(!user){q("#da").showModal();return}
await openWallet();
const m=q("#wm");
m.textContent="Vérification du paiement…";
for(let i=0;i<12;i++){
const{data}=await sb.rpc("verifier_paiement",{p_ref:ref[0]});
if(data&&data.statut==="reussi"){await loadWallet();applyUI();await renderWallet();m.textContent="✅ Paiement confirmé : votre porte-monnaie a été rechargé.";return}
if(data&&(data.statut==="echoue"||data.statut==="annule")){m.textContent="Le paiement n’a pas abouti. Vous n’avez pas été débité.";return}
await new Promise(r=>setTimeout(r,5000));
}
m.textContent="Paiement en cours de confirmation. Votre solde sera mis à jour dès que l’opérateur confirme : vous pouvez fermer cette fenêtre.";
}
setTimeout(retour,2000);
etat();
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Porte-monnaie");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment recharger mon porte-monnaie ?</summary><p>Ouvrez « Porte-monnaie », choisissez un montant et payez par Mobile Money (Orange Money, MTN, Moov, Wave) sur la page sécurisée. Votre solde est mis à jour dès que l’opérateur confirme.</p></details><details><summary>Comment retirer mon argent ? (vendeurs)</summary><p>Après vérification de votre identité, ouvrez « Porte-monnaie » en compte vendeur, indiquez votre numéro Mobile Money et le montant. La demande est payée sous 24 heures ouvrées. Vous pouvez l’annuler tant qu’elle n’est pas payée.</p></details>");
const hb=hBy("#dt","Paiements et protection acheteur");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Les recharges se font par Mobile Money via un prestataire de paiement. Les retraits des vendeurs nécessitent une identité vérifiée, sont plafonnés par jour et traités sous 24 heures ouvrées. Des frais peuvent s’appliquer et sont indiqués avant validation.</li>");
}catch(e){}
})();
