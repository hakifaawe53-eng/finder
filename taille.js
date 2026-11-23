// Finder - taille.js : taille des vêtements
(function(){
if(window.__finderTaille)return;window.__finderTaille=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
const sc=q("#sc"),sf=q("#sf");
if(!sc||!sf)return;
const CAT="Vêtements";
Object.assign(ERR,{"taille invalide":"Indiquez une taille valide (20 caractères maximum)."});
const LET=["XXS","XS","S","M","L","XL","XXL","3XL","4XL"],EU=["34","36","38","40","42","44","46","48","50","52","54"];
const st=document.createElement("style");
st.textContent=`
.szg{margin:6px 0}
.szh{display:block;color:#6A7B84;font-size:.78rem;margin:8px 0 4px}
.szr{display:flex;flex-wrap:wrap;gap:6px}
.szc{border:1.5px solid #E2EBEB;background:#fff;color:#12212B;border-radius:999px;padding:7px 14px;font-weight:600;min-width:46px}
.szc.on{background:linear-gradient(135deg,#00A39A,#007782);color:#fff;border-color:transparent}
.szo{margin-top:8px}
.szo[hidden]{display:none}
.szp{display:inline-block;background:#E8F6F5;color:#005961;border-radius:999px;padding:4px 12px;margin:6px 0;font-size:.9rem}
.tszc{display:inline-block;background:#E8F6F5;color:#005961;border-radius:999px;padding:1px 8px;font-size:.72rem;font-weight:600;margin-top:4px}
#vtz{margin:8px 0}
@keyframes szerr{0%,100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}30%{box-shadow:0 0 0 6px rgba(229,72,77,.35)}}
#vtz.szerr{border-radius:14px;animation:szerr 1.8s ease 1}
`;
document.head.appendChild(st);
function chips(){
const b=(v,t)=>'<button type="button" class="szc" data-v="'+v+'">'+(t||v)+"</button>";
return'<div class="szg"><span class="szh">Lettres</span><div class="szr">'+LET.map(c=>b(c)).join("")+'</div><span class="szh">Tailles européennes</span><div class="szr">'+EU.map(c=>b(c)).join("")+'</div><span class="szh">Autre</span><div class="szr">'+b("Taille unique")+b("__autre","Autre…")+'</div><input class="szo" maxlength="20" placeholder="Précisez (ex : 42/44)" hidden></div>';
}
function pick(root,e){
const b=e.target.closest(".szc");
if(!b)return;
root.querySelectorAll(".szc").forEach(x=>x.classList.toggle("on",x===b));
const o=root.querySelector(".szo");
o.hidden=b.dataset.v!=="__autre";
if(!o.hidden)o.focus();
}
function value(root){
const b=root.querySelector(".szc.on");
if(!b)return"";
if(b.dataset.v==="__autre")return root.querySelector(".szo").value.trim().slice(0,20);
return b.dataset.v;
}
function clear(root){
root.querySelectorAll(".szc").forEach(x=>x.classList.remove("on"));
const o=root.querySelector(".szo");
o.value="";o.hidden=true;
}
function setValue(root,v){
clear(root);
if(!v)return;
const b=[...root.querySelectorAll(".szc")].find(x=>x.dataset.v===v);
if(b){b.classList.add("on");return}
const a=root.querySelector('[data-v="__autre"]'),o=root.querySelector(".szo");
a.classList.add("on");o.hidden=false;o.value=v;
}
let PEND=null;
/* Formulaire Vendre */
const blk=document.createElement("div");
blk.id="vtz";blk.hidden=true;
blk.innerHTML='<label>Taille du vêtement <small>(obligatoire)</small></label>'+chips()+'<p class="meta">Indiquez la taille écrite sur l’étiquette.</p>';
sc.after(blk);
blk.addEventListener("click",e=>pick(blk,e));
const sync=()=>{blk.hidden=sc.value!==CAT};
sc.addEventListener("change",sync);
sync();
sf.addEventListener("reset",()=>setTimeout(()=>{clear(blk);sync();PEND=null},0));
document.addEventListener("submit",e=>{
if(e.target.id!=="sf")return;
if(sc.value!==CAT){PEND=null;return}
const v=value(blk);
if(!v){
e.preventDefault();e.stopImmediatePropagation();
q("#sm").textContent="Indiquez la taille du vêtement.";
blk.scrollIntoView({block:"center",behavior:"smooth"});
blk.classList.remove("szerr");
void blk.offsetWidth;
blk.classList.add("szerr");
return;
}
PEND=v;
},true);
/* Enregistrement de la taille juste après la publication */
const R0=sb.rpc.bind(sb);
sb.rpc=function(fn,args,opts){
if(fn==="publier_annonce"&&PEND){
const t=PEND;
PEND=null;
return Promise.resolve(R0(fn,args,opts)).then(async r=>{
try{
if(r&&!r.error&&r.data&&r.data.id){
const x=await R0("definir_details",{p_listing:r.data.id,p_taille:t});
if(x&&x.error)setTimeout(()=>alert("Votre annonce est publiée, mais la taille n’a pas pu être enregistrée. Ouvrez l’annonce pour l’ajouter."),500);
}
}catch(e){}
return r;
});
}
return R0(fn,args,opts);
};
/* Fiche d'un article */
document.body.insertAdjacentHTML("beforeend",'<dialog id="dtz"><h2>Taille du vêtement</h2><div id="dtzc">'+chips()+'</div><p class="err" id="dtze" role="alert"></p><div class="row"><button type="button" class="pri" id="dtzs">Enregistrer</button><button type="button" data-x>Annuler</button></div></dialog>');
const dtz=q("#dtz"),dtzc=q("#dtzc");
dtz.querySelector("[data-x]").onclick=()=>dtz.close();
dtzc.addEventListener("click",e=>pick(dtzc,e));
let edId=null;
const S10=window.show;
window.show=function(i){
const r=S10.apply(this,arguments);
try{extras(i)}catch(e){}
return r;
};
function extras(i){
if(i.category!==CAT)return;
const dc=q("#dc");
if(i.taille&&!dc.querySelector(".szp")){
const pt=dc.querySelector(".pt");
if(pt)pt.insertAdjacentHTML("afterend",'<p class="szp">📏 Taille <b>'+esc(i.taille)+"</b></p>");
}
if(user&&user.id===i.user_id&&!i.vendu&&i.statut==="actif"&&!dc.querySelector(".vtzo")){
const own='<div class="vown vtzo"><h3>📏 Taille</h3><p>'+(i.taille?"Taille indiquée : <b>"+esc(i.taille)+"</b>":'<span class="meta">Aucune taille indiquée : les acheteurs en ont besoin.</span>')+'</p><button type="button" class="sbtn'+(i.taille?"":" pri")+'" data-tzedit="'+i.id+'">'+(i.taille?"Modifier la taille":"Ajouter la taille")+"</button></div>";
const del=dc.querySelector(".del");
if(del)del.insertAdjacentHTML("beforebegin",own);else dc.insertAdjacentHTML("beforeend",own);
}
}
document.addEventListener("click",e=>{
const b=e.target.closest("[data-tzedit]");
if(!b)return;
edId=b.dataset.tzedit;
const i=items.find(x=>x.id===edId);
setValue(dtzc,i&&i.taille);
q("#dtze").textContent="";
dtz.showModal();
});
q("#dtzs").onclick=async()=>{
const v=value(dtzc),m=q("#dtze");
if(!v){m.textContent="Choisissez une taille.";return}
const{error}=await sb.rpc("definir_details",{p_listing:edId,p_taille:v});
if(error){m.textContent=err(error);return}
dtz.close();
await load();
const j=items.find(x=>x.id===edId);
q("#dd").close();
if(j)show(j);
showToast("Taille enregistrée ✓","msg");
};
/* Cartes */
function badges(root){
root.querySelectorAll(".card").forEach(c=>{
if(c.dataset.tz)return;
const i=items.find(x=>x.id===c.dataset.id);
if(!i)return;
c.dataset.tz="1";
if(i.category===CAT&&i.taille){
const box=c.querySelector(":scope>div:last-child");
if(box)box.insertAdjacentHTML("beforeend",'<div class="tszc">📏 Taille '+esc(i.taille)+"</div>");
}
});
}
["#grid","#srgrid"].forEach(sel=>when(sel,g=>{badges(g);new MutationObserver(()=>badges(g)).observe(g,{childList:true})}));
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment indiquer la taille d’un vêtement ?</summary><p>Dans « Vendre », choisissez la catégorie Vêtements : un bloc « Taille » apparaît, avec les tailles en lettres (S, M, L…), les tailles européennes (34 à 54), « Taille unique » et « Autre ». Pour une annonce existante, ouvrez-la et appuyez sur « Ajouter la taille » ou « Modifier la taille ».</p></details>");
}catch(e){}
})();
