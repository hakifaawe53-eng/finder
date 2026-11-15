// Finder - garde.js : sécurité des comptes (appareil, VPN, bannissements)
(function(){
if(window.__finderGarde)return;window.__finderGarde=1;
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
Object.assign(ERR,{"compte suspendu":"Votre compte est suspendu. Contactez le support Finder.","verification requise":"Pour votre sécurité, vérifiez d’abord votre identité (menu : Vérifier mon identité)."});
const st=document.createElement("style");
st.textContent=".gb{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-radius:14px;padding:10px 12px;margin:8px 0;font-weight:600}.gb-r{background:#FFF4F4;border:1px solid #F5C6C6}.gb-o{background:#FFF4E5;border:1px solid #F0D4A8}.gb button{padding:7px 12px}.gd-sec ul{margin:6px 0;padding-left:18px;font-size:.88rem}.gd-sec input,.gd-sec select{margin:6px 0}";
document.head.appendChild(st);
const rid=()=>{try{return crypto.randomUUID()}catch(e){return Date.now().toString(36)+Math.random().toString(36).slice(2,14)}};
const cookie=n=>{const m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));return m?decodeURIComponent(m[1]):null};
const setCookie=(n,v)=>{try{document.cookie=n+"="+encodeURIComponent(v)+";max-age=63072000;path=/;SameSite=Lax;Secure"}catch(e){}};
let did=LS.get("finder_did")||cookie("fdid");
if(!did||did.length<8)did=rid();
LS.set("finder_did",did);setCookie("fdid",did);
async function sha(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function canvasSig(){
try{
const c=document.createElement("canvas");c.width=220;c.height=40;
const x=c.getContext("2d");
x.textBaseline="top";x.font="16px Arial";x.fillStyle="#f60";x.fillRect(10,5,80,20);
x.fillStyle="#069";x.fillText("Finder ✓ 123 àéç",4,8);
x.strokeStyle="rgba(102,204,0,.7)";x.arc(150,20,12,0,6.28);x.stroke();
return c.toDataURL().slice(-120);
}catch(e){return""}
}
function glSig(){
try{
const c=document.createElement("canvas"),g=c.getContext("webgl")||c.getContext("experimental-webgl");
if(!g)return"";
const d=g.getExtension("WEBGL_debug_renderer_info");
return d?g.getParameter(d.UNMASKED_VENDOR_WEBGL)+"|"+g.getParameter(d.UNMASKED_RENDERER_WEBGL):String(g.getParameter(g.VERSION));
}catch(e){return""}
}
const DEV=(async()=>{
let tz="";
try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
const raw=[navigator.userAgent,navigator.platform,navigator.hardwareConcurrency,navigator.deviceMemory,screen.width+"x"+screen.height+"x"+screen.colorDepth,devicePixelRatio,(navigator.languages||[navigator.language]).join(","),tz,navigator.maxTouchPoints,canvasSig(),glSig()].join("¦");
let fp="";
try{fp=(await sha(raw)).slice(0,40)}catch(e){}
return{vid:did,fp,tz,lang:navigator.language||""};
})();
const su=sb.auth.signUp.bind(sb.auth);
sb.auth.signUp=async function(c){
const d=await DEV;
return su({...c,options:{...((c&&c.options)||{}),data:{...((c&&c.options&&c.options.data)||{}),finder_dev:d}}});
};
const si=sb.auth.signInWithPassword.bind(sb.auth);
sb.auth.signInWithPassword=async function(c){
const r=await si(c);
if(r&&r.error&&/banned/i.test(r.error.message||""))setTimeout(()=>alert("Ce compte a été suspendu par Finder. Si vous pensez à une erreur, contactez le support Finder."),150);
return r;
};
const ban=document.createElement("div");
ban.id="gbanner";ban.hidden=true;
q("main").prepend(ban);
function banner(n){
ban.dataset.n=n||"";
if(n==="suspendu"){
ban.className="gb gb-r";
ban.innerHTML='🔒 Votre compte est suspendu pour une vérification de sécurité. <button type="button" data-g="sup">Contacter le support</button>';
ban.hidden=false;
}else if(n==="verification"){
ban.className="gb gb-o";
ban.innerHTML='🪪 Pour votre sécurité, vérifiez votre identité pour acheter, vendre ou utiliser le porte-monnaie. <button type="button" data-g="kyc">Vérifier mon identité</button>';
ban.hidden=false;
}else ban.hidden=true;
}
ban.onclick=e=>{
const b=e.target.closest("[data-g]");
if(!b)return;
const t=q(b.dataset.g==="kyc"?"#bid":"#bsup");
if(t)t.click();
};
async function check(){
if(!user)return;
const k="finder_gc_"+user.id;
let t=0;
try{t=+sessionStorage.getItem(k)||0}catch(e){}
if(Date.now()-t<20*60*1000)return;
try{sessionStorage.setItem(k,String(Date.now()))}catch(e){}
const d=await DEV;
const{data,error}=await sb.rpc("verifier_appareil",{p_vid:d.vid,p_fp:d.fp,p_tz:d.tz,p_lang:d.lang});
if(error||!data)return;
banner(data.niveau);
if(data.niveau==="banni"){
alert("Votre compte a été suspendu par Finder. Contactez le support si vous pensez à une erreur.");
sb.auth.signOut();
}
}
sb.auth.onAuthStateChange(ev=>{
if(ev==="SIGNED_OUT"){ban.hidden=true;return}
if(ev==="SIGNED_IN"||ev==="INITIAL_SESSION")setTimeout(check,1800);
});
setTimeout(check,2500);
const A0=window.applyUI;
window.applyUI=function(){
const r=A0.apply(this,arguments);
try{if(ban.dataset.n==="verification"&&myId&&myId.statut==="verifie")ban.hidden=true}catch(e){}
return r;
};
const LV={surveille:"👁️ Surveillé",verification:"🪪 Vérification requise",suspendu:"🔒 Suspendu"};
function secHtml(d){
const g=d.diag||{};
const fl=(d.signales||[]).map(s=>'<div class="ord"><b>'+esc(s.nom)+'</b> <span class="meta">'+esc(s.email||"")+"</span><br>"+(LV[s.niveau]||esc(s.niveau))+" · score "+s.score+(s.vpn?" · VPN":"")+(s.pays?" · "+esc(s.pays):"")+"<ul>"+(s.raisons||[]).slice(0,8).map(r=>"<li>"+esc(r)+"</li>").join("")+'</ul><button type="button" class="sbtn del" data-gb="'+s.user_id+'">🚫 Bannir</button><button type="button" class="sbtn pri" data-gv="'+s.user_id+'">✅ Valider (faux positif)</button></div>').join("")||"<p class='meta'>Aucun compte signalé.</p>";
const bn=(d.bannis||[]).map(b=>'<div class="ord"><b>'+esc(b.nom)+'</b> <span class="meta">'+esc(b.email||"")+'</span><br><span class="meta">'+(b.jusqu?"Jusqu’au "+new Date(b.jusqu).toLocaleDateString("fr-FR"):"Définitif")+" · "+esc(b.motif||"sans motif")+'</span><button type="button" class="sbtn" data-gl="'+b.user_id+'">Lever le bannissement</button></div>').join("")||"<p class='meta'>Aucun compte banni.</p>";
return'<div class="gd-sec"><h3>🛡️ Sécurité des comptes ('+(d.signales||[]).length+')</h3><p class="meta">Votre IP vue par Finder : <b>'+esc(g.ip||"non détectée")+"</b> ("+esc(g.pays||"?")+") · Service anti-VPN : <b>"+(g.cle?"actif":"non configuré")+"</b> · Politique VPN : "+esc(g.politique||"1")+"</p>"+fl+"<h3>🚫 Comptes bannis ("+(d.bannis||[]).length+")</h3>"+bn+'<div class="ord"><b>Bannir un utilisateur par email</b><input id="gbe" type="email" placeholder="email@exemple.com"><input id="gbm" placeholder="Motif (attaque, fraude…)"><select id="gbj"><option value="">Définitif</option><option value="7">7 jours</option><option value="30">30 jours</option><option value="90">90 jours</option></select><p class="err" id="gber"></p><button type="button" class="sbtn del" id="gbgo">🚫 Bannir</button></div></div>';
}
const M2=window.openMod;
window.openMod=async function(){
await M2.apply(this,arguments);
try{
const{data,error}=await sb.rpc("garde_liste");
if(error||!data)return;
const c=q("#dmc");
if(c&&!c.querySelector(".gd-sec"))c.insertAdjacentHTML("afterbegin",secHtml(data));
}catch(e){}
};
q("#bmod").onclick=window.openMod;
q("#dmc").addEventListener("click",async e=>{
const b=e.target.closest("[data-gb],[data-gv],[data-gl],#gbgo");
if(!b)return;
let fn="garde_decider",args=null;
if(b.dataset.gb){
const m=prompt("Motif du bannissement (attaque, fraude, comportement irresponsable…)");
if(m===null)return;
const j=prompt("Durée en jours (vide = définitif)","");
if(j===null)return;
if(!confirm("Bannir ce compte ? Ses annonces seront bloquées et il ne pourra plus se connecter."))return;
args={p_user:b.dataset.gb,p_action:"bannir",p_motif:m,p_jours:parseInt(j,10)||null};
}else if(b.dataset.gv){
args={p_user:b.dataset.gv,p_action:"valider"};
}else if(b.dataset.gl){
if(!confirm("Lever le bannissement de ce compte ?"))return;
args={p_user:b.dataset.gl,p_action:"lever"};
}else{
const em=q("#gbe").value.trim(),mo=q("#gbm").value.trim(),jo=parseInt(q("#gbj").value,10)||null,er=q("#gber");
if(!em.includes("@")){er.textContent="Entrez l’email du compte.";return}
if(!confirm("Bannir "+em+" ? Ses annonces seront bloquées et il ne pourra plus se connecter."))return;
fn="garde_bannir_email";
args={p_email:em,p_motif:mo,p_jours:jo};
}
const{data,error}=await sb.rpc(fn,args);
if(error){
const t=error.message||"";
alert(t.includes("introuvable")?"Utilisateur introuvable.":t.includes("action invalide")?"Action impossible (vous ne pouvez pas bannir un modérateur ni vous-même).":"Action impossible : "+t);
return;
}
if(data&&data.commandes!==undefined)alert("Compte banni. Annonces bloquées : "+data.annonces+". Commandes en cours à traiter : "+data.commandes+".");
openMod();
});
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Sécurité de la plateforme</b> : pour prévenir les fraudes et empêcher le retour de personnes bannies, Finder traite de façon sécurisée votre adresse IP (conservée uniquement sous forme chiffrée irréversible), un identifiant d’appareil, des caractéristiques techniques de votre navigateur et votre fuseau horaire. L’adresse IP peut être transmise à un service de détection de VPN et de proxy. Ces données sont conservées au maximum 12 mois, plus longtemps pour un compte banni.</li>");
const hb=hBy("#dt","Boutiques et badge bleu");
if(hb&&hb.nextElementSibling)hb.nextElementSibling.insertAdjacentHTML("beforeend","<li>Finder peut suspendre ou bannir un compte en cas d’attaque, de fraude ou de comportement irresponsable, et empêcher la création de nouveaux comptes par la même personne. Toute décision peut être contestée auprès du support.</li>");
const hs=hBy("#dhelp","Sécurité");
if(hs)hs.insertAdjacentHTML("beforebegin","<details><summary>Pourquoi mon compte est-il suspendu ou soumis à une vérification ?</summary><p>Pour la sécurité de tous, Finder peut demander la vérification de votre identité ou suspendre temporairement un compte lorsque des signaux de fraude sont détectés (par exemple un appareil lié à un compte banni). Utilisez « Contacter le support » pour contester une décision.</p></details>");
}catch(e){}
})();
