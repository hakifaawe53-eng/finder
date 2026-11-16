// Finder - controle.js : contrôle de l'article avant de donner le code de remise
(function(){
if(window.__finderControle)return;window.__finderControle=1;
const q=s=>document.querySelector(s);
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const s=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const st=document.createElement("style");
st.textContent=".ctlrow{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #EEF3F3}.ctlrow input{width:auto;margin-top:4px}.ctlcode{text-align:center;font-size:1.8rem;letter-spacing:.25em;color:#007782;font-weight:800;margin:10px 0}";
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dctl"><h2>📋 Contrôle avant remise</h2><p class="vstep">Après avoir donné votre code, le paiement au vendeur est <b>immédiat et définitif</b>. Contrôlez tout <b>avant</b>.</p><div id="ctll"></div><p class="err" id="ctle"></p><div id="ctlr"></div><div class="row"><button type="button" class="pri" id="ctlok" disabled>✅ Tout est conforme : afficher mon code</button></div><div class="row"><button type="button" id="ctlpb">⚠️ Il y a un problème : signaler</button><button type="button" data-x>Fermer</button></div></dialog>');
const d=q("#dctl");
d.querySelector("[data-x]").onclick=()=>d.close();
const BASE=["L’article correspond aux photos et à la description","Les accessoires annoncés sont présents","Je suis satisfait(e) : je ne demande ni échange ni remboursement"];
const CAT={
"Téléphones":["J’ai allumé le téléphone : l’écran s’affiche normalement, sans tache ni fissure cachée","Je tape *#06# : les 4 derniers chiffres de l’IMEI sont bien ‹FIN›","Le téléphone n’est verrouillé ni par un code ni par un compte (Google, iCloud)","Boutons, caméras, haut-parleur, micro et charge fonctionnent"],
"Informatique":["J’ai allumé l’appareil : il démarre normalement et l’écran est en bon état","Le numéro de série se termine bien par ‹FIN›","Clavier, ports, batterie et chargeur fonctionnent","L’appareil n’est pas verrouillé par un mot de passe ou un compte"],
"Électronique":["J’ai allumé l’appareil : il fonctionne normalement","Ports, boutons, son et image fonctionnent","Les câbles et accessoires d’origine sont là"],
"Véhicules et motos":["Le numéro de châssis ou la plaque se termine bien par ‹FIN›","Les papiers (carte grise) sont présents et au nom du vendeur","Le moteur démarre, les freins et les feux fonctionnent","J’ai fait un essai"],
"Vêtements":["Taille et étiquette conformes à l’annonce","Pas de tache, de trou ni d’usure cachée"],
"Chaussures":["Pointure conforme à l’annonce","Semelles, coutures et fermetures en bon état"],
"Meubles":["Dimensions et matière conformes à l’annonce","Pas de pièce cassée, de moisissure ni de défaut caché"],
"Électroménager":["L’appareil s’allume et fonctionne normalement","Pas de fuite, de bruit anormal ni d’odeur suspecte","Câble et accessoires présents"],
"Bébé et enfants":["Aucune pièce cassée ou dangereuse","Étiquette, taille ou âge conformes à l’annonce"]
};
let cur=null;
function mask(card){
const rc=card.querySelector(".rcode");
if(!rc||rc.dataset.ctl)return;
const b=rc.querySelector("b"),ok=card.querySelector("[data-ok]");
if(!b||!ok)return;
const id=ok.dataset.ok;
rc.dataset.ctl="1";rc.dataset.id=id;rc.dataset.code=b.textContent;
if(g("finder_ctl_"+id)==="1")return;
b.textContent="••• •••";
rc.insertAdjacentHTML("beforeend",'<button type="button" class="sbtn pri" data-ctl="'+id+'">📋 Contrôler l’article avant de voir mon code</button>');
}
function scan(){document.querySelectorAll("#ol .ord").forEach(mask)}
new MutationObserver(scan).observe(q("#ol"),{childList:true,subtree:true});
async function openCtl(id){
cur=id;
q("#ctll").innerHTML="<p class='meta'>Chargement…</p>";
q("#ctlr").innerHTML="";q("#ctle").textContent="";
q("#ctlok").disabled=true;
d.showModal();
let info=null;
try{const r=await sb.rpc("numero_fin",{p_commande:id});info=r.data}catch(e){}
const cat=info&&info.categorie,fin=info&&info.fin;
const items=BASE.slice();
(CAT[cat]||[]).forEach(t=>{
if(t.includes("‹FIN›")){if(fin)items.unshift(t.replace("‹FIN›","**** "+fin))}
else items.splice(items.length-3,0,t);
});
q("#ctll").innerHTML=items.map((t,i)=>'<label class="ctlrow"><input type="checkbox" data-i="'+i+'"><span>'+esc(t)+"</span></label>").join("");
}
q("#ctll").addEventListener("change",()=>{
const all=[...q("#ctll").querySelectorAll("input")];
q("#ctlok").disabled=!(all.length&&all.every(x=>x.checked));
});
q("#ctlok").onclick=()=>{
if(!cur)return;
s("finder_ctl_"+cur,"1");
const rc=document.querySelector('#ol .rcode[data-id="'+cur+'"]');
const code=rc?rc.dataset.code:"";
q("#ctlr").innerHTML='<p class="meta">Voici votre code. Donnez-le au vendeur maintenant, pas avant :</p><div class="ctlcode">'+esc(code)+"</div>";
q("#ctlok").disabled=true;
if(rc){const b=rc.querySelector("b");if(b)b.textContent=code;const btn=rc.querySelector("[data-ctl]");if(btn)btn.remove()}
};
q("#ctlpb").onclick=()=>{
const id=cur;
d.close();
const b=document.querySelector('#ol [data-pb="'+id+'"]');
if(b)b.click();
};
document.addEventListener("click",e=>{
const b=e.target.closest("[data-ctl]");
if(b)openCtl(b.dataset.ctl);
});
scan();
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Pourquoi mon code de remise est-il masqué ?</summary><p>Pour vous inciter à contrôler l’article avant de donner votre code : une fois le code donné, le vendeur est payé immédiatement. Appuyez sur « Contrôler l’article », cochez chaque vérification, puis votre code s’affiche. Pour un téléphone, vous comparez aussi les 4 derniers chiffres de l’IMEI (tapez *#06#).</p></details>");
}catch(e){}
})();
