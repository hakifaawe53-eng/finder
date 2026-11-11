// Finder - vac.js : mode vacances / absence pour les boutiques
(function(){
if(window.__finderVac)return;window.__finderVac=1;
const q=s=>document.querySelector(s);
Object.assign(ERR,{"boutique en vacances":"Cette boutique est en mode absence : les achats sont suspendus pour le moment. Vous pouvez quand même écrire au vendeur.","date invalide":"La date de retour doit être comprise entre aujourd’hui et un an."});
const st=document.createElement("style");
st.textContent=".vacb{background:#FFF4E5;border:1px solid #F0D4A8;border-radius:14px;padding:10px 12px;margin:8px 0}.vacb b{display:block}.tagv{background:#F59E0B}.card.paused img,.card.paused .ph{opacity:.6;filter:grayscale(.4)}#vacnote{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.ok{color:#0F8A55;min-height:1.4em}";
document.head.appendChild(st);
const MOT={vacances:["🏖️","En vacances"],voyage:["✈️","En voyage"],pause:["⏸️","En pause"]};
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const onVac=sh=>!!(sh&&sh.vacances&&(!sh.vacances_jusqu_au||sh.vacances_jusqu_au>=today()));
const fdate=d=>new Date(d+"T00:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"});
const lab=sh=>MOT[sh.vacances_motif]||MOT.vacances;
function banner(sh){
const m=lab(sh);
return '<div class="vacb"><b>'+m[0]+" "+m[1]+(sh.vacances_jusqu_au?" · retour le "+esc(fdate(sh.vacances_jusqu_au)):"")+"</b>Les achats sont suspendus pendant l’absence du vendeur."+(sh.vacances_message?"<br><i>« "+esc(sh.vacances_message)+" »</i>":"")+"</div>";
}
const R0=window.renderShop;
if(R0)window.renderShop=function(){
const r=R0.apply(this,arguments);
try{const b=q("#shophd"),sh=shops[sellerId];if(!b.hidden&&onVac(sh))b.insertAdjacentHTML("afterbegin",banner(sh))}catch(e){}
return r;
};
const S1=window.show;
window.show=function(i){
const r=S1.apply(this,arguments);
try{
const sh=shops[i.user_id];
if(onVac(sh)){const b=q("#dc").querySelector(".buybtn");if(b)b.outerHTML=banner(sh)+'<p class="meta">Vous pouvez quand même écrire au vendeur.</p>'}
}catch(e){}
return r;
};
function paint(){
document.querySelectorAll("#grid .card").forEach(c=>{
const i=items.find(x=>x.id===c.dataset.id);
if(!i||i.vendu)return;
const sh=shops[i.user_id];
if(onVac(sh)){c.classList.add("paused");if(!c.querySelector(".tag"))c.insertAdjacentHTML("afterbegin",'<span class="tag tagv">🏖️ En vacances</span>')}
});
}
const D1=window.load;
window.load=async function(){const r=await D1.apply(this,arguments);paint();return r};
const note=document.createElement("div");
note.id="vacnote";note.className="vacb";note.hidden=true;
q("main").prepend(note);
function syncNote(){
const sh=myShop;
if(user&&acct==="vendeur"&&onVac(sh)){
const m=lab(sh);
note.innerHTML="<span><b>"+m[0]+" Votre boutique est en mode absence"+(sh.vacances_jusqu_au?" jusqu’au "+esc(fdate(sh.vacances_jusqu_au)):"")+"</b>Les achats sont suspendus.</span><button type=\"button\" class=\"pri\" id=\"vacopen\">Rouvrir ma boutique</button>";
note.hidden=false;
}else note.hidden=true;
}
note.onclick=async e=>{
if(!e.target.closest("#vacopen"))return;
const{error}=await sb.rpc("maj_vacances",{p_actif:false,p_retour:null,p_motif:"vacances",p_message:null});
if(error){alert(err(error));return}
await loadMyShop();applyUI();load();refreshNotifs();
};
const A1=window.applyUI;
window.applyUI=function(){const r=A1.apply(this,arguments);syncNote();return r};
const dbq=q("#dbq"),bqx=q("#bqx");
const panel=document.createElement("div");
panel.id="vacp";
panel.innerHTML='<h3>🏖️ Mode vacances / absence</h3><p class="meta">Suspendez les achats pendant votre absence. Vos annonces restent visibles avec la mention « En vacances » et les acheteurs peuvent toujours vous écrire.</p><label class="chk"><input type="checkbox" id="vacon"> Mettre ma boutique en mode absence</label><div id="vacf" hidden><label>Motif</label><select id="vacmot"><option value="vacances">🏖️ Vacances</option><option value="voyage">✈️ Voyage</option><option value="pause">⏸️ Pause temporaire</option></select><label>Retour prévu le (facultatif)</label><input type="date" id="vacdate"><label>Message pour les acheteurs (facultatif)</label><textarea id="vacmsg" rows="2" maxlength="140" placeholder="Ex : De retour le 20 pour vos commandes !"></textarea></div><p class="meta" id="vacwarn"></p><p class="err" id="vacm" role="alert"></p><button type="button" class="sbtn pri" id="vacsave">Enregistrer</button>';
bqx.insertBefore(panel,bqx.firstChild);
async function renderVac(){
const sh=myShop;
if(!sh)return;
const on=onVac(sh);
q("#vacon").checked=on;
q("#vacmot").value=sh.vacances_motif||"vacances";
q("#vacdate").min=today();
q("#vacdate").value=sh.vacances_jusqu_au&&sh.vacances_jusqu_au>=today()?sh.vacances_jusqu_au:"";
q("#vacmsg").value=sh.vacances_message||"";
q("#vacf").hidden=!on;
q("#vacm").textContent="";
const{count}=await sb.from("commandes").select("id",{count:"exact",head:true}).eq("seller_id",user.id).in("statut",["paye","litige"]);
q("#vacwarn").textContent=count?"Vous avez "+count+" commande"+(count>1?"s":"")+" en cours : continuez à les traiter pendant votre absence.":"";
}
q("#vacon").onchange=e=>{q("#vacf").hidden=!e.target.checked};
q("#vacsave").onclick=async()=>{
const m=q("#vacm");
m.className="err";m.textContent="";
const on=q("#vacon").checked;
const{error}=await sb.rpc("maj_vacances",{p_actif:on,p_retour:on&&q("#vacdate").value?q("#vacdate").value:null,p_motif:q("#vacmot").value,p_message:q("#vacmsg").value.trim()||null});
if(error){m.textContent=err(error);return}
await loadMyShop();applyUI();load();refreshNotifs();
await renderVac();
m.className="ok";m.textContent=on?"Mode absence activé ✓":"Boutique rouverte ✓";
};
new MutationObserver(()=>{if(dbq.open&&!bqx.hidden)renderVac()}).observe(dbq,{attributes:true,attributeFilter:["open"]});
new MutationObserver(()=>{if(dbq.open&&!bqx.hidden)renderVac()}).observe(bqx,{attributes:true,attributeFilter:["hidden"]});
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Que se passe-t-il quand une boutique est en vacances ?</summary><p>Les achats sont suspendus et l’annonce porte la mention « En vacances » avec la date de retour si elle est indiquée. Vous pouvez quand même écrire au vendeur. Les commandes déjà payées continuent normalement.</p></details><details><summary>Vendeur : comment mettre ma boutique en vacances ?</summary><p>Ouvrez « Ma boutique », section « Mode vacances / absence », activez-le, choisissez le motif, une date de retour et un message si vous le souhaitez, puis enregistrez. Sans date de retour, la boutique reste fermée jusqu’à ce que vous la rouvriez.</p></details>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Un vendeur peut mettre sa boutique en mode absence : les achats sont alors suspendus, mais les commandes déjà payées doivent être traitées normalement.</li>");
}catch(e){}
syncNote();paint();
})();
