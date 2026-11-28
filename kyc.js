// Finder - kyc.js : préremplissage de la vérification d'identité, comparaison et journal pour les modérateurs, textes légaux
(function(){
if(window.__finderKyc)return;window.__finderKyc=1;
const q=s=>document.querySelector(s);
const css=document.createElement("style");
css.textContent=`
.cmpbox{margin-top:8px}
.cmp{background:#F4FAFA;border-radius:14px;padding:10px 12px;font-size:.9rem}
.cmp p{margin:4px 0}
#djal{width:min(96vw,520px)}
.jrow{border-bottom:1px solid #E6EEEE;padding:8px 0;font-size:.9rem}
.kpre{background:#EEF8F7;border-radius:12px;padding:10px 12px;font-size:.9rem;margin:0 0 10px}
`;
document.head.appendChild(css);
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtD=x=>{try{return new Date(x+"T00:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}catch(e){return x||"—"}};
const fmtT=x=>{try{return new Date(x).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch(e){return x||""}};
const MOTIFS={verification_identite:"Vérification d’identité",litige:"Litige",fraude:"Suspicion de fraude"};
/* 1. Préremplissage de la vérification d'identité */
const dk=q("#dkyc"),kf=q("#kf");
function natTel(t){let d=String(t||"").replace(/\D/g,"");if(d.startsWith("225")&&d.length>10)d=d.slice(3);return d.replace(/(\d{2})(?=\d)/g,"$1 ")}
async function prefill(){
if(!dk||!kf||!dk.open||kf.hidden||typeof user==="undefined"||!user)return;
if(kf.dataset.pf==="1")return;
kf.dataset.pf="1";
try{
const r=await sb.from("profils_prives").select("nom_famille,prenoms,date_naissance,telephone,commune").eq("user_id",user.id).maybeSingle();
const d=r.data;
if(!d)return;
const set=(n,v)=>{const e=kf.elements[n];if(e&&!e.value&&v)e.value=v};
set("kn",d.nom_famille);set("kp",d.prenoms);set("kd",d.date_naissance);set("kt",natTel(d.telephone));
if(d.commune)set("ka",d.commune+", ");
if(!q("#kpre"))kf.insertAdjacentHTML("afterbegin",'<p class="kpre" id="kpre">✅ Ces informations viennent de votre inscription. Vérifiez qu’elles sont <b>identiques à votre pièce d’identité</b> et corrigez-les si besoin. Ajoutez votre quartier à l’adresse.</p>');
}catch(e){}
}
if(dk&&kf){
new MutationObserver(()=>{kf.dataset.pf="";if(dk.open)setTimeout(prefill,250)}).observe(dk,{attributes:true,attributeFilter:["open"]});
new MutationObserver(()=>setTimeout(prefill,100)).observe(kf,{attributes:true,attributeFilter:["hidden"]});
}
/* 2. Modération : comparaison et journal d'accès */
async function addMod(){
const box=q("#dmc");
if(!box)return;
if(!box.querySelector("[data-jal]"))box.insertAdjacentHTML("afterbegin",'<p><button type="button" class="sbtn" data-jal="1">📜 Journal des accès aux données privées</button></p>');
const r=await sb.rpc("file_identites");
(r.data||[]).forEach(d=>{
const b=box.querySelector('[data-iv="'+d.user_id+'"]');
if(!b)return;
const ord=b.closest(".ord");
if(!ord||ord.querySelector("[data-cmp]"))return;
const row=ord.querySelector(".row");
if(!row)return;
row.insertAdjacentHTML("beforeend",'<button type="button" class="sbtn" data-cmp="'+d.user_id+'">🔎 Comparer avec l’inscription</button>');
row.insertAdjacentHTML("afterend",'<div class="cmpbox" data-cb="'+d.user_id+'"></div>');
});
}
const M0=window.openMod;
if(typeof M0==="function"){
window.openMod=async function(){
const r=await M0.apply(this,arguments);
try{await addMod()}catch(e){}
return r;
};
}
function renderCmp(bx,r){
if(!r||!r.inscription){bx.innerHTML='<p class="meta">Aucune information d’inscription pour ce compte (compte créé avant cette fonction).</p>';return}
const d=r.declare||{},ic=ok=>ok?"✅":"⚠️";
bx.innerHTML='<div class="cmp"><p><b>Comparaison avec l’inscription</b></p><p>'+ic(r.nom_ok)+" Nom : "+E(d.nom)+"</p><p>"+ic(r.prenoms_ok)+" Prénoms : "+E(d.prenoms)+"</p><p>"+ic(r.naissance_ok)+" Naissance : "+E(fmtD(d.naissance))+"</p><p>Lieu de naissance (à contrôler sur la pièce) : "+E(d.lieu)+"</p><p>"+ic(r.tel_ok)+" Téléphone : "+E(d.tel||"—")+"</p><p>Ville : "+E(d.commune||"—")+" · E-mail : "+E(d.email||"—")+'</p><p class="meta">Cette consultation est enregistrée dans le journal.</p></div>';
}
document.addEventListener("click",async e=>{
const c=e.target.closest("[data-cmp]");
if(c){
const uid=c.dataset.cmp,bx=q('[data-cb="'+uid+'"]');
if(!bx)return;
c.disabled=true;
bx.innerHTML='<p class="meta">Consultation…</p>';
const r=await sb.rpc("comparer_identite",{p_user:uid});
c.disabled=false;
if(r.error){bx.innerHTML='<p class="err">Impossible : '+E(r.error.message||"erreur")+"</p>";return}
renderCmp(bx,r.data);
return;
}
const j=e.target.closest("[data-jal]");
if(j){
let d=q("#djal");
if(!d){
document.body.insertAdjacentHTML("beforeend",'<dialog id="djal"><h2>Journal des accès</h2><p class="meta">Chaque consultation des informations privées d’un utilisateur est enregistrée ici.</p><div id="jalc"></div><div class="row"><button type="button" id="jalx">Fermer</button></div></dialog>');
d=q("#djal");
q("#jalx").onclick=()=>d.close();
}
q("#jalc").innerHTML='<p class="meta">Chargement…</p>';
if(!d.open)d.showModal();
const r=await sb.rpc("journal_acces_donnees",{p_limite:100});
if(r.error){q("#jalc").innerHTML='<p class="err">Accès refusé ou erreur.</p>';return}
const a=r.data||[];
q("#jalc").innerHTML=a.length?a.map(x=>'<div class="jrow">'+E(fmtT(x.date))+" · <b>"+E(x.admin)+"</b> a consulté les informations de <b>"+E(x.user)+'</b> <span class="meta">('+E(MOTIFS[x.motif]||x.motif)+")</span></div>").join(""):'<p class="meta">Aucune consultation pour le moment.</p>';
}
});
/* 3. Textes légaux */
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const ulOf=h=>h&&h.nextElementSibling&&h.nextElementSibling.tagName==="UL"?h.nextElementSibling:null;
function patchLegal(){
const pv=q("#dpriv");
if(pv&&!pv.dataset.lg){
pv.dataset.lg="1";
const mt=pv.querySelector("p.meta");
if(mt&&/Dernière mise à jour/.test(mt.textContent))mt.textContent="Dernière mise à jour : 25 novembre 2026";
const u1=ulOf(hBy("#dpriv","1."));
if(u1){
const first=u1.querySelector("li");
if(first&&/Votre compte/.test(first.textContent)){
first.innerHTML="<b>Votre compte</b> : votre numéro de téléphone ou votre adresse e-mail (selon votre choix de connexion) et votre mot de passe (conservé sous forme sécurisée, nous ne pouvons pas le lire).";
first.insertAdjacentHTML("afterend","<li><b>Vos informations d’inscription</b> : nom, prénoms, date de naissance, lieu de naissance, numéro de téléphone, adresse e-mail (facultative) et ville de résidence, que vous donnez en créant votre compte. Elles sont privées.</li>");
}
}
const u2=ulOf(hBy("#dpriv","2."));
if(u2)u2.insertAdjacentHTML("beforeend","<li>Vérifier, dès l’inscription, que vous avez 18 ans ou plus, et comparer vos informations d’inscription avec votre pièce d’identité lorsque vous demandez une vérification.</li>");
const h3=hBy("#dpriv","3."),p3=h3&&h3.nextElementSibling;
if(p3&&p3.tagName==="P")p3.innerHTML=p3.innerHTML.replace("votre email, vos informations d’identité","votre numéro de téléphone, votre email, vos informations d’inscription (nom, prénoms, date et lieu de naissance), vos informations d’identité");
const u6=ulOf(hBy("#dpriv","6."));
if(u6)u6.insertAdjacentHTML("beforeend","<li>Chaque consultation de vos informations d’inscription par une personne habilitée de Finder est enregistrée dans un journal d’accès, avec la date et le motif.</li>");
const h9=hBy("#dpriv","9."),p9=h9&&h9.nextElementSibling;
if(p9&&p9.tagName==="P")p9.textContent="Finder s’adresse aux personnes de 18 ans et plus. La création d’un compte est refusée si la date de naissance indiquée correspond à une personne de moins de 18 ans. La vérification d’identité est réservée aux personnes majeures.";
}
const dt=q("#dt");
if(dt&&!dt.dataset.lg){
dt.dataset.lg="1";
const uc=ulOf(hBy("#dt","Comptes client et vendeur"));
if(uc)uc.insertAdjacentHTML("beforeend","<li>Pour créer un compte, vous devez avoir au moins 18 ans et donner des informations exactes (nom, prénoms, date et lieu de naissance, numéro de téléphone). Un compte créé avec de fausses informations peut être suspendu.</li>");
const vi=hBy("#dt","Vos informations");
if(vi){
const t="Les informations demandées à l’inscription restent privées : elles ne sont jamais affichées aux autres utilisateurs. Elles peuvent être comparées avec votre pièce d’identité lors d’une vérification.";
const u=ulOf(vi);
if(u)u.insertAdjacentHTML("beforeend","<li>"+t+"</li>");
else vi.insertAdjacentHTML("afterend","<p>"+t+"</p>");
}
}
}
setTimeout(patchLegal,1200);
})();
// FIN DU FICHIER
