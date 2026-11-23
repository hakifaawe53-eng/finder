// Finder - succes.js : écrans de confirmation beaux et professionnels
(function(){
if(window.__finderSucces)return;window.__finderSucces=1;
const q=s=>document.querySelector(s);
const st=document.createElement("style");
st.textContent=`
#dok{width:min(92vw,380px)!important;max-width:380px!important;margin:auto!important;border-radius:26px!important;padding:28px 22px 20px!important;text-align:center;overflow:hidden;max-height:90vh!important}
#dok::backdrop{background:rgba(8,35,40,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
.okc{width:84px;height:84px;margin:0 auto 14px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;animation:okpop .5s cubic-bezier(.2,1.4,.4,1) both}
.okc.ok{background:linear-gradient(135deg,#19C37D,#0F8A55);box-shadow:0 10px 28px rgba(15,138,85,.35);color:#19C37D}
.okc.err{background:linear-gradient(135deg,#F2635F,#D92D20);box-shadow:0 10px 28px rgba(217,45,32,.3);color:#F2635F}
.okc.warn{background:linear-gradient(135deg,#FBBF24,#D97706);box-shadow:0 10px 28px rgba(217,119,6,.3);color:#FBBF24}
.okc.info{background:linear-gradient(135deg,#00A39A,#007782);box-shadow:0 10px 28px rgba(0,119,130,.3);color:#00A39A}
.okc:before{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid currentColor;animation:okring 1.4s .25s ease-out both}
.okc svg{width:46px;height:46px;fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.okc .okp{stroke-dasharray:60;stroke-dashoffset:60;animation:okdraw .5s .3s ease forwards}
.okc .okd{fill:#fff;stroke:none}
@keyframes okpop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes okring{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.8);opacity:0}}
@keyframes okdraw{to{stroke-dashoffset:0}}
#okt{margin:0 0 6px;font-size:1.25rem;line-height:1.25}
#okx{margin:0;color:#4A5B64;line-height:1.5}
#okl{margin:14px 0 0;text-align:left}
#okl div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-top:1px solid #E2EBEB;font-size:.9rem}
#okl span{color:#6A7B84}
#okl b{text-align:right}
.okb{display:flex;flex-direction:column;gap:8px;margin-top:18px}
.okb button{width:100%;padding:13px;font-size:1rem}
.okconf{position:absolute;left:0;right:0;top:0;height:0;pointer-events:none}
.okconf i{position:absolute;top:0;opacity:0;animation:okfall 1.9s ease-in forwards}
@keyframes okfall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(420px) rotate(560deg);opacity:0}}
#toast.ok{background:linear-gradient(135deg,#0F8A55,#19C37D)!important;color:#fff!important}
#toast.ok:before{content:"✓";display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#fff;color:#0F8A55;font-weight:800;margin-right:8px;font-size:.85rem}
@media(prefers-reduced-motion:reduce){.okc,.okc:before,.okc .okp,.okconf i{animation:none}.okc .okp{stroke-dashoffset:0}}
`;
document.head.appendChild(st);
document.body.insertAdjacentHTML("beforeend",'<dialog id="dok"><div class="okconf" id="okconf"></div><div class="okc" id="okc"></div><h2 id="okt"></h2><p id="okx"></p><div id="okl"></div><div class="okb"><button type="button" class="pri" id="okcta" hidden></button><button type="button" id="okno">Continuer</button></div></dialog>');
const dd=q("#dok");
const ICON={
ok:'<svg viewBox="0 0 52 52"><path class="okp" d="M14 27l8 8 16-17"/></svg>',
err:'<svg viewBox="0 0 52 52"><path class="okp" d="M16 16l20 20M36 16L16 36"/></svg>',
warn:'<svg viewBox="0 0 52 52"><path class="okp" d="M26 14v16"/><circle class="okd" cx="26" cy="38" r="2.6"/></svg>',
info:'<svg viewBox="0 0 52 52"><path class="okp" d="M26 24v14"/><circle class="okd" cx="26" cy="15" r="2.6"/></svg>'
};
const DEF={ok:"Opération réussie",err:"Action impossible",warn:"Attention",info:"Information"};
const Q=[];
let cur=null;
function lines(o){return(o.lines||[]).map(l=>"<div><span>"+esc(l[0])+"</span><b>"+esc(l[1])+"</b></div>").join("")}
function setLines(o,L){o.lines=L;if(cur===o)q("#okl").innerHTML=lines(o)}
function confetti(on){
const c=q("#okconf");
c.innerHTML="";
if(!on||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
const col=["#19C37D","#00A39A","#F59E0B","#2BB0FF","#E5484D"];
let h="";
for(let i=0;i<22;i++){
const l=Math.random()*100,d=Math.random()*.5,s=6+Math.random()*6;
h+='<i style="left:'+l.toFixed(1)+"%;width:"+s.toFixed(1)+"px;height:"+(s*1.4).toFixed(1)+"px;background:"+col[i%col.length]+";border-radius:"+(Math.random()>.5?"50%":"2px")+";animation-delay:"+d.toFixed(2)+'s"></i>';
}
c.innerHTML=h;
}
function show(o){
if(dd.open){Q.push(o);return o}
cur=o;
q("#okc").className="okc "+o.kind;
q("#okc").innerHTML=ICON[o.kind]||ICON.info;
q("#okt").textContent=o.title;
const x=q("#okx");
x.textContent=o.text||"";
x.hidden=!o.text;
q("#okl").innerHTML=lines(o);
const cta=q("#okcta");
if(o.cta){cta.textContent=o.cta.label;cta.hidden=false}else cta.hidden=true;
q("#okno").textContent=o.cta?"Plus tard":"Continuer";
confetti(!!o.big&&o.kind==="ok");
dd.showModal();
try{if(navigator.vibrate)navigator.vibrate(o.kind==="ok"?[18,30,18]:[30])}catch(e){}
return o;
}
dd.addEventListener("close",()=>{
cur=null;
const n=Q.shift();
if(n)setTimeout(()=>show(n),150);
});
q("#okno").onclick=()=>dd.close();
q("#okcta").onclick=()=>{
const o=cur;
dd.close();
if(o&&o.cta&&o.cta.run)setTimeout(o.cta.run,150);
};
window.finderNotice=show;
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const OKW=/(reussi|effectue|envoye|enregistre|confirme|cree|valide|ajoute|mis a jour|retire|publie|termine|active|merci|bienvenue|change|certifie|libere|✓|✅)/;
const KOW=/(impossible|echou|erreur|refus|invalide|incorrect|n'a pas|n’a pas|trop |indisponible|introuvable|deja |non disponible|plus disponible|interdit|suspendu|autorisez|desole|insuffisant|doit |obligatoire|veuillez|oubli)/;
function kind(t){
const n=norm(t),ok=OKW.test(n),ko=KOW.test(n);
if(/passez en compte/.test(n))return"info";
if(ko&&ok)return"warn";
if(ko)return"err";
if(/en cours de verification|sera visible des/.test(n))return"info";
return ok?"ok":"info";
}
function split(t){
t=String(t).trim();
const m=/^([\s\S]{4,64}?)(?:[.!]\s+|\s:\s+|\n+)([\s\S]+)$/.exec(t);
if(m)return[m[1].replace(/[.:!]+$/,""),m[2].trim()];
if(t.length<=64)return[t.replace(/[.!]+$/,""),""];
return["",t];
}
const SP=[
[/^Achat effectu/i,{big:true,title:"Achat effectué avec succès",cta:{label:"Voir ma commande",id:"ord"},purchase:true}],
[/Remise valid/i,{big:true,title:"Remise validée",cta:{label:"Voir mes ventes",id:"ord"}}],
[/mot de passe a été changé/i,{title:"Mot de passe modifié"}],
[/boutique est (cr|maintenant)/i,{big:true,cta:{label:"Ouvrir ma boutique",id:"bq"}}],
[/demande est envoy/i,{title:"Demande envoyée"}],
[/Votre annonce est enregistr/i,{title:"Annonce enregistrée"}]
];
async function purchase(o){
try{
if(!user)return;
const{data}=await sb.from("commandes").select("titre,montant,frais_acheteur,created_at").eq("buyer_id",user.id).order("created_at",{ascending:false}).limit(1);
const c=data&&data[0];
if(!c||Date.now()-new Date(c.created_at)>180000)return;
setLines(o,[["Article",c.titre],["Montant payé",fcfa(c.montant+(c.frais_acheteur||0))],["Votre argent","Gardé en sécurité jusqu’à la remise"]]);
}catch(e){}
}
window.alert=function(m){
let t=String(m==null?"":m);
if(!t.trim())return;
if(t.includes("confirmez la réception"))t="Achat effectué. Vos coordonnées de livraison ont été transmises au vendeur. Votre code de remise est dans « Mes achats » : donnez-le au vendeur seulement quand vous avez l’article en main.";
const k=kind(t);
const p=split(t);
const o={kind:k,title:p[0].replace(/^[✅✓✔❌⚠ℹ🎉\uFE0F\s]+/u,""),text:p[1]};
const sp=SP.find(s=>s[0].test(t));
if(sp){
Object.assign(o,sp[1]);
if(sp[1].title)o.text=p[1];
if(sp[1].cta){const id=sp[1].cta.id;o.cta={label:sp[1].cta.label,run:()=>{const e=q("#"+id);if(e)e.click()}}}
}
if(!o.title)o.title=DEF[k];
show(o);
if(o.purchase)purchase(o);
};
const T0=window.showToast;
window.showToast=function(t){
const r=T0.apply(this,arguments);
try{const e=q("#toast");if(e)e.classList.toggle("ok",/[✓✅]/.test(String(t)))}catch(x){}
return r;
};
const wm=q("#wm");
if(wm){
let last="";
new MutationObserver(()=>{
const t=(wm.textContent||"").trim();
if(!t.startsWith("✅")){last="";return}
if(t===last)return;
last=t;
if(/Paiement confirmé/.test(t)){
const o=show({kind:"ok",big:true,title:"Paiement effectué avec succès",text:"Votre porte-monnaie a été rechargé. Le montant est disponible immédiatement."});
(async()=>{
try{
const{data}=await sb.from("paiements").select("montant,ref,traite_le").eq("type","recharge").eq("statut","reussi").order("traite_le",{ascending:false}).limit(1);
const p=data&&data[0];
if(p&&o)setLines(o,[["Montant",fcfa(p.montant)],["Référence",String(p.ref||"").slice(0,12)],["Date",new Date(p.traite_le||Date.now()).toLocaleString("fr-FR")]]);
}catch(e){}
})();
}else if(/Demande envoy/.test(t)){
show({kind:"ok",big:true,title:"Demande de retrait envoyée",text:"Votre retrait sera payé sous 24 heures ouvrées. Vous serez prévenu dès qu’il est envoyé sur votre Mobile Money."});
}else{
const p=split(t.replace(/^✅\s*/,""));
show({kind:"ok",title:p[0]||DEF.ok,text:p[1]});
}
wm.textContent="";
}).observe(wm,{childList:true,characterData:true,subtree:true});
}
})();
