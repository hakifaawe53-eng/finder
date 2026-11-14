// Finder - litiges.js : écran Litiges dans Modération
(function(){
if(window.__finderLitiges)return;window.__finderLitiges=1;
const q=s=>document.querySelector(s);
const st=document.createElement("style");
st.textContent=".lit{border-left:5px solid #E5484D}";
document.head.appendChild(st);
const fdt=ts=>new Date(ts).toLocaleString("fr-FR",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const LV={nouvelle:"Commande reçue",en_preparation:"En préparation",expediee:"Expédiée",en_livraison:"En livraison",livree:"Livrée"};
async function section(){
const{data,error}=await sb.rpc("file_litiges");
if(error)return"";
const L=data||[];
return"<h3>⚖️ Litiges ("+L.length+")</h3>"+(L.length?L.map(o=>{
const motif=Object.keys(o).filter(k=>/motif|litige/i.test(k)&&typeof o[k]==="string"&&o[k]).map(k=>o[k])[0]||"";
const lv=o.liv;
const frais=o.frais_acheteur||0;
return'<div class="ord lit"><b>'+esc(o.titre)+"</b> · "+fcfa(o.montant)+' <span class="meta">(+ '+fcfa(frais)+' de protection)</span><br><span class="meta">Acheteur : '+esc(o.acheteur)+" · Vendeur : "+esc(o.vendeur)+(o.boutique?" ("+esc(o.boutique)+")":"")+"<br>Commande du "+fdt(o.created_at)+" · Livraison : "+esc(LV[o.livraison]||o.livraison)+(o.livraison_maj?" ("+fdt(o.livraison_maj)+")":"")+"</span>"+(motif?'<p class="soldnote" style="text-align:left;font-weight:400"><b>Motif :</b> '+esc(motif)+"</p>":"")+(lv?'<p class="meta">Livraison à : '+esc(lv.nom)+" · "+esc(lv.telephone)+" · "+esc(lv.quartier)+", "+esc(lv.commune)+", "+esc(lv.ville)+"</p>":"")+'<button type="button" class="sbtn del" data-lr="'+o.id+'" data-m="'+(o.montant+frais)+'">↩️ Rembourser l’acheteur</button><button type="button" class="sbtn pri" data-lp="'+o.id+'" data-m="'+o.montant+'">💸 Payer le vendeur</button></div>';
}).join(""):"<p class='meta'>Aucun litige en cours.</p>");
}
const M1=window.openMod;
window.openMod=async function(){
await M1.apply(this,arguments);
try{
const html=await section();
const c=q("#dmc");
if(c&&html&&!c.querySelector(".lit-sec"))c.insertAdjacentHTML("afterbegin",'<div class="lit-sec">'+html+"</div>");
}catch(e){}
};
q("#bmod").onclick=window.openMod;
q("#dmc").addEventListener("click",async e=>{
const r=e.target.closest("[data-lr]"),p=e.target.closest("[data-lp]");
if(!r&&!p)return;
const b=r||p,id=r?r.dataset.lr:p.dataset.lp;
const msg=r?"Rembourser "+fcfa(+b.dataset.m)+" à l’acheteur (protection comprise) ? Le vendeur ne sera pas payé. Cette action est définitive.":"Payer "+fcfa(+b.dataset.m)+" au vendeur ? L’acheteur ne sera pas remboursé. Cette action est définitive.";
if(!confirm(msg))return;
const{error}=await sb.rpc("decider_litige",{p_id:id,p_decision:r?"rembourser":"liberer"});
if(error){alert((error.message||"").includes("deja")?"Ce litige est déjà traité.":"Décision impossible : "+(error.message||"erreur"));return}
showToast(r?"Acheteur remboursé ✓":"Vendeur payé ✓","msg");
openMod();
});
})();
