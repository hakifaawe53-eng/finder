// Finder - delai.js : délais automatiques (litige après livraison, remboursement si le vendeur n'avance pas)
(function(){
if(window.__finderDelai)return;window.__finderDelai=1;
const q=s=>document.querySelector(s);
const REGLE=new Date("2026-11-14T00:00:00Z").getTime();
const J=864e5,LITIGE=7,REMB=10;
const fd=ts=>new Date(ts).toLocaleDateString("fr-FR",{day:"numeric",month:"long"});
async function decorate(){
const map=new Map();
document.querySelectorAll("#ol .ord").forEach(c=>{
const b=c.querySelector("[data-ok],[data-no]");
if(b)map.set(b.dataset.ok||b.dataset.no,c);
});
if(!map.size)return;
const{data}=await sb.from("commandes").select("id,statut,livraison,livraison_maj,created_at").in("id",[...map.keys()]);
(data||[]).forEach(o=>{
const c=map.get(o.id);
if(!c||c.querySelector(".autol"))return;
if(o.statut!=="paye"||new Date(o.created_at).getTime()<REGLE)return;
const buyer=acct==="client";
let txt="";
if(o.livraison==="livree"){
if(!o.livraison_maj)return;
const lim=new Date(o.livraison_maj).getTime()+LITIGE*J;
txt=buyer?"Livraison déclarée le "+fd(o.livraison_maj)+". Sans code de remise ni signalement de votre part d’ici le "+fd(lim)+", Finder ouvrira automatiquement un litige.":"Livraison déclarée le "+fd(o.livraison_maj)+". Si l’acheteur ne donne pas son code d’ici le "+fd(lim)+", un litige s’ouvrira automatiquement : gardez vos preuves de livraison.";
}else{
const lim=new Date(o.livraison_maj||o.created_at).getTime()+REMB*J;
txt=buyer?"Le vendeur doit faire avancer la livraison. Sans avancement d’ici le "+fd(lim)+", votre commande sera annulée et vous serez remboursé automatiquement.":"Faites avancer le statut de livraison. Sans avancement d’ici le "+fd(lim)+", la commande sera annulée et l’acheteur remboursé automatiquement.";
}
const html='<p class="meta autol">⏳ '+txt+"</p>";
const m=c.querySelector(".ordmsg");
if(m)m.insertAdjacentHTML("afterend",html);else c.insertAdjacentHTML("beforeend",html);
});
}
const O2=window.openOrders;
window.openOrders=async function(){
await O2.apply(this,arguments);
try{await decorate()}catch(e){}
};
q("#ord").onclick=window.openOrders;
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Que se passe-t-il si je ne donne pas mon code après la livraison ?</summary><p>Si le vendeur indique avoir livré, vous recevez un rappel au bout de 3 jours. Sans code de remise ni signalement de votre part au bout de 7 jours, Finder ouvre automatiquement un litige : votre argent reste bloqué le temps de l’examen.</p></details><details><summary>Que se passe-t-il si le vendeur ne livre pas ?</summary><p>Si le vendeur ne fait pas avancer la livraison pendant 10 jours, la commande est annulée et vous êtes remboursé automatiquement, protection acheteur comprise. Vous êtes prévenu avant.</p></details>");
const hb=hBy("#dt","Paiements et protection acheteur");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Lorsque le vendeur a indiqué avoir livré, l’acheteur reçoit un rappel au bout de 3 jours ; sans code de remise ni signalement au bout de 7 jours, Finder ouvre automatiquement un litige et les fonds restent bloqués pendant l’examen.</li><li>Si le vendeur ne fait pas avancer le statut de livraison pendant 10 jours, la commande est annulée et l’acheteur est remboursé automatiquement.</li>");
}catch(e){}
})();
