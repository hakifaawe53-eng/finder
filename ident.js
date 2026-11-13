// Finder - ident.js : identifiant personnel de chaque boutique
(function(){
if(window.__finderIdent)return;window.__finderIdent=1;
const q=s=>document.querySelector(s);
Object.assign(ERR,{"identifiant invalide":"Identifiant invalide : 3 à 20 caractères, lettres minuscules, chiffres et _.","identifiant reserve":"Cet identifiant est réservé. Choisissez-en un autre.","identifiant verrouille":"L’identifiant ne peut être modifié qu’une fois tous les 30 jours.","identifiant pris":"Cet identifiant est déjà pris. Choisissez-en un autre."});
const st=document.createElement("style");
st.textContent=".sp-handle{color:#6A7B84;font-weight:600;font-size:.9rem;margin-top:2px}.idrow{display:flex;align-items:center;gap:6px}.idrow span{font-weight:800;color:#007782;font-size:1.1rem}.idrow input{flex:1}.hid{color:#6A7B84;font-size:.85rem}";
document.head.appendChild(st);
const handleOf=u=>(user&&u===user.id&&myShop&&myShop.identifiant)||(shops[u]&&shops[u].identifiant)||"";
/* Affichage sur la page boutique */
const sh=q("#shophd");
new MutationObserver(()=>{
const h2=sh.querySelector(".sp-id h2")||sh.querySelector("h2");
if(!h2||sh.querySelector(".sp-handle"))return;
const h=handleOf(sellerId);
if(h)h2.insertAdjacentHTML("afterend",'<div class="sp-handle">@'+esc(h)+"</div>");
}).observe(sh,{childList:true});
/* Affichage dans la fiche d'un article */
const S5=window.show;
window.show=function(i){
const r=S5.apply(this,arguments);
try{
const b=shops[i.user_id],s=q("#dc .seller");
if(b&&b.identifiant&&s&&!s.querySelector(".hid"))s.insertAdjacentHTML("beforeend",' <span class="hid">@'+esc(b.identifiant)+"</span>");
}catch(e){}
return r;
};
/* Recherche par @identifiant */
document.addEventListener("submit",async e=>{
if(e.target.id!=="f")return;
const v=q("#q").value.trim();
if(!/^@[a-zA-Z0-9_]{1,20}$/.test(v))return;
e.preventDefault();e.stopImmediatePropagation();
const h=v.slice(1).toLowerCase();
const{data}=await sb.from("boutiques").select("user_id").eq("identifiant",h).maybeSingle();
if(!data){q("#msg").textContent="Aucune boutique avec l’identifiant @"+h+".";return}
q("#q").value="";
sellerId=data.user_id;mode="seller";labels();load();window.scrollTo(0,0);
},true);
/* Lien personnalisé ?s=identifiant */
async function deepS(){
const s=new URLSearchParams(location.search).get("s");
if(!s||!/^[a-zA-Z0-9_]{3,20}$/.test(s))return;
history.replaceState(null,"",location.pathname);
const{data}=await sb.from("boutiques").select("user_id").eq("identifiant",s.toLowerCase()).maybeSingle();
if(!data){showToast("Boutique introuvable.","msg");return}
sellerId=data.user_id;mode="seller";labels();load();
}
function waitReady(cb){let n=0;const iv=setInterval(()=>{const m=q("#msg");if((m&&m.textContent!=="Chargement…")||++n>30){clearInterval(iv);cb()}},200)}
setTimeout(()=>waitReady(deepS),1500);
/* Partage avec le lien personnalisé */
document.addEventListener("click",e=>{
const b=e.target.closest(".shwb,.shcb");
if(!b)return;
const u=b.dataset.u,h=handleOf(u);
if(!h)return;
e.stopImmediatePropagation();e.preventDefault();
const link=location.origin+"/?s="+h;
if(b.classList.contains("shcb")){
try{navigator.clipboard.writeText(link).then(()=>showToast("Lien copié ✓","msg")).catch(()=>prompt("Copiez ce lien :",link))}catch(x){prompt("Copiez ce lien :",link)}
}else{
const nm=(shops[u]&&shops[u].nom)||(myShop&&myShop.nom)||"Boutique";
window.open("https://wa.me/?text="+encodeURIComponent("🏪 "+nm+" (@"+h+") sur Finder\nDécouvrez tous les articles de la boutique :\n"+link),"_blank","noopener");
}
},true);
/* Section dans « Ma boutique » */
const dbq=q("#dbq"),bqx=q("#bqx");
const panel=document.createElement("div");
panel.id="idp";
panel.innerHTML='<h3>🆔 Identifiant de la boutique</h3><p class="meta">Votre identifiant unique et personnel. Les acheteurs peuvent vous retrouver en tapant @votre_identifiant dans la recherche.</p><label>Identifiant</label><div class="idrow"><span>@</span><input id="idin" maxlength="20" autocapitalize="off" autocomplete="off" spellcheck="false"></div><p class="meta" id="idm"></p><p class="err" id="ide" role="alert"></p><button type="button" class="sbtn pri" id="idsave">Enregistrer l’identifiant</button>';
bqx.insertBefore(panel,bqx.firstChild);
let tmr=null;
function renderId(){
const s=myShop;
if(!s)return;
const inp=q("#idin"),m=q("#idm");
q("#ide").textContent="";
inp.value=s.identifiant||"";
const free=s.identifiant_modifie_le?new Date(s.identifiant_modifie_le).getTime()+30*864e5:0;
const locked=Date.now()<free;
inp.disabled=locked;q("#idsave").disabled=locked;
m.className="meta";
m.textContent=locked?"🔒 Vous pourrez changer votre identifiant à partir du "+new Date(free).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})+".":(s.identifiant_modifie_le?"Un identifiant peut être changé une fois tous les 30 jours.":"Vous pouvez personnaliser votre identifiant gratuitement une première fois. Ensuite, un seul changement tous les 30 jours.");
}
q("#idin").addEventListener("input",e=>{
const v=e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,"").slice(0,20);
e.target.value=v;
clearTimeout(tmr);
const m=q("#idm");
if(v.length<3){m.className="meta";m.textContent="3 à 20 caractères : lettres minuscules, chiffres et _.";return}
tmr=setTimeout(async()=>{
const{data}=await sb.rpc("verifier_identifiant",{p_id:v});
if(q("#idin").value!==v)return;
const t={ok:"✓ @"+v+" est disponible",pris:"✗ Cet identifiant est déjà pris",reserve:"✗ Cet identifiant est réservé",invalide:"✗ Format invalide"}[data]||"";
m.className=data==="ok"?"ok":"err";
m.textContent=t;
},400);
});
q("#idsave").onclick=async()=>{
const e=q("#ide");
e.textContent="";
const v=q("#idin").value.trim();
if(v.length<3){e.textContent=err({message:"identifiant invalide"});return}
const{error}=await sb.rpc("changer_identifiant",{p_id:v});
if(error){e.textContent=err(error);return}
await loadMyShop();
renderId();
load();
showToast("Identifiant enregistré ✓","msg");
};
const onShop=()=>{if(dbq.open&&!bqx.hidden)renderId()};
new MutationObserver(onShop).observe(dbq,{attributes:true,attributeFilter:["open"]});
new MutationObserver(onShop).observe(bqx,{attributes:true,attributeFilter:["hidden"]});
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Qu’est-ce que l’identifiant de ma boutique ?</summary><p>C’est un nom unique, par exemple @maboutique, qui identifie votre boutique. Les acheteurs peuvent la retrouver en le tapant dans la recherche. Vous pouvez le personnaliser dans « Ma boutique » : le premier changement est libre, puis un seul changement tous les 30 jours.</p></details>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>L’identifiant d’une boutique est unique. Il est interdit d’en choisir un qui imite Finder, son équipe ou une autre boutique. Finder peut le modifier en cas d’usurpation ou de contenu inapproprié.</li>");
}catch(e){}
})();
