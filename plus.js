// Finder - plus.js : verso de la pièce, catégorie Électronique, paramètres complets
(function(){
if(window.__finderPlus)return;window.__finderPlus=1;
const q=s=>document.querySelector(s);
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
Object.assign(ERR,{"verso requis":"Ajoutez aussi la photo du verso de la pièce.","mfa requise":"Pour cette opération, validez d’abord votre code de sécurité : reconnectez-vous et saisissez le code de votre application d’authentification."});
const st=document.createElement("style");
st.textContent=".setp{display:flex;align-items:center;gap:14px;margin:6px 0 10px}.seta{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#00A39A,#005961) center/cover no-repeat;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;flex:0 0 72px}details.setd{background:#fff;border:1px solid #E2EBEB;border-radius:16px;padding:4px 14px;margin:10px 0}details.setd>summary{padding:12px 0;font-weight:700;cursor:pointer}details.setd h3{margin:14px 0 4px;font-size:.95rem}.ok{color:#0F8A55;min-height:1.4em}.mfqr{width:180px;height:180px;display:block;margin:8px auto;background:#fff}.avs{width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px}";
document.head.appendChild(st);
const when=(sel,cb)=>{let n=0;const iv=setInterval(()=>{const e=q(sel);if(e){clearInterval(iv);cb(e)}else if(++n>50)clearInterval(iv)},200)};
const walk=(root,re,to)=>{if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(re.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(re,to)};
/* 1. Catégorie Électronique */
const EL="Électronique";
if(!CATS.includes(EL)){const i=CATS.indexOf("Téléphones");CATS.splice(i>=0?i+1:CATS.length-1,0,EL)}
try{fill(q("#sc"),CATS);renderSide()}catch(e){}
function syncCat(){
[q("#hcats .cgrid"),q("#dcat .cgrid")].forEach(g=>{
if(!g)return;
let t=[...g.querySelectorAll(".ctile")].find(x=>x.dataset.c===EL);
if(!t){t=document.createElement("button");t.className="ctile";t.dataset.c=EL;t.innerHTML="<span></span>"+EL;const ref=[...g.querySelectorAll(".ctile")].find(x=>x.dataset.c==="Téléphones");if(ref)ref.after(t);else g.appendChild(t)}
const s=t.querySelector("span");s.style.background="#EDE9FE";s.textContent="🎧";
});
const sel=q("#alf select[name=cat]");
if(sel&&![...sel.options].some(o=>o.value===EL))sel.add(new Option(EL,EL));
}
let nc=0;const ic=setInterval(()=>{syncCat();if(++nc>30)clearInterval(ic)},200);
/* 2. Verso de la pièce d'identité */
const k1=q("#kf1"),kty=q("#kty"),kf=q("#kf");
if(k1&&kty&&kf){
const kvw=document.createElement("div");kvw.id="kvw";
kvw.innerHTML='<label for="kf3" id="kl3">Photo de la pièce (verso)</label><input id="kf3" name="kf3" type="file" accept="image/*"><p class="meta">Le dos de la pièce, net et sans reflet.</p>';
k1.nextElementSibling.after(kvw);
const k3=q("#kf3");
const updKv=()=>{const t=kty.value,need=t==="CNI"||t==="Permis";kvw.hidden=t==="Passeport";k3.required=need;q("#kl3").textContent="Photo de la pièce (verso) — "+(need?"obligatoire":"facultatif");q('label[for="kf1"]').textContent=t==="Passeport"?"Photo de la page d’identité du passeport":"Photo de la pièce (recto)"};
kty.addEventListener("change",updKv);
kf.addEventListener("reset",()=>setTimeout(updKv,0));
updKv();
kf.onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#km"),nais=f.kd.value;
const age=Math.floor((Date.now()-new Date(nais).getTime())/31557600000);
if(!nais||age<18){m.textContent="Vous devez avoir au moins 18 ans.";return}
const t=f.kty.value,need=t==="CNI"||t==="Permis";
const p1=f.kf1.files[0],p2=f.kf2.files[0],p3=kvw.hidden?null:f.kf3.files[0];
if(!p1||!p2){m.textContent="Ajoutez la photo de la pièce et le selfie.";return}
if(need&&!p3){m.textContent="Ajoutez aussi la photo du verso de la pièce.";return}
if([p1,p2,p3].some(x=>x&&x.size>5e6)){m.textContent="Chaque photo doit faire moins de 5 Mo.";return}
m.textContent="Envoi en cours…";
const up=async(file,tag)=>{
const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
const path=user.id+"/"+tag+"-"+Date.now()+"."+ext;
const r=await sb.storage.from("identites").upload(path,file);
return r.error?null:path;
};
const a=await up(p1,"piece"),b=await up(p2,"selfie"),c=p3?await up(p3,"verso"):null;
if(!a||!b||(p3&&!c)){m.textContent="L’envoi des photos a échoué. Utilisez des photos JPG ou PNG de moins de 5 Mo, puis réessayez.";return}
const{error}=await sb.rpc("soumettre_identite",{p_nom:f.kn.value,p_prenoms:f.kp.value,p_naissance:nais,p_adresse:f.ka.value,p_tel:f.kt.value,p_type:t,p_numero:f.kno.value,p_piece:a,p_selfie:b,p_verso:c});
if(error){m.textContent=err(error);return}
await loadIdent();applyUI();q("#dkyc").close();refreshNotifs();
alert("Votre demande est envoyée. Dès que Finder aura vérifié votre identité, vous serez prévenu et ce critère du badge bleu sera rempli.");
};
}
const M0=window.openMod;
if(M0){
window.openMod=async function(){
await M0.apply(this,arguments);
try{
const{data}=await sb.rpc("file_identites");
(data||[]).forEach(d=>{
if(!d.verso)return;
const b=q('#dmc [data-iv="'+d.user_id+'"]');
if(!b)return;
const row=b.closest(".ord").querySelector(".row");
if(row&&!row.querySelector("[data-verso]"))row.insertAdjacentHTML("beforeend",'<button type="button" data-vp="'+esc(d.verso)+'" data-verso="1">Voir le verso</button>');
});
}catch(e){}
};
q("#bmod").onclick=window.openMod;
}
/* 3. Paramètres */
document.body.insertAdjacentHTML("beforeend",`<dialog id="dset">
<div class="whd"><button type="button" class="bk" data-x aria-label="Retour">←</button><h2>Paramètres</h2></div>
<div class="setp"><div class="seta" id="seta"></div><div><b id="setn"></b><br><small class="meta" id="sete"></small></div></div>
<div class="phbtns"><button type="button" id="avpick">📷 Changer la photo</button><button type="button" id="avself">🤳 Selfie</button><button type="button" id="avdel">Retirer</button></div>
<p class="meta" id="avm"></p>
<input type="file" id="avf" accept="image/*" hidden><input type="file" id="avs" accept="image/*" capture="user" hidden>
<details class="setd" open><summary>👤 Profil</summary><form id="stpf"><label>Nom affiché</label><input name="nom" required minlength="2" maxlength="40"><label>Ville</label><select name="ville"></select><label>Présentation</label><textarea name="bio" rows="3" maxlength="200" placeholder="Ex : Je vends des vêtements en très bon état."></textarea><p class="err" id="spm"></p><button class="pri sbtn">Enregistrer le profil</button></form></details>
<details class="setd"><summary>🔐 Sécurité et connexion</summary>
<h3>Mot de passe</h3>
<form id="stpw"><label>Ancien mot de passe</label><input name="old" type="password" required autocomplete="current-password"><label>Nouveau mot de passe (8 caractères minimum)</label><input name="n1" id="stn1" type="password" required minlength="8" autocomplete="new-password"><p class="meta" id="stst"></p><label>Confirmer le nouveau mot de passe</label><input name="n2" type="password" required minlength="8" autocomplete="new-password"><label class="chk"><input type="checkbox" id="stsh"> Afficher les mots de passe</label><p id="stpwm" class="err"></p><button class="pri sbtn">Changer le mot de passe</button></form>
<h3>Adresse email</h3><p class="meta" id="semail"></p>
<form id="stem"><label>Nouvelle adresse email</label><input name="mail" type="email" required autocomplete="email"><p id="stemm" class="err"></p><button class="sbtn">Changer l’adresse email</button></form>
<h3>Validation en deux étapes</h3><div id="smfa"></div>
<h3>Appareils</h3><p class="meta">Déconnectez votre compte de tous vos appareils (téléphone, ordinateur…).</p><button type="button" class="sbtn" id="sall">Se déconnecter partout</button>
</details>
<details class="setd"><summary>🔔 Notifications</summary><div id="stnt"></div></details>
<details class="setd"><summary>📍 Localisation et confidentialité</summary><div id="stgeo"></div>
<h3>Mes données</h3><button type="button" class="sbtn" id="stexp">⬇️ Télécharger mes données</button><p class="meta" id="stexm"></p><button type="button" class="sbtn" data-go="bprv">🔒 Politique de confidentialité</button><button type="button" class="sbtn" id="stdel">🗑️ Demander la suppression de mon compte</button></details>
<details class="setd"><summary>🛍️ Mon compte Finder</summary><div id="stac"></div></details>
<details class="setd"><summary>❓ Aide et informations</summary><button type="button" class="sbtn" data-go="bhelp">Centre d’aide</button><button type="button" class="sbtn" data-go="bsup">Contacter le support</button><button type="button" class="sbtn" data-go="babt">À propos de nous</button><button type="button" class="sbtn" data-go="tosb">Conditions d’utilisation</button><p class="meta">Finder · version 1.0</p></details>
<button type="button" class="sbtn del" id="slogout">Se déconnecter</button>
</dialog>
<dialog id="dmfa"><h2>Code de sécurité</h2><p>Entrez le code à 6 chiffres de votre application d’authentification pour continuer.</p><form id="mfaf"><input name="code" inputmode="numeric" maxlength="6" required autocomplete="one-time-code" placeholder="123456"><p class="err" id="mfam" role="alert"></p><div class="row"><button class="pri">Valider</button><button type="button" id="mfaout">Se déconnecter</button></div></form></dialog>`);
const dset=q("#dset"),dmfa=q("#dmfa");
dset.querySelector("[data-x]").onclick=()=>dset.close();
dmfa.addEventListener("cancel",e=>e.preventDefault());
const stpf=q("#stpf");
stpf.ville.innerHTML='<option value="">Ville (facultatif)</option>'+CITIES.map(c=>"<option>"+esc(c)+"</option>").join("");
function setAv(){
const a=q("#seta"),u=me&&me.avatar_url;
if(u){a.style.backgroundImage='url("'+u+'")';a.textContent=""}
else{a.style.backgroundImage="";a.textContent=((me&&me.nom)||"F").trim().slice(0,1).toUpperCase()}
}
async function avatar(file){
const m=q("#avm");
if(!file||!/^image\//.test(file.type)){m.textContent="Choisissez une image.";return}
m.textContent="Envoi en cours…";
try{
const bmp=await createImageBitmap(file);
const s=Math.min(bmp.width,bmp.height),c=document.createElement("canvas");
c.width=c.height=512;
c.getContext("2d").drawImage(bmp,(bmp.width-s)/2,(bmp.height-s)/2,s,s,0,0,512,512);
const blob=await new Promise(r=>c.toBlob(r,"image/jpeg",0.85));
const path=user.id+"/avatar-"+Date.now()+".jpg";
const up=await sb.storage.from("photos").upload(path,blob,{contentType:"image/jpeg"});
if(up.error)throw up.error;
const url=sb.storage.from("photos").getPublicUrl(path).data.publicUrl;
const r=await sb.from("profils").update({avatar_url:url}).eq("user_id",user.id);
if(r.error)throw r.error;
await refreshMe();setAv();m.textContent="Photo mise à jour ✓";
}catch(e){m.textContent="Impossible de changer la photo. Réessayez."}
}
q("#avpick").onclick=()=>q("#avf").click();
q("#avself").onclick=()=>q("#avs").click();
q("#avf").onchange=e=>{avatar(e.target.files[0]);e.target.value=""};
q("#avs").onchange=e=>{avatar(e.target.files[0]);e.target.value=""};
q("#avdel").onclick=async()=>{
const r=await sb.from("profils").update({avatar_url:null}).eq("user_id",user.id);
q("#avm").textContent=r.error?"Impossible de retirer la photo.":"Photo retirée.";
await refreshMe();setAv();
};
when("#hubc",hc=>new MutationObserver(()=>{const a=hc.querySelector(".av");if(a&&me&&me.avatar_url&&!a.dataset.f){a.dataset.f=1;a.style.background='url("'+me.avatar_url+'") center/cover';a.textContent=""}}).observe(hc,{childList:true}));
const S0=window.show;
window.show=function(i){
const r=S0.apply(this,arguments);
try{
const sh=shops[i.user_id],p=pro[i.user_id],u=(sh&&sh.logo_url)||(p&&p.avatar_url),s=q("#dc .seller");
if(s&&u&&!s.querySelector(".avs"))s.insertAdjacentHTML("afterbegin",'<img class="avs" src="'+esc(u)+'" alt="">');
}catch(e){}
return r;
};
stpf.onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#spm");
const row={user_id:user.id,nom:f.nom.value.trim(),ville:f.ville.value||null,bio:f.bio.value.trim()||null,mode:me.mode};
const{error}=await sb.from("profils").upsert(row);
if(error){m.className="err";m.textContent="Enregistrement impossible. Vérifiez le nom (2 caractères minimum).";return}
await refreshMe();applyUI();q("#setn").textContent=me.nom;
m.className="ok";m.textContent="Profil enregistré ✓";
};
q("#stn1").addEventListener("input",e=>{
const v=e.target.value;let s=0;
if(v.length>=8)s++;if(v.length>=12)s++;if(/[a-z]/.test(v)&&/[A-Z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;
q("#stst").textContent=v?"Robustesse : "+(s<=2?"faible":s<=3?"moyenne":"forte"):"";
});
q("#stsh").onchange=e=>{const f=q("#stpw");["old","n1","n2"].forEach(n=>f[n].type=e.target.checked?"text":"password")};
q("#stpw").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#stpwm");
m.className="err";
const o=f.old.value,a=f.n1.value,b=f.n2.value;
if(a.length<8){m.textContent="Le nouveau mot de passe doit contenir au moins 8 caractères.";return}
if(a!==b){m.textContent="Les deux nouveaux mots de passe ne sont pas identiques.";return}
if(a===o){m.textContent="Choisissez un mot de passe différent de l’ancien.";return}
m.textContent="Vérification…";
const t=supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:"finder-tmp"}});
const c=await t.auth.signInWithPassword({email:user.email,password:o});
if(c.error){m.textContent="L’ancien mot de passe est incorrect.";return}
const u=await sb.auth.updateUser({password:a});
if(u.error){m.textContent="Changement impossible. Reconnectez-vous puis réessayez.";return}
f.reset();q("#stst").textContent="";
m.className="ok";m.textContent="Mot de passe changé ✓";
};
q("#stem").onsubmit=async e=>{
e.preventDefault();
const f=e.target,m=q("#stemm");
m.className="err";
const n=f.mail.value.trim().toLowerCase();
if(!n.includes("@")||n===(user.email||"").toLowerCase()){m.textContent="Entrez une nouvelle adresse email valide.";return}
m.textContent="Envoi en cours…";
const r=await sb.auth.updateUser({email:n},{emailRedirectTo:location.origin+location.pathname});
if(r.error){m.textContent="Changement impossible pour le moment. Réessayez plus tard.";return}
f.reset();m.className="ok";
m.textContent="Un email de confirmation a été envoyé. L’adresse changera dès que vous aurez confirmé (regardez aussi vos spams).";
};
q("#sall").onclick=async()=>{if(!confirm("Se déconnecter de tous vos appareils ?"))return;dset.close();await sb.auth.signOut({scope:"global"})};
let mfaFactor=null;
async function loadMfa(){
const box=q("#smfa");
box.innerHTML="<p class='meta'>Chargement…</p>";
const r=await sb.auth.mfa.listFactors();
if(r.error){box.innerHTML="<p class='meta'>Indisponible pour le moment.</p>";return}
const f=((r.data&&r.data.totp)||[]).find(x=>x.status==="verified");
if(f){
box.innerHTML='<p class="soldnote">✓ Activée</p><p class="meta">Un code de votre application d’authentification est demandé à chaque connexion et pour les opérations d’argent.</p><label>Code actuel (6 chiffres) pour désactiver</label><input id="mfdis" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><p class="err" id="mfm"></p><button type="button" class="sbtn" id="mfoff">Désactiver</button>';
q("#mfoff").onclick=async()=>{
const m=q("#mfm");
const v=await sb.auth.mfa.challengeAndVerify({factorId:f.id,code:q("#mfdis").value.trim()});
if(v.error){m.textContent="Code incorrect.";return}
const u=await sb.auth.mfa.unenroll({factorId:f.id});
if(u.error){m.textContent="Impossible de désactiver pour le moment.";return}
loadMfa();
};
}else{
box.innerHTML='<p class="meta">Protégez votre compte avec une application comme Google Authenticator ou Microsoft Authenticator.</p><button type="button" class="sbtn pri" id="mfon">Activer la validation en deux étapes</button><div id="mfsetup"></div>';
q("#mfon").onclick=startEnroll;
}
}
async function startEnroll(){
const box=q("#mfsetup");
box.innerHTML="<p class='meta'>Préparation…</p>";
const l=await sb.auth.mfa.listFactors();
for(const x of ((l.data&&l.data.all)||[]))if(x.status!=="verified")await sb.auth.mfa.unenroll({factorId:x.id});
const r=await sb.auth.mfa.enroll({factorType:"totp",friendlyName:"Finder"});
if(r.error){box.innerHTML="<p class='err'>La validation en deux étapes n’est pas disponible pour le moment.</p>";return}
const id=r.data.id,t=r.data.totp;
box.innerHTML='<p>1. Scannez ce code avec votre application :</p><img class="mfqr" alt="Code QR"><p class="meta">Ou saisissez cette clé : <b id="mfsec"></b></p><p>2. Entrez le code à 6 chiffres affiché :</p><input id="mfcode" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><p class="err" id="mfm2"></p><button type="button" class="sbtn pri" id="mfok">Confirmer</button>';
box.querySelector(".mfqr").src=t.qr_code;
q("#mfsec").textContent=t.secret;
q("#mfok").onclick=async()=>{
const v=await sb.auth.mfa.challengeAndVerify({factorId:id,code:q("#mfcode").value.trim()});
if(v.error){q("#mfm2").textContent="Code incorrect. Réessayez.";return}
loadMfa();
};
}
async function checkMfa(){
if(!user)return;
try{
const a=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
if(a.data&&a.data.nextLevel==="aal2"&&a.data.currentLevel!=="aal2"&&!dmfa.open){
const l=await sb.auth.mfa.listFactors();
mfaFactor=((l.data&&l.data.totp)||[]).find(x=>x.status==="verified");
if(mfaFactor){q("#da").close();dmfa.showModal()}
}
}catch(e){}
}
sb.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_IN"||ev==="INITIAL_SESSION")setTimeout(checkMfa,600)});
q("#mfaf").onsubmit=async e=>{
e.preventDefault();
const m=q("#mfam");
if(!mfaFactor){m.textContent="Code indisponible. Reconnectez-vous.";return}
m.textContent="Vérification…";
const v=await sb.auth.mfa.challengeAndVerify({factorId:mfaFactor.id,code:e.target.code.value.trim()});
if(v.error){m.textContent="Code incorrect. Réessayez.";return}
e.target.reset();m.textContent="";dmfa.close();
};
q("#mfaout").onclick=()=>{dmfa.close();sb.auth.signOut()};
const T0=window.showToast;
window.showToast=function(){if(LS.get("finder_toast")==="off")return;return T0.apply(this,arguments)};
function renderNotifSet(){
const on=LS.get("finder_toast")!=="off";
const perm="Notification" in window?Notification.permission:"unsupported";
const lbl={granted:"autorisées ✓",denied:"refusées (à changer dans les réglages du navigateur)",default:"pas encore autorisées",unsupported:"non disponibles sur cet appareil"}[perm]||"";
q("#stnt").innerHTML='<label class="chk"><input type="checkbox" id="sttoast" '+(on?"checked":"")+'> Afficher les bandeaux de notification dans Finder</label><p class="meta">Notifications du navigateur : '+lbl+'</p>'+(perm==="default"?'<button type="button" class="sbtn" id="stperm">Autoriser les notifications du navigateur</button>':"")+'<p class="meta">Vous retrouvez toujours toutes vos notifications dans la cloche 🔔.</p>';
q("#sttoast").onchange=e=>{if(e.target.checked)LS.del("finder_toast");else LS.set("finder_toast","off")};
const b=q("#stperm");
if(b)b.onclick=async()=>{await Notification.requestPermission();renderNotifSet()};
}
function renderGeoSet(){
const on=LS.get("finder_geo")==="on";
q("#stgeo").innerHTML='<p class="meta">Localisation : <b>'+(on?"activée":"désactivée")+'</b>. Elle sert à proposer des offres près de chez vous. Votre position précise n’est pas enregistrée.</p><button type="button" class="sbtn" id="stgb">'+(on?"Désactiver la localisation":"Activer la localisation")+'</button>';
q("#stgb").onclick=()=>{
if(on){LS.set("finder_geo","off");LS.del("finder_city");location.reload()}
else{dset.close();window.scrollTo({top:0});const b=q('#geochip [data-a="on"]');if(b)b.click()}
};
}
function renderAcct(){
const seller=acct==="vendeur";
q("#stac").innerHTML='<div class="wrow"><span>Type de compte</span><b>'+(seller?"Vendeur":"Client")+'</b></div><button type="button" class="sbtn" data-go="sw">'+(seller?"Passer en compte client":"Passer en compte vendeur")+'</button>'+(seller?'<button class="sbtn" data-go="bq" type="button">'+esc(q("#bq").textContent)+'</button><button class="sbtn" data-go="bid" type="button">'+esc(idLabel())+'</button><button class="sbtn" data-go="bcar" type="button">Ma carrière</button>':'<button class="sbtn" data-go="fav" type="button">Mes favoris</button>')+'<button type="button" class="sbtn" data-go="wal">Porte-monnaie</button>';
}
dset.onclick=e=>{
const b=e.target.closest("[data-go]");
if(!b)return;
const id=b.dataset.go;
dset.close();
if(id==="tosb"){q("#dt").showModal();return}
const t=q("#"+id);
if(t)setTimeout(()=>t.click(),60);
};
q("#slogout").onclick=()=>{dset.close();q("#auth").click()};
q("#stexp").onclick=async()=>{
const m=q("#stexm");
m.textContent="Préparation du fichier…";
const g=async(t,f)=>{try{const r=await f(sb.from(t).select("*").limit(1000));return r.data||[]}catch(e){return[]}};
const me2=user.id;
const D={exporte_le:new Date().toISOString(),email:user.email,profil:me};
D.annonces=await g("listings",x=>x.eq("user_id",me2));
D.commandes=await g("commandes",x=>x.or("buyer_id.eq."+me2+",seller_id.eq."+me2));
D.livraisons=await g("livraisons",x=>x);
D.favoris=await g("favoris",x=>x);
D.avis_recus=await g("avis",x=>x.eq("seller_id",me2));
D.avis_donnes=await g("avis",x=>x.eq("reviewer_id",me2));
D.messages=await g("messages",x=>x);
D.portefeuilles=await g("portefeuilles",x=>x);
D.transactions=await g("transactions",x=>x);
D.boutique=await g("boutiques",x=>x.eq("user_id",me2));
D.alertes=await g("alertes",x=>x);
D.notifications=await g("notifications",x=>x);
D.demandes_support=await g("support_tickets",x=>x);
const blob=new Blob([JSON.stringify(D,null,2)],{type:"application/json"});
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);a.download="finder-mes-donnees.json";
document.body.appendChild(a);a.click();a.remove();
m.textContent="Fichier téléchargé ✓";
};
q("#stdel").onclick=async()=>{
if(!confirm("Demander la suppression de votre compte ? Le support vous répondra."))return;
dset.close();
await openSupport();
const f=q("#sf2");
f.sujet.value="Mes données personnelles (accès, suppression)";
f.msg.value="Je souhaite supprimer mon compte et mes données personnelles.";
};
async function openSettings(){
if(!user){q("#da").showModal();return}
await refreshMe();
if(!me){openProfile(true);return}
q("#setn").textContent=me.nom||"Mon compte";
q("#sete").textContent=user.email||"";
setAv();
stpf.nom.value=me.nom||"";stpf.ville.value=me.ville||"";stpf.bio.value=me.bio||"";
q("#spm").textContent="";q("#avm").textContent="";
q("#semail").textContent="Adresse actuelle : "+(user.email||"");
renderNotifSet();renderGeoSet();renderAcct();loadMfa();
dset.showModal();
}
const pro1=q("#pro");
pro1.textContent="Paramètres";
pro1.onclick=openSettings;
/* Textes */
try{
const hBy=(root,t)=>[...document.querySelectorAll(root+" h3")].find(h=>h.textContent.trim().startsWith(t));
const ul=q("#dpriv ul");
if(ul)ul.insertAdjacentHTML("beforeend","<li><b>Votre photo de profil</b> (facultative) : elle est visible par les visiteurs, à côté de votre nom.</li>");
const hw=hBy("#dhelp","Porte-monnaie");
if(hw)hw.insertAdjacentHTML("beforebegin","<h3>Paramètres et sécurité</h3><details><summary>Comment changer ma photo de profil ?</summary><p>Ouvrez « Paramètres », puis « Changer la photo » ou « Selfie ».</p></details><details><summary>Comment protéger mon compte ?</summary><p>Dans « Paramètres », « Sécurité et connexion », changez votre mot de passe et activez la validation en deux étapes avec une application d’authentification.</p></details><details><summary>Comment télécharger mes données ?</summary><p>Dans « Paramètres », « Localisation et confidentialité », appuyez sur « Télécharger mes données ».</p></details>");
walk(q("#dpriv"),/photo de la pièce et selfie avec la pièce/,"photos de la pièce (recto et verso) et selfie avec la pièce");
walk(q("#dt"),/photo de la pièce et selfie avec la pièce/,"photos de la pièce (recto et verso) et selfie avec la pièce");
walk(q("#dhelp"),/la photo de votre pièce et un selfie/,"les photos de votre pièce (recto et verso) et un selfie");
}catch(e){}
})();
