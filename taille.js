// Finder - taille.js : taille, pointure, âge et public (vêtements, chaussures, bébé et enfants)
(function(){
if(window.__finderTaille)return;window.__finderTaille=1;
const q=s=>document.querySelector(s);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>60)clearInterval(iv)},250)};
const sc=q("#sc"),sf=q("#sf");
if(!sc||!sf)return;
Object.assign(ERR,{"taille invalide":"Indiquez une taille valide (20 caractères maximum)."});
const rng=(a,b,s)=>{const r=[];for(let i=a;i<=b;i+=(s||1))r.push(String(i));return r};
const LET=["XXS","XS","S","M","L","XL","XXL","3XL","4XL"],EU=rng(34,54,2),P1=rng(28,35),P2=rng(36,47);
const BB=["Naissance","0-3 mois","3-6 mois","6-9 mois","9-12 mois","12-18 mois","18-24 mois"],EN=["2 ans","3 ans","4 ans","5 ans","6 ans","7 ans","8 ans","10 ans","12 ans","14 ans"];
const PUBS=["Homme","Femme","Enfant","Mixte"];
const CFG={
"Vêtements":{t:"Taille du vêtement",ic:"📏",lab:"Taille",req:true,pub:true,g:[["Lettres",LET],["Tailles européennes",EU],["Autre",["Taille unique"]]],hint:"Indiquez la taille écrite sur l’étiquette.",msg:"Indiquez la taille du vêtement."},
"Chaussures":{t:"Pointure",ic:"👟",lab:"Pointure",req:true,pub:true,g:[["Enfant (28 à 35)",P1],["Adulte (36 à 47)",P2]],hint:"La pointure européenne est écrite à l’intérieur de la chaussure. Pour une demi-pointure, choisissez « Autre… ».",msg:"Indiquez la pointure."},
"Bébé et enfants":{t:"Âge ou taille",ic:"🧸",lab:"Âge / taille",req:false,pub:false,g:[["Bébé",BB],["Enfant",EN]],hint:"Facultatif : utile pour les vêtements, chaussures et jeux selon l’âge.",msg:""}
};
const st=document.createElement("style");
st.textContent=`
.szg{margin:6px 0}
.szh{display:block;color:#6A7B84;font-size:.78rem;margin:8px 0 4px}
.szr{display:flex;flex-wrap:wrap;gap:6px}
.szc,.pbc{border:1.5px solid #E2EBEB;background:#fff;color:#12212B;border-radius:999px;padding:7px 14px;font-weight:600;min-width:46px}
.szc.on,.pbc.on{background:linear-gradient(135deg,#00A39A,#007782);color:#fff;border-color:transparent}
.szo{margin-top:8px}
.szo[hidden]{display:none}
.szp{display:inline-block;background:#E8F6F5;color:#005961;border-radius:999px;padding:4px 12px;margin:6px 0;font-size:.9rem}
.tszc{display:inline-block;background:#E8F6F5;color:#005961;border-radius:999px;padding:1px 8px;font-size:.72rem;font-weight:600;margin-top:4px}
#vtz{margin:8px 0}
#dtz{width:min(96vw,460px)}
@keyframes szerr{0%,100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}30%{box-shadow:0 0 0 6px rgba(229,72,77,.35)}}
#vtz.szerr{border-radius:14px;animation:szerr 1.8s ease 1}
`;
document.head.appendChild(st);
function chips(c){
const b=(v,t)=>'<button type="button" class="szc" data-v="'+esc(v)+'">'+esc(t||v)+"</button>";
let h='<div class="szg">';
c.g.forEach((g,gi)=>{
const L=g[1].slice();
if(gi===c.g.length-1)L.push("__autre");
h+='<span class="szh">'+esc(g[0])+'</span><div class="szr">'+L.map(v=>v==="__autre"?b(v,"Autre…"):b(v)).join("")+"</div>";
});
h+='<input class="szo" maxlength="20" placeholder="Précisez (ex : 42/44)" hidden></div>';
if(c.pub)h+='<span class="szh">Pour qui ?</span><div class="szr pubr">'+PUBS.map(p=>'<button type="button" class="pbc" data-p="'+p+'">'+p+"</button>").join("")+"</div>";
return h;
}
function pick(root,e){
const p=e.target.closest(".pbc");
if(p){root.querySelectorAll(".pbc").forEach(x=>x.classList.toggle("on",x===p));return}
const b=e.target.closest(".szc");
if(!b)return;
root.querySelectorAll(".szc").forEach(x=>x.classList.toggle("on",x===b));
const o=root.querySelector(".szo");
if(o){o.hidden=b.dataset.v!=="__autre";if(!o.hidden)o.focus()}
}
function value(root){
const b=root.querySelector(".szc.on");
if(!b)return"";
if(b.dataset.v==="__autre"){const o=root.querySelector(".szo");return o?o.value.trim().slice(0,20):""}
return b.dataset.v;
}
const pubValue=root=>{const b=root.querySelector(".pbc.on");return b?b.dataset.p:""};
function setValue(root,v,pu){
root.querySelectorAll(".szc,.pbc").forEach(x=>x.classList.remove("on"));
const o=root.querySelector(".szo");
if(o){o.value="";o.hidden=true}
if(v){
const b=[...root.querySelectorAll(".szc")].find(x=>x.dataset.v===v);
if(b)b.classList.add("on");
else{const a=root.querySelector('[data-v="__autre"]');if(a&&o){a.classList.add("on");o.hidden=false;o.value=v}}
}
if(pu){const p=[...root.querySelectorAll(".pbc")].find(x=>x.dataset.p===pu);if(p)p.classList.add("on")}
}
let PEND=null;
/* Formulaire Vendre */
const blk=document.createElement("div");
blk.id="vtz";blk.hidden=true;
sc.after(blk);
blk.addEventListener("click",e=>pick(blk,e));
let blkCat="";
function sync(){
const c=CFG[sc.value];
if(!c){blk.hidden=true;blk.innerHTML="";blkCat="";return}
if(blkCat!==sc.value){
blk.innerHTML="<label>"+c.t+" <small>("+(c.req?"obligatoire":"facultatif")+")</small></label>"+chips(c)+'<p class="meta">'+c.hint+"</p>";
blkCat=sc.value;
}
blk.hidden=false;
}
sc.addEventListener("change",sync);
sync();
sf.addEventListener("reset",()=>setTimeout(()=>{blk.innerHTML="";blkCat="";sync();PEND=null},0));
document.addEventListener("submit",e=>{
if(e.target.id!=="sf")return;
const c=CFG[sc.value];
if(!c){PEND=null;return}
const v=value(blk),pu=c.pub?pubValue(blk):"";
let msg="";
if(c.req&&!v)msg=c.msg;
else if(c.pub&&!pu)msg="Indiquez pour qui est l’article (homme, femme, enfant ou mixte).";
if(msg){
e.preventDefault();e.stopImmediatePropagation();
q("#sm").textContent=msg;
blk.scrollIntoView({block:"center",behavior:"smooth"});
blk.classList.remove("szerr");
void blk.offsetWidth;
blk.classList.add("szerr");
return;
}
PEND=(v||pu)?{t:v||null,p:pu||null}:null;
},true);
/* Enregistrement juste après la publication */
const R0=sb.rpc.bind(sb);
sb.rpc=function(fn,args,opts){
if(fn==="publier_annonce"&&PEND){
const d=PEND;
PEND=null;
return Promise.resolve(R0(fn,args,opts)).then(async r=>{
try{
if(r&&!r.error&&r.data&&r.data.id){
const x=await R0("definir_details",{p_listing:r.data.id,p_taille:d.t,p_public:d.p});
if(x&&x.error)setTimeout(()=>alert("Votre annonce est publiée, mais la taille n’a pas pu être enregistrée. Ouvrez l’annonce pour l’ajouter."),500);
}
}catch(e){}
return r;
});
}
return R0(fn,args,opts);
};
/* Fiche d'un article */
document.body.insertAdjacentHTML("beforeend",'<dialog id="dtz"><h2 id="dtzt">Taille</h2><div id="dtzc"></div><p class="err" id="dtze" role="alert"></p><div class="row"><button type="button" class="pri" id="dtzs">Enregistrer</button><button type="button" data-x>Annuler</button></div></dialog>');
const dtz=q("#dtz"),dtzc=q("#dtzc");
dtz.querySelector("[data-x]").onclick=()=>dtz.close();
dtzc.addEventListener("click",e=>pick(dtzc,e));
let edId=null,edCat="";
const lab=i=>{
const c=CFG[i.category];
if(!c)return"";
const p=[];
if(i.taille)p.push(c.ic+" "+c.lab+" <b>"+esc(i.taille)+"</b>");
if(i.public_cible)p.push("👤 <b>"+esc(i.public_cible)+"</b>");
return p.join(" · ");
};
const S10=window.show;
window.show=function(i){
const r=S10.apply(this,arguments);
try{extras(i)}catch(e){}
return r;
};
function extras(i){
const c=CFG[i.category];
if(!c)return;
const dc=q("#dc");
const l=lab(i);
if(l&&!dc.querySelector(".szp")){
const pt=dc.querySelector(".pt");
if(pt)pt.insertAdjacentHTML("afterend",'<p class="szp">'+l+"</p>");
}
if(user&&user.id===i.user_id&&!i.vendu&&i.statut==="actif"&&!dc.querySelector(".vtzo")){
const own='<div class="vown vtzo"><h3>'+c.ic+" "+c.t+"</h3><p>"+(l||'<span class="meta">Aucune information indiquée : les acheteurs en ont besoin pour filtrer.</span>')+'</p><button type="button" class="sbtn'+(i.taille?"":" pri")+'" data-tzedit="'+i.id+'">'+(i.taille?"Modifier":"Ajouter")+"</button></div>";
const del=dc.querySelector(".del");
if(del)del.insertAdjacentHTML("beforebegin",own);else dc.insertAdjacentHTML("beforeend",own);
}
}
document.addEventListener("click",e=>{
const b=e.target.closest("[data-tzedit]");
if(!b)return;
edId=b.dataset.tzedit;
const i=items.find(x=>x.id===edId);
if(!i)return;
edCat=i.category;
const c=CFG[edCat];
if(!c)return;
q("#dtzt").textContent=c.t;
dtzc.innerHTML=chips(c)+'<p class="meta">'+c.hint+"</p>";
setValue(dtzc,i.taille,i.public_cible);
q("#dtze").textContent="";
dtz.showModal();
});
q("#dtzs").onclick=async()=>{
const c=CFG[edCat],m=q("#dtze");
if(!c)return;
const v=value(dtzc),pu=c.pub?pubValue(dtzc):"";
if(c.req&&!v){m.textContent=c.msg;return}
if(c.pub&&!pu){m.textContent="Indiquez pour qui est l’article.";return}
const{error}=await sb.rpc("definir_details",{p_listing:edId,p_taille:v||null,p_public:pu||null});
if(error){m.textContent=err(error);return}
dtz.close();
await load();
const j=items.find(x=>x.id===edId);
q("#dd").close();
if(j)show(j);
showToast("Informations enregistrées ✓","msg");
};
/* Cartes */
function badges(root){
root.querySelectorAll(".card").forEach(c=>{
if(c.dataset.tz)return;
const i=items.find(x=>x.id===c.dataset.id);
if(!i)return;
c.dataset.tz="1";
const cf=CFG[i.category];
if(cf&&(i.taille||i.public_cible)){
const box=c.querySelector(":scope>div:last-child");
const t=[];
if(i.taille)t.push(cf.ic+" "+esc(i.taille));
if(i.public_cible)t.push(esc(i.public_cible));
if(box)box.insertAdjacentHTML("beforeend",'<div class="tszc">'+t.join(" · ")+"</div>");
}
});
}
["#grid","#srgrid"].forEach(sel=>when(sel,g=>{badges(g);new MutationObserver(()=>badges(g)).observe(g,{childList:true})}));
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Comment indiquer la taille, la pointure ou l’âge ?</summary><p>Dans « Vendre », choisissez la catégorie : Vêtements (taille et public, obligatoires), Chaussures (pointure et public, obligatoires) ou Bébé et enfants (âge ou taille, facultatif). Pour une annonce existante, ouvrez-la et appuyez sur « Ajouter » ou « Modifier ». Les acheteurs peuvent ensuite filtrer par taille et par public dans la recherche avancée.</p></details>");
}catch(e){}
})();
