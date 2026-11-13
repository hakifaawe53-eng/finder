// Finder - remise.js : code de remise en main propre
(function(){
if(window.__finderRemise)return;window.__finderRemise=1;
const q=s=>document.querySelector(s);
const st=document.createElement("style");
st.textContent=`
.rcode{background:#EEF8F7;border:1px dashed #00A39A;border-radius:14px;padding:10px 12px;margin:10px 0;text-align:center}
.rcode b{display:block;font-size:1.7rem;letter-spacing:.25em;color:#007782;margin:2px 0}
.rcode small{color:#6A7B84}
.rval{background:#F3F8F8;border-radius:14px;padding:10px 12px;margin:10px 0}
.rval input{letter-spacing:.2em;text-align:center;font-size:1.1rem}
`;
document.head.appendChild(st);
async function decorate(){
const cards=[...document.querySelectorAll("#ol .ord")];
if(!cards.length)return;
if(acct==="client"){
const ids=cards.map(c=>{const b=c.querySelector("[data-ok]");return b&&b.dataset.ok}).filter(Boolean);
if(!ids.length)return;
const{data}=await sb.from("codes_remise").select("commande_id,code").in("commande_id",ids);
const M=Object.fromEntries((data||[]).map(x=>[x.commande_id,x.code]));
cards.forEach(c=>{
const b=c.querySelector("[data-ok]");
if(!b||c.querySelector(".rcode"))return;
const code=M[b.dataset.ok];
if(!code)return;
const html='<div class="rcode"><small>🔑 Votre code de remise</small><b>'+esc(String(code).replace(/(\d{3})(\d{3})/,"$1 $2"))+"</b><small>Donnez-le au vendeur uniquement quand vous avez reçu l’article. Ne le partagez jamais avant.</small></div>";
const m=c.querySelector(".ordmsg");
if(m)m.insertAdjacentHTML("afterend",html);else c.insertAdjacentHTML("beforeend",html);
});
}else{
cards.forEach(c=>{
const b=c.querySelector("[data-no]");
if(!b||c.querySelector(".rval"))return;
b.insertAdjacentHTML("beforebegin",'<div class="rval"><label>🔑 Code de remise</label><p class="meta">Demandez le code à 6 chiffres à l’acheteur au moment de la remise : le paiement est versé dès qu’il est validé.</p><input inputmode="numeric" maxlength="7" placeholder="6 chiffres" autocomplete="off"><p class="err"></p><button type="button" class="sbtn pri" data-vc="'+b.dataset.no+'">Valider la remise</button></div>');
});
}
}
const O1=window.openOrders;
window.openOrders=async function(){
await O1.apply(this,arguments);
try{await decorate()}catch(e){}
};
q("#ord").onclick=window.openOrders;
document.addEventListener("click",async e=>{
const b=e.target.closest("[data-vc]");
if(!b)return;
const box=b.closest(".rval"),m=box.querySelector(".err");
const code=box.querySelector("input").value.replace(/\D/g,"");
if(code.length!==6){m.textContent="Entrez les 6 chiffres du code.";return}
m.textContent="Vérification…";
const{data,error}=await sb.rpc("valider_code_remise",{p_commande:b.dataset.vc,p_code:code});
if(error){m.textContent=err(error);return}
if(data==="ok"){
alert("Remise validée ✓ Le paiement est versé dans votre porte-monnaie.");
await loadWallet();applyUI();openOrders();load();refreshNotifs();
return;
}
m.textContent={incorrect:"Code incorrect. Vérifiez-le avec l’acheteur.",bloque:"Trop d’essais. Réessayez dans 1 heure.",indisponible:"Aucun code pour cette commande. Demandez à l’acheteur de confirmer la réception."}[data]||"Validation impossible.";
});
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Qu’est-ce que le code de remise ?</summary><p>À chaque achat, vous recevez un code à 6 chiffres dans « Mes achats ». Donnez-le au vendeur uniquement quand vous avez l’article en main : il le saisit dans « Mes ventes » et il est payé. Ne partagez jamais ce code avant d’avoir reçu l’article.</p></details>");
const hb=hBy("#dt","Paiements et protection acheteur");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Le code de remise est personnel à l’acheteur. Le vendeur qui le saisit déclenche le paiement : l’acheteur ne doit le communiquer qu’après réception de l’article.</li>");
}catch(e){}
})();
